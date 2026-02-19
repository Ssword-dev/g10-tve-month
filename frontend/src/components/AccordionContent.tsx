"use client";

import { Accordion as AccordionPrimitive } from "radix-ui";
import { cn } from "@_ssword/classes";
import { forwardRef } from "react";
import type { ClassProps, Props, RefType } from "./types";

const base = AccordionPrimitive.Content;

type ComponentBase = typeof base;

interface AccordionContentProps extends Props<ComponentBase>, ClassProps {}

const AccordionContent = forwardRef<RefType<ComponentBase>, AccordionContentProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const Comp = base;

    return (
      <Comp
        data-slot="accordion-content"
        className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
        ref={forwardedRef}
        {...props}
      >
        <div className={cn("pt-0 pb-3", className)}>{children}</div>
      </Comp>
    );
  },
);

AccordionContent.displayName = "AccordionContent";

export default AccordionContent;
export type { AccordionContentProps as Props };
