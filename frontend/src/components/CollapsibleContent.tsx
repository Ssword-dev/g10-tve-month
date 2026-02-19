"use client";

import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { forwardRef } from "react";
import type { ClassProps, Props, RefType } from "./types";
import { cn } from "@_ssword/classes";

const base = CollapsiblePrimitive.Content;

type ComponentBase = typeof base;

interface CollapsibleContentProps extends Props<ComponentBase>, ClassProps {}

const CollapsibleContent = forwardRef<
  RefType<ComponentBase>,
  CollapsibleContentProps
>(({ className, ...props }, forwardedRef) => {
  const Comp = base;

  return (
    <Comp
      data-slot="collapsible-content"
      className={cn(className)}
      ref={forwardedRef}
      {...props}
    />
  );
});

CollapsibleContent.displayName = "CollapsibleContent";

export default CollapsibleContent;
export type { CollapsibleContentProps as Props };
