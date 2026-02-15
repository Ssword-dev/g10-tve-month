<?php

require dirname(__DIR__) . '/vendor/autoload.php';
require_once dirname(__DIR__) . '/helpers/employees.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(type: 'error', message: 'Invalid request method. POST required.', statusCode: 405);
}

$db = db();
$payload = parse_json_body();

$employeeNumberRaw = input_get('employee_number', $payload);
if (!is_numeric($employeeNumberRaw)) {
    respond(type: 'error', message: 'Invalid employee_number value.', statusCode: 422);
}

$employeeNumber = (int)$employeeNumberRaw;
if ($employeeNumber <= 0) {
    respond(type: 'error', message: 'employee_number must be a positive integer.', statusCode: 422);
}

$editableFields = [
    'first_name' => 's',
    'middle_name' => 's',
    'last_name' => 's',
    'deped_email' => 's',
    'designation' => 's',
    'date_joined' => 's',
    'date_of_latest_promotion' => 's',
    'contact_number' => 's',
    'plantilla_number' => 's',
    'date_of_original_appointment' => 's',
    'bp_number' => 'i',
    'address' => 's',
    'civil_status' => 's',
    'date_of_birth' => 's',
    'salary_grade' => 'i',
    'salary' => 's',
    'employment_status' => 's',
    'tin' => 's',
    'place_of_birth' => 's',
];

$updates = [];
$params = [];
$types = '';

foreach ($editableFields as $field => $type) {
    if (!input_has($field, $payload)) {
        continue;
    }

    $value = input_get($field, $payload);

    if ($type === 'i') {
        if ($value === null || $value === '') {
            $normalized = null;
        } elseif (!is_numeric($value)) {
            respond(type: 'error', message: "Invalid numeric value for $field.", statusCode: 422);
        } else {
            $normalized = (int)$value;
        }

        $params[] = $normalized;
    } else {
        $params[] = ($value === '') ? null : $value;
    }

    $updates[] = "$field = ?";
    $types .= $type;
}

if (!$updates) {
    respond(type: 'error', message: 'No updatable fields were provided.', statusCode: 422);
}

$params[] = $employeeNumber;
$types .= 'i';

$sql = 'UPDATE employees_table SET ' . implode(', ', $updates) . ' WHERE employee_number = ?';

$statement = $db->prepare($sql);
if (!$statement) {
    respond(type: 'error', message: 'Failed to prepare employee update query: ' . $db->error, statusCode: 500);
}

$statement->bind_param($types, ...$params);

if (!$statement->execute()) {
    $errorMessage = $statement->error;
    $statement->close();

    respond(type: 'error', message: 'Failed to update employee: ' . $errorMessage, statusCode: 500);
}

$statement->close();

$employeeStatement = $db->prepare('SELECT * FROM employees_table WHERE employee_number = ? LIMIT 1');
if (!$employeeStatement) {
    respond(type: 'error', message: 'Failed to prepare employee lookup query.', statusCode: 500);
}

$employeeStatement->bind_param('i', $employeeNumber);

if (!$employeeStatement->execute()) {
    $employeeStatement->close();

    respond(type: 'error', message: 'Failed to fetch updated employee.', statusCode: 500);
}

$employeeResult = $employeeStatement->get_result();
$employee = $employeeResult->fetch_assoc();
$employeeStatement->close();

if (!$employee) {
    respond(type: 'error', message: 'Employee not found after update.', statusCode: 404);
}

$employees = with_employee_courses($db, [$employee]);

respond(type: 'data', data: $employees[0]);
