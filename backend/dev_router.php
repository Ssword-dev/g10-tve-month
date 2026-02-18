<?php
$requested = $_SERVER['REQUEST_URI'];

// remove query string for routing
$path = parse_url($requested, PHP_URL_PATH);

if ($path === '/' || $path === '') {
    $path = '/index.php';
} else {
    if (!preg_match('/\.[a-zA-Z0-9]+$/', $path)) {
        $path .= '.php';
    }
}

$file = __DIR__ . '/api' . $path;
if (file_exists($file)) {
    require $file;
    exit(0);
}

// fallback 404
http_response_code(404);
echo "404 Not Found: $path";