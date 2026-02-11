<?php

// ### Default Database Configurations ### //
// DO NOT EDIT THIS CONFIGURATION UNLESS   //
// YOU KNOW WHAT YOU ARE DOING... Please.  //

config('mysql_host', 'localhost');
config('mysql_user', 'root');
config('mysql_password', '');
config('mysql_database', 'tve_month_db');

function db(): mysqli {
    $connection = config('mysql_database_connection');

    if ($connection instanceof mysqli) {
        return $connection;
    }

    $connection = mysqli_connect(
        config('mysql_host'),
        config('mysql_user'),
        config('mysql_password'),
        config('mysql_database')
    );

    if (!$connection) {
        throw new RuntimeException('Database connection failed: ' . mysqli_connect_error());
    }

    config('mysql_database_connection', $connection);

    return $connection;
}
