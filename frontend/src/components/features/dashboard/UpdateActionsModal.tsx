import { useEffect, useState } from "react";

import unsafeCast from "@/utils/unsafeCast";
import {
  addCourseAction,
  deleteCourseAction,
  deleteEmployeeAction,
  updateCourseAction,
  updateEmployeeAction,
} from "@/domain/employees/actions";
import type { Course, Employee } from "@/domain/employees/types";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/misc";

import type {
  CourseFormState,
  EmployeeFormState,
  FieldErrorMap,
} from "@/pages/EmployeeDashboard/types";
import {
  courseKey,
  emptyCourseForm,
  toCoursePayload,
  toEmployeeFormState,
  toEmployeePayload,
  validateCourseForm,
  validateEmployeeForm,
} from "@/pages/EmployeeDashboard/utils";
import { CourseManagementSection } from "./CourseManagementSection";
import { DangerousActionSection } from "./DangerousActionSection";
import { EmployeeFormSection } from "./EmployeeFormSection";
import { ModalShell } from "./ModalShell";

interface AdminActionsModalProps {
  employee: Employee | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
}

export function UpdateActionsModal({
  employee,
  open,
  onClose,
  onSaved,
}: AdminActionsModalProps) {
  const [form, setForm] = useState<EmployeeFormState | null>(null);
  const [newCourse, setNewCourse] =
    useState<CourseFormState>(emptyCourseForm());
  const [editKey, setEditKey] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<CourseFormState>(emptyCourseForm());
  const [employeeErrors, setEmployeeErrors] = useState<FieldErrorMap>(
    {} as FieldErrorMap,
  );
  const [newCourseErrors, setNewCourseErrors] = useState<FieldErrorMap>(
    {} as FieldErrorMap,
  );
  const [editCourseErrors, setEditCourseErrors] = useState<FieldErrorMap>(
    {} as FieldErrorMap,
  );
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (!employee) return;
    setForm(toEmployeeFormState(employee));
    setNewCourse(emptyCourseForm());
    setEditKey(null);
    setEditForm(emptyCourseForm());
    setEmployeeErrors({} as FieldErrorMap);
    setNewCourseErrors({} as FieldErrorMap);
    setEditCourseErrors({} as FieldErrorMap);
    setFeedback("");
    setErrorText("");
  }, [employee]);

  if (!employee || !form) return null;

  const courses = employee.courses ?? [];
  const dirty =
    JSON.stringify(form) !== JSON.stringify(toEmployeeFormState(employee)) ||
    JSON.stringify(newCourse) !== JSON.stringify(emptyCourseForm()) ||
    editKey !== null;

  const tryClose = () => {
    if (busyAction) return;
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    onClose();
  };

  const saveEmployee = async () => {
    const errors = validateEmployeeForm(form);
    setEmployeeErrors(errors);
    if (Object.values(errors).some(Boolean)) return;
    try {
      setBusyAction("saveEmployee");
      setFeedback("");
      setErrorText("");
      const result = await updateEmployeeAction(
        toEmployeePayload(employee, form),
      );
      result.unwrap();
      await onSaved();
      setFeedback("Employee record updated successfully.");
    } catch (error) {
      setErrorText((error as Error).message);
    } finally {
      setBusyAction(null);
    }
  };

  const addCourse = async () => {
    const errors = validateCourseForm(newCourse, courses);
    setNewCourseErrors(errors);
    if (Object.values(errors).some(Boolean)) return;
    try {
      setBusyAction("addCourse");
      setFeedback("");
      setErrorText("");
      const result = await addCourseAction(
        toCoursePayload(employee.employee_number, newCourse),
      );
      result.unwrap();
      await onSaved();
      setNewCourse(emptyCourseForm());
      setFeedback("Course added successfully.");
    } catch (error) {
      setErrorText((error as Error).message);
    } finally {
      setBusyAction(null);
    }
  };

  const saveCourseEdit = async () => {
    if (!editKey) return;
    const existing = courses.find((course) => courseKey(course) === editKey);
    if (!existing) return;

    const errors = validateCourseForm(editForm, courses, editKey);
    setEditCourseErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    try {
      setBusyAction("saveCourseEdit");
      setFeedback("");
      setErrorText("");
      const result = await updateCourseAction({
        ...toCoursePayload(employee.employee_number, editForm),
        original_course_name: existing.course_name,
        original_degree_level: existing.degree_level,
      });
      result.unwrap();
      await onSaved();
      setEditKey(null);
      setFeedback("Course updated successfully.");
    } catch (error) {
      setErrorText((error as Error).message);
    } finally {
      setBusyAction(null);
    }
  };

  const deleteCourse = async (course: Course) => {
    if (
      !window.confirm(
        `Delete "${course.course_name}" (${course.degree_level})?`,
      )
    )
      return;

    try {
      const currentKey = courseKey(course);
      setBusyAction(`delete:${currentKey}`);
      setFeedback("");
      setErrorText("");
      const result = await deleteCourseAction({
        employee_number: employee.employee_number,
        course_name: course.course_name,
        degree_level: course.degree_level,
      });
      result.unwrap();
      await onSaved();
      if (editKey === currentKey) setEditKey(null);
      setFeedback("Course removed successfully.");
    } catch (error) {
      setErrorText((error as Error).message);
    } finally {
      setBusyAction(null);
    }
  };

  const deleteEmployee = async () => {
    if (!window.confirm("Delete this employee record permanently?")) return;

    try {
      setBusyAction("deleteEmployee");
      setFeedback("");
      setErrorText("");
      const result = await deleteEmployeeAction({
        employee_number: employee.employee_number,
      });
      result.unwrap();
      await onSaved();
      onClose();
    } catch (error) {
      setErrorText((error as Error).message);
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <ModalShell
      open={open}
      title={`Update Actions - ${employee.last_name}, ${employee.first_name}`}
      onRequestClose={tryClose}
      disableClose={Boolean(busyAction)}
      zClass="z-70"
    >
      {feedback && (
        <Card className="border-success/30 bg-success/10 p-3">
          <Text size="sm" className="text-success">
            {feedback}
          </Text>
        </Card>
      )}
      {errorText && (
        <Card className="border-destructive/30 bg-destructive/10 p-3">
          <Text size="sm" className="text-destructive">
            {errorText}
          </Text>
        </Card>
      )}

      <EmployeeFormSection
        form={form}
        setForm={unsafeCast(setForm)}
        errors={employeeErrors}
        onSave={saveEmployee}
        isSaving={busyAction === "saveEmployee"}
      />

      <CourseManagementSection
        courses={courses}
        newCourse={newCourse}
        setNewCourse={setNewCourse}
        newCourseErrors={newCourseErrors}
        onAddCourse={addCourse}
        addBusy={busyAction === "addCourse"}
        editKey={editKey}
        setEditKey={setEditKey}
        editForm={editForm}
        setEditForm={setEditForm}
        editErrors={editCourseErrors}
        onSaveEdit={saveCourseEdit}
        editBusy={busyAction === "saveCourseEdit"}
        onDeleteCourse={deleteCourse}
        deleteBusyKey={
          busyAction?.startsWith("delete:")
            ? busyAction.replace("delete:", "")
            : null
        }
      />

      <div className="border-t border-border pt-4">
        <DangerousActionSection
          onDeleteEmployee={deleteEmployee}
          isDeleting={busyAction === "deleteEmployee"}
        />
      </div>
    </ModalShell>
  );
}
