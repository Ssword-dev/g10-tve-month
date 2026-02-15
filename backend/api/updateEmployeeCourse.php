<?php

require dirname(__DIR__) . '/vendor/autoload.php';
require_once dirname(__DIR__) . '/helpers/employees.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(type: 'error', message: 'Invalid request method. POST required.', statusCode: 405);
}

$db = db();
$payload = parse_json_body();

$employeeNumberRaw = input_get('employee_number', $payload);
$originalCourseName = trim((string)input_get('original_course_name', $payload, ''));
$originalDegreeLevel = trim((string)input_get('original_degree_level', $payload, ''));

$courseName = trim((string)input_get('course_name', $payload, ''));
$degreeLevel = trim((string)input_get('degree_level', $payload, ''));
$unitsCompletedRaw = input_get('units_completed', $payload, null);
$isFinishedRaw = input_get('is_finished', $payload, 0);

if (!is_numeric($employeeNumberRaw) || (int)$employeeNumberRaw <= 0) {
    respond(type: 'error', message: 'Invalid employee_number value.', statusCode: 422);
}

if ($originalCourseName === '' || $originalDegreeLevel === '') {
    respond(type: 'error', message: 'original_course_name and original_degree_level are required.', statusCode: 422);
}

if ($courseName === '' || $degreeLevel === '') {
    respond(type: 'error', message: 'course_name and degree_level are required.', statusCode: 422);
}

$allowedDegreeLevels = ['bachelor', 'master', 'doctorate'];
if (!in_array($degreeLevel, $allowedDegreeLevels, true) || !in_array($originalDegreeLevel, $allowedDegreeLevels, true)) {
    respond(type: 'error', message: 'degree_level values must be bachelor, master, or doctorate.', statusCode: 422);
}

$employeeNumber = (int)$employeeNumberRaw;
$unitsCompleted = ($unitsCompletedRaw === null || $unitsCompletedRaw === '') ? null : (int)$unitsCompletedRaw;
$isFinished = normalize_boolean($isFinishedRaw);

$updateCourseStatement = $db->prepare(
    'UPDATE courses_table
     SET course_name = ?, degree_level = ?, units_completed = ?, is_finished = ?
     WHERE achiever_employee_number = ?
       AND course_name = ?
       AND degree_level = ?
     LIMIT 1'
);

if (!$updateCourseStatement) {
    respond(type: 'error', message: 'Failed to prepare update statement.', statusCode: 500);
}

$updateCourseStatement->bind_param(
    'ssiisss',
    $courseName,
    $degreeLevel,
    $unitsCompleted,
    $isFinished,
    $employeeNumber,
    $originalCourseName,
    $originalDegreeLevel,
);

if (!$updateCourseStatement->execute()) {
    $errorMessage = $updateCourseStatement->error;
    $updateCourseStatement->close();

    respond(type: 'error', message: 'Failed to update course: ' . $errorMessage, statusCode: 500);
}

$affectedRows = $updateCourseStatement->affected_rows;
$updateCourseStatement->close();

if ($affectedRows < 1) {
    respond(type: 'error', message: 'Course not found or no changes detected.', statusCode: 404);
}

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
