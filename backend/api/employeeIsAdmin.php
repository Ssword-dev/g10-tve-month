<?php
require dirname(__DIR__) . '/vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(
        type: 'error',
        message: 'Invalid request method. POST required.',
        statusCode: 405
    );
}

$contentType = strtolower($_SERVER['CONTENT_TYPE'] ?? '');
$rawBody = file_get_contents('php://input');

$requestData = [];
if (str_contains($contentType, 'application/json')) {
    $decoded = json_decode($rawBody ?: 'null', true);

    if (!is_array($decoded)) {
        respond(
            type: 'error',
            message: 'Invalid JSON body.',
            statusCode: 400
        );
    }

    $requestData = $decoded;
} else {
    $requestData = $_POST;
}

$employeeNumberRaw = $requestData['employee_number'] ?? null;

if ($employeeNumberRaw === null) {
    respond(
        type: 'error',
        message: 'employee_number is required.',
        statusCode: 422
    );
}

$employeeNumber = filter_var($employeeNumberRaw, FILTER_VALIDATE_INT);

if ($employeeNumber === false || $employeeNumber <= 0) {
    respond(
        type: 'error',
        message: 'employee_number must be a positive integer.',
        statusCode: 422
    );
}

$db = db();

$existsStmt = $db->prepare('SELECT employee_number FROM employees_table WHERE employee_number = ? LIMIT 1');
if (!$existsStmt) {
    respond(
        type: 'error',
        message: 'Failed to prepare employee existence query.',
        statusCode: 500
    );
}

$existsStmt->bind_param('i', $employeeNumber);

if (!$existsStmt->execute()) {
    $existsStmt->close();

    respond(
        type: 'error',
        message: 'Failed to execute employee existence query.',
        statusCode: 500
    );
}

$existsResult = $existsStmt->get_result();
$employeeExists = (bool)($existsResult && $existsResult->fetch_assoc());
$existsStmt->close();

$isAdmin = false;

if ($employeeExists) {
    $adminStmt = $db->prepare('SELECT employee_number FROM admin_users_table WHERE employee_number = ? LIMIT 1');

    if (!$adminStmt) {
        respond(
            type: 'error',
            message: 'Failed to prepare admin check query.',
            statusCode: 500
        );
    }

    $adminStmt->bind_param('i', $employeeNumber);

    if (!$adminStmt->execute()) {
        $adminStmt->close();

        respond(
            type: 'error',
            message: 'Failed to execute admin check query.',
            statusCode: 500
        );
    }

    $adminResult = $adminStmt->get_result();
    $isAdmin = (bool)($adminResult && $adminResult->fetch_assoc());
    $adminStmt->close();
}

respond(
    type: 'data',
    data: [
        'employee_number' => $employeeNumber,
        'exists' => $employeeExists,
        'is_admin' => $isAdmin,
    ]
);
