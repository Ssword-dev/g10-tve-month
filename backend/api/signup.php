<?php
require dirname(__DIR__) . '/vendor/autoload.php';

$db = db();

// only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(
        type: 'error',
        message: 'Invalid request method. POST required.',
        statusCode: 405
    );
}

// collect form data
$form_data = [
    'employee_number' => $_POST['employee_number'] ?? null,
    'first_name' => $_POST['first_name'] ?? null,
    'middle_name' => $_POST['middle_name'] ?? null,
    'last_name' => $_POST['last_name'] ?? null,
    'deped_email' => $_POST['deped_email'] ?? null,
    'designation' => $_POST['designation'] ?? null,
    'date_joined' => $_POST['date_joined'] ?? null,
    'date_of_latest_promotion' => $_POST['date_of_latest_promotion'] ?? null,
    'contact_number' => $_POST['contact_number'] ?? null,
    'plantilla_number' => $_POST['plantilla_number'] ?? null,
    'date_of_original_appointment' => $_POST['date_of_original_appointment'] ?? null,
    'bp_number' => $_POST['bp_number'] ?? null,
    'address' => $_POST['address'] ?? null,
    'civil_status' => $_POST['civil_status'] ?? null,
    'date_of_birth' => $_POST['date_of_birth'] ?? null,
    'salary_grade' => $_POST['salary_grade'] ?? null,
    'salary' => $_POST['salary'] ?? null,
    'employment_status' => $_POST['employment_status'] ?? null,
    'tin' => $_POST['tin'] ?? null,
    'place_of_birth' => $_POST['place_of_birth'] ?? null,
    'password' => $_POST['password'] ?? null,
    'confirm_password' => $_POST['confirm_password'] ?? null,
];

// validate form
$errors = validate_form($form_data);
if (!empty($errors)) {
    respond(
        type: 'error',
        message: implode("<br>", $errors)
    );
}

try {
    // begin transaction
    $db->begin_transaction();

    // check if employee exists
    $check = $db->prepare("SELECT employee_number FROM employees_table WHERE employee_number = ?");
    $check->bind_param("i", $form_data['employee_number']);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        throw new Exception("Employee number already exists.");
    }

    // insert employee
    $stmt = $db->prepare("
        INSERT INTO employees_table (
            first_name, middle_name, last_name, deped_email,
            employee_number, designation, date_joined, date_of_latest_promotion,
            contact_number, plantilla_number, date_of_original_appointment, bp_number,
            address, civil_status, date_of_birth, salary_grade, salary,
            employment_status, tin, place_of_birth
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $deped_email = $form_data['deped_email'] ?: null;

    $stmt->bind_param(
        "ssssisssssisssisssss",
        $form_data['first_name'],
        $form_data['middle_name'],
        $form_data['last_name'],
        $deped_email,
        $form_data['employee_number'],
        $form_data['designation'],
        $form_data['date_joined'],
        $form_data['date_of_latest_promotion'],
        $form_data['contact_number'],
        $form_data['plantilla_number'],
        $form_data['date_of_original_appointment'],
        $form_data['bp_number'],
        $form_data['address'],
        $form_data['civil_status'],
        $form_data['date_of_birth'],
        $form_data['salary_grade'],
        $form_data['salary'],
        $form_data['employment_status'],
        $form_data['tin'],
        $form_data['place_of_birth']
    );

    if (!$stmt->execute()) {
        throw new Exception("Failed to insert employee: " . $db->error);
    }

    // insert admin user
    $password_hash = password_hash($form_data['password'], PASSWORD_DEFAULT);
    $stmt_admin = $db->prepare("INSERT INTO admin_users_table (employee_number, password_hash) VALUES (?, ?)");
    $stmt_admin->bind_param("is", $form_data['employee_number'], $password_hash);

    if (!$stmt_admin->execute()) {
        throw new Exception("Failed to create admin user: " . $db->error);
    }

    // commit transaction
    $db->commit();

    respond(
        type: 'data',
        data: [
            'employee_number' => $form_data['employee_number'],
            'first_name' => $form_data['first_name'],
            'last_name' => $form_data['last_name'],
        ],
        message: 'Admin user created successfully.'
    );

} catch (Exception $e) {
    $db->rollback();
    respond(
        type: 'error',
        message: $e->getMessage()
    );
} finally {
    $stmt_admin->close();
    $stmt->close();
    $check->close();
}
