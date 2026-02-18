import type { PropsWithChildren } from "react";

export function TableTools({ children }: PropsWithChildren) {
  return <div className="absolute bottom-4 right-4 flex flex-row gap-3">{children}</div>;
}
