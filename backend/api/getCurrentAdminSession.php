<?php
require dirname(__DIR__) . '/vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(
        type: 'error',
        message: 'Invalid request method. GET required.',
        statusCode: 405
    );
}

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

$authUser = $_SESSION['auth_user'] ?? null;
$employeeNumber = $_SESSION['employee_number'] ?? null;

if (!is_array($authUser) || !is_numeric($employeeNumber)) {
    respond(
        type: 'data',
        data: [
            'authenticated' => false,
            'role' => 'guest',
            'permissions' => [
                'can_manage_employees' => false,
                'can_view_sensitive_employee_fields' => false,
            ],
            'user' => null,
        ]
    );
}

respond(
    type: 'data',
    data: [
        'authenticated' => true,
        'role' => 'admin',
        'permissions' => [
            'can_manage_employees' => true,
            'can_view_sensitive_employee_fields' => true,
        ],
        'user' => $authUser,
    ]
);
