import { cn, cvm } from "@_ssword/classes";
import { useMemo } from "react";
import { Slot } from "@radix-ui/react-slot";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { AsChildProps, ClassProps, Props, VariantProps } from "./types";

const fieldBase = "div";
type FieldComponentBase = typeof fieldBase;
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
    Props<FieldComponentBase>,
    ClassProps,
    VariantProps<typeof fieldVariants>,
    AsChildProps {}
function Field({
  className,
  orientation = "vertical",
  asChild,
  ...props
}: FieldProps) {
  const Comp = asChild ? Slot : fieldBase;
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

const fieldContentBase = "div";
type FieldContentComponentBase = typeof fieldContentBase;
interface FieldContentProps
  extends Props<FieldContentComponentBase>, ClassProps, AsChildProps {}
function FieldContent({ className, asChild, ...props }: FieldContentProps) {
  const Comp = asChild ? Slot : fieldContentBase;
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

const fieldDescriptionBase = "p";
type FieldDescriptionComponentBase = typeof fieldDescriptionBase;
interface FieldDescriptionProps
  extends Props<FieldDescriptionComponentBase>, ClassProps, AsChildProps {}
function FieldDescription({
  className,
  asChild,
  ...props
}: FieldDescriptionProps) {
  const Comp = asChild ? Slot : fieldDescriptionBase;
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

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }
    if (!errors?.length) {
      return null;
    }
    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ];
    if (uniqueErrors?.length == 1) {
      return uniqueErrors[0]?.message;
    }
    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>,
        )}
      </ul>
    );
  }, [children, errors]);
  if (!content) {
    return null;
  }
  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-destructive text-sm font-normal", className)}
      {...props}
    >
      {content}
    </div>
  );
}

const fieldGroupBase = "div";
type FieldGroupComponentBase = typeof fieldGroupBase;
interface FieldGroupProps
  extends Props<FieldGroupComponentBase>, ClassProps, AsChildProps {}
function FieldGroup({ className, asChild, ...props }: FieldGroupProps) {
  const Comp = asChild ? Slot : fieldGroupBase;
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

const fieldLabelBase = Label;
type FieldLabelComponentBase = typeof fieldLabelBase;
interface FieldLabelProps
  extends Props<FieldLabelComponentBase>, ClassProps, AsChildProps {}
function FieldLabel({ className, asChild, ...props }: FieldLabelProps) {
  const Comp = asChild ? Slot : fieldLabelBase;
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

const fieldLegendBase = "legend";
type FieldLegendComponentBase = typeof fieldLegendBase;
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
    Props<FieldLegendComponentBase>,
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

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode;
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "-my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2 relative",
        className,
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="text-muted-foreground px-2 bg-background relative mx-auto block w-fit"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  );
}

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3 flex flex-col",
        className,
      )}
      {...props}
    />
  );
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "gap-2 text-sm font-medium group-data-[disabled=true]/field:opacity-50 flex w-fit items-center leading-snug",
        className,
      )}
      {...props}
    />
  );
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
};
