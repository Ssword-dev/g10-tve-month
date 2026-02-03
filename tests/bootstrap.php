<?php
// Tests bootstrap: sets up $db and provides reset_db() used by tests.

$DB_HOST = getenv('DB_HOST') ?: '127.0.0.1';
$DB_USER = getenv('DB_USER') ?: 'root';
$DB_PASS = getenv('DB_PASS') ?: '';
$DB_BASE = getenv('DB_NAME') ?: 'tve_month';
$DB_SUFFIX = getenv('DB_SUFFIX') ?: '_test';

$DB_NAME = $DB_BASE . $DB_SUFFIX;

// Create mysqli connection (without selecting DB) to create DB if necessary
$mysqli = new mysqli($DB_HOST, $DB_USER, $DB_PASS);
if ($mysqli->connect_errno) {
    fwrite(STDERR, "DB connect error: " . $mysqli->connect_error . "\n");
    exit(1);
}

// Ensure test database exists
$createDbSql = "CREATE DATABASE IF NOT EXISTS `{$DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";
$mysqli->query($createDbSql);
$mysqli->select_db($DB_NAME);

// Export $db as global for API files
$db = $mysqli;
$GLOBALS['db'] = $db;

function await_multi_query_completion(mysqli $db): void {
    do {
        if ($result = $db->store_result()) {
            $result->free();
        }
    } while ($db->more_results() && $db->next_result());
}


/**
 * Replace %suffix% with _test and multi-query schema and dummy data.
 */
function reset_db(): void {
    global $db;

    $root = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR;
    $schemaPath = $root . 'schema.sql';
    $dataPath = $root . 'dummy_data.sql';

    if (!file_exists($schemaPath) || !file_exists($dataPath)) {
        fwrite(STDERR, "Missing schema.sql or dummy_data.sql for reset\n");
        return;
    }

    $schema = file_get_contents($schemaPath);
    $data = file_get_contents($dataPath);

    if (!$db->multi_query($schema)) {
        fwrite(STDERR, "DB schema reset error: " . $db->error . "\n");
        return;
    };

    await_multi_query_completion($db);

    if (!$db->multi_query($data)) {
        fwrite(STDERR, "DB data reset error: " . $db->error . "\n");
        return;
    }

    await_multi_query_completion($db);
}

// Run initial reset once now so tests start with a clean DB
reset_db();

// make reset_db available for tests
$GLOBALS['reset_db'] = 'reset_db';

// Autoload (if composer present)
$vendor = __DIR__ . '/../vendor/autoload.php';
if (file_exists($vendor)) {
    require $vendor;
}
