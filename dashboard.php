<?php
session_start();
if (!isset($_SESSION['employee_number'])) {
    header("Location: login.html");
    exit();
}

require_once 'db.php';

$employee_number = $_SESSION['employee_number'];

$stmt = $conn->prepare("SELECT * FROM admin_users_view WHERE employee_number = ?");
$stmt->bind_param("i", $employee_number);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $admin = $result->fetch_assoc();
} else {
    die("Admin info not found.");
}

$stmt->close();
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Dashboard</title>
</head>
<body>
    <h1>Welcome, <?php echo htmlspecialchars($admin['first_name'] . ' ' . $admin['last_name']); ?></h1>
    <p>Employee Number: <?php echo $admin['employee_number']; ?></p>
    <p>Email: <?php echo $admin['deped_email']; ?></p>
    <p>Designation: <?php echo $admin['designation']; ?></p>
    <p>Date Joined: <?php echo $admin['date_joined']; ?></p>
    <p>Salary: <?php echo $admin['salary']; ?></p>
    <p><a href="logout.php">Logout</a></p>
</body>
</html>