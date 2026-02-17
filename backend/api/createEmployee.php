<?php

require dirname(__DIR__) . '/vendor/autoload.php';
require_once dirname(__DIR__) . '/helpers/employees.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(type: 'error', message: 'Invalid request method. POST required.', statusCode: 405);
}

function normalize_nullable_string(mixed $value): ?string {
    $trimmed = trim((string)$value);
    return $trimmed === '' ? null : $trimmed;
}

function normalize_nullable_int(mixed $value): ?int {
    if ($value === null || $value === '') {
        return null;
    }

    if (!is_numeric($value)) {
        return null;
    }

    return (int)$value;
}

function normalize_nullable_date(mixed $value): ?string {
    $trimmed = trim((string)$value);
    if ($trimmed === '') {
        return null;
    }

    $parsed = DateTime::createFromFormat('Y-m-d', $trimmed);
    $valid = $parsed && $parsed->format('Y-m-d') === $trimmed;

    return $valid ? $trimmed : null;
}

$db = db();
$payload = parse_json_body();

$employeeNumberRaw = input_get('employee_number', $payload);
$employeeNumber = filter_var($employeeNumberRaw, FILTER_VALIDATE_INT);

if ($employeeNumber === false || $employeeNumber <= 0) {
    respond(type: 'error', message: 'employee_number must be a positive integer.', statusCode: 422);
}

$firstName = trim((string)input_get('first_name', $payload, ''));
$middleName = trim((string)input_get('middle_name', $payload, ''));
$lastName = trim((string)input_get('last_name', $payload, ''));

if ($firstName === '' || $lastName === '') {
    respond(type: 'error', message: 'first_name and last_name are required.', statusCode: 422);
}

$record = [
    'first_name' => $firstName,
    'middle_name' => $middleName,
    'last_name' => $lastName,
    'deped_email' => normalize_nullable_string(input_get('deped_email', $payload, '')),
    'employee_number' => (int)$employeeNumber,
    'designation' => normalize_nullable_string(input_get('designation', $payload, '')),
    'date_joined' => normalize_nullable_date(input_get('date_joined', $payload, '')),
    'date_of_latest_promotion' => normalize_nullable_date(input_get('date_of_latest_promotion', $payload, '')),
    'contact_number' => normalize_nullable_string(input_get('contact_number', $payload, '')),
    'plantilla_number' => normalize_nullable_string(input_get('plantilla_number', $payload, '')),
    'date_of_original_appointment' => normalize_nullable_date(input_get('date_of_original_appointment', $payload, '')),
    'bp_number' => normalize_nullable_int(input_get('bp_number', $payload, '')),
    'address' => normalize_nullable_string(input_get('address', $payload, '')),
    'civil_status' => normalize_nullable_string(input_get('civil_status', $payload, '')),
    'date_of_birth' => normalize_nullable_date(input_get('date_of_birth', $payload, '')),
    'salary_grade' => normalize_nullable_int(input_get('salary_grade', $payload, '')),
    'salary' => normalize_nullable_string(input_get('salary', $payload, '')),
    'employment_status' => normalize_nullable_string(input_get('employment_status', $payload, '')),
    'tin' => normalize_nullable_string(input_get('tin', $payload, '')),
    'place_of_birth' => normalize_nullable_string(input_get('place_of_birth', $payload, '')),
];

if (input_has('tin', $payload) && $record['tin'] !== null && strlen($record['tin']) > 11) {
    respond(type: 'error', message: 'tin must be 11 characters or less.', statusCode: 422);
}

if (input_has('deped_email', $payload) && $record['deped_email'] !== null && !filter_var($record['deped_email'], FILTER_VALIDATE_EMAIL)) {
    respond(type: 'error', message: 'deped_email must be a valid email address.', statusCode: 422);
}

$check = $db->prepare('SELECT employee_number FROM employees_table WHERE employee_number = ? LIMIT 1');
if (!$check) {
    respond(type: 'error', message: 'Failed to prepare duplicate employee check.', statusCode: 500);
}

$check->bind_param('i', $record['employee_number']);

if (!$check->execute()) {
    $check->close();
    respond(type: 'error', message: 'Failed to execute duplicate employee check.', statusCode: 500);
}

$existing = $check->get_result();
$exists = (bool)($existing && $existing->fetch_assoc());
$check->close();

if ($exists) {
    respond(type: 'error', message: 'Employee number already exists.', statusCode: 409);
}

$stmt = $db->prepare(
    'INSERT INTO employees_table (
        first_name, middle_name, last_name, deped_email,
        employee_number, designation, date_joined, date_of_latest_promotion,
        contact_number, plantilla_number, date_of_original_appointment, bp_number,
        address, civil_status, date_of_birth, salary_grade, salary,
        employment_status, tin, place_of_birth
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);

if (!$stmt) {
    respond(type: 'error', message: 'Failed to prepare employee insert.', statusCode: 500);
}

$stmt->bind_param(
    'ssssisssssisssisssss',
    $record['first_name'],
    $record['middle_name'],
    $record['last_name'],
    $record['deped_email'],
    $record['employee_number'],
    $record['designation'],
    $record['date_joined'],
    $record['date_of_latest_promotion'],
    $record['contact_number'],
    $record['plantilla_number'],
    $record['date_of_original_appointment'],
    $record['bp_number'],
    $record['address'],
    $record['civil_status'],
    $record['date_of_birth'],
    $record['salary_grade'],
    $record['salary'],
    $record['employment_status'],
    $record['tin'],
    $record['place_of_birth']
);

if (!$stmt->execute()) {
    $stmt->close();
    respond(type: 'error', message: 'Failed to create employee record.', statusCode: 500);
}

$stmt->close();

$lookup = $db->prepare('SELECT * FROM employees_table WHERE employee_number = ? LIMIT 1');
if (!$lookup) {
    respond(type: 'error', message: 'Failed to prepare employee lookup.', statusCode: 500);
}

$lookup->bind_param('i', $record['employee_number']);

if (!$lookup->execute()) {
    $lookup->close();
    respond(type: 'error', message: 'Failed to execute employee lookup.', statusCode: 500);
}

$employee = $lookup->get_result()->fetch_assoc();
$lookup->close();

if (!$employee) {
    respond(type: 'error', message: 'Employee was created but lookup failed.', statusCode: 500);
}

$withCourses = with_employee_courses($db, [$employee]);
respond(type: 'data', data: $withCourses[0]);
