"use client";

import { Tabs as TabsPrimitive } from "radix-ui";
import { cvm, cn } from "@_ssword/classes";
import { forwardRef } from "react";
import type { ClassProps, Props, RefType, VariantProps } from "./types";

const tabsBase = TabsPrimitive.Root;
type TabsComponentBase = typeof tabsBase;
interface TabsProps extends Props<TabsComponentBase>, ClassProps {
  orientation?: "horizontal" | "vertical";
}
const Tabs = forwardRef<RefType<TabsComponentBase>, TabsProps>(
  ({ className, orientation = "horizontal", ...props }, forwardedRef) => {
    const Comp = tabsBase;
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

const tabsListBase = TabsPrimitive.List;
type TabsListComponentBase = typeof tabsListBase;
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
  extends Props<TabsListComponentBase>, ClassProps, VariantProps<typeof tabsListVM> {}
const TabsList = forwardRef<RefType<TabsListComponentBase>, TabsListProps>(
  ({ className, variant = "default", ...props }, forwardedRef) => {
    const Comp = tabsListBase;
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

const tabsTriggerBase = TabsPrimitive.Trigger;
type TabsTriggerComponentBase = typeof tabsTriggerBase;
interface TabsTriggerProps extends Props<TabsTriggerComponentBase>, ClassProps {}
const TabsTrigger = forwardRef<RefType<TabsTriggerComponentBase>, TabsTriggerProps>(
  ({ className, ...props }, forwardedRef) => {
    const Comp = tabsTriggerBase;
    return (
      <Comp
        data-slot="tabs-trigger"
        className={cn(
          "gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg:not([class*='size-'])]:size-4 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground/60 hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center whitespace-nowrap transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
          "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent",
          "data-active:bg-background dark:data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 data-active:text-foreground",
          "after:bg-foreground after:absolute after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
          className,
        )}
        ref={forwardedRef}
        {...props}
      />
    );
  },
);

const tabsContentBase = TabsPrimitive.Content;
type TabsContentComponentBase = typeof tabsContentBase;
interface TabsContentProps extends Props<TabsContentComponentBase>, ClassProps {}
const TabsContent = forwardRef<RefType<TabsContentComponentBase>, TabsContentProps>(
  ({ className, ...props }, forwardedRef) => {
    const Comp = tabsContentBase;
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

export { Tabs, TabsContent, TabsList, TabsTrigger };
