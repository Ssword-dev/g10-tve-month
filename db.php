<?php
$host = "localhost";
$user = "root";
$pass = ""; // your MySQL password
$dbname = "tve_month_db";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>