<?php

require dirname(__DIR__) . '/vendor/autoload.php';
require_once dirname(__DIR__) . '/helpers/employees.php';

$db = db();

// only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(type: 'error', message: 'Invalid request method. GET required.', statusCode: 405);
}

// Get JSON payload from request body
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    // Fallback to GET parameters for backward compatibility
    $input = $_GET;
}

final class FilterParser {
    private array $conditions = [];
    private array $params = [];
    private array $types = [];
    
    private array $allowedFields = [
        'employee_number', 'first_name', 'middle_name', 'last_name', 'deped_email',
        'designation', 'date_joined', 'date_of_latest_promotion', 'contact_number',
        'plantilla_number', 'date_of_original_appointment', 'bp_number', 'address',
        'civil_status', 'date_of_birth', 'salary_grade', 'salary', 'employment_status',
        'tin', 'place_of_birth'
    ];

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
        'salary' => 'string',
        'employment_status' => 'string',
        'tin' => 'string',
        'place_of_birth' => 'string'
    ];

    public function parse(array $payload): void {
        if (isset($payload['where'])) {
            $this->parseExpression($payload['where']);
        }
    }

    public function getConditionString(): string {
        return $this->conditions ? implode(' AND ', $this->conditions) : '1=1';
    }

    public function getParams(): array {
        return $this->params;
    }

    public function getTypeString(): string {
        return implode('', $this->types);
    }

    public function getAllowedFields(): array {
        return $this->allowedFields;
    }

    private function parseExpression(array $expr): void {
        if (isset($expr['type'])) {
            switch ($expr['type']) {
                case 'and':
                    $this->parseAnd($expr['filters']);
                    break;
                case 'or':
                    $this->parseOr($expr['filters']);
                    break;
                case 'not':
                    $this->parseNot($expr['filter']);
                    break;
            }
            return;
        }

        $this->parseFieldFilter($expr);
    }

    private function parseAnd(array $filters): void {
        $subConditions = [];
        $currentParamsCount = count($this->params);
        $currentTypesCount = count($this->types);

        foreach ($filters as $filter) {
            $this->parseExpression($filter);
        }

        // Group the newly added conditions as an AND group
        $newConditions = array_slice($this->conditions, -(count($filters)));
        if ($newConditions) {
            $this->conditions = array_slice($this->conditions, 0, -count($filters));
            $this->conditions[] = '(' . implode(' AND ', $newConditions) . ')';
        }
    }

    private function parseOr(array $filters): void {
        $subConditions = [];
        $subParams = [];
        $subTypes = [];
        $startParamCount = count($this->params);

        foreach ($filters as $filter) {
            $this->parseExpression($filter);
        }

        // Get the newly added conditions and params
        $newConditions = array_slice($this->conditions, -(count($filters)));
        $newParams = array_slice($this->params, $startParamCount);
        $newTypes = array_slice($this->types, $startParamCount);

        if ($newConditions) {
            // Remove the individual conditions
            $this->conditions = array_slice($this->conditions, 0, -count($filters));
            $this->params = array_slice($this->params, 0, $startParamCount);
            $this->types = array_slice($this->types, 0, $startParamCount);
            
            // Add as OR group
            $this->conditions[] = '(' . implode(' OR ', $newConditions) . ')';
            $this->params = array_merge($this->params, $newParams);
            $this->types = array_merge($this->types, $newTypes);
        }
    }

    private function parseNot(array $filter): void {
        $startParamCount = count($this->params);
        $startConditionCount = count($this->conditions);

        $this->parseExpression($filter);

        if (count($this->conditions) > $startConditionCount) {
            $lastCondition = array_pop($this->conditions);
            $this->conditions[] = 'NOT (' . $lastCondition . ')';
        }
    }

    private function parseFieldFilter(array $filter): void {
        $field = $filter['field'] ?? null;
        
        if (!$field || !in_array($field, $this->allowedFields)) {
            return;
        }

        $fieldType = $this->fieldTypes[$field] ?? 'string';

        // Handle null condition
        if (isset($filter['null'])) {
            $this->handleNullCondition($field, $filter['null']);
        }

        // Handle comparisons
        if (isset($filter['comparisons']) && is_array($filter['comparisons'])) {
            foreach ($filter['comparisons'] as $comparison) {
                $this->handleComparison($field, $fieldType, $comparison);
            }
        }
    }

    private function handleNullCondition(string $field, array $nullCond): void {
        if ($nullCond['is_null']) {
            $this->conditions[] = "$field IS NULL";
        } else {
            $this->conditions[] = "$field IS NOT NULL";
        }
    }

    private function handleComparison(string $field, string $fieldType, array $comp): void {
        $type = $comp['type'] ?? null;
        $negate = $comp['negate'] ?? false;
        $operator = $this->getOperator($type, $negate);

        if (!$operator) {
            return;
        }

        switch ($type) {
            case 'between':
                $this->handleBetween($field, $fieldType, $comp, $operator);
                break;
            case 'in':
                $this->handleIn($field, $fieldType, $comp, $negate);
                break;
            case 'contains':
            case 'startsWith':
            case 'endsWith':
                $this->handleStringPattern($field, $type, $comp, $negate);
                break;
            default:
                $this->handleSimpleComparison($field, $fieldType, $comp, $operator);
                break;
        }
    }

    private function getOperator(string $type, bool $negate): ?string {
        $operators = [
            'eq' => $negate ? '!=' : '=',
            'neq' => $negate ? '=' : '!=',
            'gt' => $negate ? '<=' : '>',
            'gte' => $negate ? '<' : '>=',
            'lt' => $negate ? '>=' : '<',
            'lte' => $negate ? '>' : '<=',
            'contains' => $negate ? 'NOT LIKE' : 'LIKE',
            'startsWith' => $negate ? 'NOT LIKE' : 'LIKE',
            'endsWith' => $negate ? 'NOT LIKE' : 'LIKE',
            'between' => $negate ? 'NOT BETWEEN' : 'BETWEEN',
            'in' => $negate ? 'NOT IN' : 'IN'
        ];

        return $operators[$type] ?? null;
    }

    private function handleBetween(string $field, string $fieldType, array $comp, string $operator): void {
        if (!isset($comp['min'], $comp['max'])) {
            return;
        }

        $this->conditions[] = "$field $operator ? AND ?";
        
        if ($fieldType === 'int') {
            $this->params[] = (int)$comp['min'];
            $this->params[] = (int)$comp['max'];
            $this->types[] = 'i';
            $this->types[] = 'i';
        } else {
            $this->params[] = $comp['min'];
            $this->params[] = $comp['max'];
            $this->types[] = 's';
            $this->types[] = 's';
        }
    }

    private function handleIn(string $field, string $fieldType, array $comp, bool $negate): void {
        if (!isset($comp['operands']) || !is_array($comp['operands'])) {
            return;
        }

        $operands = $comp['operands'];
        $placeholders = implode(',', array_fill(0, count($operands), '?'));
        $operator = $negate ? 'NOT IN' : 'IN';
        
        $this->conditions[] = "$field $operator ($placeholders)";
        
        foreach ($operands as $operand) {
            if ($fieldType === 'int') {
                $this->params[] = (int)$operand;
                $this->types[] = 'i';
            } else {
                $this->params[] = $operand;
                $this->types[] = 's';
            }
        }
    }

    private function handleStringPattern(string $field, string $type, array $comp, bool $negate): void {
        if (!isset($comp['operand'])) {
            return;
        }

        $pattern = $comp['operand'];
        
        switch ($type) {
            case 'contains':
                $pattern = "%$pattern%";
                break;
            case 'startsWith':
                $pattern = "$pattern%";
                break;
            case 'endsWith':
                $pattern = "%$pattern";
                break;
        }

        $operator = $negate ? 'NOT LIKE' : 'LIKE';
        $this->conditions[] = "$field $operator ?";
        $this->params[] = $pattern;
        $this->types[] = 's';
    }

    private function handleSimpleComparison(string $field, string $fieldType, array $comp, string $operator): void {
        if (!isset($comp['operand'])) {
            return;
        }

        $this->conditions[] = "$field $operator ?";
        
        if ($fieldType === 'int') {
            $this->params[] = (int)$comp['operand'];
            $this->types[] = 'i';
        } else {
            $this->params[] = $comp['operand'];
            $this->types[] = 's';
        }
    }
}

// Parse the filter payload
$parser = new FilterParser();
$parser->parse($input);

// Build the base query
$sql = "SELECT * FROM employees_table";

$conditionString = $parser->getConditionString();
if ($conditionString !== '1=1') {
    $sql .= " WHERE " . $conditionString;
}

// Handle sorting
if (isset($input['sort']) && is_array($input['sort'])) {
    $orderBy = [];
    foreach ($input['sort'] as $sort) {
        $field = $sort['field'] ?? null;
        $direction = strtoupper($sort['direction'] ?? 'ASC');
        
        if ($field && in_array($field, $parser->getAllowedFields())) {
            $orderBy[] = "$field $direction";
        }
    }
    
    if ($orderBy) {
        $sql .= " ORDER BY " . implode(', ', $orderBy);
    }
} else {
    $sql .= " ORDER BY last_name ASC, first_name ASC";
}

// Handle pagination
if (isset($input['limit'])) {
    $limit = (int)$input['limit'];
    $page = isset($input['page']) ? (int)$input['page'] : 1;
    $offset = ($page - 1) * $limit;
    
    $sql .= " LIMIT ? OFFSET ?";
    
    // Get params from parser and add pagination params
    $params = $parser->getParams();
    $types = $parser->getTypeString();
    
    $params[] = $limit;
    $params[] = $offset;
    $types .= 'ii';
} else {
    $params = $parser->getParams();
    $types = $parser->getTypeString();
}

// Prepare and execute the statement
$stmt = $db->prepare($sql);
if (!$stmt) {
    respond(type: 'error', message: 'Failed to prepare query: ' . $db->error);
}

// Bind parameters
if ($params) {
    $stmt->bind_param($types, ...$params);
}

// Execute
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

// Fetch courses for employees
try {
    $employees = with_employee_courses($db, $employees);
} catch (RuntimeException $exception) {
    respond(type: 'error', message: $exception->getMessage(), statusCode: 500);
}

// Handle field selection
if (isset($input['fields']) && is_array($input['fields'])) {
    $allowedFields = array_intersect($input['fields'], $parser->getAllowedFields());
    if ($allowedFields) {
        $employees = array_map(function($emp) use ($allowedFields) {
            return array_intersect_key($emp, array_flip($allowedFields));
        }, $employees);
    }
}

// Respond
respond(type: 'data', data: $employees, message: count($employees) . " employee(s) found.");