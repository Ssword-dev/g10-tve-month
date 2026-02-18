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
$employeeNumber = filter_var($employeeNumberRaw, FILTER_VALIDATE_INT);

if ($employeeNumber === false || $employeeNumber <= 0) {
    respond(type: 'error', message: 'employee_number must be a positive integer.', statusCode: 422);
}

$db = db();
$delete = $db->prepare('DELETE FROM admin_users_table WHERE employee_number = ? LIMIT 1');
if (!$delete) {
    respond(type: 'error', message: 'Failed to prepare admin role removal.', statusCode: 500);
}

$delete->bind_param('i', $employeeNumber);
if (!$delete->execute()) {
    $delete->close();
    respond(type: 'error', message: 'Failed to remove admin role.', statusCode: 500);
}

$affectedRows = $delete->affected_rows;
$delete->close();

if ($affectedRows < 1) {
    respond(type: 'error', message: 'Admin role not found.', statusCode: 404);
}

respond(type: 'success');
