<?php
require dirname(__DIR__) . '/vendor/autoload.php';

// TEST API ROUTE FOR TESTING.

respond(
    type: 'data',
    data: [
        'foo' => 'bar'
    ]
);