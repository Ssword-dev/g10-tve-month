<?php
require dirname(__DIR__) . '/vendor/autoload.php';
require_once dirname(__DIR__) . '/helpers/employees.php';

$db = db();

// get employee_number (POST first, fallback to GET)
$employee_number = $_POST['employee_number'] ?? $_GET['employee_number'] ?? null;

// validate numeric
if (!is_numeric($employee_number)) {
    respond(
        type: 'error',
        message: 'Invalid employee number provided.'
    );
}

// ensure integer (reject floats)
if (intval($employee_number) != floatval($employee_number)) {
    respond(
        type: 'error',
        message: 'Employee number must be an integer.'
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
    SELECT *
    FROM employees_with_computed_view
    WHERE employee_number = ?
    LIMIT 1
");

if (!$employeeStatement) {
    respond(
        type: 'error',
        message: 'Failed to prepare employee query.'
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

try {
    $employees = withComputed($db, [$employee]);
} catch (RuntimeException $exception) {
    respond(type: 'error', message: $exception->getMessage(), statusCode: 500);
}

respond(
    type: 'data',
    data: $employees[0]
);
