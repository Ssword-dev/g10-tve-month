<?php

use Core\ApiCallResult;

return function ($queryParams = [], $bodyParams = []) {
    global $db;
    
    // Default to getting parameters from $queryParams, fallback to $bodyParams
    $employee_number = $queryParams['employee_number'] ?? $bodyParams['employee_number'] ?? null;
    $course_name = $queryParams['course_name'] ?? $bodyParams['course_name'] ?? null;
    $degree_level = $queryParams['degree_level'] ?? $bodyParams['degree_level'] ?? null;
    $units_completed = $queryParams['units_completed'] ?? $bodyParams['units_completed'] ?? null;
    $is_finished = $queryParams['is_finished'] ?? $bodyParams['is_finished'] ?? null;
    
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