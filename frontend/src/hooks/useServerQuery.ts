import { useState, useEffect, useCallback } from "react";
import type { ServerQuery } from "@/infrastructure/ServerQuery";

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

    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateState(); // sync initial state
    return unsubscribe;
  }, [serverQuery, updateState]);

  return { ...state, refresh };
}
