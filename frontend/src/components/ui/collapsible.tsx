"use client";

import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { forwardRef } from "react";
import { cn } from "@_ssword/classes";
import type { ClassProps, Props, RefType } from "./types";

const collapsibleBase = CollapsiblePrimitive.Root;
type CollapsibleComponentBase = typeof collapsibleBase;
interface CollapsibleProps extends Props<CollapsibleComponentBase>, ClassProps {}
const Collapsible = forwardRef<RefType<CollapsibleComponentBase>, CollapsibleProps>(
  ({ className, ...props }, forwardedRef) => {
    const Comp = collapsibleBase;
    return (
      <Comp
        data-slot="collapsible"
        className={cn("w-full", className)}
        ref={forwardedRef}
        {...props}
      />
    );
  },
);

const collapsibleTriggerBase = CollapsiblePrimitive.Trigger;
type CollapsibleTriggerComponentBase = typeof collapsibleTriggerBase;
interface CollapsibleTriggerProps extends Props<CollapsibleTriggerComponentBase>, ClassProps {}
const CollapsibleTrigger = forwardRef<
  RefType<CollapsibleTriggerComponentBase>,
  CollapsibleTriggerProps
>(({ className, ...props }, forwardedRef) => {
  const Comp = collapsibleTriggerBase;
  return (
    <Comp
      data-slot="collapsible-trigger"
      className={cn(className)}
      ref={forwardedRef}
      {...props}
    />
  );
});

const collapsibleContentBase = CollapsiblePrimitive.Content;
type CollapsibleContentComponentBase = typeof collapsibleContentBase;
interface CollapsibleContentProps extends Props<CollapsibleContentComponentBase>, ClassProps {}
const CollapsibleContent = forwardRef<
  RefType<CollapsibleContentComponentBase>,
  CollapsibleContentProps
>(({ className, ...props }, forwardedRef) => {
  const Comp = collapsibleContentBase;
  return (
    <Comp
      data-slot="collapsible-content"
      className={cn(className)}
      ref={forwardedRef}
      {...props}
    />
  );
});

Collapsible.displayName = "Collapsible";
CollapsibleTrigger.displayName = "CollapsibleTrigger";
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
