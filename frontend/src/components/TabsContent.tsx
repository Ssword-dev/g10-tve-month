"use client";

import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@_ssword/classes";
import { forwardRef } from "react";
import type { ClassProps, Props, RefType } from "./types";

const base = TabsPrimitive.Content;

type ComponentBase = typeof base;

interface TabsContentProps extends Props<ComponentBase>, ClassProps {}

const TabsContent = forwardRef<RefType<ComponentBase>, TabsContentProps>(
  ({ className, ...props }, forwardedRef) => {
    const Comp = base;

    return (
      <Comp
        data-slot="tabs-content"
        className={cn("text-sm flex-1 outline-none", className)}
        ref={forwardedRef}
        {...props}
      />
    );
  },
);

export default TabsContent;
export type { TabsContentProps as Props };
