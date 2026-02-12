<?php
session_start();
require_once 'db.php'; // database connection

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $employee_number = trim($_POST['employee_number']);
    $password = $_POST['password'];

    if (empty($employee_number) || empty($password)) {
        die("Please enter both Employee Number and Password.");
    }

    // Use prepared statements to prevent SQL injection
    $stmt = $conn->prepare("SELECT password_hash FROM admin_users_table WHERE employee_number = ?");
    $stmt->bind_param("i", $employee_number);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();
        $hash = $row['password_hash'];

        if (password_verify($password, $hash)) {
            // Login success
            $_SESSION['employee_number'] = $employee_number;
            header("Location: dashboard.php");
            exit();
        } else {
            echo "<p class='error'>Incorrect password.</p>";
        }
    } else {
        echo "<p class='error'>Employee number not found or not an admin.</p>";
    }

    $stmt->close();
}
$conn->close();
?>