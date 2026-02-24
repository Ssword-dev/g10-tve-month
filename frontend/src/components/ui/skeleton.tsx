import { forwardRef } from "react";
import { cn, cvm } from "@_ssword/classes";
import type { ClassProps, Props, RefType, VariantProps } from "./types";

const base = "span";
type BaseComponent = typeof base;

const skeletonVM = cvm("skeleton animate-skeleton-pulse", {
  variants: {},
  defaultVariants: {},
  compoundVariants: [],
});

interface SkeletonProps
  extends Props<BaseComponent>, ClassProps, VariantProps<typeof skeletonVM> {}

const Skeleton = forwardRef<RefType<BaseComponent>, SkeletonProps>(
  ({ className, ...intrinsicProps }, forwardedRef) => {
    const Comp = base;
    return (
      <Comp
        {...intrinsicProps}
        ref={forwardedRef}
        className={cn(skeletonVM({}), className)}
      />
    );
  },
);

export { Skeleton };
