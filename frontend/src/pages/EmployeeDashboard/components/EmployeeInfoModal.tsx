import type { Employee } from "@/domain/employees/types";

import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Card from "@/components/Card";
import CardContent from "@/components/CardContent";
import CardTitle from "@/components/CardTitle";
import Text from "@/components/Text";

import { courseKey } from "../utils";
import { EmployeeDetailsCard } from "./EmployeeDetailsCard";
import { ModalShell } from "./ModalShell";

interface EmployeeInfoModalProps {
  employee: Employee | null;
  open: boolean;
  onClose: () => void;
  onOpenAdmin: () => void;
}

export function EmployeeInfoModal({
  employee,
  open,
  onClose,
  onOpenAdmin,
}: EmployeeInfoModalProps) {
  if (!employee) return null;

  return (
    <ModalShell
      open={open}
      title={`Employee #${employee.employee_number}`}
      onRequestClose={onClose}
    >
      <EmployeeDetailsCard employee={employee} />
      <Card className="gap-3 border-border p-4">
        <CardTitle>
          <Text weight="semibold">Courses</Text>
        </CardTitle>
        <CardContent className="space-y-2 p-0">
          {(employee.courses ?? []).length === 0 && (
            <Text size="sm" className="text-text-muted">
              No courses found for this employee.
            </Text>
          )}
          {(employee.courses ?? []).map((course) => (
            <div
              key={courseKey(course)}
              className="rounded-md border border-border px-3 py-2"
            >
              <div className="flex items-center justify-between gap-2">
                <Text weight="semibold">{course.course_name}</Text>
                <Badge>{course.degree_level}</Badge>
              </div>
              <Text size="sm" className="text-text-muted">
                Units: {course.units_completed ?? "N/A"} | Finished:{" "}
                {course.is_finished ? "Yes" : "No"}
              </Text>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={onOpenAdmin}>Take Action</Button>
      </div>
    </ModalShell>
  );
}
