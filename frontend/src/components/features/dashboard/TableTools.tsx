import type { PropsWithChildren } from "react";

export function TableTools({ children }: PropsWithChildren) {
  return (
    <div className="pointer-events-none absolute bottom-3 right-3 flex max-w-[calc(100%-1.5rem)] flex-wrap justify-end gap-2 sm:bottom-4 sm:right-4 sm:gap-3">
      <div className="pointer-events-auto flex flex-wrap justify-end gap-2 px-2 sm:gap-3">
        {children}
      </div>
    </div>
  );
}
