import { useCallback, useState } from "react";
import { Plus } from "lucide-react";

import Dialog from "@/components/Dialog";
import DialogContent from "@/components/DialogContent";
import DialogPortal from "@/components/DialogPortal";
import DialogTrigger from "@/components/DialogTrigger";

import { AddEmployeeForm } from "./AddEmployeeForm";
import { TableToolButton } from "./TableToolButton";

export function AddEmployeeButton() {
  const [open, setOpen] = useState(false);
  const closeModal = useCallback(() => setOpen(false), []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPortal container={document.body} />
      <DialogTrigger asChild>
        <TableToolButton>
          <Plus className="h-5 w-5" />
        </TableToolButton>
      </DialogTrigger>
      <DialogContent className="h-[92vh] w-[96vw] border-border bg-background p-0 shadow-2xl sm:h-[88vh] sm:w-[90vw] lg:h-[82vh] lg:w-[80vw]">
        <AddEmployeeForm closeModal={closeModal} />
      </DialogContent>
    </Dialog>
  );
}
