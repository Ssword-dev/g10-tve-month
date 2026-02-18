<?php

require dirname(__DIR__) . '/vendor/autoload.php';
require_once dirname(__DIR__) . '/helpers/employees.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(type: 'error', message: 'Invalid request method. POST required.', statusCode: 405);
}

$db = db();
$payload = body();
if (!is_array($payload)) {
    $payload = [];
}
$employeeNumberRaw = input_get('employee_number', $payload);

if (!is_numeric($employeeNumberRaw) || (int)$employeeNumberRaw <= 0) {
    respond(type: 'error', message: 'employee_number must be a positive integer.', statusCode: 422);
}

$employeeNumber = (int)$employeeNumberRaw;

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

$activeAdminEmployeeNumber = $_SESSION['employee_number'] ?? null;
if (is_numeric($activeAdminEmployeeNumber) && (int)$activeAdminEmployeeNumber === $employeeNumber) {
    respond(
        type: 'error',
        message: 'Cannot delete the currently authenticated admin employee.',
        statusCode: 403
    );
}

$adminLinkCheck = $db->prepare('SELECT employee_number FROM admin_users_table WHERE employee_number = ? LIMIT 1');
if (!$adminLinkCheck) {
    respond(type: 'error', message: 'Failed to prepare admin link check.', statusCode: 500);
}

$adminLinkCheck->bind_param('i', $employeeNumber);
if (!$adminLinkCheck->execute()) {
    $adminLinkCheck->close();
    respond(type: 'error', message: 'Failed to execute admin link check.', statusCode: 500);
}

$isLinkedToAdmin = (bool)$adminLinkCheck->get_result()->fetch_assoc();
$adminLinkCheck->close();

if ($isLinkedToAdmin) {
    respond(
        type: 'error',
        message: 'Cannot delete an employee with an active admin role. Revoke admin role first.',
        statusCode: 409
    );
}

$employeeStatement = $db->prepare('SELECT employee_number FROM employees_table WHERE employee_number = ? LIMIT 1');
if (!$employeeStatement) {
    respond(type: 'error', message: 'Failed to prepare employee lookup.', statusCode: 500);
}

$employeeStatement->bind_param('i', $employeeNumber);
if (!$employeeStatement->execute()) {
    $employeeStatement->close();
    respond(type: 'error', message: 'Failed to execute employee lookup.', statusCode: 500);
}

$exists = (bool)$employeeStatement->get_result()->fetch_assoc();
$employeeStatement->close();

if (!$exists) {
    respond(type: 'error', message: 'Employee not found.', statusCode: 404);
}

$deleteStatement = $db->prepare('DELETE FROM employees_table WHERE employee_number = ? LIMIT 1');
if (!$deleteStatement) {
    respond(type: 'error', message: 'Failed to prepare employee deletion.', statusCode: 500);
}

$deleteStatement->bind_param('i', $employeeNumber);
if (!$deleteStatement->execute()) {
    $deleteStatement->close();
    respond(type: 'error', message: 'Failed to delete employee.', statusCode: 500);
}

$deleteStatement->close();

respond(type: 'success');
