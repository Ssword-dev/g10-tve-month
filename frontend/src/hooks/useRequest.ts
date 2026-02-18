import { useCallback, useMemo, useRef, useState } from "react";

type RequestStatus = "idle" | "loading" | "success" | "error";
type ResponseParser = "json" | "text" | "none";

type UseRequestOptions<TBody> = {
  url: string;
  method?: string;
  headers?: HeadersInit;
  body?: TBody;
  parser?: ResponseParser;
  credentials?: RequestCredentials;
};

type UseRequestState<TResponse> = {
  status: RequestStatus;
  data: TResponse | null;
  error: Error | null;
  statusCode: number | null;
  statusText: string | null;
  headers: Headers | null;
};

function buildRequestBody(body: unknown): BodyInit | null {
  if (body == null) {
    return null;
  }

  if (
    typeof body === "string" ||
    body instanceof FormData ||
    body instanceof Blob ||
    body instanceof URLSearchParams
  ) {
    return body;
  }

  return JSON.stringify(body);
}

function resolveHeaders(baseHeaders: HeadersInit | undefined, body: unknown): HeadersInit {
  const shouldSetJsonContentType =
    body != null &&
    !(body instanceof FormData) &&
    !(body instanceof Blob) &&
    !(body instanceof URLSearchParams) &&
    typeof body !== "string";

  if (!shouldSetJsonContentType) {
    return baseHeaders ?? {};
  }

  return {
    "Content-Type": "application/json",
    ...(baseHeaders ?? {}),
  };
}

export default function useRequest<TResponse = unknown, TBody = unknown>(
  defaults?: Partial<UseRequestOptions<TBody>>,
) {
  const abortControllerRef = useRef<AbortController | null>(null);

  const [state, setState] = useState<UseRequestState<TResponse>>({
    status: "idle",
    data: null,
    error: null,
    statusCode: null,
    statusText: null,
    headers: null,
  });

  const execute = useCallback(
    async (options?: Partial<UseRequestOptions<TBody>>) => {
      const finalOptions = {
        method: "GET",
        parser: "json" as ResponseParser,
        ...defaults,
        ...options,
      };

      if (!finalOptions.url) {
        throw new Error("useRequest requires a URL.");
      }

      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setState((current) => ({
        ...current,
        status: "loading",
        error: null,
      }));

      try {
        const response = await fetch(finalOptions.url, {
          method: finalOptions.method,
          headers: resolveHeaders(finalOptions.headers, finalOptions.body),
          body: buildRequestBody(finalOptions.body),
          credentials: finalOptions.credentials,
          signal: abortControllerRef.current.signal,
        });

        let payload: TResponse | null = null;
        if (finalOptions.parser === "json") {
          payload = (await response.json()) as TResponse;
        } else if (finalOptions.parser === "text") {
          payload = (await response.text()) as unknown as TResponse;
        }

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        setState({
          status: "success",
          data: payload,
          error: null,
          statusCode: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });

        return payload;
      } catch (error) {
        const resolvedError = error instanceof Error ? error : new Error("Request failed.");

        setState((current) => ({
          ...current,
          status: "error",
          error: resolvedError,
        }));

        throw resolvedError;
      }
    },
    [defaults],
  );

  const abort = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    setState({
      status: "idle",
      data: null,
      error: null,
      statusCode: null,
      statusText: null,
      headers: null,
    });
  }, []);

  return useMemo(
    () => ({
      ...state,
      execute,
      abort,
      reset,
      isIdle: state.status === "idle",
      isLoading: state.status === "loading",
      isSuccess: state.status === "success",
      isError: state.status === "error",
    }),
    [state, execute, abort, reset],
  );
}

export type { RequestStatus, ResponseParser, UseRequestOptions, UseRequestState };
