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
    'full_name',
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
        'full_name' => 'string',
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
        'bp_number' => 'string',
        'address' => 'string',
        'civil_status' => 'string',
        'date_of_birth' => 'date',
        'salary_grade' => 'int',
        'salary' => 'int',
        'age' => 'int',
        'employment_status' => 'string',
        'tin' => 'string',
        'place_of_birth' => 'string',
    ];

    private array $fieldSqlMap = [
        'age' => 'TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE())',
        'full_name' => 'full_name',
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

    public function resolveFieldSql(string $field): string
    {
        return $this->fieldSqlMap[$field] ?? $field;
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
        $sqlField = $this->resolveFieldSql($field);

        $parts = [];
        $params = [];
        $types = '';

        if (isset($filter['null']) && is_array($filter['null']) && array_key_exists('is_null', $filter['null'])) {
            $parts[] = $sqlField . ((bool)$filter['null']['is_null'] ? ' IS NULL' : ' IS NOT NULL');
        }

        if (isset($filter['comparisons']) && is_array($filter['comparisons'])) {
            foreach ($filter['comparisons'] as $comparison) {
                if (!is_array($comparison)) {
                    continue;
                }

                $parsed = $this->buildComparison($sqlField, $fieldType, $comparison);
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

    private function buildComparison(string $sqlField, string $fieldType, array $comparison): ?array
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
                    'sql' => "$sqlField BETWEEN ? AND ?",
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
                    'sql' => "$sqlField BETWEEN ? AND ?",
                    'params' => [(int)$min, (int)$max],
                    'types' => 'ii',
                ];
            }

            return [
                'sql' => "$sqlField BETWEEN ? AND ?",
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
            $sql = "$sqlField IN ($placeholders)";
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
                'sql' => "$sqlField $sqlOperator ?",
                'params' => [$pattern],
                'types' => 's',
            ];
        }

        if ($fieldType === 'int') {
            if (!is_numeric($operand)) {
                return null;
            }

            return [
                'sql' => "$sqlField $sqlOperator ?",
                'params' => [(int)$operand],
                'types' => 'i',
            ];
        }

        if ($fieldType === 'date') {
            return [
                'sql' => "$sqlField $sqlOperator ?",
                'params' => [(string)$operand],
                'types' => 's',
            ];
        }

        return [
            'sql' => "$sqlField $sqlOperator ?",
            'params' => [(string)$operand],
            'types' => 's',
        ];
    }
}

function buildCourseFiltersClause(array $input): array
{
    $rawCourseFilters = $input['course_filters'] ?? null;
    if (!is_array($rawCourseFilters) || count($rawCourseFilters) === 0) {
        return ['sql' => '', 'params' => [], 'types' => ''];
    }

    $allowedModes = ['has_specific', 'has_any', 'only_has'];
    $allowedDegreeLevels = ['bachelor', 'master', 'doctorate'];
    $parts = [];
    $params = [];
    $types = '';
    $employeeReference = 'employees_with_computed_view.employee_number';

    foreach ($rawCourseFilters as $courseFilter) {
        if (!is_array($courseFilter)) {
            continue;
        }

        $mode = $courseFilter['mode'] ?? null;
        $degreeLevel = $courseFilter['degree_level'] ?? null;
        $courseName = trim((string)($courseFilter['course_name'] ?? ''));

        if (!is_string($mode) || !in_array($mode, $allowedModes, true)) {
            continue;
        }

        if (!is_string($degreeLevel) || !in_array($degreeLevel, $allowedDegreeLevels, true)) {
            continue;
        }

        if ($mode === 'has_specific') {
            if ($courseName === '') {
                continue;
            }

            $parts[] = "
                EXISTS (
                    SELECT 1
                    FROM courses_table c
                    WHERE c.achiever_employee_number = $employeeReference
                      AND c.degree_level = ?
                      AND c.course_name LIKE ?
                )
            ";
            $params[] = $degreeLevel;
            $params[] = '%' . $courseName . '%';
            $types .= 'ss';
            continue;
        }

        if ($mode === 'has_any') {
            $parts[] = "
                EXISTS (
                    SELECT 1
                    FROM courses_table c
                    WHERE c.achiever_employee_number = $employeeReference
                      AND c.degree_level = ?
                )
            ";
            $params[] = $degreeLevel;
            $types .= 's';
            continue;
        }

        $parts[] = "
            EXISTS (
                SELECT 1
                FROM courses_table c_required
                WHERE c_required.achiever_employee_number = $employeeReference
                  AND c_required.degree_level = ?
            )
            AND NOT EXISTS (
                SELECT 1
                FROM courses_table c_other
                WHERE c_other.achiever_employee_number = $employeeReference
                  AND c_other.degree_level <> ?
            )
        ";
        $params[] = $degreeLevel;
        $params[] = $degreeLevel;
        $types .= 'ss';
    }

    if (count($parts) === 0) {
        return ['sql' => '', 'params' => [], 'types' => ''];
    }

    return [
        'sql' => implode(' AND ', array_map(fn ($part) => '(' . trim($part) . ')', $parts)),
        'params' => $params,
        'types' => $types,
    ];
}

$parser = new FilterParser($role === 'admin' ? [
    'employee_number', 'full_name', 'first_name', 'middle_name', 'last_name', 'deped_email',
    'designation', 'date_joined', 'date_of_latest_promotion', 'contact_number',
    'plantilla_number', 'date_of_original_appointment', 'bp_number', 'address',
    'civil_status', 'date_of_birth', 'salary_grade', 'salary', 'age', 'employment_status',
    'tin', 'place_of_birth',
] : $guestAllowedFields);
$parsedWhere = $parser->parse($input);
$courseFiltersClause = buildCourseFiltersClause($input);

$sql = 'SELECT employees_with_computed_view.* FROM employees_with_computed_view';
$params = [];
$types = '';

if ($parsedWhere || $courseFiltersClause['sql'] !== '') {
    $whereParts = [];

    if ($parsedWhere) {
        $whereParts[] = '(' . $parsedWhere['sql'] . ')';
        $params = array_merge($params, $parsedWhere['params']);
        $types .= $parsedWhere['types'];
    }

    if ($courseFiltersClause['sql'] !== '') {
        $whereParts[] = '(' . $courseFiltersClause['sql'] . ')';
        $params = array_merge($params, $courseFiltersClause['params']);
        $types .= $courseFiltersClause['types'];
    }

    $sql .= ' WHERE ' . implode(' AND ', $whereParts);
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

        $orderBy[] = $parser->resolveFieldSql($basis) . ' ' . $direction;
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
    $employees = withComputed($db, $employees);
} catch (RuntimeException $exception) {
    respond(type: 'error', message: $exception->getMessage(), statusCode: 500);
}

$allowed = $parser->getAllowedFields();
$fieldsInput = isset($input['fields']) && is_array($input['fields']) ? $input['fields'] : [];
$include = $fieldsInput['include'] ?? ($role === 'admin' ? 'ALL' : $allowed);
$exclude = $fieldsInput['exclude'] ?? 'NONE';

$employees = array_map(function (array $employee) use ($include, $exclude, $allowed, $role): array {
    $employeeNumber = $employee['employee_number'] ?? null;

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

    // Always keep employee_number so row actions can resolve the selected employee.
    if ($employeeNumber !== null) {
        $employee['employee_number'] = $employeeNumber;
    }

    return $employee;
}, $employees);

respond(type: 'data', data: $employees, message: count($employees) . ' employee(s) found.');
