import * as React from "react"
import { clsx, cn } from "@_ssword/classes"

const inputBaseClasses = clsx(
  /* background & border */
  "bg-surface border border-border rounded-lg",
  "px-2.5 py-1 text-base md:text-sm transition-colors w-full min-w-0 outline-none",

  /* focus */
  "focus-visible:border-accent focus-visible:ring-3 focus-visible:ring-accent/50",

  /* invalid */
  "aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40 dark:aria-invalid:border-danger/50",

  /* disabled */
  "disabled:bg-input/50 dark:disabled:bg-input/80 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",

  /* file input */
  "file:h-6 file:text-sm file:font-medium file:inline-flex file:border-0 file:bg-transparent file:text-foreground",

  /* placeholder */
  "placeholder:text-text-muted"
)

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
    )
  }
)

Input.displayName = "Input"

export default Input
