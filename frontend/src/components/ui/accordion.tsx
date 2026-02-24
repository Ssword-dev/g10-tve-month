"use client";

import { Accordion as AccordionPrimitive } from "radix-ui";
import { ChevronDown } from "lucide-react";
import { cn } from "@_ssword/classes";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import type { ClassProps, Props, RefType } from "./types";

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

const accordionItemBase = AccordionPrimitive.Item;
type AccordionItemComponentBase = typeof accordionItemBase;
interface AccordionItemProps extends Props<AccordionItemComponentBase>, ClassProps {}
const AccordionItem = forwardRef<RefType<AccordionItemComponentBase>, AccordionItemProps>(
  ({ className, ...props }, forwardedRef) => {
    const Comp = accordionItemBase;
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

const accordionTriggerBase = AccordionPrimitive.Trigger;
type AccordionTriggerComponentBase = typeof accordionTriggerBase;
interface AccordionTriggerProps extends Props<AccordionTriggerComponentBase>, ClassProps {}
const AccordionTrigger = forwardRef<
  RefType<AccordionTriggerComponentBase>,
  AccordionTriggerProps
>(({ className, children, ...props }, forwardedRef) => {
  const Comp = accordionTriggerBase;
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

const accordionContentBase = AccordionPrimitive.Content;
type AccordionContentComponentBase = typeof accordionContentBase;
interface AccordionContentProps extends Props<AccordionContentComponentBase>, ClassProps {}
const AccordionContent = forwardRef<RefType<AccordionContentComponentBase>, AccordionContentProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const Comp = accordionContentBase;
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

AccordionItem.displayName = "AccordionItem";
AccordionTrigger.displayName = "AccordionTrigger";
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
