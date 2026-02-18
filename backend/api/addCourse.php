<?php

require dirname(__DIR__) . '/vendor/autoload.php';
require_once dirname(__DIR__) . '/helpers/employees.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(type: 'error', message: 'Invalid request method. POST required.', statusCode: 405);
}

$db = db();
$payload = body();
if (!is_array($payload)) {
    $payload = [];
}

$employeeNumberRaw = input_get('employee_number', $payload);
$courseName = trim((string)input_get('course_name', $payload, ''));
$degreeLevel = trim((string)input_get('degree_level', $payload, ''));
$unitsCompletedRaw = input_get('units_completed', $payload, null);
$isFinishedRaw = input_get('is_finished', $payload, 0);

if (!is_numeric($employeeNumberRaw) || (int)$employeeNumberRaw <= 0) {
    respond(type: 'error', message: 'Invalid employee_number value.', statusCode: 422);
}

if ($courseName === '' || $degreeLevel === '') {
    respond(type: 'error', message: 'course_name and degree_level are required.', statusCode: 422);
}

$allowedDegreeLevels = ['bachelor', 'master', 'doctorate'];
if (!in_array($degreeLevel, $allowedDegreeLevels, true)) {
    respond(type: 'error', message: 'degree_level must be bachelor, master, or doctorate.', statusCode: 422);
}

$employeeNumber = (int)$employeeNumberRaw;
$unitsCompleted = ($unitsCompletedRaw === null || $unitsCompletedRaw === '') ? null : (int)$unitsCompletedRaw;
$isFinished = normalize_boolean($isFinishedRaw);

$insertCourseStatement = $db->prepare(
    'INSERT INTO courses_table (achiever_employee_number, course_name, degree_level, units_completed, is_finished)
     VALUES (?, ?, ?, ?, ?)'
);

if (!$insertCourseStatement) {
    respond(type: 'error', message: 'Unable to prepare add course request.', statusCode: 500);
}

$insertCourseStatement->bind_param(
    'issii',
    $employeeNumber,
    $courseName,
    $degreeLevel,
    $unitsCompleted,
    $isFinished,
);

if (!$insertCourseStatement->execute()) {
    $insertCourseStatement->close();
    respond(type: 'error', message: 'Unable to add course to employee.', statusCode: 500);
}

$insertCourseStatement->close();

respond(
    type: 'data',
    data: [
        'employee_number' => $employeeNumber,
        'course_name' => $courseName,
        'degree_level' => $degreeLevel,
        'units_completed' => $unitsCompleted,
        'is_finished' => $isFinished,
    ],
);
