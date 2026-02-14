import { useEffect, useState, useCallback } from "react";
import {
  unwrap,
  type AnyServerResponse,
  type Unwrap,
} from "@/core/bridge/ServerAction";

/* =========================
   type helpers
   ========================= */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncServerFn = (...args: any[]) => Promise<AnyServerResponse>;

type InferArgs<TFn> = TFn extends (
  ...args: infer TArgs
) => Promise<AnyServerResponse>
  ? TArgs
  : never;

type InferData<TFn extends AsyncServerFn> = Unwrap<Awaited<ReturnType<TFn>>>;

interface ServerQuery<TQueryFn extends AsyncServerFn> {
  data: InferData<TQueryFn> | null;
  error?: Error | null;
  isLoading: boolean;
  isSuccess: boolean;
  refresh: () => Promise<void>;
}

/* =========================
   hook
   ========================= */

function useServerQuery<TQueryFn extends AsyncServerFn>(
  queryFn: TQueryFn,
  args: InferArgs<TQueryFn>,
): ServerQuery<TQueryFn> {
  type TData = InferData<TQueryFn>;

  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const result = await queryFn(...args);
      const unwrapped = unwrap(result) as InferData<TQueryFn>;

      setData(unwrapped);
      setIsSuccess(true);

      return;
    } catch (err) {
      setError(err as Error);
      return;
    } finally {
      setIsLoading(false);
    }
  }, [queryFn, ...args]);

  useEffect(() => {
    execute();
  }, [execute]);

  return {
    data,
    error,
    isLoading,
    isSuccess,
    refresh: execute,
  };
}

export default useServerQuery;
