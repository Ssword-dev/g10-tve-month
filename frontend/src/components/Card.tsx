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

const base = "div";

type ComponentBase = typeof base;

const cardVM = cvm(
  "bg-surface text-text flex flex-col gap-6 rounded-xl border px-3 py-6 shadow-sm",
  {
    variants: {
      borderAccent: {
        none: "",
        primary: "hover:border-primary",
        secondary: "hover:border-secondary",
      },

      transition: {
        all: "transition-all",
        colors: "transition-colors",
        opacity: "transition-opacity",
        shadow: "transition-shadow",
        transform: "transition-transform",
        none: "",
      },
    },
    defaultVariants: {
      borderAccent: "none",
      transition: "none",
    },
    compoundVariants: [],
  },
);

interface CardProps
  extends
    Props<ComponentBase>,
    ClassProps,
    VariantProps<typeof cardVM>,
    AsChildProps {}

const Card = forwardRef<RefType<ComponentBase>, CardProps>(
  (props, forwardedRef) => {
    const { borderAccent, transition, className, asChild, ...baseProps } =
      props;
    const Comp = asChild ? Slot : base;

    return (
      <Comp
        {...baseProps}
        className={cn(cardVM({ borderAccent, transition }), className)}
        ref={forwardedRef}
      />
    );
  },
);

export default Card;
export type { CardProps as Props };
