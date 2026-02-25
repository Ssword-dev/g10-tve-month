import type { Employee } from "@/domain/employees/types";
import { useEffect, useState } from "react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/misc";

import { courseKey } from "@/pages/EmployeeDashboard/utils";
import { DeleteEmployeeConfirmModal } from "./DeleteEmployeeConfirmModal";
import { EmployeeDetailsCard } from "./EmployeeDetailsCard";
import { ModalShell } from "./ModalShell";
import {
  employeeIsAdminAction,
  removeAdminRoleAction,
} from "@/domain/auth/actions";

interface EmployeeInfoModalProps {
  employee: Employee | null;
  open: boolean;
  onClose: () => void;
  onOpenAdmin: () => void;
  onDeleteEmployee: (employeeNumber: number) => Promise<void>;
  canManageEmployees: boolean;
  showSensitiveFields: boolean;
}

export function EmployeeInfoModal({
  employee,
  open,
  onClose,
  onOpenAdmin,
  onDeleteEmployee,
  canManageEmployees,
  showSensitiveFields,
}: EmployeeInfoModalProps) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteErrorText, setDeleteErrorText] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [isRevokingAdminRole, setIsRevokingAdminRole] = useState(false);
  const [revokeErrorText, setRevokeErrorText] = useState("");
  const [revokeFeedback, setRevokeFeedback] = useState("");

  useEffect(() => {
    if (!open) {
      setConfirmDeleteOpen(false);
      setIsDeleting(false);
      setDeleteErrorText("");
      setRevokeErrorText("");
      setRevokeFeedback("");
    }
  }, [open, employee?.employee_number]);

  useEffect(() => {
    if (!open || !employee) {
      setIsAdmin(false);
      setIsAdminLoading(false);
      return;
    }

    let cancelled = false;

    const loadAdminStatus = async () => {
      setIsAdminLoading(true);

      try {
        const result = await employeeIsAdminAction({
          employee_number: employee.employee_number,
        });
        const status = result.unwrap();

        if (!cancelled) {
          setIsAdmin(Boolean(status.is_admin));
        }
      } catch {
        if (!cancelled) {
          setIsAdmin(false);
        }
      } finally {
        if (!cancelled) {
          setIsAdminLoading(false);
        }
      }
    };

    void loadAdminStatus();

    return () => {
      cancelled = true;
    };
  }, [open, employee?.employee_number]);

  if (!employee) return null;

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      setDeleteErrorText("");
      await onDeleteEmployee(employee.employee_number);
      setConfirmDeleteOpen(false);
    } catch (error) {
      setDeleteErrorText(
        error instanceof Error ? error.message : "Failed to delete employee.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const revokeAdminRole = async () => {
    if (!employee || isRevokingAdminRole) {
      return;
    }

    if (
      !window.confirm(
        "Revoke admin role for this employee? They will lose admin access.",
      )
    ) {
      return;
    }

    try {
      setIsRevokingAdminRole(true);
      setRevokeErrorText("");
      setRevokeFeedback("");

      const result = await removeAdminRoleAction({
        employee_number: employee.employee_number,
      });
      result.unwrap();

      setIsAdmin(false);
      setRevokeFeedback("Admin role revoked successfully.");
    } catch (error) {
      setRevokeErrorText(
        error instanceof Error ? error.message : "Failed to revoke admin role.",
      );
    } finally {
      setIsRevokingAdminRole(false);
    }
  };

  return (
    <>
      <ModalShell
        open={open}
        title={`Employee #${employee.employee_number}`}
        onRequestClose={onClose}
      >
        <EmployeeDetailsCard
          employee={employee}
          showSensitiveFields={showSensitiveFields}
        />
        <Card className="gap-3 border-border p-4">
          <CardTitle>
            <Text weight="semibold">Courses</Text>
          </CardTitle>
          <CardContent className="space-y-2 p-0">
            {(employee.courses ?? []).length === 0 && (
              <Text size="sm" className="text-muted-foreground">
                No courses found for this employee.
              </Text>
            )}
            {(employee.courses ?? []).map((course) => (
              <div
                key={courseKey(course)}
                className="rounded-md border border-border px-3 py-2"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Text weight="semibold">{course.course_name}</Text>
                  <Badge>{course.degree_level}</Badge>
                </div>
                <Text size="sm" className="text-muted-foreground">
                  Units: {course.units_completed ?? "N/A"} | Finished:{" "}
                  {course.is_finished ? "Yes" : "No"}
                </Text>
              </div>
            ))}
          </CardContent>
        </Card>
        {canManageEmployees && (
          <div className="flex flex-wrap justify-end gap-2 sm:gap-4">
            {!isAdminLoading && isAdmin ? (
              <Button
                className="w-full px-2 py-1 sm:w-auto"
                variant="outline"
                disabled={isRevokingAdminRole}
                onClick={() => void revokeAdminRole()}
              >
                {isRevokingAdminRole
                  ? "Revoking Admin Role..."
                  : "Revoke Admin Role"}
              </Button>
            ) : null}
            <Button
              className="w-full bg-primary px-2 py-1 text-primary-foreground sm:w-auto"
              onClick={onOpenAdmin}
            >
              Update Record
            </Button>
            <Button
              className="w-full bg-destructive px-2 py-1 text-destructive-foreground sm:w-auto"
              onClick={() => {
                setDeleteErrorText("");
                setConfirmDeleteOpen(true);
              }}
            >
              Delete Record
            </Button>
          </div>
        )}
        {revokeFeedback ? (
          <Text size="sm" className="text-success">
            {revokeFeedback}
          </Text>
        ) : null}
        {revokeErrorText ? (
          <Text size="sm" className="text-destructive">
            {revokeErrorText}
          </Text>
        ) : null}
      </ModalShell>

      <DeleteEmployeeConfirmModal
        open={confirmDeleteOpen && open}
        isDeleting={isDeleting}
        errorText={deleteErrorText}
        onCancel={() => {
          setDeleteErrorText("");
          setConfirmDeleteOpen(false);
        }}
        onConfirm={confirmDelete}
      />
    </>
  );
}
