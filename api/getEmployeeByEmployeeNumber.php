<?php

use Core\ApiCallResult;
/** @var \mysqli $db */
// Fetch employee details by employee number, including their courses.
// The courses are stored as a sequence table linked by achiever_employee_number
// to the employees_table.employee_number.

return function ($queryParams = [], $bodyParams = []) {
    global $db;
    
    // Default to getting parameters from $queryParams, fallback to $bodyParams
    $employee_number = $queryParams['employee_number'] ?? $bodyParams['employee_number'] ?? null;

    // Validate that employee number is numeric.
    if (!is_numeric($employee_number)) {
        return new ApiCallResult(
            success: false,
            message: "Invalid employee number provided.",
            data: null
        );
    }

    // Validate that employee number is an integer.
    // This is a hack, since is_numeric allows floats.
    // we are using loose equality to check if the float of
    // the number is equal to the int of the number.
    // if not, then it is a float, and we reject it.
    if (intval($employee_number) != floatval($employee_number)) {
        return new ApiCallResult(
            success: false,
            message: "Employee number must be an integer.",
            data: null
        );
    }

    // Convert to int.
    $employee_number = intval($employee_number);

    // Validate that employee number is positive.
    // Normal people doesn't use negative employees
    // or use zero-based counting (that is only
    // for programmers).
    if ($employee_number <= 0) {
        return new ApiCallResult(
            success: false,
            message: "Employee number must be a positive integer.",
            data: null
        );
    }

    $employeeStatement = $db->prepare("
        SELECT 
            e.employee_number,
            e.first_name, 
            e.last_name
        FROM employees_table e
        WHERE e.employee_number = ?
        LIMIT 1;
    ");

    if (!$employeeStatement) {
        return new ApiCallResult(
            success: false,
            message: "Failed to prepare statement during retrieval of employee record.",
            data: null
        );
    }

    $employeeStatement->bind_param("i", $employee_number);
    $employeeStatement->execute();

    $employeeQueryResult = $employeeStatement->get_result();
    $employee = $employeeQueryResult->fetch_assoc();
    
    if (!$employee) {
        // Free up employee statement resources on error.
        $employeeStatement->close();
        return new ApiCallResult(
            success: false,
            message: "Employee not found.",
            data: null
        );
    }

    // Fetch the courses they took.
    $coursesStatement = $db->prepare("
        SELECT 
            c.course_name, c.degree_level, c.units_completed, c.is_finished
        FROM courses_table c
        WHERE c.achiever_employee_number = ?;
    ");

    if (!$coursesStatement) {
        // Free up employee statement resources on error.
        $employeeStatement->close();
        return new ApiCallResult(
            success: false,
            message: "Failed to prepare statement during retrieval of employee courses.",
            data: null
        );
    }

    $coursesStatement->bind_param("i", $employee_number);
    $coursesStatement->execute();
    $coursesQueryResult = $coursesStatement->get_result();

    $employee['courses'] = [];

    while ($course = $coursesQueryResult->fetch_assoc()) {
        $employee['courses'][] = $course;
    }

    // Free up resources. usually get cleaned up after request
    // but better to be explicit.
    $employeeStatement->close();
    $coursesStatement->close();

    return new ApiCallResult(
        success: true,
        message: "Employee details retrieved.",
        data: $employee
    );
};