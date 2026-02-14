import {
  createServerAction,
  type AnyTData,
  type AnyTParams,
  type ServerAction,
  type ServerActionOptions,
  type TDataDefault,
  type TParamsDefault,
} from "@/core/bridge/ServerAction";

function useServerAction<
  TParams extends AnyTParams = TParamsDefault,
  TData extends AnyTData = TDataDefault,
>(opts: ServerActionOptions): ServerAction<TParams, TData> {
  return createServerAction<TParams, TData>(opts);
}

export default useServerAction;
