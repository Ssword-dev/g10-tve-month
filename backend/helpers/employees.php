<?php

function parse_json_body(): array {
    $raw = file_get_contents('php://input');

    if (!is_string($raw) || trim($raw) === '') {
        return [];
    }

    $decoded = json_decode($raw, true);

    return is_array($decoded) ? $decoded : [];
}

function input_has(string $key, array $payload): bool {
    return array_key_exists($key, $payload)
        || array_key_exists($key, $_POST)
        || array_key_exists($key, $_GET);
}

function input_get(string $key, array $payload, mixed $default = null): mixed {
    if (array_key_exists($key, $payload)) {
        return $payload[$key];
    }

    if (array_key_exists($key, $_POST)) {
        return $_POST[$key];
    }

    if (array_key_exists($key, $_GET)) {
        return $_GET[$key];
    }

    return $default;
}

function normalize_boolean(mixed $value): int {
    if (is_bool($value)) {
        return $value ? 1 : 0;
    }

    if (is_numeric($value)) {
        return (int)$value === 1 ? 1 : 0;
    }

    $normalized = strtolower(trim((string)$value));

    return in_array($normalized, ['1', 'true', 'yes', 'y', 'on'], true) ? 1 : 0;
}

function employeeReadTable(mysqli $db): string {
    return 'employees_table';
}

function employeeReadSelectSql(mysqli $db): string {
    $table = employeeReadTable($db);

    return "$table.*, TRIM(CONCAT_WS(' ', $table.first_name, $table.middle_name, $table.last_name)) AS full_name";
}

// Computed / Virtual fields.
function withEmployeeCourses(mysqli $db, array $employees): array {
    if (!$employees) {
        return $employees;
    }

    $employeeNumbers = [];

    foreach ($employees as $employee) {
        if (!isset($employee['employee_number'])) {
            continue;
        }

        $employeeNumbers[] = (int)$employee['employee_number'];
    }

    $employeeNumbers = array_values(array_unique($employeeNumbers));

    if (!$employeeNumbers) {
        foreach ($employees as &$employee) {
            $employee['courses'] = [];
        }

        return $employees;
    }

    $placeholders = implode(',', array_fill(0, count($employeeNumbers), '?'));
    $typeString = str_repeat('i', count($employeeNumbers));

    $coursesStatement = $db->prepare(
        "SELECT achiever_employee_number, course_name, degree_level, units_completed, is_finished
         FROM courses_table
         WHERE achiever_employee_number IN ($placeholders)
         ORDER BY achiever_employee_number ASC, degree_level ASC, course_name ASC"
    );

    if (!$coursesStatement) {
        throw new RuntimeException('Failed to prepare courses lookup query: ' . $db->error);
    }

    if (!bind_params($coursesStatement, $typeString, $employeeNumbers)) {
        $coursesStatement->close();
        throw new RuntimeException('Failed to bind courses lookup parameters.');
    }

    if (!$coursesStatement->execute()) {
        $coursesStatement->close();

        throw new RuntimeException('Failed to execute courses lookup query: ' . $coursesStatement->error);
    }

    $coursesResult = $coursesStatement->get_result();
    $coursesByEmployee = [];

    while ($course = $coursesResult->fetch_assoc()) {
        $employeeNumber = (int)$course['achiever_employee_number'];

        $coursesByEmployee[$employeeNumber][] = [
            'course_name' => $course['course_name'],
            'degree_level' => $course['degree_level'],
            'units_completed' => isset($course['units_completed']) ? (int)$course['units_completed'] : null,
            'is_finished' => (int)$course['is_finished'],
        ];
    }

    $coursesStatement->close();

    foreach ($employees as &$employee) {
        $employeeNumber = isset($employee['employee_number']) ? (int)$employee['employee_number'] : 0;
        $employee['courses'] = $coursesByEmployee[$employeeNumber] ?? [];
    }

    return $employees;
}

function withEmployeeAge(array $employees): array {
    foreach ($employees as &$employee) {
        $dateOfBirthRaw = $employee['date_of_birth'] ?? null;
        $dateOfBirth = is_string($dateOfBirthRaw) ? trim($dateOfBirthRaw) : '';

        if ($dateOfBirth === '') {
            $employee['age'] = null;
            continue;
        }

        $today = new DateTimeImmutable('today');
        $birthDate = DateTimeImmutable::createFromFormat('Y-m-d', $dateOfBirth);

        if (!$birthDate || $birthDate->format('Y-m-d') !== $dateOfBirth) {
            $employee['age'] = null;
            continue;
        }

        $employee['age'] = $birthDate->diff($today)->y;
    }

    return $employees;
}

function withComputed(mysqli $db, array $employees): array {
    $employees = withEmployeeCourses($db, $employees);
    $employees = withEmployeeAge($employees);
    return $employees;
}
