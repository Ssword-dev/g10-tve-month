<?php

require dirname(__DIR__) . '/vendor/autoload.php';
require_once dirname(__DIR__) . '/helpers/employees.php';

$db = db();

// only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(type: 'error', message: 'Invalid request method. GET required.', statusCode: 405);
}

final class QueryState {
    public array $conditions = [];
    public array $params = [];
    public array $types = [];

    public function conditionString(): string {
        return $this->conditions ? implode(' AND ', $this->conditions) : '';
    }

    public function typeString(): string {
        return implode('', $this->types);
    }
}

/**
 * helper to build integer conditions
 */
function buildIntegerCondition(string $column, array|int $value): array {
    $cond = '';
    $params = [];
    $types = [];

    if (is_array($value)) {
        if (isset($value['min']) || isset($value['max'])) {
            $parts = [];
            if (isset($value['min'])) {
                $parts[] = "$column >= ?";
                $params[] = (int)$value['min'];
                $types[] = 'i';
            }
            if (isset($value['max'])) {
                $parts[] = "$column <= ?";
                $params[] = (int)$value['max'];
                $types[] = 'i';
            }
            $cond = implode(' AND ', $parts);
        } else {
            $value = array_map('intval', $value);
            $placeholders = implode(',', array_fill(0, count($value), '?'));
            $cond = "$column IN ($placeholders)";
            $params = $value;
            $types = array_fill(0, count($value), 'i');
        }
    } else {
        $cond = "$column = ?";
        $params[] = (int)$value;
        $types[] = 'i';
    }

    return [$cond, $params, $types];
}

$filters = [
    'employee_number' => function(QueryState $qs, $value) {
        [$cond, $params, $types] = buildIntegerCondition('employee_number', $value);
        $qs->conditions[] = $cond;
        $qs->params = array_merge($qs->params, $params);
        $qs->types = array_merge($qs->types, $types);
    },

    'name' => function(QueryState $qs, $value) {
        $qs->conditions[] = "CONCAT(first_name,' ', middle_name, ' ', last_name) LIKE ?";
        $qs->params[] = "%$value%";
        $qs->types[] = 's';
    },

    'designation' => function(QueryState $qs, $value) {
        $qs->conditions[] = "designation LIKE ?";
        $qs->params[] = "%$value%";
        $qs->types[] = 's';
    },

    'date_joined' => function(QueryState $qs, $value) {
        if (isset($value['min'])) {
            $qs->conditions[] = "date_joined >= ?";
            $qs->params[] = $value['min'];
            $qs->types[] = 's';
        }
        if (isset($value['max'])) {
            $qs->conditions[] = "date_joined <= ?";
            $qs->params[] = $value['max'];
            $qs->types[] = 's';
        }
    },

    'employment_status' => function(QueryState $qs, $value) {
        $qs->conditions[] = "employment_status = ?";
        $qs->params[] = $value;
        $qs->types[] = 's';
    }
];

$filtersDefinition = array_keys($filters);

// --- process filters from GET ---
$qs = new QueryState();
foreach ($filtersDefinition as $filterKey) {
    if (!empty($_GET[$filterKey])) {
        $filters[$filterKey]($qs, $_GET[$filterKey]);
    }
}

// --- build query ---
$sql = "SELECT *
        FROM employees_table";

if ($qs->conditions) {
    $sql .= " WHERE " . $qs->conditionString();
}

$sql .= " ORDER BY last_name ASC, first_name ASC";

// --- prepare statement ---
$stmt = $db->prepare($sql);
if (!$stmt) {
    respond(type: 'error', message: 'Failed to prepare query: ' . $db->error);
}

// --- bind params ---
if ($qs->params) {
    $stmt->bind_param($qs->typeString(), ...$qs->params);
}

// --- execute ---
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

// --- respond ---
respond(type: 'data', data: $employees, message: count($employees) . " employee(s) found.");
