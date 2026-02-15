<?php
require __DIR__ . '/backend/vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require __DIR__ . '/backend/api/login.php';
    exit(0);
}

respond(
    type: 'error',
    message: 'Legacy endpoint. Use POST /backend/api/login.php.',
    statusCode: 410
);
