"use client";

import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@_ssword/classes";
import { forwardRef } from "react";
import type { ClassProps, Props, RefType } from "./types";

const base = TabsPrimitive.Root;

type ComponentBase = typeof base;

interface TabsProps extends Props<ComponentBase>, ClassProps {
  orientation?: "horizontal" | "vertical";
}

const Tabs = forwardRef<RefType<ComponentBase>, TabsProps>(
  ({ className, orientation = "horizontal", ...props }, forwardedRef) => {
    const Comp = base;
    return (
      <Comp
        data-slot="tabs"
        data-orientation={orientation}
        className={cn(
          "gap-2 group/tabs flex data-horizontal:flex-col",
          className,
        )}
        ref={forwardedRef}
        {...props}
      />
    );
  },
);

export default Tabs;
export type { TabsProps as Props };
