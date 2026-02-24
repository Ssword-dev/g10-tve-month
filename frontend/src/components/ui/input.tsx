import * as React from "react";
import { clsx, cn } from "@_ssword/classes";

const inputBaseClasses = clsx(
  "bg-card border border-border rounded-lg",
  "px-2.5 py-1 text-base md:text-sm transition-colors w-full min-w-0 outline-none",
  "focus-visible:border-accent focus-visible:ring-3 focus-visible:ring-accent/50",
  "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:aria-invalid:border-destructive/50",
  "disabled:bg-input/50 dark:disabled:bg-input/80 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  "file:h-6 file:text-sm file:font-medium file:inline-flex file:border-0 file:bg-transparent file:text-foreground",
  "placeholder:text-muted-foreground",
);

export interface InputProps extends React.ComponentProps<"input"> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(inputBaseClasses, className)}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
