<?php
require dirname(__DIR__) . '/vendor/autoload.php';
require_once dirname(__DIR__) . '/helpers/employees.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(type: 'error', message: 'Invalid request method. GET required.', statusCode: 405);
}

$db = db();

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

$isAuthenticatedAdmin = is_array($_SESSION['auth_user'] ?? null) && is_numeric($_SESSION['employee_number'] ?? null);
$allowedGuestFields = [
    'employee_number',
    'first_name',
    'middle_name',
    'last_name',
    'designation',
    'employment_status',
    'date_joined',
];

$stmt = $db->prepare('SELECT * FROM employees_table ORDER BY last_name ASC, first_name ASC;');

if (!$stmt) {
    respond(type: 'error', message: 'Failed to prepare statement.', statusCode: 500);
}

if (!$stmt->execute()) {
    $stmt->close();

    respond(type: 'error', message: 'Failed to execute prepared statement.', statusCode: 500);
}

$result = $stmt->get_result();
$employees = [];

while ($employee = $result->fetch_assoc()) {
    if (!$isAuthenticatedAdmin) {
        $employee = array_intersect_key($employee, array_flip($allowedGuestFields));
    }
    $employees[] = $employee;
}

$stmt->close();

try {
    $employees = with_employee_courses($db, $employees);
} catch (RuntimeException $exception) {
    respond(type: 'error', message: $exception->getMessage(), statusCode: 500);
}

respond(type: 'data', data: $employees);
