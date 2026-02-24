import React, { forwardRef, useImperativeHandle, useState } from "react";
import PaginationContext, {
  type PaginationContextValue,
} from "@/contexts/PaginationContext";
import usePagination from "@/hooks/usePagination";
import { cn } from "@_ssword/classes";
import { Button } from "@/components/ui/button";
import type { ClassProps, Props } from "./types";

const paginationBase = "div";
type PaginationComponentBase = typeof paginationBase;
interface PaginationProps extends Props<PaginationComponentBase>, ClassProps {}

const Pagination = forwardRef<PaginationContextValue, PaginationProps>(
  function Pagination({ children, className }: PaginationProps, ref) {
    const Comp = paginationBase;
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

interface PaginationOffsetButtonProps extends Props<typeof Button>, ClassProps {
  offset: number;
}

function PaginationOffsetButton({
  offset,
  ...props
}: PaginationOffsetButtonProps) {
  const pagination = usePagination();
  return (
    <Button
      onClick={() => {
        const unsafeIndex = pagination.pageIndex + offset;
        const newIndex = Math.max(
          Math.min(unsafeIndex, pagination.itemCount),
          0,
        );
        pagination.setPageIndex(newIndex);
      }}
      {...props}
    />
  );
}

export { Pagination, PaginationOffsetButton };
