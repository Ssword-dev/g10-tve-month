import { useState } from "react";
import PaginationContext from "@/contexts/PaginationContext";
import type { ClassProps, Props } from "./types";
import { cn } from "@_ssword/classes";

const base = "div";

type ComponentBase = typeof base;

interface PaginationProps extends Props<ComponentBase>, ClassProps {}

function Pagination({ children, className }: PaginationProps) {
  const Comp = base;
  const [pageIndex, setPageIndex] = useState(0);
  return (
    <PaginationContext.Provider value={{ pageIndex, setPageIndex }}>
      <Comp className={cn("overflow-x-hidden", className)}>
        <div
          className={cn(
            "*:h-full *:w-full transition-transform duration-300",
            className,
          )}
          style={{
            transform: `translateX(${pageIndex * 100}%)`,
          }}
        >
          {children}
        </div>
      </Comp>
    </PaginationContext.Provider>
  );
}

export default Pagination;
