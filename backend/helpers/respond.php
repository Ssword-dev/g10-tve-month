<?php

function respond(
    $type, // data, error, success
    $data = null, // JSONable
    $message = null, // an error message if $type === 'error'
    $headers = [], // HTTP headers
    $statusCode = 200,
    $terminate = true
){
    header('Content-Type: application/json');

    http_response_code(
        $statusCode ?? (
            ['success' => 200, 'error' => 400, 'data' => 200][$type]
        )
    );

    foreach ($headers as $key => $val) {
        header($key . ':' . $val);
    }

    switch ($type){
        case 'data':
            echo json_encode([
                'type' => $type,
                'data' => $data,
            ]);
            break;
        
        case 'error':
            echo json_encode([
                'type' => $type,
                'message' => $message
            ]);
            break;
    }

    if ($terminate) {
        die(0);
    }
}