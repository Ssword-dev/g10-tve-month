import { cn } from "@_ssword/classes";
import type { AsChildProps, ClassProps, Props } from "./types";
import { Slot } from "@radix-ui/react-slot";

const base = "div";

type ComponentBase = typeof base;

interface FieldGroupProps
  extends Props<ComponentBase>, ClassProps, AsChildProps {}

function FieldGroup({ className, asChild, ...props }: FieldGroupProps) {
  const Comp = asChild ? Slot : base;
  return (
    <Comp
      data-slot="field-group"
      className={cn(
        "gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4 group/field-group @container/field-group flex w-full flex-col",
        className,
      )}
      {...props}
    />
  );
}

export default FieldGroup;
