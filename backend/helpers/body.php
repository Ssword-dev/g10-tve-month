<?php

function body() {
    static $parsedBody = null;
    static $hasParsed = false;

    if ($hasParsed) {
        return $parsedBody;
    }

    $hasParsed = true;
    $requestBody = file_get_contents('php://input');
    $contentType = strtolower((string)($_SERVER['CONTENT_TYPE'] ?? ''));

    if (str_contains($contentType, 'application/json')) {
        $decoded = json_decode($requestBody ?: 'null', true);
        $parsedBody = is_array($decoded) ? $decoded : [];
        return $parsedBody;
    }

    if (is_array($_POST) && count($_POST) > 0) {
        $parsedBody = $_POST;
        return $parsedBody;
    }

    $decoded = json_decode($requestBody ?: 'null', true);
    $parsedBody = is_array($decoded) ? $decoded : [];

    return $parsedBody;
}
