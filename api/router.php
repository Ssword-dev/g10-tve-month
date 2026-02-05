<?php

$qp = $_GET;
$bp = $_POST;

$p = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$p = rtrim($p, '/g10-tve-month');

$f = __DIR__ . $p;
$fn = require($f);

$result = $fn($qp, $bp);

if ($result->)