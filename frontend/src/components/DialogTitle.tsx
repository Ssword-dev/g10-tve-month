import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@_ssword/classes";

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

export default DialogTitle;
