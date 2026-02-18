// ============================================================================
// React & Hooks
// ============================================================================
import {
  useEffect,
  useCallback,
  useState,
  type PropsWithChildren,
} from "react";

// ============================================================================
// External Dependencies
// ============================================================================
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { X, Pencil, Trash2, Plus, Filter } from "lucide-react";

// ============================================================================
// DnD Kit
// ============================================================================
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ============================================================================
// Utils
// ============================================================================
import { cn } from "@_ssword/classes";
import unsafeCast from "@/utils/unsafeCast";

// ============================================================================
// Domain/Features
// ============================================================================
import {
  addCourseAction,
  addEmployeeAction,
  deleteCourseAction,
  deleteEmployeeAction,
  updateCourseAction,
  updateEmployeeAction,
} from "@/domain/employees/actions";
import type { AddEmployeePayload } from "@/domain/employees/payloads";
import type {
  Employee,
  Course,
  DegreeLevel,
  FilterEmployeesPayload,
  FilterExpression,
  NumberComparison,
  AndFilter,
  OrFilter,
} from "@/domain/employees/types";

// ============================================================================
// Local Components
// ============================================================================
import Button from "@/components/Button";
import Card from "@/components/Card";
import CardAction from "@/components/CardAction";
import CardContent from "@/components/CardContent";
import CardHeader from "@/components/CardHeader";
import CardTitle from "@/components/CardTitle";
import Input from "@/components/Input";
import Label from "@/components/Label";
import Text from "@/components/Text";
import Badge from "@/components/Badge";
import Dialog from "@/components/Dialog";
import DialogPortal from "@/components/DialogPortal";
import DialogTrigger from "@/components/DialogTrigger";
import DialogContent from "@/components/DialogContent";
import Field from "@/components/Field";
import FieldLabel from "@/components/FieldLabel";
import FieldError from "@/components/FieldError";

// ============================================================================
// Types & Utils (Local)
// ============================================================================
import type {
  EmployeeFormState,
  FieldErrorMap,
  CourseFormState,
} from "./types";
import {
  courseKey,
  emptyCourseForm,
  toEmployeeFormState,
  validateEmployeeForm,
  toEmployeePayload,
  validateCourseForm,
  toCoursePayload,
} from "./utils";
import { employeeFormSchema } from "./schemas";
import { filterEmployeesQuery } from "./queries";

// ============================================================================
// Component Types
// ============================================================================
import type { ClassProps, Props } from "@/components/types";

function ModalShell({
  open,
  title,
  onRequestClose,
  disableClose = false,
  zClass = "z-60",
  children,
}: {
  open: boolean;
  title: string;
  onRequestClose: () => void;
  disableClose?: boolean;
  zClass?: string;
  children: React.ReactNode;
}) {
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
        className="h-[90vh] w-full max-w-6xl overflow-y-auto no-scrollbar border-border bg-surface p-0"
        onClick={(event) => event.stopPropagation()}
      >
        <CardHeader className="sticky top-0 z-10 flex flex-row items-center justify-between border-b border-border bg-surface px-5 py-3">
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

function EmployeeField({
  label,
  value,
  onChange,
  error,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: React.ComponentProps<typeof Input>["type"];
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && (
        <Text size="xs" className="text-danger">
          {error}
        </Text>
      )}
    </div>
  );
}
function EmployeeDetailsCard({ employee }: { employee: Employee }) {
  return (
    <div className="space-y-3 text-xs leading-relaxed">
      <section className="space-y-1.5">
        <Text size="xs" weight="semibold" className="text-accent">
          Personal Info
        </Text>
        <div className="space-y-1">
          <p>
            <span className="font-semibold">Full Name:</span>{" "}
            {employee.last_name}, {employee.first_name} {employee.middle_name}
          </p>
          <p>
            <span className="font-semibold">DepEd Email:</span>{" "}
            {employee.deped_email}
          </p>
          <p>
            <span className="font-semibold">Date of Birth / Civil Status:</span>{" "}
            {employee.date_of_birth} / {employee.civil_status}
          </p>
          <p>
            <span className="font-semibold">Address:</span> {employee.address}
          </p>
          <p>
            <span className="font-semibold">TIN / Place of Birth:</span>{" "}
            {employee.tin} / {employee.place_of_birth}
          </p>
        </div>
      </section>
      <section className="space-y-1.5 border-t border-border pt-2">
        <Text size="xs" weight="semibold" className="text-accent">
          Employment Info
        </Text>
        <div className="space-y-1">
          <p>
            <span className="font-semibold">Designation:</span>{" "}
            {employee.designation}
          </p>
          <p>
            <span className="font-semibold">Employment Status:</span>{" "}
            {employee.employment_status}
          </p>
          <p>
            <span className="font-semibold">Contact Number:</span>{" "}
            {employee.contact_number}
          </p>
          <p>
            <span className="font-semibold">Plantilla # / BP #:</span>{" "}
            {employee.plantilla_number} / {employee.bp_number}
          </p>
          <p>
            <span className="font-semibold">
              Date Joined / Latest Promotion / Original Appointment:
            </span>{" "}
            {employee.date_joined} / {employee.date_of_latest_promotion} /{" "}
            {employee.date_of_original_appointment}
          </p>
        </div>
      </section>
      <section className="space-y-1.5 border-t border-border pt-2">
        <Text size="xs" weight="semibold" className="text-accent">
          Payroll Info
        </Text>
        <p>
          <span className="font-semibold">Salary Grade + Salary:</span> SG{" "}
          {employee.salary_grade} + PHP {employee.salary}
        </p>
      </section>
    </div>
  );
}

function EmployeeInfoModal({
  employee,
  open,
  onClose,
  onOpenAdmin,
}: {
  employee: Employee | null;
  open: boolean;
  onClose: () => void;
  onOpenAdmin: () => void;
}) {
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

function EmployeeFormSection({
  form,
  setForm,
  errors,
  onSave,
  isSaving,
}: {
  form: EmployeeFormState;
  setForm: React.Dispatch<React.SetStateAction<EmployeeFormState>>;
  errors: FieldErrorMap;
  onSave: () => Promise<void>;
  isSaving: boolean;
}) {
  return (
    <Card className="gap-3 border-border p-4">
      <CardTitle>
        <Text weight="semibold">Edit Employee Attributes</Text>
      </CardTitle>
      <CardContent className="grid grid-cols-1 gap-3 p-0 md:grid-cols-2">
        <EmployeeField
          label="First Name"
          value={form.first_name}
          error={errors.first_name}
          onChange={(v) => setForm((s) => ({ ...s, first_name: v }))}
        />
        <EmployeeField
          label="Middle Name"
          value={form.middle_name}
          onChange={(v) => setForm((s) => ({ ...s, middle_name: v }))}
        />
        <EmployeeField
          label="Last Name"
          value={form.last_name}
          error={errors.last_name}
          onChange={(v) => setForm((s) => ({ ...s, last_name: v }))}
        />
        <EmployeeField
          label="DepEd Email"
          value={form.deped_email}
          onChange={(v) => setForm((s) => ({ ...s, deped_email: v }))}
        />
        <EmployeeField
          label="Designation"
          value={form.designation}
          error={errors.designation}
          onChange={(v) => setForm((s) => ({ ...s, designation: v }))}
        />
        <EmployeeField
          label="Employment Status"
          value={form.employment_status}
          error={errors.employment_status}
          onChange={(v) => setForm((s) => ({ ...s, employment_status: v }))}
        />
        <EmployeeField
          label="Date Joined"
          type="date"
          value={form.date_joined}
          error={errors.date_joined}
          onChange={(v) => setForm((s) => ({ ...s, date_joined: v }))}
        />
        <EmployeeField
          label="Latest Promotion"
          type="date"
          value={form.date_of_latest_promotion}
          error={errors.date_of_latest_promotion}
          onChange={(v) =>
            setForm((s) => ({ ...s, date_of_latest_promotion: v }))
          }
        />
        <EmployeeField
          label="Original Appointment"
          type="date"
          value={form.date_of_original_appointment}
          error={errors.date_of_original_appointment}
          onChange={(v) =>
            setForm((s) => ({ ...s, date_of_original_appointment: v }))
          }
        />
        <EmployeeField
          label="Date of Birth"
          type="date"
          value={form.date_of_birth}
          error={errors.date_of_birth}
          onChange={(v) => setForm((s) => ({ ...s, date_of_birth: v }))}
        />
        <EmployeeField
          label="Contact Number"
          value={form.contact_number}
          onChange={(v) => setForm((s) => ({ ...s, contact_number: v }))}
        />
        <EmployeeField
          label="Plantilla Number"
          value={form.plantilla_number}
          onChange={(v) => setForm((s) => ({ ...s, plantilla_number: v }))}
        />
        <EmployeeField
          label="BP Number"
          type="number"
          value={form.bp_number}
          error={errors.bp_number}
          onChange={(v) => setForm((s) => ({ ...s, bp_number: v }))}
        />
        <EmployeeField
          label="Salary Grade"
          type="number"
          value={form.salary_grade}
          error={errors.salary_grade}
          onChange={(v) => setForm((s) => ({ ...s, salary_grade: v }))}
        />
        <EmployeeField
          label="Salary"
          value={form.salary}
          onChange={(v) => setForm((s) => ({ ...s, salary: v }))}
        />
        <EmployeeField
          label="Address"
          value={form.address}
          onChange={(v) => setForm((s) => ({ ...s, address: v }))}
        />
        <EmployeeField
          label="Civil Status"
          value={form.civil_status}
          onChange={(v) => setForm((s) => ({ ...s, civil_status: v }))}
        />
        <EmployeeField
          label="TIN"
          value={form.tin}
          onChange={(v) => setForm((s) => ({ ...s, tin: v }))}
        />
        <EmployeeField
          label="Place of Birth"
          value={form.place_of_birth}
          onChange={(v) => setForm((s) => ({ ...s, place_of_birth: v }))}
        />
      </CardContent>
      <CardAction className="sticky bottom-0 bg-surface/95 py-3">
        <Button disabled={isSaving} onClick={() => void onSave()}>
          Save Employee
        </Button>
      </CardAction>
    </Card>
  );
}
function CourseManagementSection({
  courses,
  newCourse,
  setNewCourse,
  newCourseErrors,
  onAddCourse,
  addBusy,
  editKey,
  setEditKey,
  editForm,
  setEditForm,
  editErrors,
  onSaveEdit,
  editBusy,
  onDeleteCourse,
  deleteBusyKey,
}: {
  courses: Course[];
  newCourse: CourseFormState;
  setNewCourse: React.Dispatch<React.SetStateAction<CourseFormState>>;
  newCourseErrors: FieldErrorMap;
  onAddCourse: () => Promise<void>;
  addBusy: boolean;
  editKey: string | null;
  setEditKey: React.Dispatch<React.SetStateAction<string | null>>;
  editForm: CourseFormState;
  setEditForm: React.Dispatch<React.SetStateAction<CourseFormState>>;
  editErrors: FieldErrorMap;
  onSaveEdit: () => Promise<void>;
  editBusy: boolean;
  onDeleteCourse: (course: Course) => Promise<void>;
  deleteBusyKey: string | null;
}) {
  return (
    <>
      <Card className="gap-3 border-border p-4">
        <CardTitle>
          <Text weight="semibold">Add Course</Text>
        </CardTitle>
        <CardContent className="grid grid-cols-1 gap-3 p-0 md:grid-cols-2">
          <EmployeeField
            label="Course Name"
            value={newCourse.course_name}
            error={newCourseErrors.course_name}
            onChange={(v) => setNewCourse((s) => ({ ...s, course_name: v }))}
          />
          <div className="space-y-1">
            <Label>Degree Level</Label>
            <select
              className="bg-surface border-border rounded-lg border px-2.5 py-1 text-sm"
              value={newCourse.degree_level}
              onChange={(event) =>
                setNewCourse((s) => ({
                  ...s,
                  degree_level: event.target.value as DegreeLevel,
                }))
              }
            >
              <option value="bachelor">bachelor</option>
              <option value="master">master</option>
              <option value="doctorate">doctorate</option>
            </select>
            {newCourseErrors.degree_level && (
              <Text size="xs" className="text-danger">
                {newCourseErrors.degree_level}
              </Text>
            )}
          </div>
          <EmployeeField
            label="Units Completed"
            type="number"
            value={newCourse.units_completed}
            error={newCourseErrors.units_completed}
            onChange={(v) =>
              setNewCourse((s) => ({ ...s, units_completed: v }))
            }
          />
          <div className="flex items-center gap-2 pt-7">
            <input
              id="course-finished-new"
              type="checkbox"
              checked={newCourse.is_finished}
              onChange={(event) =>
                setNewCourse((s) => ({
                  ...s,
                  is_finished: event.target.checked,
                }))
              }
            />
            <Label htmlFor="course-finished-new">Course Finished</Label>
          </div>
        </CardContent>
        <CardAction>
          <Button disabled={addBusy} onClick={() => void onAddCourse()}>
            Add Course
          </Button>
        </CardAction>
      </Card>

      <Card className="gap-3 border-border p-4">
        <CardTitle>
          <Text weight="semibold">Existing Courses</Text>
        </CardTitle>
        <CardContent className="space-y-3 p-0">
          {courses.length === 0 && (
            <Text size="sm" className="text-text-muted">
              No courses available.
            </Text>
          )}
          {courses.map((course) => {
            const currentKey = courseKey(course);
            const isEditing = editKey === currentKey;
            return (
              <div
                key={currentKey}
                className="rounded-md border border-border p-3"
              >
                {!isEditing && (
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Text weight="semibold">{course.course_name}</Text>
                      <Text size="sm" className="text-text-muted">
                        {course.degree_level} | Units:{" "}
                        {course.units_completed ?? "N/A"} | Finished:{" "}
                        {course.is_finished ? "Yes" : "No"}
                      </Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        className="px-2 py-2"
                        onClick={() => {
                          setEditKey(currentKey);
                          setEditForm({
                            course_name: course.course_name,
                            degree_level: course.degree_level,
                            units_completed:
                              course.units_completed == null
                                ? ""
                                : String(course.units_completed),
                            is_finished: Boolean(course.is_finished),
                          });
                        }}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        className="px-2 py-2"
                        disabled={deleteBusyKey === currentKey}
                        onClick={() => void onDeleteCourse(course)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {isEditing && (
                  <div className="space-y-3">
                    <Badge>Edit Mode</Badge>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <EmployeeField
                        label="Course Name"
                        value={editForm.course_name}
                        error={editErrors.course_name}
                        onChange={(v) =>
                          setEditForm((s) => ({ ...s, course_name: v }))
                        }
                      />
                      <div className="space-y-1">
                        <Label>Degree Level</Label>
                        <select
                          className="bg-surface border-border rounded-lg border px-2.5 py-1 text-sm"
                          value={editForm.degree_level}
                          onChange={(event) =>
                            setEditForm((s) => ({
                              ...s,
                              degree_level: event.target.value as DegreeLevel,
                            }))
                          }
                        >
                          <option value="bachelor">bachelor</option>
                          <option value="master">master</option>
                          <option value="doctorate">doctorate</option>
                        </select>
                        {editErrors.degree_level && (
                          <Text size="xs" className="text-danger">
                            {editErrors.degree_level}
                          </Text>
                        )}
                      </div>
                      <EmployeeField
                        label="Units Completed"
                        type="number"
                        value={editForm.units_completed}
                        error={editErrors.units_completed}
                        onChange={(v) =>
                          setEditForm((s) => ({ ...s, units_completed: v }))
                        }
                      />
                      <div className="flex items-center gap-2 pt-7">
                        <input
                          id={`course-finished-${currentKey}`}
                          type="checkbox"
                          checked={editForm.is_finished}
                          onChange={(event) =>
                            setEditForm((s) => ({
                              ...s,
                              is_finished: event.target.checked,
                            }))
                          }
                        />
                        <Label htmlFor={`course-finished-${currentKey}`}>
                          Course Finished
                        </Label>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        disabled={editBusy}
                        onClick={() => void onSaveEdit()}
                      >
                        Save Course
                      </Button>
                      <Button
                        variant="glass"
                        disabled={editBusy}
                        onClick={() => setEditKey(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </>
  );
}

function DangerousActionSection({
  employeeNumber,
}: {
  employeeNumber: number;
}) {
  const deleteEmployee = useCallback(() => {
    deleteEmployeeAction({ employee_number: employeeNumber });
    filterEmployeesQuery.refresh();
  }, [employeeNumber]);

  return (
    <Card className="gap-3 border-border p-4">
      <CardTitle>
        <Text weight="semibold" className="text-danger">
          Dangerous Actions
        </Text>
      </CardTitle>
      <CardContent className="grid grid-cols-1 gap-3 p-0 md:grid-cols-2">
        <Button className="bg-danger text-text" onClick={deleteEmployee}>
          Delete Employee
        </Button>
      </CardContent>
    </Card>
  );
}

function AdminActionsModal({
  employee,
  open,
  onClose,
  onSaved,
}: {
  employee: Employee | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
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

  return (
    <ModalShell
      open={open}
      title={`Admin Actions - ${employee.last_name}, ${employee.first_name}`}
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
        <Card className="border-danger/30 bg-danger/10 p-3">
          <Text size="sm" className="text-danger">
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

      <DangerousActionSection employeeNumber={employee.employee_number} />
    </ModalShell>
  );
}

interface FieldDefinition<TKey extends string> extends Props<typeof Input> {
  name: TKey;
  type?: Props<typeof Input>["type"];
  label: string;
}
function AddEmployeeForm({ closeModal }: { closeModal: () => void }) {
  const [currentPage, setCurrentPage] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<EmployeeFormState>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      deped_email: "",
      designation: "",
      employment_status: "",
      date_joined: "",
      date_of_latest_promotion: "",
      date_of_original_appointment: "",
      date_of_birth: "",
      contact_number: "",
      plantilla_number: "",
      bp_number: "",
      salary_grade: 1,
      salary: "",
      address: "",
      civil_status: "",
      tin: "",
      place_of_birth: "",
    },
  });

  const submitEmployeePayload = async (data: EmployeeFormState) => {
    try {
      const result = await addEmployeeAction({ ...data, courses: [] });
      result.unwrap();
      filterEmployeesQuery.refresh();
      closeModal();
    } catch (error) {
      console.error("Failed to add employee:", error);
    }
  };

  // #region Field Categories as array of pages
  const fieldCategories = [
    // Page 0: Personal Information
    [
      {
        name: "first_name",
        label: "First Name",
        placeholder: "Enter first name",
        required: true,
      },
      {
        name: "middle_name",
        label: "Middle Name",
        placeholder: "Enter middle name",
      },
      {
        name: "last_name",
        label: "Last Name",
        placeholder: "Enter last name",
        required: true,
      },
      { name: "date_of_birth", label: "Date of Birth", type: "date" },
      {
        name: "place_of_birth",
        label: "Place of Birth",
        placeholder: "Enter place of birth",
      },
      {
        name: "civil_status",
        label: "Civil Status",
        placeholder: "Enter civil status",
      },
      { name: "tin", label: "TIN", placeholder: "Enter TIN" },
    ],
    // Page 1: Contact Information
    [
      {
        name: "deped_email",
        label: "DepEd Email",
        type: "email",
        placeholder: "Enter DepEd email",
      },
      {
        name: "contact_number",
        label: "Contact Number",
        placeholder: "Enter contact number",
      },
      { name: "address", label: "Address", placeholder: "Enter address" },
    ],
    // Page 2: Employment Details
    [
      {
        name: "designation",
        label: "Designation",
        placeholder: "Enter designation",
        required: true,
      },
      {
        name: "employment_status",
        label: "Employment Status",
        placeholder: "Enter employment status",
        required: true,
      },
      { name: "date_joined", label: "Date Joined", type: "date" },
      {
        name: "date_of_latest_promotion",
        label: "Latest Promotion",
        type: "date",
      },
      {
        name: "date_of_original_appointment",
        label: "Original Appointment",
        type: "date",
      },
      {
        name: "plantilla_number",
        label: "Plantilla Number",
        placeholder: "Enter plantilla number",
      },
    ],
    // Page 3: Compensation
    [
      {
        name: "salary_grade",
        label: "Salary Grade",
        type: "number",
        placeholder: "Enter salary grade",
      },
      { name: "salary", label: "Salary", placeholder: "Enter salary" },
      {
        name: "bp_number",
        label: "BP Number",
        type: "number",
        placeholder: "Enter BP number",
      },
    ],
  ] as const;
  // #endregion

  const FormField = ({
    name,
    label,
    type,
    placeholder,
    required,
  }: FieldDefinition<keyof AddEmployeePayload>) => {
    return (
      <Controller
        key={name}
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <Field className="grid gap-1.5">
            <FieldLabel
              htmlFor={name}
              className="text-sm font-medium text-text-muted"
            >
              {label}
              {required && <span className="text-danger ml-1">*</span>}
            </FieldLabel>
            <Input
              id={name}
              {...field}
              type={type || "text"}
              placeholder={placeholder}
              aria-invalid={!!fieldState.error}
              value={field.value ?? ""}
              className={cn(
                "bg-surface border-border text-text placeholder:text-text-muted/50",
                "focus:border-primary focus:ring-1 focus:ring-primary/30",
                "transition-colors duration-200",
                fieldState.error &&
                  "border-danger focus:border-danger focus:ring-danger/30",
              )}
            />
            <FieldError errors={fieldState.error ? [fieldState.error] : []} />
          </Field>
        )}
      />
    );
  };

  const handleNext = () => {
    if (currentPage < fieldCategories.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const isLastPage = currentPage === fieldCategories.length - 1;
  const isFirstPage = currentPage === 0;

  return (
    <Card
      asChild
      className="w-full h-full border-border bg-surface shadow-lg overflow-hidden"
    >
      <form onSubmit={handleSubmit(submitEmployeePayload)}>
        <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
          <CardTitle className="text-xl font-semibold text-text">
            Add New Employee
          </CardTitle>
        </CardHeader>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 px-6 pt-3">
          {fieldCategories.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1.5 w-6 rounded-full transition-colors",
                index === currentPage
                  ? "bg-primary"
                  : index < currentPage
                    ? "bg-primary/40"
                    : "bg-border",
              )}
            />
          ))}
        </div>

        <CardContent className="flex-1 px-6 py-2 overflow-y-auto">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {fieldCategories[currentPage].map((fieldDefinition) => (
              <FormField key={fieldDefinition.name} {...fieldDefinition} />
            ))}
          </div>
        </CardContent>

        <CardAction className="flex justify-between border-t border-border bg-muted/20 px-6 py-2">
          <div>
            {!isFirstPage && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                className="border-border bg-surface text-text hover:bg-muted"
              >
                Previous
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            {!isLastPage ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-primary text-background hover:bg-primary/90"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-background hover:bg-primary/90"
              >
                {isSubmitting ? "Saving..." : "Save Employee"}
              </Button>
            )}
          </div>
        </CardAction>
      </form>
    </Card>
  );
}

function TableToolButton({
  children,
  className,
  ...props
}: Props<typeof Button> & ClassProps) {
  return (
    <Button
      className={cn(
        "h-12 w-12 rounded-full bg-primary p-0 text-background shadow-md",
        "hover:bg-primary/90 hover:shadow-lg active:scale-95",
        "transition-all duration-200",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

function AddEmployeeButton() {
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
      <DialogContent className="w-[80vw] h-[80vh] border-border bg-background p-0 shadow-2xl">
        <AddEmployeeForm closeModal={closeModal} />
      </DialogContent>
    </Dialog>
  );
}

// #section Filter Modal

// ============================================================================
// Draggable Filter Item Components
// ============================================================================

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing p-1 text-text-muted hover:text-text"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <div className="pl-6">{children}</div>
    </div>
  );
}

// ============================================================================
// Field Selector
// ============================================================================

interface FieldSelectorProps {
  value: keyof Employee;
  onChange: (value: keyof Employee) => void;
}

const employeeFields: { value: keyof Employee; label: string; type: string }[] =
  [
    { value: "first_name", label: "First Name", type: "string" },
    { value: "middle_name", label: "Middle Name", type: "string" },
    { value: "last_name", label: "Last Name", type: "string" },
    { value: "deped_email", label: "DepEd Email", type: "string" },
    { value: "employee_number", label: "Employee #", type: "number" },
    { value: "designation", label: "Designation", type: "string" },
    { value: "date_joined", label: "Date Joined", type: "date" },
    {
      value: "date_of_latest_promotion",
      label: "Latest Promotion",
      type: "date",
    },
    { value: "contact_number", label: "Contact #", type: "string" },
    { value: "plantilla_number", label: "Plantilla #", type: "string" },
    {
      value: "date_of_original_appointment",
      label: "Original Appointment",
      type: "date",
    },
    { value: "bp_number", label: "BP #", type: "number" },
    { value: "address", label: "Address", type: "string" },
    { value: "civil_status", label: "Civil Status", type: "string" },
    { value: "date_of_birth", label: "Date of Birth", type: "date" },
    { value: "salary_grade", label: "Salary Grade", type: "number" },
    { value: "salary", label: "Salary", type: "string" },
    { value: "employment_status", label: "Employment Status", type: "string" },
    { value: "tin", label: "TIN", type: "string" },
    { value: "place_of_birth", label: "Place of Birth", type: "string" },
  ];

function FieldSelector({ value, onChange }: FieldSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as keyof Employee)}
      className="bg-surface border-border rounded-lg border px-3 py-1.5 text-sm"
    >
      {employeeFields.map((field) => (
        <option key={field.value} value={field.value}>
          {field.label}
        </option>
      ))}
    </select>
  );
}

// ============================================================================
// Operator Selector
// ============================================================================

interface OperatorSelectorProps {
  fieldType: string;
  value: string;
  onChange: (value: any) => void;
}

const numberOperators = [
  { value: "eq", label: "equals" },
  { value: "neq", label: "not equals" },
  { value: "gt", label: "greater than" },
  { value: "gte", label: "greater than or equal" },
  { value: "lt", label: "less than" },
  { value: "lte", label: "less than or equal" },
  { value: "between", label: "between" },
];

const stringOperators = [
  { value: "eq", label: "equals" },
  { value: "neq", label: "not equals" },
  { value: "contains", label: "contains" },
  { value: "startsWith", label: "starts with" },
  { value: "endsWith", label: "ends with" },
  { value: "in", label: "is any of" },
];

const dateOperators = [
  { value: "eq", label: "on" },
  { value: "neq", label: "not on" },
  { value: "gt", label: "after" },
  { value: "gte", label: "on or after" },
  { value: "lt", label: "before" },
  { value: "lte", label: "on or before" },
  { value: "between", label: "between" },
];

const booleanOperators = [
  { value: "eq", label: "is" },
  { value: "neq", label: "is not" },
];

function OperatorSelector({
  fieldType,
  value,
  onChange,
}: OperatorSelectorProps) {
  const operators =
    fieldType === "number"
      ? numberOperators
      : fieldType === "date"
        ? dateOperators
        : fieldType === "boolean"
          ? booleanOperators
          : stringOperators;

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-surface border-border rounded-lg border px-3 py-1.5 text-sm"
    >
      {operators.map((op) => (
        <option key={op.value} value={op.value}>
          {op.label}
        </option>
      ))}
    </select>
  );
}

// ============================================================================
// Value Input Component
// ============================================================================

interface ValueInputProps {
  fieldType: string;
  operator: string;
  value: any;
  onChange: (value: any) => void;
}

function ValueInput({ fieldType, operator, value, onChange }: ValueInputProps) {
  // Null check operators don't need value input
  if (operator === "is_null" || operator === "not_null") {
    return <div className="text-sm text-text-muted px-3">(no value)</div>;
  }

  // Between operator shows two inputs
  if (operator === "between") {
    return (
      <div className="flex items-center gap-2">
        <Input
          type={
            fieldType === "date"
              ? "date"
              : fieldType === "number"
                ? "number"
                : "text"
          }
          placeholder={fieldType === "date" ? "From" : "Min"}
          value={value?.min || ""}
          onChange={(e) => onChange({ ...value, min: e.target.value })}
          className="w-28"
        />
        <span className="text-text-muted">and</span>
        <Input
          type={
            fieldType === "date"
              ? "date"
              : fieldType === "number"
                ? "number"
                : "text"
          }
          placeholder={fieldType === "date" ? "To" : "Max"}
          value={value?.max || ""}
          onChange={(e) => onChange({ ...value, max: e.target.value })}
          className="w-28"
        />
      </div>
    );
  }

  // In operator shows comma-separated values
  if (operator === "in") {
    return (
      <Input
        placeholder="Comma-separated values"
        value={Array.isArray(value) ? value.join(", ") : value || ""}
        onChange={(e) =>
          onChange(e.target.value.split(",").map((v) => v.trim()))
        }
        className="w-48"
      />
    );
  }

  // Single value input
  return (
    <Input
      type={
        fieldType === "date"
          ? "date"
          : fieldType === "number"
            ? "number"
            : "text"
      }
      placeholder="Enter value"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-32"
    />
  );
}

// ============================================================================
// Filter Condition Component
// ============================================================================

interface FilterConditionProps {
  id: string;
  filter: AnyFieldFilter;
  onChange: (filter: AnyFieldFilter) => void;
  onRemove: () => void;
}

function FilterCondition({
  id,
  filter,
  onChange,
  onRemove,
}: FilterConditionProps) {
  const fieldInfo = employeeFields.find((f) => f.value === filter.field);
  const fieldType = fieldInfo?.type || "string";

  const updateComparison = (comparison: any, index: number) => {
    const newComparisons = [...(filter.comparisons || [])];
    newComparisons[index] = comparison;
    onChange({ ...filter, comparisons: newComparisons });
  };

  const removeComparison = (index: number) => {
    const newComparisons = filter.comparisons?.filter((_, i) => i !== index);
    onChange({ ...filter, comparisons: newComparisons });
  };

  const addComparison = () => {
    const defaultComparison: NumberComparison = {
      type: "eq",
      operand: 0,
    };
    onChange({
      ...filter,
      comparisons: [...(filter.comparisons || []), defaultComparison],
    });
  };

  const toggleNull = () => {
    if (filter.null) {
      const { null: _, ...rest } = filter;
      onChange(rest);
    } else {
      onChange({ ...filter, null: { is_null: true } });
    }
  };

  return (
    <SortableItem id={id}>
      <Card className="border-border bg-surface p-3">
        <div className="space-y-3">
          {/* Field and null toggle */}
          <div className="flex items-center gap-2">
            <FieldSelector
              value={filter.field}
              onChange={(field) => onChange({ ...filter, field })}
            />
            <Button
              type="button"
              variant={filter.null ? "default" : "outline"}
              size="sm"
              onClick={toggleNull}
              className={cn(
                "text-xs",
                filter.null && "bg-primary text-background",
              )}
            >
              {filter.null?.is_null
                ? "IS NULL"
                : filter.null
                  ? "NOT NULL"
                  : "Nullable"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="ml-auto text-text-muted hover:text-danger"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Comparisons */}
          {!filter.null && (
            <div className="space-y-2 pl-2">
              {filter.comparisons?.map((comp, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <OperatorSelector
                    fieldType={fieldType}
                    value={comp.type}
                    onChange={(type) =>
                      updateComparison({ ...comp, type }, idx)
                    }
                  />
                  <ValueInput
                    fieldType={fieldType}
                    operator={comp.type}
                    value={
                      "operand" in comp
                        ? comp.operand
                        : "min" in comp
                          ? { min: comp.min, max: comp.max }
                          : comp.operands
                    }
                    onChange={(val) => {
                      if (comp.type === "between") {
                        updateComparison(
                          { ...comp, min: val.min, max: val.max },
                          idx,
                        );
                      } else if (comp.type === "in") {
                        updateComparison({ ...comp, operands: val }, idx);
                      } else {
                        updateComparison({ ...comp, operand: val }, idx);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeComparison(idx)}
                    className="text-text-muted hover:text-danger"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addComparison}
                className="text-xs text-primary"
              >
                + Add condition
              </Button>
            </div>
          )}
        </div>
      </Card>
    </SortableItem>
  );
}

// ============================================================================
// Logical Group Component
// ============================================================================

interface LogicalGroupProps {
  id: string;
  group: AndFilter | OrFilter;
  onChange: (group: AndFilter | OrFilter) => void;
  onRemove: () => void;
  level?: number;
}

function LogicalGroup({
  id,
  group,
  onChange,
  onRemove,
  level = 0,
}: LogicalGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const addFilter = () => {
    const newFilter: AnyFieldFilter = {
      field: "first_name",
      comparisons: [{ type: "eq", operand: "" }],
    };
    onChange({
      ...group,
      filters: [...group.filters, newFilter],
    });
  };

  const updateFilter = (index: number, filter: FilterExpression) => {
    const newFilters = [...group.filters];
    newFilters[index] = filter;
    onChange({ ...group, filters: newFilters });
  };

  const removeFilter = (index: number) => {
    const newFilters = group.filters.filter((_, i) => i !== index);
    onChange({ ...group, filters: newFilters });
  };

  const toggleType = () => {
    const newType = group.type === "and" ? "or" : "and";
    onChange({
      type: newType,
      filters: group.filters,
    } as AndFilter | OrFilter);
  };

  return (
    <SortableItem id={id}>
      <Card className={cn("border-border bg-surface/50", level > 0 && "ml-6")}>
        <CardContent className="p-3">
          <div className="space-y-3">
            {/* Group header */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-text-muted hover:text-text"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              <Badge
                className={cn(
                  "cursor-pointer",
                  group.type === "and"
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary/20 text-secondary",
                )}
                onClick={toggleType}
              >
                {group.type.toUpperCase()}
              </Badge>
              <Text size="sm" className="text-text-muted">
                group
              </Text>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="ml-auto text-text-muted hover:text-danger"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Group content */}
            {isExpanded && (
              <div className="space-y-2 pl-6">
                <DndContext
                  sensors={useSensors(
                    useSensor(PointerSensor),
                    useSensor(KeyboardSensor, {
                      coordinateGetter: sortableKeyboardCoordinates,
                    }),
                  )}
                  collisionDetection={closestCenter}
                  onDragEnd={(event) => {
                    const { active, over } = event;
                    if (over && active.id !== over.id) {
                      const oldIndex = group.filters.findIndex(
                        (_, i) => `filter-${i}` === active.id,
                      );
                      const newIndex = group.filters.findIndex(
                        (_, i) => `filter-${i}` === over.id,
                      );
                      onChange({
                        ...group,
                        filters: arrayMove(group.filters, oldIndex, newIndex),
                      });
                    }
                  }}
                >
                  <SortableContext
                    items={group.filters.map((_, i) => `filter-${i}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    {group.filters.map((filter, index) => (
                      <div key={index}>
                        {"field" in filter ? (
                          <FilterCondition
                            id={`filter-${index}`}
                            filter={filter}
                            onChange={(f) => updateFilter(index, f)}
                            onRemove={() => removeFilter(index)}
                          />
                        ) : (
                          <LogicalGroup
                            id={`filter-${index}`}
                            group={filter as AndFilter | OrFilter}
                            onChange={(g) => updateFilter(index, g)}
                            onRemove={() => removeFilter(index)}
                            level={level + 1}
                          />
                        )}
                      </div>
                    ))}
                  </SortableContext>
                </DndContext>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addFilter}
                  className="text-xs text-primary"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add filter
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </SortableItem>
  );
}

// ============================================================================
// Sort Fields Component
// ============================================================================

interface SortFieldProps {
  basis: keyof Employee;
  direction: "asc" | "desc";
  onChange: (basis: keyof Employee, direction: "asc" | "desc") => void;
  onRemove: () => void;
}

function SortField({ basis, direction, onChange, onRemove }: SortFieldProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-surface border-border rounded-lg border">
      <select
        value={basis}
        onChange={(e) => onChange(e.target.value as keyof Employee, direction)}
        className="bg-transparent border-none text-sm focus:outline-none"
      >
        {employeeFields.map((field) => (
          <option key={field.value} value={field.value}>
            {field.label}
          </option>
        ))}
      </select>
      <select
        value={direction}
        onChange={(e) => onChange(basis, e.target.value as "asc" | "desc")}
        className="bg-transparent border-none text-sm focus:outline-none"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="text-text-muted hover:text-danger"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

// ============================================================================
// Field Selection Component
// ============================================================================

interface FieldSelectionProps {
  fields: {
    include: (keyof Employee)[] | "ALL";
    exclude: (keyof Employee)[] | "NONE";
  };
  onChange: (fields: {
    include: (keyof Employee)[] | "ALL";
    exclude: (keyof Employee)[] | "NONE";
  }) => void;
}

function FieldSelection({ fields, onChange }: FieldSelectionProps) {
  const [mode, setMode] = useState<"include" | "exclude">(
    fields.include !== "ALL" ? "include" : "exclude",
  );

  const toggleField = (field: keyof Employee) => {
    if (mode === "include") {
      const current = fields.include === "ALL" ? [] : fields.include;
      const newInclude = current.includes(field)
        ? current.filter((f) => f !== field)
        : [...current, field];
      onChange({
        include: newInclude.length ? newInclude : "ALL",
        exclude: "NONE",
      });
    } else {
      const current = fields.exclude === "NONE" ? [] : fields.exclude;
      const newExclude = current.includes(field)
        ? current.filter((f) => f !== field)
        : [...current, field];
      onChange({
        include: "ALL",
        exclude: newExclude.length ? newExclude : "NONE",
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={mode === "include" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("include")}
          className="text-xs"
        >
          Include
        </Button>
        <Button
          type="button"
          variant={mode === "exclude" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("exclude")}
          className="text-xs"
        >
          Exclude
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border-border rounded-lg border">
        {employeeFields.map((field) => {
          const isSelected =
            mode === "include"
              ? fields.include !== "ALL" && fields.include.includes(field.value)
              : fields.exclude !== "NONE" &&
                fields.exclude.includes(field.value);

          return (
            <label
              key={field.value}
              className={cn(
                "flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors",
                isSelected
                  ? "bg-primary/10 border-primary/30 border"
                  : "hover:bg-muted/30",
              )}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleField(field.value)}
                className="rounded border-border text-primary focus:ring-primary/30"
              />
              <span className="text-sm">{field.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Main Filter Modal Component
// ============================================================================

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filter: FilterEmployeesPayload) => void;
  initialFilter?: FilterEmployeesPayload;
}

export function FilterModal({
  open,
  onClose,
  onApply,
  initialFilter,
}: FilterModalProps) {
  const [filter, setFilter] = useState<FilterEmployeesPayload>(
    initialFilter || {
      where: {
        type: "and",
        filters: [],
      },
      page: 1,
      limit: 50,
      sort: [],
      fields: {
        include: "ALL",
        exclude: "NONE",
      },
    },
  );

  const addRootFilter = () => {
    const newFilter: AnyFieldFilter = {
      field: "first_name",
      comparisons: [{ type: "eq", operand: "" }],
    };

    if (!filter.where) {
      setFilter({
        ...filter,
        where: newFilter,
      });
    } else if ("type" in filter.where) {
      setFilter({
        ...filter,
        where: {
          ...filter.where,
          filters: [
            ...(filter.where as AndFilter | OrFilter).filters,
            newFilter,
          ],
        },
      });
    }
  };

  const updateRootFilter = (where: FilterExpression) => {
    setFilter({ ...filter, where });
  };

  const addSort = () => {
    setFilter({
      ...filter,
      sort: [...(filter.sort || []), { basis: "last_name", direction: "asc" }],
    });
  };

  const updateSort = (
    index: number,
    basis: keyof Employee,
    direction: "asc" | "desc",
  ) => {
    const newSort = [...(filter.sort || [])];
    newSort[index] = { basis, direction };
    setFilter({ ...filter, sort: newSort });
  };

  const removeSort = (index: number) => {
    const newSort = filter.sort?.filter((_, i) => i !== index);
    setFilter({ ...filter, sort: newSort });
  };

  const handleApply = () => {
    onApply(filter);
    onClose();
  };

  const handleReset = () => {
    setFilter({
      where: {
        type: "and",
        filters: [],
      },
      page: 1,
      limit: 50,
      sort: [],
      fields: {
        include: "ALL",
        exclude: "NONE",
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <Card className="border-border bg-surface h-full flex flex-col">
          <CardHeader className="border-b border-border px-6 py-4">
            <CardTitle className="text-xl font-semibold text-text">
              Filter Employees
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {/* Filter Builder */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Text weight="semibold" size="sm" className="text-text">
                  Filter Conditions
                </Text>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRootFilter}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Condition
                </Button>
              </div>

              {filter.where && (
                <div className="space-y-2">
                  {"type" in filter.where ? (
                    <LogicalGroup
                      id="root-group"
                      group={filter.where as AndFilter | OrFilter}
                      onChange={updateRootFilter}
                      onRemove={() =>
                        setFilter({ ...filter, where: undefined })
                      }
                    />
                  ) : (
                    <FilterCondition
                      id="root-condition"
                      filter={filter.where as AnyFieldFilter}
                      onChange={updateRootFilter}
                      onRemove={() =>
                        setFilter({ ...filter, where: undefined })
                      }
                    />
                  )}
                </div>
              )}
            </div>

            {/* Sort Options */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Text weight="semibold" size="sm" className="text-text">
                  Sort By
                </Text>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSort}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Sort
                </Button>
              </div>

              {filter.sort && filter.sort.length > 0 && (
                <div className="space-y-2">
                  {filter.sort.map((sort, index) => (
                    <SortField
                      key={index}
                      basis={sort.basis}
                      direction={sort.direction}
                      onChange={(basis, direction) =>
                        updateSort(index, basis, direction)
                      }
                      onRemove={() => removeSort(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Field Selection */}
            <div className="space-y-3">
              <Text weight="semibold" size="sm" className="text-text">
                Field Selection
              </Text>
              <FieldSelection
                fields={filter.fields}
                onChange={(fields) => setFilter({ ...filter, fields })}
              />
            </div>

            {/* Pagination */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="page">Page</Label>
                <Input
                  id="page"
                  type="number"
                  min={1}
                  value={filter.page}
                  onChange={(e) =>
                    setFilter({
                      ...filter,
                      page: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="limit">Items per page</Label>
                <Input
                  id="limit"
                  type="number"
                  min={1}
                  max={100}
                  value={filter.limit}
                  onChange={(e) =>
                    setFilter({
                      ...filter,
                      limit: parseInt(e.target.value) || 50,
                    })
                  }
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>

          <CardAction className="flex justify-end gap-3 border-t border-border px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="border-border"
            >
              Reset
            </Button>
            <Button
              type="button"
              onClick={handleApply}
              className="bg-primary text-background hover:bg-primary/90"
            >
              Apply Filters
            </Button>
          </CardAction>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
// #endsection FilterModal

function FilterEmployeesButton() {
  return (
    <TableToolButton>
      <Filter className="h-5 w-5" />
    </TableToolButton>
  );
}

function TableTools({ children }: PropsWithChildren) {
  return (
    <div className="absolute bottom-4 right-4 flex flex-row gap-3">
      {children}
    </div>
  );
}

function EmployeeTableShell({ children }: PropsWithChildren) {
  return (
    <div className="relative h-full min-h-0 w-full overflow-auto bg-background">
      {children}
      <TableTools>
        <AddEmployeeButton />
        <FilterEmployeesButton />
      </TableTools>
    </div>
  );
}

function EmployeeTable({
  employees,
  isLoading,
  error,
  onRetry,
  onSelect,
}: {
  employees: Employee[];
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  onSelect: (employeeNumber: number) => void;
}) {
  if (isLoading)
    return (
      <div className="flex h-40 items-center justify-center">
        <Text className="text-text-muted">Loading employees...</Text>
      </div>
    );
  if (error)
    return (
      <div className="flex flex-col items-center justify-center gap-3 h-40">
        <Text className="text-danger">Failed to load employees.</Text>
        <Button onClick={onRetry}>Retry</Button>
      </div>
    );

  return (
    <div className="h-full min-h-0 min-w-0 overflow-x-scroll overflow-y-scroll">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-border-muted border-b text-text-muted">
            <th className="py-2 pr-4 font-medium">Employee #</th>
            <th className="py-2 pr-4 font-medium">Full Name</th>
            <th className="py-2 pr-4 font-medium">Email</th>
            <th className="py-2 pr-4 font-medium">Designation</th>
            <th className="py-2 pr-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 && (
            <tr>
              <td colSpan={9} className="py-6 text-center text-text-muted">
                No employees found.
              </td>
            </tr>
          )}
          {employees.map((employee) => (
            <tr
              key={employee.employee_number}
              className="border-border-muted border-b align-top last:border-b-0"
            >
              <td className="py-3 pr-4">
                <button
                  className="text-primary cursor-help text-left hover:underline"
                  onClick={() => onSelect(employee.employee_number)}
                >
                  {employee.employee_number}
                </button>
              </td>
              <td className="py-3 pr-4">
                <Text weight="medium" className="leading-tight">
                  {employee.last_name}, {employee.first_name}{" "}
                  {employee.middle_name}
                </Text>
              </td>
              <td className="py-3 pr-4">{employee.deped_email}</td>
              <td className="py-3 pr-4">{employee.designation}</td>
              <td className="py-3 pr-4">
                <Badge className="rounded-full bg-success/20 px-2.5 py-1 text-xs text-success">
                  {employee.employment_status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export {
  ModalShell,
  EmployeeField,
  EmployeeDetailsCard,
  EmployeeInfoModal,
  EmployeeFormSection,
  CourseManagementSection,
  DangerousActionSection,
  AdminActionsModal,
  EmployeeTableShell,
  EmployeeTable,
};
