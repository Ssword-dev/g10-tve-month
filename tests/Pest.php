<?php
$boot = __DIR__ . '/bootstrap.php';
if (file_exists($boot)) {
    require_once $boot;
} else {
    fwrite(STDERR, "Missing bootstrap.php for tests\n");
    exit(1);
}