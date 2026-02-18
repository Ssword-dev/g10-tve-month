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

$requestData = body();
if (!is_array($requestData)) {
    $requestData = [];
}

$depedEmailRaw = $requestData['deped_email'] ?? null;
$passwordRaw = $requestData['password'] ?? null;

if ($depedEmailRaw === null || $passwordRaw === null) {
    respond(
        type: 'error',
        message: 'deped_email and password are required.',
        statusCode: 422
    );
}

$depedEmail = trim((string) $depedEmailRaw);
if ($depedEmail === '' || !filter_var($depedEmail, FILTER_VALIDATE_EMAIL)) {
    respond(
        type: 'error',
        message: 'deped_email must be a valid email address.',
        statusCode: 422
    );
}

$password = (string) $passwordRaw;
if (trim($password) === '') {
    respond(
        type: 'error',
        message: 'password is required.',
        statusCode: 422
    );
}

$db = db();
$stmt = $db->prepare("
    SELECT
        A.password_hash,
        E.employee_number,
        E.first_name,
        E.middle_name,
        E.last_name,
        E.deped_email,
        E.designation,
        E.employment_status
    FROM admin_users_table AS A
    INNER JOIN employees_table AS E
        ON E.employee_number = A.employee_number
    WHERE LOWER(E.deped_email) = LOWER(?)
    LIMIT 1
");

if (!$stmt) {
    respond(
        type: 'error',
        message: 'Failed to prepare login statement.',
        statusCode: 500
    );
}

$stmt->bind_param('s', $depedEmail);

if (!$stmt->execute()) {
    $stmt->close();

    respond(
        type: 'error',
        message: 'Failed to execute login statement.',
        statusCode: 500
    );
}

$result = $stmt->get_result();
$adminUser = $result ? $result->fetch_assoc() : null;
$stmt->close();

if (!$adminUser || !password_verify($password, $adminUser['password_hash'] ?? '')) {
    respond(
        type: 'error',
        message: 'Invalid deped_email or password.',
        statusCode: 401
    );
}

$_SESSION['employee_number'] = (int) $adminUser['employee_number'];
$avatarDirectory = dirname(__DIR__) . '/runtime/admin_avatars';
$avatarUrl = null;
if (is_dir($avatarDirectory)) {
    $matches = glob($avatarDirectory . '/' . $_SESSION['employee_number'] . '.*') ?: [];
    if (count($matches) > 0) {
        $avatarUrl = '/api/getAdminAvatar?employee_number=' . rawurlencode((string)$_SESSION['employee_number']);
    }
}

$_SESSION['auth_user'] = [
    'employee_number' => (int) $adminUser['employee_number'],
    'first_name' => $adminUser['first_name'],
    'middle_name' => $adminUser['middle_name'],
    'last_name' => $adminUser['last_name'],
    'deped_email' => $adminUser['deped_email'],
    'designation' => $adminUser['designation'],
    'employment_status' => $adminUser['employment_status'],
    'avatar_url' => $avatarUrl,
];

respond(
    type: 'data',
    data: [
        'authenticated' => true,
        'role' => 'admin',
        'permissions' => [
            'can_manage_employees' => true,
            'can_view_sensitive_employee_fields' => true,
        ],
        'user' => $_SESSION['auth_user'],
    ]
);
