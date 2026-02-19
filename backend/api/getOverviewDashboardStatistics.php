<?php

require dirname(__DIR__) . '/vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(
        type: 'error',
        message: 'Invalid request method. GET required.',
        statusCode: 405
    );
}

$db = db();

$statsQuery = "
    SELECT
        COUNT(*) AS total_employees,
        SUM(CASE WHEN employment_status = 'Permanent' THEN 1 ELSE 0 END) AS permanent_count,
        SUM(CASE WHEN employment_status <> 'Permanent' OR employment_status IS NULL THEN 1 ELSE 0 END) AS non_permanent_count,
        SUM(CASE WHEN LOWER(COALESCE(designation, '')) LIKE '%teacher%' THEN 1 ELSE 0 END) AS teacher_count,
        SUM(CASE WHEN LOWER(COALESCE(designation, '')) LIKE '%principal%' THEN 1 ELSE 0 END) AS principal_count,
        COALESCE(ROUND(AVG(salary_grade)), 0) AS average_salary_grade
    FROM employees_table
";

$statsStmt = $db->prepare($statsQuery);
if (!$statsStmt) {
    respond(
        type: 'error',
        message: 'Failed to prepare overview statistics query.',
        statusCode: 500
    );
}

if (!$statsStmt->execute()) {
    $statsStmt->close();

    respond(
        type: 'error',
        message: 'Failed to execute overview statistics query.',
        statusCode: 500
    );
}

$statsResult = $statsStmt->get_result();
$statsRow = $statsResult->fetch_assoc() ?: [];
$statsStmt->close();

$recentlyPromotedQuery = "
    SELECT
        employee_number,
        first_name,
        last_name,
        designation,
        date_of_latest_promotion,
        date_joined
    FROM employees_table
    ORDER BY date_of_latest_promotion DESC
    LIMIT 3
";

$recentlyPromotedStmt = $db->prepare($recentlyPromotedQuery);
if (!$recentlyPromotedStmt) {
    respond(
        type: 'error',
        message: 'Failed to prepare recently promoted query.',
        statusCode: 500
    );
}

if (!$recentlyPromotedStmt->execute()) {
    $recentlyPromotedStmt->close();

    respond(
        type: 'error',
        message: 'Failed to execute recently promoted query.',
        statusCode: 500
    );
}

$recentlyPromotedResult = $recentlyPromotedStmt->get_result();
$recentlyPromoted = [];
while ($employee = $recentlyPromotedResult->fetch_assoc()) {
    $recentlyPromoted[] = $employee;
}
$recentlyPromotedStmt->close();

$recentlyJoinedQuery = "
    SELECT
        employee_number,
        first_name,
        last_name,
        designation,
        date_of_latest_promotion,
        date_joined
    FROM employees_table
    ORDER BY date_joined DESC
    LIMIT 3
";

$recentlyJoinedStmt = $db->prepare($recentlyJoinedQuery);
if (!$recentlyJoinedStmt) {
    respond(
        type: 'error',
        message: 'Failed to prepare recently joined query.',
        statusCode: 500
    );
}

if (!$recentlyJoinedStmt->execute()) {
    $recentlyJoinedStmt->close();

    respond(
        type: 'error',
        message: 'Failed to execute recently joined query.',
        statusCode: 500
    );
}

$recentlyJoinedResult = $recentlyJoinedStmt->get_result();
$recentlyJoined = [];
while ($employee = $recentlyJoinedResult->fetch_assoc()) {
    $recentlyJoined[] = $employee;
}
$recentlyJoinedStmt->close();

$designationDistributionQuery = "
    SELECT
        COALESCE(NULLIF(designation, ''), 'Unspecified') AS designation,
        COUNT(*) AS total
    FROM employees_table
    GROUP BY COALESCE(NULLIF(designation, ''), 'Unspecified')
    ORDER BY total DESC, designation ASC
";

$designationDistributionStmt = $db->prepare($designationDistributionQuery);
if (!$designationDistributionStmt) {
    respond(
        type: 'error',
        message: 'Failed to prepare designation distribution query.',
        statusCode: 500
    );
}

if (!$designationDistributionStmt->execute()) {
    $designationDistributionStmt->close();

    respond(
        type: 'error',
        message: 'Failed to execute designation distribution query.',
        statusCode: 500
    );
}

$designationDistributionResult = $designationDistributionStmt->get_result();
$designationDistribution = [];
while ($row = $designationDistributionResult->fetch_assoc()) {
    $designationDistribution[$row['designation']] = (int)$row['total'];
}
$designationDistributionStmt->close();

respond(
    type: 'data',
    data: [
        'totalEmployees' => (int)($statsRow['total_employees'] ?? 0),
        'permanentCount' => (int)($statsRow['permanent_count'] ?? 0),
        'nonPermanentCount' => (int)($statsRow['non_permanent_count'] ?? 0),
        'teacherCount' => (int)($statsRow['teacher_count'] ?? 0),
        'principalCount' => (int)($statsRow['principal_count'] ?? 0),
        'averageSalaryGrade' => (int)($statsRow['average_salary_grade'] ?? 0),
        'recentlyPromoted' => $recentlyPromoted,
        'recentlyJoined' => $recentlyJoined,
        'designationDistribution' => $designationDistribution,
    ]
);
