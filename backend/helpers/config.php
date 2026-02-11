<?php
$configurations = [];

function config($name, $value = null): mixed {
    global $configurations;

    if (!is_array($configurations)) {
        $configurations = [];
    }

    if (func_num_args() === 2) {
        $configurations[$name] = $value;
        return $value;
    }

    return $configurations[$name] ?? null;
}
