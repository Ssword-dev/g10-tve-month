import { cn, cvm } from "@_ssword/classes";
import type { AsChildProps, ClassProps, Props, VariantProps } from "./types";
import { Slot } from "@radix-ui/react-slot";

const base = "div";

type ComponentBase = typeof base;

const fieldVariants = cvm(
  "data-[invalid=true]:text-destructive gap-2 group/field flex w-full",
  {
    variants: {
      orientation: {
        vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
        horizontal:
          "flex-row items-center *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        responsive:
          "flex-col *:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:*:data-[slot=field-label]:flex-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
    compoundVariants: [],
  },
);

interface FieldProps
  extends
    Props<ComponentBase>,
    ClassProps,
    VariantProps<typeof fieldVariants>,
    AsChildProps {}

function Field({
  className,
  orientation = "vertical",
  asChild,
  ...props
}: FieldProps) {
  const Comp = asChild ? Slot : base;
  return (
    <Comp
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

export default Field;
