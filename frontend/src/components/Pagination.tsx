import React, { forwardRef, useImperativeHandle, useState } from "react";
import PaginationContext, {
  type PaginationContextValue,
} from "@/contexts/PaginationContext";
import type { ClassProps, Props } from "./types";
import { cn } from "@_ssword/classes";

const base = "div";

type ComponentBase = typeof base;

interface PaginationProps extends Props<ComponentBase>, ClassProps {}

const Pagination = forwardRef<PaginationContextValue, PaginationProps>(
  function Pagination({ children, className }: PaginationProps, ref) {
    const Comp = base;
    const itemCount = React.Children.count(children);
    const [pageIndex, setPageIndex] = useState(0);
    const value: PaginationContextValue = {
      pageIndex,
      setPageIndex,
      itemCount,
    };

    useImperativeHandle(ref, () => value);
    return (
      <PaginationContext.Provider value={value}>
        <Comp className={cn("overflow-x-hidden overflow-y-hidden", className)}>
          <div
            className={cn(
              "*:h-full *:w-full transition-transform duration-300",
              className,
            )}
            style={{
              transform: `translateX(-${pageIndex * 100}%)`,
            }}
          >
            {children}
          </div>
        </Comp>
      </PaginationContext.Provider>
    );
  },
);

export default Pagination;
