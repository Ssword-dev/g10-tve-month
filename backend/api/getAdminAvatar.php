<?php
require dirname(__DIR__) . '/vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(
        type: 'error',
        message: 'Invalid request method. GET required.',
        statusCode: 405
    );
}

$employeeNumberRaw = $_GET['employee_number'] ?? null;
$employeeNumber = filter_var($employeeNumberRaw, FILTER_VALIDATE_INT);

if ($employeeNumber === false || $employeeNumber <= 0) {
    respond(
        type: 'error',
        message: 'employee_number must be a positive integer.',
        statusCode: 422
    );
}

$avatarDirectory = dirname(__DIR__) . '/runtime/admin_avatars';
if (!is_dir($avatarDirectory)) {
    respond(type: 'error', message: 'Avatar not found.', statusCode: 404);
}

$matches = glob($avatarDirectory . '/' . $employeeNumber . '.*') ?: [];
if (count($matches) === 0) {
    respond(type: 'error', message: 'Avatar not found.', statusCode: 404);
}

$avatarPath = $matches[0];
if (!is_file($avatarPath)) {
    respond(type: 'error', message: 'Avatar not found.', statusCode: 404);
}

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = $finfo ? finfo_file($finfo, $avatarPath) : 'application/octet-stream';
if ($finfo) {
    finfo_close($finfo);
}

http_response_code(200);
header('Content-Type: ' . $mimeType);
header('Content-Length: ' . (string)filesize($avatarPath));
readfile($avatarPath);
exit(0);
