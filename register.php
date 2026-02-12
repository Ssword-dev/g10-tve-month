<?php
include "db.php";

if(isset($_POST['register'])){
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Secure password hash
    $hashed = password_hash($password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $username, $hashed);
    $stmt->execute();

    echo "Registered successfully!";
}
?>