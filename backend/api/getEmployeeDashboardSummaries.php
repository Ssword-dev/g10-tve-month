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

$teachingSummaryStmt = $db->prepare(
    'SELECT * FROM teaching_employees_summary_view LIMIT 1'
);
if (!$teachingSummaryStmt) {
    respond(
        type: 'error',
        message: 'Failed to prepare teaching summary query.',
        statusCode: 500
    );
}

if (!$teachingSummaryStmt->execute()) {
    $teachingSummaryStmt->close();
    respond(
        type: 'error',
        message: 'Failed to execute teaching summary query.',
        statusCode: 500
    );
}

$teachingSummaryResult = $teachingSummaryStmt->get_result();
$teachingSummary = $teachingSummaryResult->fetch_assoc() ?: [];
$teachingSummaryStmt->close();

$nonTeachingSummaryStmt = $db->prepare(
    'SELECT * FROM non_teaching_employees_summary_view LIMIT 1'
);
if (!$nonTeachingSummaryStmt) {
    respond(
        type: 'error',
        message: 'Failed to prepare non-teaching summary query.',
        statusCode: 500
    );
}

if (!$nonTeachingSummaryStmt->execute()) {
    $nonTeachingSummaryStmt->close();
    respond(
        type: 'error',
        message: 'Failed to execute non-teaching summary query.',
        statusCode: 500
    );
}

$nonTeachingSummaryResult = $nonTeachingSummaryStmt->get_result();
$nonTeachingSummary = $nonTeachingSummaryResult->fetch_assoc() ?: [];
$nonTeachingSummaryStmt->close();

$designationFrequencyStmt = $db->prepare(
    'SELECT designation, `COUNT(*)` AS occurrence FROM designation_frequency_table_view ORDER BY occurrence DESC, designation ASC'
);
if (!$designationFrequencyStmt) {
    respond(
        type: 'error',
        message: 'Failed to prepare designation frequency query.',
        statusCode: 500
    );
}

if (!$designationFrequencyStmt->execute()) {
    $designationFrequencyStmt->close();
    respond(
        type: 'error',
        message: 'Failed to execute designation frequency query.',
        statusCode: 500
    );
}

$designationFrequencyResult = $designationFrequencyStmt->get_result();
$designationFrequency = [];
while ($row = $designationFrequencyResult->fetch_assoc()) {
    $designationFrequency[] = [
        'designation' => (string)($row['designation'] ?? ''),
        'occurrence' => (int)($row['occurrence'] ?? 0),
    ];
}
$designationFrequencyStmt->close();

$employmentStatusDistributionStmt = $db->prepare(
    'SELECT employment_status, occurrence FROM employment_status_distribution_table_view ORDER BY occurrence DESC, employment_status ASC'
);
if (!$employmentStatusDistributionStmt) {
    respond(
        type: 'error',
        message: 'Failed to prepare employment status distribution query.',
        statusCode: 500
    );
}

if (!$employmentStatusDistributionStmt->execute()) {
    $employmentStatusDistributionStmt->close();
    respond(
        type: 'error',
        message: 'Failed to execute employment status distribution query.',
        statusCode: 500
    );
}

$employmentStatusDistributionResult = $employmentStatusDistributionStmt->get_result();
$employmentStatusDistribution = [];
while ($row = $employmentStatusDistributionResult->fetch_assoc()) {
    $employmentStatusDistribution[] = [
        'employmentStatus' => (string)($row['employment_status'] ?? ''),
        'occurrence' => (int)($row['occurrence'] ?? 0),
    ];
}
$employmentStatusDistributionStmt->close();

respond(
    type: 'data',
    data: [
        'teachingEmployeesSummary' => [
            'teachingStaff' => (int)($teachingSummary['teaching_staff'] ?? 0),
            'noJhsTeachers' => (int)($teachingSummary['no_jhs_teachers'] ?? 0),
            'noShsTeachers' => (int)($teachingSummary['no_shs_teachers'] ?? 0),
            'noTeachersWithMastersDegree' => (int)($teachingSummary['no_teachers_with_masters_degree'] ?? 0),
            'noTeachersWithDoctorateDegree' => (int)($teachingSummary['no_teachers_with_doctorate_degree'] ?? 0),
        ],
        'nonTeachingEmployeesSummary' => [
            'nonTeachingStaff' => (int)($nonTeachingSummary['non_teaching_staff'] ?? 0),
            'noJhsNonTeachingStaff' => (int)($nonTeachingSummary['no_jhs_non_teaching_staff'] ?? 0),
            'noShsNonTeachingStaff' => (int)($nonTeachingSummary['no_shs_non_teaching_staff'] ?? 0),
            'noNonTeachingStaffWithMastersDegree' => (int)($nonTeachingSummary['no_non_teaching_staff_with_masters_degree'] ?? 0),
            'noNonTeachingStaffWithDoctorateDegree' => (int)($nonTeachingSummary['no_non_teaching_staff_with_doctorate_degree'] ?? 0),
        ],
        'designationFrequencyTable' => $designationFrequency,
        'employmentStatusDistributionTable' => $employmentStatusDistribution,
    ]
);
