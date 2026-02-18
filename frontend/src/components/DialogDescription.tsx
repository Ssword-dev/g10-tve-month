import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@_ssword/classes";

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export default DialogDescription;
