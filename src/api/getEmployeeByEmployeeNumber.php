<?php
/** @var \mysqli $db */

// api/getEmployeeByNumber.php
// Fetch employee details by employee number, including their courses.

return function ($employee_number) {
    global $db;

    $employeeStatement = $db->prepare("
        SELECT 
            e.employee_number,
            e.first_name, 
            e.last_name
        FROM employees_table e
        WHERE e.employee_number = ?
        LIMIT 1;
    ");

    $employeeStatement->bind_param("i", $employee_number);
    $employeeStatement->execute();

    $employeeQueryResult = $employeeStatement->get_result();
    $employee = $employeeQueryResult->fetch_assoc();
    
    // fetch the courses they took.
    $coursesStatement = $db->prepare("
        SELECT 
            c.course_name, c.degree_level, c.units_completed, c.is_finished
        FROM courses_table c
        WHERE c.achiever_employee_number = ?;
    ");

    $coursesStatement->bind_param("i", $employee_number);
    $coursesStatement->execute();
    $coursesQueryResult = $coursesStatement->get_result();

    $employee['courses'] = [];

    while ($course = $coursesQueryResult->fetch_assoc()) {
        $employee['courses'][] = $course;
    }
    
    return $employee;
};