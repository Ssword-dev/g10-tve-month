import { cn } from "@_ssword/classes";
import type { AsChildProps, ClassProps, Props } from "./types";
import { Slot } from "@radix-ui/react-slot";

const base = "p";

type ComponentBase = typeof base;

interface FieldDescriptionProps
  extends Props<ComponentBase>, ClassProps, AsChildProps {}

function FieldDescription({
  className,
  asChild,
  ...props
}: FieldDescriptionProps) {
  const Comp = asChild ? Slot : base;
  return (
    <Comp
      data-slot="field-description"
      className={cn(
        "text-muted-foreground text-left text-sm [[data-variant=legend]+&]:-mt-1.5 leading-normal font-normal group-has-data-horizontal/field:text-balance",
        "last:mt-0 nth-last-2:-mt-1",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className,
      )}
      {...props}
    />
  );
}

export default FieldDescription;
