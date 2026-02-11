import { createContext } from "react";

interface PaginationContextValue {
  pageIndex: number;
  setPageIndex(pageIndex: number): void;
}

const PaginationContext = createContext<PaginationContextValue | null>(null);
export default PaginationContext;
