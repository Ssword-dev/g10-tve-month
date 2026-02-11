import { forwardRef } from "react";
import { cn, cvm } from "@_ssword/classes";
import type {
  AsChildProps,
  ClassProps,
  Props,
  RefType,
  VariantProps,
} from "./types";
import { Slot } from "@radix-ui/react-slot";

const base = "span";

type BaseComponent = typeof base;

const textVM = cvm("text-base font-normal text-foreground", {
  variants: {
    variant: {
      default: "",
      subtle: "text-muted-foreground",
      muted: "text-muted-foreground/80",
      destructive: "text-destructive",
      success: "text-success",
      warning: "text-warning",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
      "6xl": "text-6xl",
      "7xl": "text-7xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    leading: {
      none: "leading-none",
      tight: "leading-tight",
      normal: "leading-normal",
      relaxed: "leading-relaxed",
      loose: "leading-loose",
    },
    tracking: {
      tighter: "tracking-tighter",
      tight: "tracking-tight",
      normal: "tracking-normal",
      wide: "tracking-wide",
      wider: "tracking-wider",
    },
    transform: {
      normal: "",
      uppercase: "uppercase",
      lowercase: "lowercase",
      capitalize: "capitalize",
    },
    wrap: {
      normal: "",
      nowrap: "whitespace-nowrap",
      balance: "text-balance",
      pretty: "text-pretty",
    },
    decoration: {
      none: "",
      underline: "underline",
      "line-through": "line-through",
    },

    // text-overflow
    overflow: {
      none: "flex-row whitespace-nowrap",
    },

    interactity: {
      normal: "",
      none: "select-none",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "base",
    weight: "normal",
    align: "left",
    leading: "normal",
    tracking: "normal",
    transform: "normal",
    wrap: "normal",
    decoration: "none",
    interactive: "normal",
  },
  compoundVariants: [],
});

interface TextProps
  extends
    Props<BaseComponent>,
    ClassProps,
    AsChildProps,
    VariantProps<typeof textVM> {}

const Text = forwardRef<RefType<BaseComponent>, TextProps>(
  (props, forwardedRef) => {
    const {
      className,
      variant,
      size,
      weight,
      align,
      leading,
      tracking,
      transform,
      wrap,
      decoration,
      interactity,
      asChild,
      ...intrinsicProps
    } = props;

    const Comp = asChild ? Slot : base;
    return (
      <Comp
        {...intrinsicProps}
        ref={forwardedRef}
        className={cn(
          textVM({
            variant,
            size,
            weight,
            align,
            leading,
            tracking,
            transform,
            wrap,
            decoration,
            interactity,
          }),
          className,
        )}
      />
    );
  },
);

export default Text;
export type { TextProps as Props };
