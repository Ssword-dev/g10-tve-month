import PaginationContext from "@/contexts/PaginationContext";
import { useContext } from "react";

function usePagination() {
  const ctx = useContext(PaginationContext);

  if (!ctx) {
    throw new Error("Cannot use pagination outside pagination boundary.");
  }

  return ctx;
}

export default usePagination;
