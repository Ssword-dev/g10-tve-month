"use client";

import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { forwardRef } from "react";
import type { ClassProps, Props, RefType } from "./types";
import { cn } from "@_ssword/classes";

const base = CollapsiblePrimitive.Root;

type ComponentBase = typeof base;

interface CollapsibleProps extends Props<ComponentBase>, ClassProps {}

const Collapsible = forwardRef<RefType<ComponentBase>, CollapsibleProps>(
  ({ className, ...props }, forwardedRef) => {
    const Comp = base;

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

Collapsible.displayName = "Collapsible";

export default Collapsible;
export type { CollapsibleProps as Props };
