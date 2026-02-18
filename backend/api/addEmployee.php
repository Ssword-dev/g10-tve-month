<?php
require dirname(__DIR__) . '/vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(
        type: 'error',
        message: 'Please use POST as your http method.',
        statusCode: 400
    );
}

$db = db();
$body = body();
if (!is_array($body)) {
    respond(
        type: 'error',
        message: 'Invalid request body.',
        statusCode: 400
    );
}

// Validate required fields
$required_fields = ['employee_number', 'first_name', 'last_name', 'designation', 'employment_status'];
foreach ($required_fields as $field) {
    if (empty($body[$field])) {
        respond(
            type: 'error',
            message: "Field '$field' is required.",
            statusCode: 400
        );
    }
}

$employee_number_raw = (string)$body['employee_number'];
if (!preg_match('/^[1-9][0-9]*$/', $employee_number_raw)) {
    respond(
        type: 'error',
        message: "Field 'employee_number' must be a positive integer.",
        statusCode: 400
    );
}
$employee_number = (int)$employee_number_raw;

$exists = $db->prepare('SELECT employee_number FROM employees_table WHERE employee_number = ? LIMIT 1');
if (!$exists) {
    respond(
        type: 'error',
        message: 'Failed to prepare employee number validation query.',
        statusCode: 500
    );
}

$exists->bind_param('i', $employee_number);
$exists->execute();
$existsResult = $exists->get_result();
if ($existsResult && $existsResult->num_rows > 0) {
    $exists->close();
    respond(
        type: 'error',
        message: 'Employee number already exists.',
        statusCode: 409
    );
}
$exists->close();

$coursesInput = $body['courses'] ?? [];
if (!is_array($coursesInput)) {
    respond(
        type: 'error',
        message: "Field 'courses' must be an array.",
        statusCode: 400
    );
}

$allowedDegreeLevels = ['bachelor', 'master', 'doctorate'];
$courses = [];

foreach ($coursesInput as $index => $courseInput) {
    if (!is_array($courseInput)) {
        respond(
            type: 'error',
            message: "Invalid course entry at index $index.",
            statusCode: 400
        );
    }

    $courseName = trim((string)($courseInput['course_name'] ?? ''));
    $degreeLevel = trim((string)($courseInput['degree_level'] ?? ''));
    $unitsCompletedRaw = $courseInput['units_completed'] ?? null;
    $isFinishedRaw = $courseInput['is_finished'] ?? 0;

    if ($courseName === '' || $degreeLevel === '') {
        respond(
            type: 'error',
            message: "course_name and degree_level are required for course at index $index.",
            statusCode: 400
        );
    }

    if (!in_array($degreeLevel, $allowedDegreeLevels, true)) {
        respond(
            type: 'error',
            message: "Invalid degree_level for course at index $index.",
            statusCode: 400
        );
    }

    if ($unitsCompletedRaw !== null && $unitsCompletedRaw !== '' && !is_numeric($unitsCompletedRaw)) {
        respond(
            type: 'error',
            message: "units_completed must be numeric for course at index $index.",
            statusCode: 400
        );
    }

    $isFinished = 0;
    if (is_bool($isFinishedRaw)) {
        $isFinished = $isFinishedRaw ? 1 : 0;
    } elseif (is_numeric($isFinishedRaw)) {
        $isFinished = ((int)$isFinishedRaw) === 1 ? 1 : 0;
    } else {
        $normalized = strtolower(trim((string)$isFinishedRaw));
        $isFinished = in_array($normalized, ['1', 'true', 'yes', 'y', 'on'], true) ? 1 : 0;
    }

    $courses[] = [
        'course_name' => $courseName,
        'degree_level' => $degreeLevel,
        'units_completed' => ($unitsCompletedRaw === null || $unitsCompletedRaw === '') ? null : (int)$unitsCompletedRaw,
        'is_finished' => $isFinished,
    ];
}

// Prepare the insert statement
$stmt = $db->prepare("
    INSERT INTO employees_table (
        employee_number,
        first_name,
        middle_name,
        last_name,
        deped_email,
        designation,
        date_joined,
        date_of_latest_promotion,
        contact_number,
        plantilla_number,
        date_of_original_appointment,
        bp_number,
        address,
        civil_status,
        date_of_birth,
        salary_grade,
        salary,
        employment_status,
        tin,
        place_of_birth
    ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
");
if (!$stmt) {
    respond(
        type: 'error',
        message: 'Failed to prepare employee insert query.',
        statusCode: 500
    );
}

// Handle empty strings as NULL for date fields
$date_joined = !empty($body['date_joined']) ? $body['date_joined'] : null;
$date_of_latest_promotion = !empty($body['date_of_latest_promotion']) ? $body['date_of_latest_promotion'] : null;
$date_of_original_appointment = !empty($body['date_of_original_appointment']) ? $body['date_of_original_appointment'] : null;
$date_of_birth = !empty($body['date_of_birth']) ? $body['date_of_birth'] : null;

// Handle numeric fields
$bp_number = !empty($body['bp_number']) ? (int)$body['bp_number'] : null;
$salary_grade = !empty($body['salary_grade']) ? (int)$body['salary_grade'] : null;

// Bind-safe variables.
$first_name = (string)$body['first_name'];
$middle_name = (string)($body['middle_name'] ?? '');
$last_name = (string)$body['last_name'];
$deped_email = isset($body['deped_email']) && $body['deped_email'] !== '' ? (string)$body['deped_email'] : null;
$designation = (string)$body['designation'];
$contact_number = (string)($body['contact_number'] ?? '');
$plantilla_number = (string)($body['plantilla_number'] ?? '');
$address = (string)($body['address'] ?? '');
$civil_status = (string)($body['civil_status'] ?? '');
$salaryRaw = $body['salary'] ?? null;
if ($salaryRaw !== null && $salaryRaw !== '' && !is_numeric($salaryRaw)) {
    respond(
        type: 'error',
        message: "Field 'salary' must be numeric.",
        statusCode: 400
    );
}
$salary = ($salaryRaw === null || $salaryRaw === '') ? null : (int)$salaryRaw;
$employment_status = (string)$body['employment_status'];
$tin = (string)($body['tin'] ?? '');
$place_of_birth = (string)($body['place_of_birth'] ?? '');

$stmt->bind_param(
    "issssssssssisssiisss",
    $employee_number,
    $first_name,
    $middle_name,
    $last_name,
    $deped_email,
    $designation,
    $date_joined,
    $date_of_latest_promotion,
    $contact_number,
    $plantilla_number,
    $date_of_original_appointment,
    $bp_number,
    $address,
    $civil_status,
    $date_of_birth,
    $salary_grade,
    $salary,
    $employment_status,
    $tin,
    $place_of_birth
);

$courseStatement = null;

try {
    $db->begin_transaction();

    if (!$stmt->execute()) {
        throw new RuntimeException('Failed to add employee: ' . $stmt->error);
    }

    if (count($courses) > 0) {
        $courseStatement = $db->prepare(
            'INSERT INTO courses_table (achiever_employee_number, course_name, degree_level, units_completed, is_finished)
             VALUES (?, ?, ?, ?, ?)'
        );

        if (!$courseStatement) {
            throw new RuntimeException('Failed to prepare course insert statement.');
        }

        foreach ($courses as $course) {
            $courseName = $course['course_name'];
            $degreeLevel = $course['degree_level'];
            $unitsCompleted = $course['units_completed'];
            $isFinished = $course['is_finished'];

            $courseStatement->bind_param(
                'issii',
                $employee_number,
                $courseName,
                $degreeLevel,
                $unitsCompleted,
                $isFinished
            );

            if (!$courseStatement->execute()) {
                throw new RuntimeException('Failed to add initial course: ' . $courseStatement->error);
            }
        }
    }

    $db->commit();

    respond(
        type: 'success',
        message: 'Employee added successfully',
        data: [
            'employee_number' => $employee_number,
            'initial_courses_count' => count($courses),
        ],
        statusCode: 201
    );
} catch (Throwable $exception) {
    $db->rollback();

    respond(
        type: 'error',
        message: $exception->getMessage(),
        statusCode: 500
    );
} finally {
    if ($courseStatement instanceof mysqli_stmt) {
        $courseStatement->close();
    }
    $stmt->close();
    $db->close();
}
