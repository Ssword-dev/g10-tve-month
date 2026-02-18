<?php

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(
        type: 'error',
        message: 'Please use POST as your http method.',
        statusCode: 400
    );
}

$db = db();
$body = body();

// Validate required fields
$required_fields = ['first_name', 'last_name', 'designation', 'employment_status'];
foreach ($required_fields as $field) {
    if (empty($body[$field])) {
        respond(
            type: 'error',
            message: "Field '$field' is required.",
            statusCode: 400
        );
    }
}

// Generate employee number (you might want a different strategy)
// Using timestamp + random number for uniqueness
$employee_number = (int)round(microtime(true) * 1000) . rand(10, 99);

// Prepare the insert statement
$stmt = $db->prepare("
    INSERT INTO employees_table (
        employee_number,
        first_name,
        middle_name,
        last_name,
        deped_email,
        designation,
        date_joined,
        date_of_latest_promotion,
        contact_number,
        plantilla_number,
        date_of_original_appointment,
        bp_number,
        address,
        civil_status,
        date_of_birth,
        salary_grade,
        salary,
        employment_status,
        tin,
        place_of_birth
    ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
");

// Handle empty strings as NULL for date fields
$date_joined = !empty($body['date_joined']) ? $body['date_joined'] : null;
$date_of_latest_promotion = !empty($body['date_of_latest_promotion']) ? $body['date_of_latest_promotion'] : null;
$date_of_original_appointment = !empty($body['date_of_original_appointment']) ? $body['date_of_original_appointment'] : null;
$date_of_birth = !empty($body['date_of_birth']) ? $body['date_of_birth'] : null;

// Handle numeric fields
$bp_number = !empty($body['bp_number']) ? (int)$body['bp_number'] : null;
$salary_grade = !empty($body['salary_grade']) ? (int)$body['salary_grade'] : null;

$stmt->bind_param(
    "issssssssssisissssss",
    $employee_number,
    $body['first_name'],
    $body['middle_name'] ?? '',
    $body['last_name'],
    $body['deped_email'] ?? null,
    $body['designation'],
    $date_joined,
    $date_of_latest_promotion,
    $body['contact_number'] ?? '',
    $body['plantilla_number'] ?? '',
    $date_of_original_appointment,
    $bp_number,
    $body['address'] ?? '',
    $body['civil_status'] ?? '',
    $date_of_birth,
    $salary_grade,
    $body['salary'] ?? '',
    $body['employment_status'],
    $body['tin'] ?? '',
    $body['place_of_birth'] ?? ''
);

if ($stmt->execute()) {
    respond(
        type: 'success',
        message: 'Employee added successfully',
        data: ['employee_number' => $employee_number],
        statusCode: 201
    );
} else {
    respond(
        type: 'error',
        message: 'Failed to add employee: ' . $stmt->error,
        statusCode: 500
    );
}

$stmt->close();
$db->close();