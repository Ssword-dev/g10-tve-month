<?php
require dirname(__DIR__) . '/vendor/autoload.php';

$db = db();

$stmt = $db->prepare("SELECT * FROM employees_table;");

if (!$stmt) respond(
        type: 'error',
        message: 'Failed to prepare statement.',
        statusCode: 500
);


if (!$stmt->execute()) respond(
    type: 'error',
    message: 'Failed to execute prepared statement.',
    statusCode: 500
);

$result = $stmt->get_result();

$employees = [];

while ($employee = $result->fetch_assoc()){
    $employees []= $employee;
}

respond(
    type: 'data',
    data: $employees
);