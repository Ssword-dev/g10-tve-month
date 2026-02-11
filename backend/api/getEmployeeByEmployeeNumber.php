<?php
require dirname(__DIR__) . '/vendor/autoload.php';

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

// fetch courses
$coursesStatement = $db->prepare("
    SELECT 
        c.course_name,
        c.degree_level,
        c.units_completed,
        c.is_finished
    FROM courses_table c
    WHERE c.achiever_employee_number = ?
");

if (!$coursesStatement) {
    $employeeStatement->close();

    respond(
        type: 'error',
        message: 'Failed to prepare courses query.'
    );
}

$coursesStatement->bind_param("i", $employee_number);
$coursesStatement->execute();

$coursesResult = $coursesStatement->get_result();

$employee['courses'] = [];

while ($course = $coursesResult->fetch_assoc()) {
    $employee['courses'][] = $course;
}

$employeeStatement->close();
$coursesStatement->close();

respond(
    type: 'data',
    data: $employee
);
