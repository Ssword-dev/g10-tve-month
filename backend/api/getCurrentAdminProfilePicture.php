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

$defaultAvatarUrl = '/default-profile.svg';
$employeeNumber = $_SESSION['employee_number'] ?? null;

if (!is_numeric($employeeNumber)) {
    respond(
        type: 'data',
        data: [
            'avatar_url' => $defaultAvatarUrl,
        ]
    );
}

$employeeNumber = (int)$employeeNumber;
$avatarDirectory = dirname(__DIR__) . '/runtime/admin_avatars';
$avatarUrl = $defaultAvatarUrl;

if (is_dir($avatarDirectory)) {
    $matches = glob($avatarDirectory . '/' . $employeeNumber . '.*') ?: [];
    if (count($matches) > 0) {
        $avatarUrl = '/api/getAdminAvatar?employee_number=' . rawurlencode((string)$employeeNumber);
    }
}

respond(
    type: 'data',
    data: [
        'avatar_url' => $avatarUrl,
    ]
);
