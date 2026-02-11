import { cn } from "@_ssword/classes";
import type { AsChildProps, ClassProps, Props } from "./types";
import { Slot } from "@radix-ui/react-slot";

const base = "div";

type ComponentBase = typeof base;

interface FieldContentProps
  extends Props<ComponentBase>, ClassProps, AsChildProps {}

function FieldContent({ className, asChild, ...props }: FieldContentProps) {
  const Comp = asChild ? Slot : base;
  return (
    <Comp
      data-slot="field-content"
      className={cn(
        "gap-0.5 group/field-content flex flex-1 flex-col leading-snug",
        className,
      )}
      {...props}
    />
  );
}

export default FieldContent;
