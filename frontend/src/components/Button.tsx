import { cn, cvm } from "@_ssword/classes";
import { forwardRef } from "react";
import type {
  AsChildProps,
  ClassProps,
  Props,
  RefType,
  VariantProps,
} from "./types";
import { Slot } from "@radix-ui/react-slot";

const base = "button";

type ComponentBase = typeof base;

const buttonVM = cvm(
  "inline-flex items-center transition-all duration-200 ease-in-out px-4 py-2 text-base rounded-md border border-border bg-primary text-text hover:bg-accent hover:border-accent-strong hover:cursor-pointer active:scale-105 active:bg-accent active:border-accent-strong",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground",
        destructive:
          "bg-destructive/10 hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 text-destructive focus-visible:border-destructive/40 dark:hover:bg-destructive/30",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "bg-transparent backdrop-blur-md",
        primary: "bg-primary",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
        xl: "px-8 py-4 text-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
    compoundVariants: [],
  },
);

interface ButtonProps
  extends
    Props<ComponentBase>,
    ClassProps,
    AsChildProps,
    VariantProps<typeof buttonVM> {}

/**
 * A Clickable UI Primitive.
 */
const Button = forwardRef<RefType<ComponentBase>, ButtonProps>(
  (props, forwardedRef) => {
    const { variant, size, className, asChild, ...baseProps } = props;

    const Comp = asChild ? Slot : base;
    return (
      <Comp
        {...baseProps}
        className={cn(buttonVM({ variant, size }), className)}
        ref={forwardedRef}
      />
    );
  },
);

export default Button;
export type { ButtonProps as Props };
