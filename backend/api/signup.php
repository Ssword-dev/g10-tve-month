<?php
require dirname(__DIR__) . '/vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(
        type: 'error',
        message: 'Invalid request method. POST required.',
        statusCode: 405
    );
}

function nullable_string(string $value): ?string
{
    $trimmed = trim($value);
    return $trimmed === '' ? null : $trimmed;
}

function nullable_int(string $value): ?int
{
    $trimmed = trim($value);
    if ($trimmed === '') {
        return null;
    }

    $parsed = filter_var($trimmed, FILTER_VALIDATE_INT);
    return $parsed === false ? null : (int) $parsed;
}

function nullable_bp_number(string $value): ?string
{
    $trimmed = trim($value);
    if ($trimmed === '') {
        return null;
    }

    return strlen($trimmed) > 30 ? null : $trimmed;
}

function nullable_date(string $value): ?string
{
    $trimmed = trim($value);
    if ($trimmed === '') {
        return null;
    }

    $parsed = DateTime::createFromFormat('Y-m-d', $trimmed);
    $isValid = $parsed && $parsed->format('Y-m-d') === $trimmed;

    return $isValid ? $trimmed : null;
}

$payload = body();
if (!is_array($payload)) {
    $payload = [];
}

$form_data = [
    'employee_number' => nullable_int((string)($payload['employee_number'] ?? '')),
    'first_name' => trim((string)($payload['first_name'] ?? '')),
    'middle_name' => trim((string)($payload['middle_name'] ?? '')),
    'last_name' => trim((string)($payload['last_name'] ?? '')),
    'deped_email' => nullable_string((string)($payload['deped_email'] ?? '')),
    'designation' => nullable_string((string)($payload['designation'] ?? '')),
    'date_joined' => nullable_date((string)($payload['date_joined'] ?? '')),
    'date_of_latest_promotion' => nullable_date((string)($payload['date_of_latest_promotion'] ?? '')),
    'contact_number' => nullable_string((string)($payload['contact_number'] ?? '')),
    'plantilla_number' => nullable_string((string)($payload['plantilla_number'] ?? '')),
    'date_of_original_appointment' => nullable_date((string)($payload['date_of_original_appointment'] ?? '')),
    'bp_number' => nullable_bp_number((string)($payload['bp_number'] ?? '')),
    'address' => nullable_string((string)($payload['address'] ?? '')),
    'civil_status' => nullable_string((string)($payload['civil_status'] ?? '')),
    'date_of_birth' => nullable_date((string)($payload['date_of_birth'] ?? '')),
    'salary_grade' => nullable_int((string)($payload['salary_grade'] ?? '')),
    'salary' => nullable_int((string)($payload['salary'] ?? '')),
    'employment_status' => nullable_string((string)($payload['employment_status'] ?? '')),
    'tin' => nullable_string((string)($payload['tin'] ?? '')),
    'place_of_birth' => nullable_string((string)($payload['place_of_birth'] ?? '')),
    'password' => (string)($payload['password'] ?? ''),
    'confirm_password' => (string)($payload['confirm_password'] ?? ''),
];

$errors = [];
if (!is_int($form_data['employee_number']) || $form_data['employee_number'] <= 0) {
    $errors[] = 'employee_number must be a positive integer.';
}
if ($form_data['first_name'] === '') {
    $errors[] = 'first_name is required.';
}
if ($form_data['last_name'] === '') {
    $errors[] = 'last_name is required.';
}
if ($form_data['middle_name'] === '') {
    $form_data['middle_name'] = '';
}
if (strlen($form_data['password']) < 8) {
    $errors[] = 'password must be at least 8 characters.';
}
if ($form_data['password'] !== $form_data['confirm_password']) {
    $errors[] = 'password and confirm_password do not match.';
}
if ($form_data['deped_email'] !== null && !filter_var($form_data['deped_email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'deped_email must be a valid email address.';
}
if ($form_data['tin'] !== null && strlen($form_data['tin']) > 60) {
    $errors[] = 'tin must be 60 characters or less.';
}
if (($payload['bp_number'] ?? '') !== '' && $form_data['bp_number'] === null) {
    $errors[] = 'bp_number must be at most 30 characters.';
}

$avatarUpload = $_FILES['avatar'] ?? null;
$avatarStagedPath = null;
$avatarExtension = null;
$avatarDirectory = dirname(__DIR__) . '/runtime/admin_avatars';

if ($avatarUpload && ($avatarUpload['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
    $uploadError = (int)($avatarUpload['error'] ?? UPLOAD_ERR_NO_FILE);
    if ($uploadError !== UPLOAD_ERR_OK) {
        $errors[] = 'avatar upload failed.';
    } else {
        $avatarTempPath = $avatarUpload['tmp_name'] ?? '';
        $avatarSize = (int)($avatarUpload['size'] ?? 0);

        if ($avatarSize <= 0 || $avatarSize > 5 * 1024 * 1024) {
            $errors[] = 'avatar must be less than or equal to 5MB.';
        } else {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mimeType = $finfo ? finfo_file($finfo, $avatarTempPath) : '';
            if ($finfo) {
                finfo_close($finfo);
            }

            $allowed = [
                'image/jpeg' => 'jpg',
                'image/png' => 'png',
                'image/webp' => 'webp',
            ];

            $avatarExtension = $allowed[$mimeType] ?? null;
            if ($avatarExtension === null) {
                $errors[] = 'avatar must be a valid jpeg, png, or webp image.';
            }
        }
    }
}

if (!empty($errors)) {
    respond(type: 'error', message: implode('<br>', $errors), statusCode: 422);
}

$db = db();
$check = null;
$stmt = null;
$stmt_admin = null;
$transactionStarted = false;

try {
    if ($avatarUpload && $avatarExtension !== null) {
        if (!is_dir($avatarDirectory) && !mkdir($avatarDirectory, 0775, true) && !is_dir($avatarDirectory)) {
            throw new RuntimeException('Failed to create avatar directory.');
        }

        $avatarStagedPath = $avatarDirectory . '/.' . $form_data['employee_number'] . '-' . bin2hex(random_bytes(8)) . '.tmp';
        if (!move_uploaded_file($avatarUpload['tmp_name'], $avatarStagedPath)) {
            throw new RuntimeException('Failed to save uploaded avatar.');
        }
    }

    $db->begin_transaction();
    $transactionStarted = true;

    $check = $db->prepare('SELECT employee_number FROM employees_table WHERE employee_number = ?');
    if (!$check) {
        throw new RuntimeException('Failed to prepare duplicate employee check.');
    }

    $formEmployeeNumber = $form_data['employee_number'];
    $check->bind_param('i', $formEmployeeNumber);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        throw new RuntimeException('Employee number already exists.');
    }

    $stmt = $db->prepare('
        INSERT INTO employees_table (
            first_name, middle_name, last_name, deped_email,
            employee_number, designation, date_joined, date_of_latest_promotion,
            contact_number, plantilla_number, date_of_original_appointment, bp_number,
            address, civil_status, date_of_birth, salary_grade, salary,
            employment_status, tin, place_of_birth
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ');

    if (!$stmt) {
        throw new RuntimeException('Failed to prepare employee insert.');
    }

    bind_params(
        $stmt,
        'ssssisssssssisssiisss',
        [
            $form_data['first_name'],
            $form_data['middle_name'],
            $form_data['last_name'],
            $form_data['deped_email'],
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
            $form_data['place_of_birth'],
        ],
    );

    if (!$stmt->execute()) {
        throw new RuntimeException('Failed to insert employee: ' . $db->error);
    }

    $password_hash = password_hash($form_data['password'], PASSWORD_DEFAULT);
    $stmt_admin = $db->prepare('INSERT INTO admin_users_table (employee_number, password_hash) VALUES (?, ?)');
    if (!$stmt_admin) {
        throw new RuntimeException('Failed to prepare admin insert.');
    }

    $adminEmployeeNumber = $form_data['employee_number'];
    $stmt_admin->bind_param('is', $adminEmployeeNumber, $password_hash);
    if (!$stmt_admin->execute()) {
        throw new RuntimeException('Failed to create admin user: ' . $db->error);
    }

    $db->commit();
    $transactionStarted = false;

    $avatar_url = null;
    if ($avatarStagedPath !== null && $avatarExtension !== null) {
        $avatarFinalPath = $avatarDirectory . '/' . $form_data['employee_number'] . '.' . $avatarExtension;

        foreach (glob($avatarDirectory . '/' . $form_data['employee_number'] . '.*') ?: [] as $existingFile) {
            @unlink($existingFile);
        }

        if (rename($avatarStagedPath, $avatarFinalPath)) {
            $avatar_url = '/api/getAdminAvatar?employee_number=' . rawurlencode((string)$form_data['employee_number']);
        } else {
            @unlink($avatarStagedPath);
        }
    }

    respond(
        type: 'data',
        data: [
            'employee_number' => $form_data['employee_number'],
            'first_name' => $form_data['first_name'],
            'last_name' => $form_data['last_name'],
            'avatar_url' => $avatar_url,
        ]
    );
} catch (Throwable $error) {
    if ($transactionStarted) {
        @$db->rollback();
    }

    if ($avatarStagedPath !== null && file_exists($avatarStagedPath)) {
        @unlink($avatarStagedPath);
    }

    $statusCode = str_contains(strtolower($error->getMessage()), 'already exists') ? 409 : 500;
    respond(type: 'error', message: $error->getMessage(), statusCode: $statusCode);
} finally {
    if ($stmt_admin instanceof mysqli_stmt) {
        $stmt_admin->close();
    }
    if ($stmt instanceof mysqli_stmt) {
        $stmt->close();
    }
    if ($check instanceof mysqli_stmt) {
        $check->close();
    }
}
