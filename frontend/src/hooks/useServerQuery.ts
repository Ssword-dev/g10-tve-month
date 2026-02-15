import { useEffect, useState, useCallback } from "react";
import {
  unwrap,
  type AnyServerResponse,
  type Unwrap,
} from "@/core/bridge/ServerAction";
import unsafeCast from "@/core/typescript/unsafeCast";

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

/* =========================
   server query cache & subscription system
   ========================= */

interface ServerQueryEntry<TData> {
  data: TData | null;
  error: Error | null;
  isLoading: boolean;
  isSuccess: boolean;
  subscribers: Set<() => void>;
  execute: () => Promise<void>;
}

const serverQueryCache = new Map<string, ServerQueryEntry<unknown>>();

function getOrCreateQuery<TData, TQueryFn extends AsyncServerFn>(
  key: string,
  queryFn: TQueryFn,
  args: InferArgs<TQueryFn>,
): ServerQueryEntry<TData> {
  if (serverQueryCache.has(key)) {
    return unsafeCast<ServerQueryEntry<TData>>(serverQueryCache.get(key)!);
  }

  const entry: ServerQueryEntry<TData> = {
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    subscribers: new Set(),
    execute: async () => {
      entry.isLoading = true;
      entry.isSuccess = false;
      entry.error = null;
      notifySubscribers();

      try {
        const result = await queryFn(...args);
        const unwrapped = unwrap(result) as TData;
        entry.data = unwrapped;
        entry.isSuccess = true;
        entry.error = null;
      } catch (err) {
        entry.error = err as Error;
        entry.data = null;
        entry.isSuccess = false;
      } finally {
        entry.isLoading = false;
        notifySubscribers();
      }
    },
  };

  serverQueryCache.set(key, entry);
  return entry;
}

function notifySubscribers(entry?: ServerQueryEntry<unknown>) {
  if (entry) {
    entry.subscribers.forEach((cb) => cb());
  } else {
    // notify all entries
    serverQueryCache.forEach((e) => e.subscribers.forEach((cb) => cb()));
  }
}

/* =========================
   hook
   ========================= */

export default function useServerQuery<TQueryFn extends AsyncServerFn>(
  queryKey: string,
  queryFn: TQueryFn,
  args: InferArgs<TQueryFn>,
) {
  type TData = InferData<TQueryFn>;

  const [state, setState] = useState<{
    data: TData | null;
    error: Error | null;
    isLoading: boolean;
    isSuccess: boolean;
  }>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
  });

  const queryEntry = getOrCreateQuery<TData, TQueryFn>(queryKey, queryFn, args);

  // update local state whenever cache changes
  const updateState = useCallback(() => {
    setState({
      data: queryEntry.data,
      error: queryEntry.error,
      isLoading: queryEntry.isLoading,
      isSuccess: queryEntry.isSuccess,
    });
  }, [queryEntry]);

  useEffect(() => {
    queryEntry.subscribers.add(updateState);

    // initialize state
    // this is safe since this useEffect does not depend
    // on the current state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateState();

    // execute query if not loaded yet
    if (!queryEntry.isLoading && !queryEntry.isSuccess && !queryEntry.data) {
      queryEntry.execute();
    }

    return () => {
      queryEntry.subscribers.delete(updateState);
    };
  }, [queryEntry, updateState]);

  return {
    ...state,
    refresh: queryEntry.execute,
  };
}
