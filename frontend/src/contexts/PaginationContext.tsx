import { createContext } from "react";

interface PaginationContextValue {
  pageIndex: number;
  setPageIndex(pageIndex: number): void;
  itemCount: number;
}

const PaginationContext = createContext<PaginationContextValue | null>(null);
export default PaginationContext;
export type { PaginationContextValue };
