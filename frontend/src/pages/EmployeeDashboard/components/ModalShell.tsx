import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

import Button from "@/components/Button";
import Card from "@/components/Card";
import CardContent from "@/components/CardContent";
import CardHeader from "@/components/CardHeader";
import CardTitle from "@/components/CardTitle";
import Text from "@/components/Text";

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
      className={`fixed inset-0 ${zClass} flex items-center justify-center bg-black/50 p-4`}
      onClick={() => {
        if (!disableClose) onRequestClose();
      }}
    >
      <Card
        className="h-[90vh] w-full max-w-6xl overflow-y-auto no-scrollbar border-border bg-card p-0"
        onClick={(event) => event.stopPropagation()}
      >
        <CardHeader className="sticky top-0 z-10 flex flex-row items-center justify-between border-b border-border bg-card px-5 py-3">
          <CardTitle>
            <Text size="xl" weight="bold">
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
        <CardContent className="space-y-4 px-5 py-5">{children}</CardContent>
      </Card>
    </div>
  );
}
