import usePagination from "@/hooks/usePagination";
import Button from "./Button";
import type { ClassProps, Props } from "./types";

interface PaginationOffsetButtonProps extends Props<typeof Button>, ClassProps {
  offset: number;
}

export default function PaginationOffsetButton({
  offset,
  ...props
}: PaginationOffsetButtonProps) {
  const pagination = usePagination();
  return (
    <Button
      onClick={() => {
        const unsafeIndex = pagination.pageIndex + offset;

        // Clamp.
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
