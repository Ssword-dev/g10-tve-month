"use client";

import { Accordion as AccordionPrimitive } from "radix-ui";
import { ChevronDown } from "lucide-react";
import { cn } from "@_ssword/classes";
import { forwardRef } from "react";
import type { ClassProps, Props, RefType } from "./types";

const base = AccordionPrimitive.Trigger;

type ComponentBase = typeof base;

interface AccordionTriggerProps extends Props<ComponentBase>, ClassProps {}

const AccordionTrigger = forwardRef<
  RefType<ComponentBase>,
  AccordionTriggerProps
>(({ className, children, ...props }, forwardedRef) => {
  const Comp = base;

  return (
    <AccordionPrimitive.Header className="flex">
      <Comp
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 py-3 text-left text-sm font-medium outline-none transition hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        ref={forwardedRef}
        {...props}
      >
        {children}
        <ChevronDown className="text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200" />
      </Comp>
    </AccordionPrimitive.Header>
  );
});

AccordionTrigger.displayName = "AccordionTrigger";

export default AccordionTrigger;
export type { AccordionTriggerProps as Props };
