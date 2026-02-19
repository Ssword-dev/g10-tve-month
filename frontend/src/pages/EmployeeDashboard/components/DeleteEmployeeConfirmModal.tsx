import Button from "@/components/Button";
import Card from "@/components/Card";
import CardContent from "@/components/CardContent";
import CardTitle from "@/components/CardTitle";
import Text from "@/components/Text";

interface DeleteEmployeeConfirmModalProps {
  open: boolean;
  isDeleting: boolean;
  errorText?: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteEmployeeConfirmModal({
  open,
  isDeleting,
  errorText,
  onCancel,
  onConfirm,
}: DeleteEmployeeConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-80 flex items-center justify-center bg-black/50 p-4"
      onClick={() => {
        if (isDeleting) return;
        onCancel();
      }}
    >
      <Card
        className="w-full max-w-lg gap-3 border-border bg-card p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <CardTitle>
          <Text size="lg" weight="bold">
            Confirm Record Deletion
          </Text>
        </CardTitle>
        <CardContent className="flex flex-col gap-1 space-y-3 p-0">
          <Text weight="semibold">
            Are you really really sure you want to delete this employee record?
          </Text>
          <Text size="sm" className="text-muted-foreground">
            This action is permanent and cannot be undone.
          </Text>
          {errorText ? (
            <Text size="sm" className="text-destructive">
              {errorText}
            </Text>
          ) : null}
          <div className="flex justify-end gap-3">
            <Button
              className="px-2 py-1"
              variant="primary"
              disabled={isDeleting}
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              className="px-2 py-1"
              variant="destructive"
              disabled={isDeleting}
              onClick={() => void onConfirm()}
            >
              {isDeleting ? "Deleting..." : "Confirm"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
