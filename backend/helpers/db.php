<?php

// ### Default Database Configurations ### //
// DO NOT EDIT THIS CONFIGURATION UNLESS   //
// YOU KNOW WHAT YOU ARE DOING... Please.  //

if (!is_callable('config')) {
    throw new Exception('Cannot set configuration variables, as `config()` is not found.');
}

config('mysql_host', getenv('MYSQL_HOST') ?: '127.0.0.1');
config('mysql_port', (int)(getenv('MYSQL_PORT') ?: '3306'));
config('mysql_user', getenv('MYSQL_USER') ?: 'root');
config('mysql_password', getenv('MYSQL_PASSWORD') ?: '');
config('mysql_database', getenv('MYSQL_DATABASE') ?: 'tve_month_db');

function db(): mysqli {
    $connection = config('mysql_database_connection');

    if ($connection instanceof mysqli) {
        return $connection;
    }

    $connection = mysqli_connect(
        config('mysql_host'),
        config('mysql_user'),
        config('mysql_password'),
        config('mysql_database'),
        (int) config('mysql_port')
    );

    if (!$connection) {
        throw new RuntimeException('Database connection failed: ' . mysqli_connect_error());
    }

    config('mysql_database_connection', $connection);

    return $connection;
}

function bind_params(mysqli_stmt $statement, string $types, array $params): bool {
    $bindArguments = [$types];

    foreach ($params as $index => $value) {
        $bindArguments[] = &$params[$index];
    }

    return call_user_func_array([$statement, 'bind_param'], $bindArguments);
}
