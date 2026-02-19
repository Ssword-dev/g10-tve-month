"use client";

import { Accordion as AccordionPrimitive } from "radix-ui";
import { cn } from "@_ssword/classes";
import type { ComponentPropsWithoutRef } from "react";

type AccordionProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & {
  className?: string;
};

const Accordion = ({ className, ...props }: AccordionProps) => (
  <AccordionPrimitive.Root
    data-slot="accordion"
    className={cn("w-full", className)}
    {...props}
  />
);

export default Accordion;
export type { AccordionProps as Props };
