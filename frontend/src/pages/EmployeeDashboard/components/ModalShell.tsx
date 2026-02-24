import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/misc";

interface ModalShellProps {
  open: boolean;
  title: string;
  onRequestClose: () => void;
  disableClose?: boolean;
  zClass?: string;
  children: ReactNode;
}

export function ModalShell({
  open,
  title,
  onRequestClose,
  disableClose = false,
  zClass = "z-60",
  children,
}: ModalShellProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !disableClose) onRequestClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, disableClose, onRequestClose]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 ${zClass} flex items-center justify-center bg-black/50 p-2 sm:p-4`}
      onClick={() => {
        if (!disableClose) onRequestClose();
      }}
    >
      <Card
        className="h-[94vh] w-full max-w-6xl overflow-y-auto no-scrollbar border-border bg-card p-0 sm:h-[90vh]"
        onClick={(event) => event.stopPropagation()}
      >
        <CardHeader className="sticky top-0 z-10 flex flex-row items-center justify-between gap-3 border-b border-border bg-card px-3 py-3 sm:px-5">
          <CardTitle>
            <Text size="lg" weight="bold" className="sm:text-xl">
              {title}
            </Text>
          </CardTitle>
          <Button
            className="px-2 py-2"
            onClick={onRequestClose}
            disabled={disableClose}
            aria-label="close modal"
          >
            <X className="size-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 px-3 py-4 sm:px-5 sm:py-5">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
