<?php
namespace Core;

use JsonSerializable;

final class ApiCallResult implements JsonSerializable {
    // Data / Status.
    public bool $success;
    public ?string $message;
    public mixed $data;

    // constructor
    public function __construct(
        bool $success,
        ?string $message = null,
        mixed $data = null,
    ) {
        $this->success = $success;
        $this->message = $message;
        $this->data = $data;
    }

    public function jsonSerialize(): array {
        return [
            'success' => $this->success,
            'message' => $this->message,
            'data' => $this->data,
        ];
    }
}