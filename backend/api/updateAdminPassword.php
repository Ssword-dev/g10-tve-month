<?php

require dirname(__DIR__) . '/vendor/autoload.php';
require_once dirname(__DIR__) . '/helpers/employees.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(type: 'error', message: 'Invalid request method. POST required.', statusCode: 405);
}

$payload = parse_json_body();
$employeeNumberRaw = input_get('employee_number', $payload);
$newPassword = (string)input_get('new_password', $payload, '');
$confirmPassword = (string)input_get('confirm_password', $payload, '');

$employeeNumber = filter_var($employeeNumberRaw, FILTER_VALIDATE_INT);
if ($employeeNumber === false || $employeeNumber <= 0) {
    respond(type: 'error', message: 'employee_number must be a positive integer.', statusCode: 422);
}

if (strlen($newPassword) < 8) {
    respond(type: 'error', message: 'new_password must be at least 8 characters.', statusCode: 422);
}

if ($newPassword !== $confirmPassword) {
    respond(type: 'error', message: 'new_password and confirm_password do not match.', statusCode: 422);
}

$db = db();

$check = $db->prepare('SELECT employee_number FROM admin_users_table WHERE employee_number = ? LIMIT 1');
if (!$check) {
    respond(type: 'error', message: 'Failed to prepare admin check.', statusCode: 500);
}

$check->bind_param('i', $employeeNumber);
if (!$check->execute()) {
    $check->close();
    respond(type: 'error', message: 'Failed to execute admin check.', statusCode: 500);
}

$isAdmin = (bool)$check->get_result()->fetch_assoc();
$check->close();

if (!$isAdmin) {
    respond(type: 'error', message: 'Admin user not found.', statusCode: 404);
}

$newHash = password_hash($newPassword, PASSWORD_DEFAULT);
$update = $db->prepare('UPDATE admin_users_table SET password_hash = ? WHERE employee_number = ? LIMIT 1');
if (!$update) {
    respond(type: 'error', message: 'Failed to prepare password update.', statusCode: 500);
}

$update->bind_param('si', $newHash, $employeeNumber);
if (!$update->execute()) {
    $update->close();
    respond(type: 'error', message: 'Failed to update admin password.', statusCode: 500);
}

$update->close();

respond(type: 'success');
