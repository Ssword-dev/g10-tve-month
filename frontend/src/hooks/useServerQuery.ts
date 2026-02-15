import { useCallback, useEffect, useState } from "react";
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

interface ServerQueryState<TData> {
  data: TData | null;
  error: Error | null;
  isLoading: boolean;
  isSuccess: boolean;
}

export interface ServerQuery<TArgs extends unknown[], TData> {
  readonly key: string;
  getState: () => ServerQueryState<TData>;
  refresh: (...args: TArgs) => Promise<void>;
  subscribe: (subscriber: () => void) => () => void;
}

export function createServerQuery<TQueryFn extends AsyncServerFn>(
  key: string,
  queryFn: TQueryFn,
  initialArgs: InferArgs<TQueryFn>,
): ServerQuery<InferArgs<TQueryFn>, InferData<TQueryFn>> {
  type TArgs = InferArgs<TQueryFn>;
  type TData = InferData<TQueryFn>;

  let lastArgs: TArgs = initialArgs;

  let state: ServerQueryState<TData> = {
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
  };

  const subscribers = new Set<() => void>();

  const notifySubscribers = () => {
    subscribers.forEach((subscriber) => subscriber());
  };

  const refresh = async (...args: TArgs) => {
    const argsToUse = args.length > 0 ? args : lastArgs;

    lastArgs = argsToUse;
    state = {
      ...state,
      isLoading: true,
      isSuccess: false,
      error: null,
    };
    notifySubscribers();

    try {
      const result = await queryFn(...argsToUse);
      const data = unwrap(result) as TData;
      state = {
        data,
        error: null,
        isLoading: false,
        isSuccess: true,
      };
    } catch (err) {
      state = {
        data: null,
        error: err as Error,
        isLoading: false,
        isSuccess: false,
      };
    }

    notifySubscribers();
  };

  const subscribe = (subscriber: () => void) => {
    subscribers.add(subscriber);
    return () => {
      subscribers.delete(subscriber);
    };
  };

  const serverQuery: ServerQuery<TArgs, TData> = {
    key,
    getState: () => state,
    refresh,
    subscribe,
  };

  void refresh(...initialArgs);

  return serverQuery;
}

export default function useServerQuery<TArgs extends unknown[], TData>(
  serverQuery: ServerQuery<TArgs, TData>,
) {
  const [state, setState] = useState(serverQuery.getState());

  const updateState = useCallback(() => {
    setState(serverQuery.getState());
  }, [serverQuery]);

  const refresh = useCallback(
    (...args: TArgs) => serverQuery.refresh(...args),
    [serverQuery],
  );

  useEffect(() => {
    const unsubscribe = serverQuery.subscribe(updateState);

    // This is safe since the effect does not depend on the
    // state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateState();

    return unsubscribe;
  }, [serverQuery, updateState]);

  return {
    ...state,
    refresh,
  };
}
