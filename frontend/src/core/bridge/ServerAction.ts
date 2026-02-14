// --------------------------------------------------
// http methods config
// --------------------------------------------------

import unsafeCast from "../typescript/unsafeCast";

const METHODS = {
  GET: { usesQuery: true },
  HEAD: { usesQuery: true },
  DELETE: { usesQuery: true },
  POST: { usesQuery: false },
  PUT: { usesQuery: false },
  PATCH: { usesQuery: false },
  OPTIONS: { usesQuery: false },
} as const;

type Method = keyof typeof METHODS;

// --------------------------------------------------
// response envelope
// --------------------------------------------------

type ResponseType = "data" | "error" | "success";

type AnyTData = unknown;
type TDataDefault = unknown;
type AnyTParams = Record<string, unknown>;
type TParamsDefault = Record<string, unknown>;

interface BaseResponse<T extends ResponseType, TData> {
  type: T;
  unwrap(): TData;
}

interface DataResponse<TData = TDataDefault> extends BaseResponse<
  "data",
  TData
> {
  data: TData;
}

interface SuccessResponse<TData = void> extends BaseResponse<"success", TData> {
  message?: string | null;
  data?: TData;
}

interface ErrorResponse<TData = never> extends BaseResponse<"error", TData> {
  message: string | null;
}

type ServerResponse<TData = TDataDefault> =
  | DataResponse<TData>
  | SuccessResponse<TData>
  | ErrorResponse<TData>;

type AnyServerResponse = ServerResponse<AnyTData>;

// unwrap helper type
type Unwrap<T extends ServerResponse<unknown>> =
  T extends DataResponse<infer D>
    ? D
    : T extends SuccessResponse<infer D>
      ? D
      : never;

// --------------------------------------------------
// server action types
// --------------------------------------------------
interface ServerActionOptions {
  name: string;
  apiUrl: string | URL;
  method?: Method;
  headers?: HeadersInit;
}

interface ServerAction<
  TParams extends AnyTParams = TParamsDefault,
  TData extends AnyTData = TDataDefault,
> {
  (opts: TParams): Promise<ServerResponse<TData>>;
  readonly actionName: string;
  readonly apiUrl: string | URL;
  readonly method: Method;
  readonly headers?: HeadersInit;
}

type AnyServerAction = ServerAction<AnyTParams, AnyTData>;

// --------------------------------------------------
// helpers
// --------------------------------------------------

function usesQuery(method: Method): boolean {
  return METHODS[method].usesQuery;
}

function buildQueryString(query: AnyTParams): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  }
  return params.toString();
}

function buildUrl(baseUrl: string, query: AnyTParams | null): string {
  if (!query) return baseUrl;
  const queryString = buildQueryString(query);
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

function buildBody(params: AnyTParams, method: Method): string | null {
  return usesQuery(method) ? null : JSON.stringify(params);
}

function buildQuery<TParams extends AnyTParams>(
  params: TParams,
  method: Method,
): TParams | null {
  return usesQuery(method) ? params : null;
}

// unwrap function
export function unwrap<T extends AnyServerResponse>(result: T): Unwrap<T> {
  switch (result.type) {
    case "error":
      throw new Error(result.message ?? "No error message provided.");
    case "success":
      return (result.data ?? undefined) as Unwrap<T>;
    case "data":
      return result.data as Unwrap<T>;
  }
}

// --------------------------------------------------
// core factory + caching
// --------------------------------------------------

const serverActionCache = new Map<string, AnyServerAction>();

export function createServerAction<
  TParams extends AnyTParams = TParamsDefault,
  TData = TDataDefault,
>(options: ServerActionOptions): ServerAction<TParams, TData> {
  const cached = serverActionCache.get(options.name);
  if (cached) return cached as ServerAction<TParams, TData>;

  const { name, apiUrl, method = "GET", headers } = options;

  const action = unsafeCast<ServerAction<TParams, TData>>(
    async (params: TParams = {} as TParams) => {
      const url = buildUrl(String(apiUrl), buildQuery(params, method));

      let parsed: ServerResponse<TData>;

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: buildBody(params, method),
        });
        parsed = (await response.json()) as ServerResponse<TData>;
      } catch {
        parsed = {
          type: "error",
          message: "Invalid JSON response",
          unwrap() {
            return unwrap(this);
          },
        } as ErrorResponse<TData>;
      }

      return {
        ...parsed,
        unwrap() {
          return unwrap(this);
        },
      } as ServerResponse<TData>;
    },
  );

  Object.defineProperties(action, {
    actionName: { value: name },
    apiUrl: { value: apiUrl },
    method: { value: method },
    headers: { value: headers },
  });

  // an unsafe cast is justified here since it needs to fix typescript errors,
  // it just voids the type params.
  serverActionCache.set(name, unsafeCast<AnyServerAction>(action));

  return action;
}

// --------------------------------------------------
// exports
// --------------------------------------------------

export type {
  AnyServerAction,
  AnyServerResponse,
  AnyTData,
  AnyTParams,
  Method,
  ResponseType,
  TDataDefault,
  TParamsDefault,
  DataResponse,
  SuccessResponse,
  ErrorResponse,
  ServerResponse,
  ServerActionOptions,
  ServerAction,
  Unwrap,
};
