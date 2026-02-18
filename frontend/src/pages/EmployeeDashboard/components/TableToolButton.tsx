import { cn } from "@_ssword/classes";
import Button from "@/components/Button";
import type { ClassProps, Props } from "@/components/types";

export function TableToolButton({
  children,
  className,
  ...props
}: Props<typeof Button> & ClassProps) {
  return (
    <Button
      className={cn(
        "h-12 w-12 rounded-full bg-primary p-0 text-primary-foreground shadow-md",
        "hover:bg-primary/90 hover:shadow-lg active:scale-95",
        "transition-all duration-200",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
