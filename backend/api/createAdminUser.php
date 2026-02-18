<?php

require dirname(__DIR__) . '/vendor/autoload.php';
require_once dirname(__DIR__) . '/helpers/employees.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(type: 'error', message: 'Invalid request method. POST required.', statusCode: 405);
}

$payload = body();
if (!is_array($payload)) {
    $payload = [];
}
$employeeNumberRaw = input_get('employee_number', $payload);
$password = (string)input_get('password', $payload, '');
$confirmPassword = (string)input_get('confirm_password', $payload, '');

$employeeNumber = filter_var($employeeNumberRaw, FILTER_VALIDATE_INT);
if ($employeeNumber === false || $employeeNumber <= 0) {
    respond(type: 'error', message: 'employee_number must be a positive integer.', statusCode: 422);
}

if (strlen($password) < 8) {
    respond(type: 'error', message: 'password must be at least 8 characters.', statusCode: 422);
}

if ($confirmPassword !== '' && $password !== $confirmPassword) {
    respond(type: 'error', message: 'password and confirm_password do not match.', statusCode: 422);
}

$db = db();

$employeeCheck = $db->prepare('SELECT employee_number FROM employees_table WHERE employee_number = ? LIMIT 1');
if (!$employeeCheck) {
    respond(type: 'error', message: 'Failed to prepare employee check.', statusCode: 500);
}

$employeeCheck->bind_param('i', $employeeNumber);
if (!$employeeCheck->execute()) {
    $employeeCheck->close();
    respond(type: 'error', message: 'Failed to execute employee check.', statusCode: 500);
}

$employeeExists = (bool)$employeeCheck->get_result()->fetch_assoc();
$employeeCheck->close();

if (!$employeeExists) {
    respond(type: 'error', message: 'Employee not found.', statusCode: 404);
}

$adminCheck = $db->prepare('SELECT employee_number FROM admin_users_table WHERE employee_number = ? LIMIT 1');
if (!$adminCheck) {
    respond(type: 'error', message: 'Failed to prepare admin check.', statusCode: 500);
}

$adminCheck->bind_param('i', $employeeNumber);
if (!$adminCheck->execute()) {
    $adminCheck->close();
    respond(type: 'error', message: 'Failed to execute admin check.', statusCode: 500);
}

$alreadyAdmin = (bool)$adminCheck->get_result()->fetch_assoc();
$adminCheck->close();

if ($alreadyAdmin) {
    respond(type: 'error', message: 'Employee is already an admin.', statusCode: 409);
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);
$insert = $db->prepare('INSERT INTO admin_users_table (employee_number, password_hash) VALUES (?, ?)');
if (!$insert) {
    respond(type: 'error', message: 'Failed to prepare admin insert.', statusCode: 500);
}

$insert->bind_param('is', $employeeNumber, $passwordHash);
if (!$insert->execute()) {
    $insert->close();
    respond(type: 'error', message: 'Failed to create admin user.', statusCode: 500);
}

$insert->close();

respond(type: 'data', data: [
    'employee_number' => (int)$employeeNumber,
    'is_admin' => true,
]);
