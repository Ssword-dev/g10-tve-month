"use client";

import { Accordion as AccordionPrimitive } from "radix-ui";
import { cn } from "@_ssword/classes";
import { forwardRef } from "react";
import type { ClassProps, Props, RefType } from "./types";

const base = AccordionPrimitive.Root;

type ComponentBase = typeof base;

interface AccordionProps extends Props<ComponentBase>, ClassProps {}

const Accordion = forwardRef<RefType<ComponentBase>, AccordionProps>(
  ({ className, ...props }, forwardedRef) => {
    const Comp = base;

    return (
      <Comp
        data-slot="accordion"
        className={cn("w-full", className)}
        ref={forwardedRef}
        {...props}
      />
    );
  },
);

Accordion.displayName = "Accordion";

export default Accordion;
export type { AccordionProps as Props };
