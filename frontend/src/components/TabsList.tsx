"use client";

import { Tabs as TabsPrimitive } from "radix-ui";
import { cvm, cn } from "@_ssword/classes";
import { forwardRef } from "react";
import type { ClassProps, Props, RefType, VariantProps } from "./types";

const base = TabsPrimitive.List;

type ComponentBase = typeof base;

const tabsListVM = cvm(
  "rounded-lg p-[3px] group-data-horizontal/tabs:h-8 data-[variant=line]:rounded-none group/tabs-list text-muted-foreground inline-flex w-fit items-center justify-center group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
    compoundVariants: [],
  },
);

interface TabsListProps
  extends Props<ComponentBase>, ClassProps, VariantProps<typeof tabsListVM> {}

const TabsList = forwardRef<RefType<ComponentBase>, TabsListProps>(
  ({ className, variant = "default", ...props }, forwardedRef) => {
    const Comp = base;

    return (
      <Comp
        data-slot="tabs-list"
        data-variant={variant}
        className={cn(tabsListVM({ variant }), className)}
        ref={forwardedRef}
        {...props}
      />
    );
  },
);

export default TabsList;
export type { TabsListProps as Props };
