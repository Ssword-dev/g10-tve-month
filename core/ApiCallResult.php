<?php
namespace Core;

// An APICallResult is a representation of
// an api call's result, it may contain data,
// or just a success/failure indication.
// An API call may propose to send certain headers,
// response code, and body, but the consuming code
// does not have to respect those proposals.
final class ApiCallResult {
    // Proposal HTTP.
    private ?int $responseCode;
    private ?array $headers;
    private mixed $body;

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
        $this->responseCode = null;
        $this->headers = null;
        $this->body = null;
    }

    // methods for setting HTTP proposals
    public function proposeResponseCode(int $code): void {
        $this->responseCode = $code;
    }

    public function proposeHeaders(array $headers): void {
        $this->headers = $headers;
    }

    public function proposeBody(mixed $body): void {
        $this->body = $body;
    }

    public function proposedBody() {
        return $this->body;
    }
}