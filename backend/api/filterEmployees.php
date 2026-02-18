<?php

require dirname(__DIR__) . '/vendor/autoload.php';
require_once dirname(__DIR__) . '/helpers/employees.php';

$db = db();

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(type: 'error', message: 'Invalid request method. POST or GET required.', statusCode: 405);
}

$input = parse_json_body();
if (!$input) {
    $input = $_GET;
}

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

$isAuthenticatedAdmin = is_array($_SESSION['auth_user'] ?? null) && is_numeric($_SESSION['employee_number'] ?? null);
$role = $isAuthenticatedAdmin ? 'admin' : 'guest';

$guestAllowedFields = [
    'employee_number',
    'first_name',
    'middle_name',
    'last_name',
    'designation',
    'employment_status',
    'date_joined',
];

final class FilterParser
{
    private array $allowedFields;

    private array $fieldTypes = [
        'employee_number' => 'int',
        'first_name' => 'string',
        'middle_name' => 'string',
        'last_name' => 'string',
        'deped_email' => 'string',
        'designation' => 'string',
        'date_joined' => 'date',
        'date_of_latest_promotion' => 'date',
        'contact_number' => 'string',
        'plantilla_number' => 'string',
        'date_of_original_appointment' => 'date',
        'bp_number' => 'int',
        'address' => 'string',
        'civil_status' => 'string',
        'date_of_birth' => 'date',
        'salary_grade' => 'int',
        'salary' => 'int',
        'employment_status' => 'string',
        'tin' => 'string',
        'place_of_birth' => 'string',
    ];

    public function __construct(array $allowedFields)
    {
        $validFields = array_values(array_intersect($allowedFields, array_keys($this->fieldTypes)));
        $this->allowedFields = $validFields;
    }

    public function getAllowedFields(): array
    {
        return $this->allowedFields;
    }

    public function parse(array $payload): ?array
    {
        if (!isset($payload['where']) || !is_array($payload['where'])) {
            return null;
        }

        return $this->buildExpression($payload['where']);
    }

    private function buildExpression(array $expr): ?array
    {
        if (isset($expr['type']) && is_string($expr['type'])) {
            if ($expr['type'] === 'not' && isset($expr['filter']) && is_array($expr['filter'])) {
                $inner = $this->buildExpression($expr['filter']);
                if (!$inner) {
                    return null;
                }

                return [
                    'sql' => 'NOT (' . $inner['sql'] . ')',
                    'params' => $inner['params'],
                    'types' => $inner['types'],
                ];
            }

            if (($expr['type'] === 'and' || $expr['type'] === 'or') && isset($expr['filters']) && is_array($expr['filters'])) {
                $parts = [];
                $params = [];
                $types = '';

                foreach ($expr['filters'] as $filter) {
                    if (!is_array($filter)) {
                        continue;
                    }

                    $parsed = $this->buildExpression($filter);
                    if (!$parsed) {
                        continue;
                    }

                    $parts[] = '(' . $parsed['sql'] . ')';
                    $params = array_merge($params, $parsed['params']);
                    $types .= $parsed['types'];
                }

                if (!$parts) {
                    return null;
                }

                return [
                    'sql' => implode(' ' . strtoupper($expr['type']) . ' ', $parts),
                    'params' => $params,
                    'types' => $types,
                ];
            }

            return null;
        }

        return $this->buildFieldFilter($expr);
    }

    private function buildFieldFilter(array $filter): ?array
    {
        $field = $filter['field'] ?? null;
        if (!is_string($field) || !in_array($field, $this->allowedFields, true)) {
            return null;
        }

        $fieldType = $this->fieldTypes[$field] ?? 'string';

        $parts = [];
        $params = [];
        $types = '';

        if (isset($filter['null']) && is_array($filter['null']) && array_key_exists('is_null', $filter['null'])) {
            $parts[] = $field . ((bool)$filter['null']['is_null'] ? ' IS NULL' : ' IS NOT NULL');
        }

        if (isset($filter['comparisons']) && is_array($filter['comparisons'])) {
            foreach ($filter['comparisons'] as $comparison) {
                if (!is_array($comparison)) {
                    continue;
                }

                $parsed = $this->buildComparison($field, $fieldType, $comparison);
                if (!$parsed) {
                    continue;
                }

                $parts[] = $parsed['sql'];
                $params = array_merge($params, $parsed['params']);
                $types .= $parsed['types'];
            }
        }

        if (!$parts) {
            return null;
        }

        return [
            'sql' => implode(' AND ', $parts),
            'params' => $params,
            'types' => $types,
        ];
    }

    private function buildComparison(string $field, string $fieldType, array $comparison): ?array
    {
        $type = $comparison['type'] ?? null;
        if (!is_string($type)) {
            return null;
        }

        if ($type === 'between') {
            if ($fieldType === 'date') {
                $from = $comparison['from'] ?? null;
                $to = $comparison['to'] ?? null;
                if (!is_string($from) || !is_string($to) || $from === '' || $to === '') {
                    return null;
                }

                return [
                    'sql' => "$field BETWEEN ? AND ?",
                    'params' => [$from, $to],
                    'types' => 'ss',
                ];
            }

            $min = $comparison['min'] ?? null;
            $max = $comparison['max'] ?? null;
            if (!is_numeric($min) || !is_numeric($max)) {
                return null;
            }

            if ($fieldType === 'int') {
                return [
                    'sql' => "$field BETWEEN ? AND ?",
                    'params' => [(int)$min, (int)$max],
                    'types' => 'ii',
                ];
            }

            return [
                'sql' => "$field BETWEEN ? AND ?",
                'params' => [(string)$min, (string)$max],
                'types' => 'ss',
            ];
        }

        if ($type === 'in') {
            $operands = $comparison['operands'] ?? null;
            if (!is_array($operands) || count($operands) === 0) {
                return null;
            }

            $placeholders = implode(', ', array_fill(0, count($operands), '?'));
            $sql = "$field IN ($placeholders)";
            $params = [];
            $types = '';

            foreach ($operands as $operand) {
                if ($fieldType === 'int') {
                    if (!is_numeric($operand)) {
                        return null;
                    }
                    $params[] = (int)$operand;
                    $types .= 'i';
                } else {
                    $params[] = (string)$operand;
                    $types .= 's';
                }
            }

            return ['sql' => $sql, 'params' => $params, 'types' => $types];
        }

        $operand = $comparison['operand'] ?? null;
        if ($operand === null) {
            return null;
        }

        $sqlOperator = match ($type) {
            'eq' => '=',
            'neq' => '!=',
            'gt' => '>',
            'gte' => '>=',
            'lt' => '<',
            'lte' => '<=',
            'contains' => 'LIKE',
            'startsWith' => 'LIKE',
            'endsWith' => 'LIKE',
            default => null,
        };

        if ($sqlOperator === null) {
            return null;
        }

        if ($type === 'contains' || $type === 'startsWith' || $type === 'endsWith') {
            $text = (string)$operand;
            $pattern = match ($type) {
                'contains' => "%$text%",
                'startsWith' => "$text%",
                'endsWith' => "%$text",
                default => $text,
            };

            return [
                'sql' => "$field $sqlOperator ?",
                'params' => [$pattern],
                'types' => 's',
            ];
        }

        if ($fieldType === 'int') {
            if (!is_numeric($operand)) {
                return null;
            }

            return [
                'sql' => "$field $sqlOperator ?",
                'params' => [(int)$operand],
                'types' => 'i',
            ];
        }

        if ($fieldType === 'date') {
            return [
                'sql' => "$field $sqlOperator ?",
                'params' => [(string)$operand],
                'types' => 's',
            ];
        }

        return [
            'sql' => "$field $sqlOperator ?",
            'params' => [(string)$operand],
            'types' => 's',
        ];
    }
}

$parser = new FilterParser($role === 'admin' ? [
    'employee_number', 'first_name', 'middle_name', 'last_name', 'deped_email',
    'designation', 'date_joined', 'date_of_latest_promotion', 'contact_number',
    'plantilla_number', 'date_of_original_appointment', 'bp_number', 'address',
    'civil_status', 'date_of_birth', 'salary_grade', 'salary', 'employment_status',
    'tin', 'place_of_birth',
] : $guestAllowedFields);
$parsedWhere = $parser->parse($input);

$sql = 'SELECT * FROM employees_table';
$params = [];
$types = '';

if ($parsedWhere) {
    $sql .= ' WHERE ' . $parsedWhere['sql'];
    $params = $parsedWhere['params'];
    $types = $parsedWhere['types'];
}

if (isset($input['sort']) && is_array($input['sort']) && count($input['sort']) > 0) {
    $orderBy = [];

    foreach ($input['sort'] as $sortRule) {
        if (!is_array($sortRule)) {
            continue;
        }

        $basis = $sortRule['basis'] ?? $sortRule['field'] ?? null;
        $direction = strtoupper((string)($sortRule['direction'] ?? 'ASC'));

        if (!is_string($basis) || !in_array($basis, $parser->getAllowedFields(), true)) {
            continue;
        }

        if (!in_array($direction, ['ASC', 'DESC'], true)) {
            $direction = 'ASC';
        }

        $orderBy[] = "$basis $direction";
    }

    if ($orderBy) {
        $sql .= ' ORDER BY ' . implode(', ', $orderBy);
    } else {
        $sql .= ' ORDER BY last_name ASC, first_name ASC';
    }
} else {
    $sql .= ' ORDER BY last_name ASC, first_name ASC';
}

$limit = isset($input['limit']) ? (int)$input['limit'] : 50;
$page = isset($input['page']) ? (int)$input['page'] : 1;

if ($limit < 1) {
    $limit = 50;
}

if ($page < 1) {
    $page = 1;
}

$offset = ($page - 1) * $limit;
$sql .= ' LIMIT ? OFFSET ?';
$params[] = $limit;
$params[] = $offset;
$types .= 'ii';

$stmt = $db->prepare($sql);
if (!$stmt) {
    respond(type: 'error', message: 'Failed to prepare query: ' . $db->error, statusCode: 500);
}

if ($params) {
    if (!bind_params($stmt, $types, $params)) {
        $stmt->close();
        respond(type: 'error', message: 'Failed to bind filter query parameters.', statusCode: 500);
    }
}

if (!$stmt->execute()) {
    $stmt->close();
    respond(type: 'error', message: 'Failed to execute query: ' . $stmt->error, statusCode: 500);
}

$result = $stmt->get_result();
$employees = [];
while ($row = $result->fetch_assoc()) {
    $employees[] = $row;
}
$stmt->close();

try {
    $employees = with_employee_courses($db, $employees);
} catch (RuntimeException $exception) {
    respond(type: 'error', message: $exception->getMessage(), statusCode: 500);
}

$allowed = $parser->getAllowedFields();
$fieldsInput = isset($input['fields']) && is_array($input['fields']) ? $input['fields'] : [];
$include = $fieldsInput['include'] ?? ($role === 'admin' ? 'ALL' : $allowed);
$exclude = $fieldsInput['exclude'] ?? 'NONE';

$employees = array_map(function (array $employee) use ($include, $exclude, $allowed, $role): array {
    // Guest users can only ever receive fields in the allowed subset.
    if ($role !== 'admin') {
        $employee = array_intersect_key($employee, array_flip($allowed));
    }

    if (is_array($include) && count($include) > 0) {
        $validInclude = array_values(array_intersect($include, $allowed));
        if ($validInclude) {
            $employee = array_intersect_key($employee, array_flip($validInclude));
        }
    }

    if (is_array($exclude) && count($exclude) > 0) {
        $validExclude = array_values(array_intersect($exclude, $allowed));
        foreach ($validExclude as $key) {
            unset($employee[$key]);
        }
    }

    return $employee;
}, $employees);

respond(type: 'data', data: $employees, message: count($employees) . ' employee(s) found.');
