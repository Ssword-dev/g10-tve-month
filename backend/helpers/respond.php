<?php

function respond(
    $type, // data, error, success
    $data = null, // JSONable
    $message = null, // an error message if $type === 'error'
    $headers = [], // HTTP headers
    $statusCode = 200,
    $terminate = true,
    $responseType = null // used when $type === 'custom'
){
    if ($type !== 'custom') {
        header('Content-Type: application/json');
    }

    http_response_code(
        $statusCode ?? (
            ['success' => 200, 'error' => 400, 'data' => 200, 'custom' => 200][$type]
        )
    );

    foreach ($headers as $key => $val) {
        if (is_int($key)) {
            header((string)$val);
            continue;
        }

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

        case 'success':
            echo json_encode([
                'type' => $type
            ]);
            break;

        case 'custom':
            // Raw HTTP mode:
            // - headers are sent exactly as provided
            // - body is sent as-is when scalar/null
            // - structured payloads are wrapped with response_type metadata
            if (is_array($data) || is_object($data)) {
                echo json_encode([
                    'response_type' => $responseType,
                    'body' => $data,
                ]);
            } else {
                if ($responseType !== null) {
                    header('X-Response-Type: ' . (string)$responseType);
                }

                if ($data !== null) {
                    echo (string)$data;
                }
            }
            break;
    }

    if ($terminate) {
        die(0);
    }
}
