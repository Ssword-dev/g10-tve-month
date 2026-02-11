import { cn, cvm } from "@_ssword/classes";
import type { AsChildProps, ClassProps, Props, VariantProps } from "./types";

const base = "legend";

type ComponentBase = typeof base;

const fieldLegendVM = cvm("mb-1.5 font-medium", {
  variants: {
    variant: {
      label: "text-sm",
      legend: "text-base",
    },
  },
  defaultVariants: {},
  compoundVariants: [],
});

interface FieldLegendProps
  extends
    Props<ComponentBase>,
    VariantProps<typeof fieldLegendVM>,
    ClassProps,
    AsChildProps {}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: FieldLegendProps) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(fieldLegendVM({ variant }), className)}
      {...props}
    />
  );
}

export default FieldLegend;
