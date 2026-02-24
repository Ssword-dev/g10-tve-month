import { forwardRef, useEffect, useRef, useState, type PointerEvent } from "react";
import { cn, cvm } from "@_ssword/classes";
import { Slot } from "@radix-ui/react-slot";
import type {
  AsChildProps,
  ClassProps,
  Props,
  RefType,
  VariantProps,
} from "./types";

const textBase = "span";
type TextBaseComponent = typeof textBase;
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
    Props<TextBaseComponent>,
    ClassProps,
    AsChildProps,
    VariantProps<typeof textVM> {}

const Text = forwardRef<RefType<TextBaseComponent>, TextProps>(
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
    const Comp = asChild ? Slot : textBase;
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

interface ActivatableChangeEventMetadata {
  value: boolean;
}

const activatableVM = cvm(
  cn(
    "inline-flex items-center justify-center",
    "px-2 py-1 text-sm font-medium",
    "text-muted-foreground bg-transparent",
    "rounded-md border border-transparent",
    "transition-all duration-150 ease-in-out",
    "hover:bg-muted hover:text-foreground",
    "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
    "data-active:bg-accent",
    "data-active:text-primary",
    "data-active:border-primary",
    "data-active:scale-95",
  ),
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  },
);
interface ActivatableProps
  extends Omit<Props<"button">, "onToggle">, ClassProps, AsChildProps {
  normallyOpen?: boolean;
  onToggle?: (e: ActivatableChangeEventMetadata) => void;
}

const Activatable = forwardRef<RefType<"button">, ActivatableProps>(
  ({ normallyOpen = false, asChild = false, onToggle, className, children, ...rest }, ref) => {
    const [active, setActive] = useState(normallyOpen);
    const hydrating = useRef(true);

    useEffect(() => {
      const id = setTimeout(() => {
        hydrating.current = false;
      }, 0);
      return () => clearTimeout(id);
    }, []);

    const Comp = asChild ? Slot : "button";

    const handleClick = (evt: PointerEvent<HTMLButtonElement>) => {
      const next = !active;
      onToggle?.({ value: next });
      setActive(next);
      rest.onClick?.(evt);
    };

    return (
      <Comp
        ref={ref}
        role="checkbox"
        data-active={active ? true : undefined}
        onClick={handleClick}
        className={cn(activatableVM({}), className)}
        {...rest}
      >
        {children}
      </Comp>
    );
  },
);

const boxBase = "div";
type BoxComponentBase = typeof boxBase;
const boxVM = cvm("p-2", {
  variants: {
    align: {
      start: "self-start",
      end: "self-end",
      center: "self-center",
    },
    justify: {
      start: "[.flex-row>&]:ml-0 [.flex-col>&]:mt-0",
      end: "[.flex-row>&]:ml-auto [.flex-col>&]:mt-auto",
      center: "[.flex-row>&]:my-auto [.flex-col>&]:my-auto",
    },
  },
  defaultVariants: {
    align: "start",
    justify: "start",
  },
  compoundVariants: [],
});

interface BoxProps
  extends
    Props<BoxComponentBase>,
    ClassProps,
    AsChildProps,
    VariantProps<typeof boxVM> {}

const Box = forwardRef<RefType<BoxComponentBase>, BoxProps>(
  (props, forwardedRef) => {
    const { align, justify, className, asChild = false, ...baseProps } = props;
    const Comp = asChild ? Slot : boxBase;
    return (
      <Comp
        {...baseProps}
        className={cn(boxVM({ align, justify }), className)}
        ref={forwardedRef}
      />
    );
  },
);

const screenBase = "div";
type ScreenComponentBase = typeof screenBase;
const screenVM = cvm(
  "pointer-events-none *:pointer-events-auto z-10000 fixed h-screen w-screen m-0 p-0 bg-transparent",
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  },
);

interface ScreenProps
  extends
    Props<ScreenComponentBase>,
    ClassProps,
    AsChildProps,
    VariantProps<typeof screenVM> {}

const Screen = forwardRef<RefType<ScreenComponentBase>, ScreenProps>(
  (props: ScreenProps, forwardedRef) => {
    const { className, asChild = false, ...restProps } = props;
    const Comp = asChild ? Slot : screenBase;
    return (
      <Comp
        {...restProps}
        ref={forwardedRef}
        className={cn(screenVM({}), className)}
      >
        {props.children}
      </Comp>
    );
  },
);

const stackVM = cvm("flex", {
  variants: {
    orientation: {
      horizontal: "flex-row data-[order=reversed]:flex-row-reversed",
      vertical: "flex-col data-[order=reversed]:flex-col-reversed",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
  compoundVariants: [],
});

interface StackProps
  extends Props<typeof Box>, ClassProps, AsChildProps, VariantProps<typeof stackVM> {
  order?: "normal" | "reversed";
  gap?: string;
}

const Stack = forwardRef<RefType<typeof Box>, StackProps>(
  (props: StackProps, forwardedRef) => {
    const {
      className,
      order = "normal",
      orientation = "vertical",
      asChild = false,
      gap = "0.5rem",
      ...restProps
    } = props;
    const Comp = asChild ? Slot : Box;
    return (
      <Comp
        {...restProps}
        ref={forwardedRef}
        className={cn(stackVM({ orientation }), className)}
        style={{ gap }}
        data-order={order}
      >
        {props.children}
      </Comp>
    );
  },
);

export { Activatable, Box, Screen, Stack, Text };
export type {
  ActivatableChangeEventMetadata,
  ActivatableProps,
  BoxProps,
  ScreenProps,
  StackProps,
  TextProps,
};
