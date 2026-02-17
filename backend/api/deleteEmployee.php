<?php
require dirname(__DIR__) . '/vendor/autoload.php';

$db = db();
$body = body();

// get employee_number (POST first, fallback to GET)
$employee_number = (string)($body['employee_number'] ?? null);

// validate numeric
if (!is_numeric($employee_number)) {
    respond(
        type: 'error',
        message: 'Invalid employee number provided. got:' . var_export($employee_number)
    );
}

// ensure integer (reject floats)
if (intval($employee_number) != floatval($employee_number)) {
    respond(
        type: 'error',
        message: 'Employee number must be an integer, got: ' . var_export($employee_number)
    );
}

$employee_number = intval($employee_number);

// must be positive
if ($employee_number <= 0) {
    respond(
        type: 'error',
        message: 'Employee number must be a positive integer.'
    );
}

// fetch employee
$employeeStatement = $db->prepare("
    SELECT 
        e.employee_number,
        e.first_name,
        e.last_name
    FROM employees_table e
    WHERE e.employee_number = ?
    LIMIT 1
");

if (!$employeeStatement) {
    respond(
        type: 'error',
        message: 'Failed to prepare employee query.',
        statusCode: 500
    );
}

$employeeStatement->bind_param("i", $employee_number);
$employeeStatement->execute();

$result = $employeeStatement->get_result();
$employee = $result->fetch_assoc();

if (!$employee) {
    $employeeStatement->close();

    respond(
        type: 'error',
        message: 'Employee not found.',
        statusCode: 404
    );
}

$employeeStatement->close();

$deleteStatement = $db->prepare("DELETE FROM `employees_table` WHERE employee_number = ?;");

if (!$deleteStatement) {
    respond(
        type: 'error',
        message: 'Failed to prepare statement for employee deletion.',
        statusCode: 500
    );
}

$deleteStatement->bind_param('i', $employee_number);

if (!$deleteStatement->execute()) {
    respond(
        type: 'error',
        message: 'Failed to delete employee due to mysql error:' . $deleteCourseStatement->error,
        statusCode: 500
    );
};

respond(
    type: 'success'
);