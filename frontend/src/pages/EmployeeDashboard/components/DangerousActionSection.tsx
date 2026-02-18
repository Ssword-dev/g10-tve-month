import { useCallback } from "react";

import { deleteEmployeeAction } from "@/domain/employees/actions";
import Button from "@/components/Button";
import Card from "@/components/Card";
import CardContent from "@/components/CardContent";
import CardTitle from "@/components/CardTitle";
import Text from "@/components/Text";

import { filterEmployeesQuery } from "../queries";

export function DangerousActionSection({ employeeNumber }: { employeeNumber: number }) {
  const deleteEmployee = useCallback(() => {
    deleteEmployeeAction({ employee_number: employeeNumber });
    filterEmployeesQuery.refresh();
  }, [employeeNumber]);

  return (
    <Card className="gap-3 border-border p-4">
      <CardTitle>
        <Text weight="semibold" className="text-destructive">
          Dangerous Actions
        </Text>
      </CardTitle>
      <CardContent className="grid grid-cols-1 gap-3 p-0 md:grid-cols-2">
        <Button variant="destructive" onClick={deleteEmployee}>
          Delete Employee
        </Button>
      </CardContent>
    </Card>
  );
}
