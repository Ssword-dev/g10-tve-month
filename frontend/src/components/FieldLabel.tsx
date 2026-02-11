import { cn } from "@_ssword/classes";
import type { AsChildProps, ClassProps, Props } from "./types";
import Label from "./Label";

const base = Label;

type ComponentBase = typeof base;

interface FieldLabelProps
  extends Props<ComponentBase>, ClassProps, AsChildProps {}

function FieldLabel({ className, asChild, ...props }: FieldLabelProps) {
  const Comp = Label;
  return (
    <Comp
      data-slot="field-label"
      asChild={asChild}
      className={cn(
        "has-data-checked:bg-primary/5 has-data-checked:border-primary/30 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10 gap-2 group-data-[disabled=true]/field:opacity-50 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-2.5 group/field-label peer/field-label flex w-fit leading-snug",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

export default FieldLabel;
