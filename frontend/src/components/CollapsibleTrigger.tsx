"use client";

import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { forwardRef } from "react";
import type { ClassProps, Props, RefType } from "./types";
import { cn } from "@_ssword/classes";

const base = CollapsiblePrimitive.Trigger;

type ComponentBase = typeof base;

interface CollapsibleTriggerProps extends Props<ComponentBase>, ClassProps {}

const CollapsibleTrigger = forwardRef<
  RefType<ComponentBase>,
  CollapsibleTriggerProps
>(({ className, ...props }, forwardedRef) => {
  const Comp = base;

  return (
    <Comp
      data-slot="collapsible-trigger"
      className={cn(className)}
      ref={forwardedRef}
      {...props}
    />
  );
});

CollapsibleTrigger.displayName = "CollapsibleTrigger";

export default CollapsibleTrigger;
export type { CollapsibleTriggerProps as Props };
