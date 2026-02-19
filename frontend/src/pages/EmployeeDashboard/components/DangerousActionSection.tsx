import Button from "@/components/Button";
import Card from "@/components/Card";
import CardContent from "@/components/CardContent";
import CardTitle from "@/components/CardTitle";
import Text from "@/components/Text";

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
          className="text-destructive-foreground bg-destructive"
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
