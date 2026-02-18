<?php
require dirname(__DIR__) . '/vendor/autoload.php';

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
$required_fields = ['employee_number', 'first_name', 'last_name', 'designation', 'employment_status'];
foreach ($required_fields as $field) {
    if (empty($body[$field])) {
        respond(
            type: 'error',
            message: "Field '$field' is required.",
            statusCode: 400
        );
    }
}

$employee_number_raw = (string)$body['employee_number'];
if (!preg_match('/^[1-9][0-9]*$/', $employee_number_raw)) {
    respond(
        type: 'error',
        message: "Field 'employee_number' must be a positive integer.",
        statusCode: 400
    );
}
$employee_number = (int)$employee_number_raw;

$exists = $db->prepare('SELECT employee_number FROM employees_table WHERE employee_number = ? LIMIT 1');
if (!$exists) {
    respond(
        type: 'error',
        message: 'Failed to prepare employee number validation query.',
        statusCode: 500
    );
}

$exists->bind_param('i', $employee_number);
$exists->execute();
$existsResult = $exists->get_result();
if ($existsResult && $existsResult->num_rows > 0) {
    $exists->close();
    respond(
        type: 'error',
        message: 'Employee number already exists.',
        statusCode: 409
    );
}
$exists->close();

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

// Bind-safe variables.
$first_name = (string)$body['first_name'];
$middle_name = (string)($body['middle_name'] ?? '');
$last_name = (string)$body['last_name'];
$deped_email = isset($body['deped_email']) && $body['deped_email'] !== '' ? (string)$body['deped_email'] : null;
$designation = (string)$body['designation'];
$contact_number = (string)($body['contact_number'] ?? '');
$plantilla_number = (string)($body['plantilla_number'] ?? '');
$address = (string)($body['address'] ?? '');
$civil_status = (string)($body['civil_status'] ?? '');
$salary = (string)($body['salary'] ?? '');
$employment_status = (string)$body['employment_status'];
$tin = (string)($body['tin'] ?? '');
$place_of_birth = (string)($body['place_of_birth'] ?? '');

$stmt->bind_param(
    "issssssssssisissssss",
    $employee_number,
    $first_name,
    $middle_name,
    $last_name,
    $deped_email,
    $designation,
    $date_joined,
    $date_of_latest_promotion,
    $contact_number,
    $plantilla_number,
    $date_of_original_appointment,
    $bp_number,
    $address,
    $civil_status,
    $date_of_birth,
    $salary_grade,
    $salary,
    $employment_status,
    $tin,
    $place_of_birth
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
