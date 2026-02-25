import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/misc";

interface DangerousActionSectionProps {
  onDeleteEmployee: () => Promise<void>;
  isDeleting: boolean;
}

export function DangerousActionSection({
  onDeleteEmployee,
  isDeleting,
}: DangerousActionSectionProps) {
  return (
    <Card className="gap-3 border-border p-4">
      <CardTitle>
        <Text weight="bold">Delete Employee</Text>
      </CardTitle>
      <CardContent className="space-y-3 p-0">
        <Text size="sm" className="text-muted-foreground">
          This action permanently removes the employee record.
        </Text>
        <Button
          className="w-full bg-destructive text-destructive-foreground sm:w-auto"
          variant="destructive"
          disabled={isDeleting}
          onClick={() => void onDeleteEmployee()}
        >
          {isDeleting ? "Deleting Employee..." : "Delete Employee"}
        </Button>
      </CardContent>
    </Card>
  );
}
