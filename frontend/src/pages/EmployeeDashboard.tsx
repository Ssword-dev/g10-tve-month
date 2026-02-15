import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Card from "@/components/Card";
import CardAction from "@/components/CardAction";
import CardContent from "@/components/CardContent";
import CardHeader from "@/components/CardHeader";
import CardTitle from "@/components/CardTitle";
import Input from "@/components/Input";
import Label from "@/components/Label";
import Text from "@/components/Text";
import {
  addCourseToEmployeeAction,
  deleteEmployeeCourseAction,
  employeeSearchQuery,
  updateEmployeeAction,
  updateEmployeeCourseAction,
} from "@/domain/employees/actions";
import type {
  AddCoursePayload,
  EmployeeUpdatePayload,
  UpdateCoursePayload,
} from "@/domain/employees/payloads";
import type { Course, DegreeLevel, Employee } from "@/domain/employees/types";
import useServerQuery from "@/hooks/useServerQuery";
import unsafeCast from "@/utils/unsafeCast";
import { X, Pencil, Trash2, Search } from "lucide-react";

import { useEffect, useState, useMemo, useCallback } from "react";

type CoursePayload = AddCoursePayload;

type EmployeeFormState = {
  first_name: string;
  middle_name: string;
  last_name: string;
  deped_email: string;
  designation: string;
  date_joined: string;
  date_of_latest_promotion: string;
  contact_number: string;
  plantilla_number: string;
  date_of_original_appointment: string;
  bp_number: string;
  address: string;
  civil_status: string;
  date_of_birth: string;
  salary_grade: string;
  salary: string;
  employment_status: string;
  tin: string;
  place_of_birth: string;
};

type CourseFormState = {
  course_name: string;
  degree_level: DegreeLevel;
  units_completed: string;
  is_finished: boolean;
};

type FieldErrorMap = Record<
  keyof EmployeeFormState | keyof CourseFormState,
  string | undefined
>;
function toInputDate(value: string | null | undefined): string {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function toNullableString(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function toNullableNumber(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

function isValidDateOrEmpty(value: string): boolean {
  if (value.trim() === "") return true;
  return /^\d{4}-\d{2}-\d{2}$/.test(value.trim());
}

function courseKey(
  course: Pick<Course, "course_name" | "degree_level">,
): string {
  return `${course.course_name.trim().toLowerCase()}::${course.degree_level}`;
}

function emptyCourseForm(): CourseFormState {
  return {
    course_name: "",
    degree_level: "bachelor",
    units_completed: "",
    is_finished: false,
  };
}

function toEmployeeFormState(employee: Employee): EmployeeFormState {
  return {
    first_name: employee.first_name ?? "",
    middle_name: employee.middle_name ?? "",
    last_name: employee.last_name ?? "",
    deped_email: employee.deped_email ?? "",
    designation: employee.designation ?? "",
    date_joined: toInputDate(employee.date_joined),
    date_of_latest_promotion: toInputDate(employee.date_of_latest_promotion),
    contact_number: employee.contact_number ?? "",
    plantilla_number: employee.plantilla_number ?? "",
    date_of_original_appointment: toInputDate(
      employee.date_of_original_appointment,
    ),
    bp_number: employee.bp_number ? String(employee.bp_number) : "",
    address: employee.address ?? "",
    civil_status: employee.civil_status ?? "",
    date_of_birth: toInputDate(employee.date_of_birth),
    salary_grade: employee.salary_grade ? String(employee.salary_grade) : "",
    salary: employee.salary ?? "",
    employment_status: employee.employment_status ?? "",
    tin: employee.tin ?? "",
    place_of_birth: employee.place_of_birth ?? "",
  };
}

function toEmployeePayload(
  employee: Employee,
  form: EmployeeFormState,
): EmployeeUpdatePayload {
  return {
    employee_number: employee.employee_number,
    first_name: form.first_name.trim(),
    middle_name: form.middle_name.trim(),
    last_name: form.last_name.trim(),
    deped_email: form.deped_email.trim(),
    designation: form.designation.trim(),
    date_joined: toNullableString(form.date_joined),
    date_of_latest_promotion: toNullableString(form.date_of_latest_promotion),
    contact_number: form.contact_number.trim(),
    plantilla_number: form.plantilla_number.trim(),
    date_of_original_appointment: toNullableString(
      form.date_of_original_appointment,
    ),
    bp_number: toNullableNumber(form.bp_number),
    address: form.address.trim(),
    civil_status: form.civil_status.trim(),
    date_of_birth: toNullableString(form.date_of_birth),
    salary_grade: toNullableNumber(form.salary_grade),
    salary: form.salary.trim(),
    employment_status: form.employment_status.trim(),
    tin: form.tin.trim(),
    place_of_birth: form.place_of_birth.trim(),
  };
}

function toCoursePayload(
  employeeNumber: number,
  form: CourseFormState,
): CoursePayload {
  return {
    employee_number: employeeNumber,
    course_name: form.course_name.trim(),
    degree_level: form.degree_level,
    units_completed: toNullableNumber(form.units_completed),
    is_finished: form.is_finished ? 1 : 0,
  };
}

function validateEmployeeForm(form: EmployeeFormState): FieldErrorMap {
  const errors = {} as FieldErrorMap;
  if (!form.first_name.trim()) errors.first_name = "First name is required.";
  if (!form.last_name.trim()) errors.last_name = "Last name is required.";
  if (!form.designation.trim()) errors.designation = "Designation is required.";
  if (!form.employment_status.trim())
    errors.employment_status = "Employment status is required.";

  if (
    form.bp_number.trim() !== "" &&
    toNullableNumber(form.bp_number) == null
  ) {
    errors.bp_number = "BP number must be numeric.";
  }
  if (
    form.salary_grade.trim() !== "" &&
    toNullableNumber(form.salary_grade) == null
  ) {
    errors.salary_grade = "Salary grade must be numeric.";
  }

  if (!isValidDateOrEmpty(form.date_joined))
    errors.date_joined = "Invalid date.";
  if (!isValidDateOrEmpty(form.date_of_latest_promotion))
    errors.date_of_latest_promotion = "Invalid date.";
  if (!isValidDateOrEmpty(form.date_of_original_appointment))
    errors.date_of_original_appointment = "Invalid date.";
  if (!isValidDateOrEmpty(form.date_of_birth))
    errors.date_of_birth = "Invalid date.";
  return errors;
}

function validateCourseForm(
  form: CourseFormState,
  courses: Course[],
  editingKey?: string | null,
): FieldErrorMap {
  const errors = {} as FieldErrorMap;
  if (!form.course_name.trim()) errors.course_name = "Course name is required.";
  if (!form.degree_level) errors.degree_level = "Degree level is required.";
  if (
    form.units_completed.trim() !== "" &&
    toNullableNumber(form.units_completed) == null
  ) {
    errors.units_completed = "Units must be numeric.";
  }

  const draftKey = courseKey({
    course_name: form.course_name,
    degree_level: form.degree_level,
  });
  const duplicate = courses.some((course) => {
    const current = courseKey(course);
    if (editingKey && editingKey === current) return false;
    return current === draftKey;
  });
  if (duplicate) errors.course_name = "Duplicate course for this employee.";
  return errors;
}

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
        <Button onClick={onOpenAdmin}>Admin Actions</Button>
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
      const result = await addCourseToEmployeeAction(
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
      const result = await updateEmployeeCourseAction({
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
      const result = await deleteEmployeeCourseAction({
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
    </ModalShell>
  );
}

function EmployeeSearchBar({
  value,
  onChange,
  onSearch,
}: {
  value: string;
  onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}) {
  return (
    <Card className="gap-0 border-border p-0">
      <CardHeader className="flex flex-row items-center justify-between px-4 py-2">
        <CardTitle>
          <Text size="2xl" weight="bold" className="px-2 py-1 leading-none">
            Employees
          </Text>
        </CardTitle>
        <CardAction>
          <Label className="relative w-full min-w-56 md:w-72">
            <Search className="text-text-muted absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              className="pl-8"
              placeholder="Search by name"
              value={value}
              onChange={onChange}
            />
            <Button className="px-3 py-2" onClick={onSearch}>
              <Search className="size-4" />
            </Button>
          </Label>
        </CardAction>
      </CardHeader>
    </Card>
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
    <div className="h-full min-h-0 min-w-0 overflow-x-scroll overflow-y-scroll no-scrollbar">
      <table className="min-w-362.5 text-left text-sm">
        <thead>
          <tr className="border-border-muted border-b text-text-muted">
            <th className="py-2 pr-4 font-medium">Employee #</th>
            <th className="py-2 pr-4 font-medium">Full Name</th>
            <th className="py-2 pr-4 font-medium">Email</th>
            <th className="py-2 pr-4 font-medium">Designation</th>
            <th className="py-2 pr-4 font-medium">Status</th>
            <th className="py-2 pr-4 font-medium">Date Joined</th>
            <th className="py-2 pr-4 font-medium">Promotion</th>
            <th className="py-2 pr-4 font-medium">Contact</th>
            <th className="py-2 pr-4 font-medium">Salary</th>
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
              <td className="py-3 pr-4">{employee.date_joined}</td>
              <td className="py-3 pr-4">{employee.date_of_latest_promotion}</td>
              <td className="py-3 pr-4">{employee.contact_number}</td>
              <td className="py-3 pr-4">
                SG {employee.salary_grade} | PHP {employee.salary}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmployeeDashboard() {
  const [nameSearchTerm, setNameSearchTerm] = useState("");
  const [selectedEmployeeNumber, setSelectedEmployeeNumber] = useState<
    number | null
  >(null);
  const [activeModal, setActiveModal] = useState<"none" | "info" | "admin">(
    "none",
  );

  const { data, isLoading, refresh, error } =
    useServerQuery(employeeSearchQuery);
  const employees = data ?? [];

  const selectedEmployee = useMemo(
    () =>
      selectedEmployeeNumber == null
        ? null
        : (employees.find(
            (employee) => employee.employee_number === selectedEmployeeNumber,
          ) ?? null),
    [employees, selectedEmployeeNumber],
  );

  useEffect(() => {
    if (selectedEmployeeNumber != null && !selectedEmployee) {
      // This is guarded.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedEmployeeNumber(null);
      setActiveModal("none");
    }
  }, [selectedEmployee, selectedEmployeeNumber]);

  const refreshEmployees = useCallback(async () => {
    await refresh(nameSearchTerm);
  }, [nameSearchTerm, refresh]);
  return (
    <main className="flex h-full min-h-0 min-w-0 flex-col gap-6 overflow-hidden p-4 md:p-8">
      <EmployeeSearchBar
        value={nameSearchTerm}
        onChange={(event) => {
          const next = event.target.value;
          setNameSearchTerm(next);
          void refresh(next);
        }}
        onSearch={() => {
          void refresh(nameSearchTerm);
        }}
      />

      <Card className="min-h-0 w-full flex-1 gap-0 overflow-hidden border-border py-0">
        <CardContent className="min-h-0 w-full flex-1 px-5 py-3">
          <EmployeeTable
            employees={employees}
            isLoading={isLoading}
            error={error}
            onRetry={() => {
              void refresh(nameSearchTerm);
            }}
            onSelect={(employeeNumber) => {
              setSelectedEmployeeNumber(employeeNumber);
              setActiveModal("info");
            }}
          />
        </CardContent>
      </Card>

      <EmployeeInfoModal
        employee={selectedEmployee}
        open={activeModal === "info" && selectedEmployee != null}
        onClose={() => {
          setSelectedEmployeeNumber(null);
          setActiveModal("none");
        }}
        onOpenAdmin={() => setActiveModal("admin")}
      />

      <AdminActionsModal
        employee={selectedEmployee}
        open={activeModal === "admin" && selectedEmployee != null}
        onClose={() => setActiveModal("none")}
        onSaved={refreshEmployees}
      />
    </main>
  );
}

export default EmployeeDashboard;
