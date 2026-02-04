<?php

use Core\ApiCallResult;

return function ($employee_number, $course_name, $degree_level, $units_completed, $is_finished) {
    global $db;

    $insertCourseStatement = $db->prepare("
        INSERT INTO courses_table (achiever_employee_number, course_name, degree_level, units_completed, is_finished)
        VALUES (?, ?, ?, ?, ?);
    ");

    $insertCourseStatement->bind_param("issii", $employee_number, $course_name, $degree_level, $units_completed, $is_finished);
    $insertCourseStatement->execute();

    return new ApiCallResult(
        success: true,
        message: "Course added successfully.",
        data: null
    );
};