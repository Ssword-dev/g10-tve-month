"use client";

import { Accordion as AccordionPrimitive } from "radix-ui";
import { cn } from "@_ssword/classes";
import { forwardRef } from "react";
import type { ClassProps, Props, RefType } from "./types";

const base = AccordionPrimitive.Item;

type ComponentBase = typeof base;

interface AccordionItemProps extends Props<ComponentBase>, ClassProps {}

const AccordionItem = forwardRef<RefType<ComponentBase>, AccordionItemProps>(
  ({ className, ...props }, forwardedRef) => {
    const Comp = base;

    return (
      <Comp
        data-slot="accordion-item"
        className={cn("border-b last:border-b-0", className)}
        ref={forwardedRef}
        {...props}
      />
    );
  },
);

AccordionItem.displayName = "AccordionItem";

export default AccordionItem;
export type { AccordionItemProps as Props };
