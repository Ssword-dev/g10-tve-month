import { cn, cvm } from "@_ssword/classes";
import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import type {
  AsChildProps,
  ClassProps,
  Props,
  RefType,
  VariantProps,
} from "./types";

const base = "button";
type ComponentBase = typeof base;

const buttonVM = cvm(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
        glass:
          "border border-border/70 bg-background/80 text-foreground backdrop-blur-md hover:bg-background",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      },
      size: {
        sm: "h-8 rounded-md px-3",
        md: "h-10 px-4 py-2 text-sm",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
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

export { Button };
export type { ButtonProps };
