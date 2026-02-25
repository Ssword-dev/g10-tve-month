import { cn, cvm } from "@_ssword/classes";
import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { Text } from "@/components/ui/misc";
import type {
  AsChildProps,
  ClassProps,
  PropType,
  Props,
  RefType,
  VariantProps,
} from "./types";

const cardBase = "div";
type CardComponentBase = typeof cardBase;
const cardVM = cvm(
  "bg-card text-foreground flex flex-col gap-6 rounded-xl border px-3 py-6 shadow-sm",
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
    Props<CardComponentBase>,
    ClassProps,
    VariantProps<typeof cardVM>,
    AsChildProps {}

const Card = forwardRef<RefType<CardComponentBase>, CardProps>(
  (props, forwardedRef) => {
    const { borderAccent, transition, className, asChild, ...baseProps } =
      props;
    const Comp = asChild ? Slot : cardBase;
    return (
      <Comp
        {...baseProps}
        className={cn(cardVM({ borderAccent, transition }), className)}
        ref={forwardedRef}
      />
    );
  },
);

const cardActionBase = "div";
type CardActionComponentBase = typeof cardActionBase;
const cardActionVM = cvm("col-start-2 row-span-2 row-start-1 self-start justify-self-end", {
  variants: {},
  defaultVariants: {},
  compoundVariants: [],
});
interface CardActionProps
  extends Props<CardActionComponentBase>, ClassProps, VariantProps<typeof cardActionVM> {}
const CardAction = forwardRef<RefType<CardActionComponentBase>, CardActionProps>((props, forwardedRef) => {
  const { className, ...baseProps } = props;
  const Comp = cardActionBase;
  return (
    <Comp
      {...baseProps}
      className={cn(cardActionVM({}), className)}
      ref={forwardedRef}
    />
  );
});

const cardContentBase = "div";
type CardContentComponentBase = typeof cardContentBase;
const cardContentVM = cvm("px-6 flex-grow", {
  variants: {},
  defaultVariants: {},
  compoundVariants: [],
});
interface CardContentProps
  extends Props<CardContentComponentBase>, ClassProps, VariantProps<typeof cardContentVM> {}
const CardContent = forwardRef<RefType<CardContentComponentBase>, CardContentProps>((props, forwardedRef) => {
  const Comp = cardContentBase;
  const { className, ...baseProps } = props;
  return (
    <Comp
      {...baseProps}
      className={cn(cardContentVM({}), className)}
      ref={forwardedRef}
    />
  );
});

const cardDescriptionBase = "div";
type CardDescriptionComponentBase = typeof cardDescriptionBase;
const cardDescriptionVM = cvm("text-muted-foreground text-sm", {
  variants: {},
  defaultVariants: {},
  compoundVariants: [],
});
interface CardDescriptionProps
  extends
    PropType<CardDescriptionComponentBase>,
    ClassProps,
    VariantProps<typeof cardDescriptionVM> {}
const CardDescription = forwardRef<RefType<CardDescriptionComponentBase>, CardDescriptionProps>(
  (props, forwardedRef) => {
    const { className, ...intrinsicProps } = props;
    const Comp = cardDescriptionBase;
    return (
      <Comp
        {...intrinsicProps}
        className={cn(cardDescriptionVM({}), className)}
        ref={forwardedRef}
      />
    );
  },
);

const cardFooterBase = "div";
type CardFooterComponentBase = typeof cardFooterBase;
const cardFooterVM = cvm("flex items-center px-6 [.border-t]:pt-6", {
  variants: {},
  defaultVariants: {},
  compoundVariants: [],
});
interface CardFooterProps
  extends Props<CardFooterComponentBase>, ClassProps, VariantProps<typeof cardFooterVM> {}
const CardFooter = forwardRef<RefType<CardFooterComponentBase>, CardFooterProps>((props, forwardedRef) => {
  const { className, ...intrinsicProps } = props;
  const Comp = cardFooterBase;
  return (
    <Comp
      {...intrinsicProps}
      className={cn(cardFooterVM({}), className)}
      ref={forwardedRef}
    />
  );
});

const cardHeaderBase = "div";
type CardHeaderComponentBase = typeof cardHeaderBase;
const cardHeaderVM = cvm(
  "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  },
);
interface CardHeaderProps
  extends Props<CardHeaderComponentBase>, ClassProps, VariantProps<typeof cardHeaderVM> {}
const CardHeader = forwardRef<RefType<CardHeaderComponentBase>, CardHeaderProps>(
  (props, forwardedRef) => {
    const { className, ...intrinsicProps } = props;
    const Comp = cardHeaderBase;
    return (
      <Comp
        {...intrinsicProps}
        className={cn(cardHeaderVM({}), className)}
        ref={forwardedRef}
      />
    );
  },
);

const cardTitleBase = Text;
type CardTitleBaseComponent = typeof cardTitleBase;
const cardTitleVM = cvm("leading-none font-semibold", {
  variants: {},
  defaultVariants: {},
  compoundVariants: [],
});
interface CardTitleProps
  extends
    Props<CardTitleBaseComponent>,
    AsChildProps,
    ClassProps,
    VariantProps<typeof cardTitleVM> {}
const CardTitle = forwardRef<RefType<CardTitleBaseComponent>, CardTitleProps>(
  ({ className, asChild, ...intrinsicProps }, forwardedRef) => {
    const Comp = asChild ? Slot : cardTitleBase;
    return (
      <Comp
        {...intrinsicProps}
        ref={forwardedRef}
        className={cn(cardTitleVM({}), className)}
      />
    );
  },
);

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
