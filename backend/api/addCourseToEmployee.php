<?php
require dirname(__DIR__) . '/vendor/autoload.php';

$db = db();

$employee_number = $_POST['employee_number'] ?? $_GET['employee_number'] ?? null;
$course_name     = $_POST['course_name'] ?? $_GET['course_name'] ?? null;
$degree_level    = $_POST['degree_level'] ?? $_GET['degree_level'] ?? null;
$units_completed = $_POST['units_completed'] ?? $_GET['units_completed'] ?? null;
$is_finished     = $_POST['is_finished'] ?? $_GET['is_finished'] ?? null;

// validate required fields
if (!$employee_number || !$course_name || !$degree_level) {
    respond(
        type: 'error',
        message: 'Missing required fields.'
    );
}

// prepare statement
$insertCourseStatement = $db->prepare("
    INSERT INTO courses_table (
        achiever_employee_number,
        course_name,
        degree_level,
        units_completed,
        is_finished
    )
    VALUES (?, ?, ?, ?, ?)
");

if (!$insertCourseStatement) {
    respond(
        type: 'error',
        message: 'Failed to prepare statement.'
    );
}

// bind params and execute
$insertCourseStatement->bind_param(
    "issii",
    $employee_number,
    $course_name,
    $degree_level,
    $units_completed,
    $is_finished
);

if (!$insertCourseStatement->execute()) {
    respond(
        type: 'error',
        message: 'Failed to execute insertion.'
    );
}

// success response
respond(
    type: 'data',
    data: [
        'employee_number' => $employee_number,
        'course_name'     => $course_name,
        'degree_level'    => $degree_level,
        'units_completed' => $units_completed,
        'is_finished'     => $is_finished
    ]
);
