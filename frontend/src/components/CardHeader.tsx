import { cn, cvm } from "@_ssword/classes";
import type { ClassProps, Props, RefType, VariantProps } from "./types";
import { forwardRef } from "react";

const base = "div";

type ComponentBase = typeof base;

const cardHeaderVM = cvm(
  "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  },
);

interface CardHeaderProps
  extends Props<ComponentBase>, ClassProps, VariantProps<typeof cardHeaderVM> {}

const CardHeader = forwardRef<RefType<ComponentBase>, CardHeaderProps>(
  (props, forwardedRef) => {
    const { className, ...intrinsicProps } = props;
    const Comp = base;

    return (
      <Comp
        {...intrinsicProps}
        className={cn(cardHeaderVM({}), className)}
        ref={forwardedRef}
      />
    );
  },
);

export default CardHeader;
export type { CardHeaderProps as Props };
