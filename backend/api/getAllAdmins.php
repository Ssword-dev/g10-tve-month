<?php

require dirname(__DIR__) . '/vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(type: 'error', message: 'Invalid request method. GET required.', statusCode: 405);
}

$db = db();
$stmt = $db->prepare(
    'SELECT
        e.employee_number,
        e.first_name,
        e.middle_name,
        e.last_name,
        e.deped_email,
        e.designation,
        e.employment_status
    FROM admin_users_table a
    INNER JOIN employees_table e ON e.employee_number = a.employee_number
    ORDER BY e.last_name ASC, e.first_name ASC'
);

if (!$stmt) {
    respond(type: 'error', message: 'Failed to prepare admins query.', statusCode: 500);
}

if (!$stmt->execute()) {
    $stmt->close();
    respond(type: 'error', message: 'Failed to execute admins query.', statusCode: 500);
}

$result = $stmt->get_result();
$admins = [];
$avatarDirectory = dirname(__DIR__) . '/runtime/admin_avatars';

while ($row = $result->fetch_assoc()) {
    $avatarUrl = null;
    if (is_dir($avatarDirectory)) {
        $matches = glob($avatarDirectory . '/' . (int)$row['employee_number'] . '.*') ?: [];
        if (count($matches) > 0) {
            $avatarUrl = '/api/getAdminAvatar?employee_number=' . rawurlencode((string)$row['employee_number']);
        }
    }

    $row['avatar_url'] = $avatarUrl;
    $admins[] = $row;
}

$stmt->close();
respond(type: 'data', data: $admins);
