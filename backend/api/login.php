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
$passwordRaw = $requestData['password'] ?? null;

if ($employeeNumberRaw === null || $passwordRaw === null) {
    respond(
        type: 'error',
        message: 'employee_number and password are required.',
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
    WHERE A.employee_number = ?
    LIMIT 1
");

if (!$stmt) {
    respond(
        type: 'error',
        message: 'Failed to prepare login statement.',
        statusCode: 500
    );
}

$stmt->bind_param('i', $employeeNumber);

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
        message: 'Invalid employee_number or password.',
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
        'user' => $_SESSION['auth_user'],
    ]
);
