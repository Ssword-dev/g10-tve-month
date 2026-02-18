<?php
require dirname(__DIR__) . '/vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(
        type: 'error',
        message: 'Invalid request method. POST required.',
        statusCode: 405
    );
}

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

// Parse request payload through the shared body() helper to keep POST input handling consistent.
body();

$_SESSION = [];

if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params['path'] ?? '/',
        $params['domain'] ?? '',
        (bool)($params['secure'] ?? false),
        (bool)($params['httponly'] ?? true)
    );
}

session_destroy();

respond(
    type: 'data',
    data: [
        'authenticated' => false,
        'role' => 'guest',
        'permissions' => [
            'can_manage_employees' => false,
            'can_view_sensitive_employee_fields' => false,
        ],
    ]
);
