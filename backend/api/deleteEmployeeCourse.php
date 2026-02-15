<?php

require dirname(__DIR__) . '/vendor/autoload.php';
require_once dirname(__DIR__) . '/helpers/employees.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(type: 'error', message: 'Invalid request method. POST required.', statusCode: 405);
}

$db = db();
$payload = parse_json_body();

$employeeNumberRaw = input_get('employee_number', $payload);
$courseName = trim((string)input_get('course_name', $payload, ''));
$degreeLevel = trim((string)input_get('degree_level', $payload, ''));

if (!is_numeric($employeeNumberRaw) || (int)$employeeNumberRaw <= 0) {
    respond(type: 'error', message: 'Invalid employee_number value.', statusCode: 422);
}

if ($courseName === '' || $degreeLevel === '') {
    respond(type: 'error', message: 'course_name and degree_level are required.', statusCode: 422);
}

$employeeNumber = (int)$employeeNumberRaw;

$deleteCourseStatement = $db->prepare(
    'DELETE FROM courses_table
     WHERE achiever_employee_number = ?
       AND course_name = ?
       AND degree_level = ?
     LIMIT 1'
);

if (!$deleteCourseStatement) {
    respond(type: 'error', message: 'Failed to prepare delete statement.', statusCode: 500);
}

$deleteCourseStatement->bind_param('iss', $employeeNumber, $courseName, $degreeLevel);

if (!$deleteCourseStatement->execute()) {
    $errorMessage = $deleteCourseStatement->error;
    $deleteCourseStatement->close();

    respond(type: 'error', message: 'Failed to delete course: ' . $errorMessage, statusCode: 500);
}

$affectedRows = $deleteCourseStatement->affected_rows;
$deleteCourseStatement->close();

if ($affectedRows < 1) {
    respond(type: 'error', message: 'Course not found.', statusCode: 404);
}

respond(
    type: 'success',
    data: [
        'employee_number' => $employeeNumber,
        'course_name' => $courseName,
        'degree_level' => $degreeLevel,
    ],
);
