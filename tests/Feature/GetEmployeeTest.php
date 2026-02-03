<?php

use function PHPUnit\Framework\assertArrayHasKey;

beforeEach(function () {
    // reset DB before each test
    if (isset($GLOBALS['reset_db']) && is_callable($GLOBALS['reset_db'])) {
        ($GLOBALS['reset_db'])();
    }
});

it('returns employee data and courses for a known employee', function () {
    // load the API function
    $fn = require __DIR__ . '/../../src/api/getEmployeeByEmployeeNumber.php';

    // call with employee number 10001 which is populated by dummy data + compatibility step
    $result = $fn(10001);

    expect(is_array($result))->toBeTrue();
    expect($result['employee_number'])->toBe(10001);
    expect(array_key_exists('first_name', $result))->toBeTrue();
    expect(is_array($result['courses']))->toBeTrue();
});
