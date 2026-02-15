import { GraduationCap, Pencil, Search, Trash2, X } from "lucide-react";

import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Card from "@/components/Card";
import CardContent from "@/components/CardContent";
import CardHeader from "@/components/CardHeader";
import CardTitle from "@/components/CardTitle";
import Input from "@/components/Input";
import Text from "@/components/Text";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import CardAction from "@/components/CardAction";
import Label from "@/components/Label";
import TooltipProvider from "@/components/TooltipProvider";
import { createServerAction } from "@/core/bridge/ServerAction";
import useServerQuery, { createServerQuery } from "@/hooks/useServerQuery";

type Employee = {
  first_name: string;
  middle_name: string;
  last_name: string;
  deped_email: string;
  employee_number: number;
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
  salary_grade: number;
  salary: string;
  employment_status: string;
  tin: string;
  place_of_birth: string;
  courses: Course[];
};

type DegreeLevel = "bachelor" | "master" | "doctorate";

type Course = {
  course_name: string;
  degree_level: DegreeLevel;
  units_completed: number | null;
  is_finished: number;
};

type EmployeeUpdatePayload = {
  employee_number: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  deped_email: string;
  designation: string;
  date_joined: string | null;
  date_of_latest_promotion: string | null;
  contact_number: string;
  plantilla_number: string;
  date_of_original_appointment: string | null;
  bp_number: number | null;
  address: string;
  civil_status: string;
  date_of_birth: string | null;
  salary_grade: number | null;
  salary: string;
  employment_status: string;
  tin: string;
  place_of_birth: string;
};

type CoursePayload = {
  employee_number: number;
  course_name: string;
  degree_level: DegreeLevel;
  units_completed: number | null;
  is_finished: number;
};

type UpdateCoursePayload = CoursePayload & {
  original_course_name: string;
  original_degree_level: DegreeLevel;
};

type OverviewActivityEmployee = Pick<
  Employee,
  | "employee_number"
  | "first_name"
  | "last_name"
  | "designation"
  | "date_of_latest_promotion"
  | "date_joined"
>;

type OverviewDashboardStats = {
  totalEmployees: number;
  permanentCount: number;
  teacherCount: number;
  principalCount: number;
  averageSalaryGrade: number;
  recentlyPromoted: OverviewActivityEmployee[];
  recentlyJoined: OverviewActivityEmployee[];
  designationDistribution: Record<string, number>;
};

const getAllEmployeesThatSatisfiesAction = createServerAction<
  { name: string },
  Employee[]
>({
  name: "getAllEmployeesThatSatisfies",
  apiUrl: "/api/getAllEmployeesThatSatisfies",
});

const employeeSearchQuery = createServerQuery(
  "EmployeeDashboard:getAllEmployeesThatSatisfies",
  (name: string) => getAllEmployeesThatSatisfiesAction({ name }),
  [""],
);

const getOverviewDashboardStatisticsAction = createServerAction<
  Record<string, never>,
  OverviewDashboardStats
>({
  name: "getOverviewDashboardStatistics",
  apiUrl: "/api/getOverviewDashboardStatistics",
});

const overviewDashboardStatsQuery = createServerQuery(
  "OverviewDashboard:getOverviewDashboardStatistics",
  () => getOverviewDashboardStatisticsAction({}),
  [],
);

const updateEmployeeAction = createServerAction<EmployeeUpdatePayload, Employee>({
  name: "updateEmployee",
  apiUrl: "/api/updateEmployee",
  method: "POST",
});

const addCourseToEmployeeAction = createServerAction<CoursePayload, CoursePayload>(
  {
    name: "addCourseToEmployee",
    apiUrl: "/api/addCourseToEmployee",
    method: "POST",
  },
);

const updateEmployeeCourseAction = createServerAction<
  UpdateCoursePayload,
  CoursePayload
>({
  name: "updateEmployeeCourse",
  apiUrl: "/api/updateEmployeeCourse",
  method: "POST",
});

const deleteEmployeeCourseAction = createServerAction<
  { employee_number: number; course_name: string; degree_level: DegreeLevel },
  { employee_number: number; course_name: string; degree_level: DegreeLevel }
>({
  name: "deleteEmployeeCourse",
  apiUrl: "/api/deleteEmployeeCourse",
  method: "POST",
});

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

function toInputDate(dateValue: string | null | undefined): string {
  if (!dateValue) return "";
  return String(dateValue).slice(0, 10);
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

function courseKey(course: Pick<Course, "course_name" | "degree_level">): string {
  return `${course.course_name}::${course.degree_level}`;
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
    date_of_original_appointment: toInputDate(employee.date_of_original_appointment),
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

function toEmployeePayload(employee: Employee, form: EmployeeFormState): EmployeeUpdatePayload {
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
    date_of_original_appointment: toNullableString(form.date_of_original_appointment),
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

function toCoursePayload(employeeNumber: number, form: CourseFormState): CoursePayload {
  return {
    employee_number: employeeNumber,
    course_name: form.course_name.trim(),
    degree_level: form.degree_level,
    units_completed: toNullableNumber(form.units_completed),
    is_finished: form.is_finished ? 1 : 0,
  };
}

function EmployeeDetailsTooltip({ employee }: { employee: Employee }) {
  return (
    <div className="w-90 space-y-3 text-xs leading-relaxed">
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
          {employee.salary_grade} + ₱{employee.salary}
        </p>
      </section>
    </div>
  );
}

function EmployeeDashboard() {
  function EmployeeField({
    label,
    value,
    onChange,
    type = "text",
    disabled = false,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
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
          onChange={(event) => onChange(event.target.value)}
        />
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
    if (!open || !employee) return null;

    return (
      <div
        className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <Card
          className="h-[90vh] w-full max-w-5xl overflow-y-auto no-scrollbar border-border bg-surface p-0"
          onClick={(event) => event.stopPropagation()}
        >
          <CardHeader className="sticky top-0 z-10 flex flex-row items-center justify-between border-b border-border bg-surface px-5 py-3">
            <CardTitle>
              <Text size="xl" weight="bold">
                Employee #{employee.employee_number}
              </Text>
            </CardTitle>
            <Button className="px-2 py-2" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 px-5 py-5">
            <EmployeeDetailsTooltip employee={employee} />
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
                  <div key={courseKey(course)} className="rounded-md border border-border px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <Text weight="semibold">{course.course_name}</Text>
                      <Badge>{course.degree_level}</Badge>
                    </div>
                    <Text size="sm" className="text-text-muted">
                      Units: {course.units_completed ?? "N/A"} | Finished: {course.is_finished ? "Yes" : "No"}
                    </Text>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button onClick={onOpenAdmin}>Admin Actions</Button>
            </div>
          </CardContent>
        </Card>
      </div>
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
    const [newCourse, setNewCourse] = useState<CourseFormState>(emptyCourseForm());
    const [editCourseKey, setEditCourseKey] = useState<string | null>(null);
    const [editCourseForm, setEditCourseForm] = useState<CourseFormState>(emptyCourseForm());
    const [busy, setBusy] = useState<string | null>(null);
    const [errorText, setErrorText] = useState("");

    useEffect(() => {
      if (!employee) return;
      setForm(toEmployeeFormState(employee));
      setNewCourse(emptyCourseForm());
      setEditCourseKey(null);
      setEditCourseForm(emptyCourseForm());
      setErrorText("");
    }, [employee]);

    if (!open || !employee || !form) return null;

    const courses = employee.courses ?? [];

    const onSaveEmployee = async () => {
      try {
        setBusy("employee");
        setErrorText("");
        const result = await updateEmployeeAction(toEmployeePayload(employee, form));
        result.unwrap();
        await onSaved();
      } catch (error) {
        setErrorText((error as Error).message);
      } finally {
        setBusy(null);
      }
    };

    const onAddCourse = async () => {
      try {
        setBusy("addCourse");
        setErrorText("");
        const result = await addCourseToEmployeeAction(
          toCoursePayload(employee.employee_number, newCourse),
        );
        result.unwrap();
        await onSaved();
        setNewCourse(emptyCourseForm());
      } catch (error) {
        setErrorText((error as Error).message);
      } finally {
        setBusy(null);
      }
    };

    const onSaveCourse = async () => {
      const existing = courses.find((course) => courseKey(course) === editCourseKey);
      if (!existing) return;

      try {
        setBusy("editCourse");
        setErrorText("");
        const result = await updateEmployeeCourseAction({
          ...toCoursePayload(employee.employee_number, editCourseForm),
          original_course_name: existing.course_name,
          original_degree_level: existing.degree_level,
        });
        result.unwrap();
        await onSaved();
        setEditCourseKey(null);
      } catch (error) {
        setErrorText((error as Error).message);
      } finally {
        setBusy(null);
      }
    };

    const onDeleteCourse = async (course: Course) => {
      try {
        setBusy(`delete:${courseKey(course)}`);
        setErrorText("");
        const result = await deleteEmployeeCourseAction({
          employee_number: employee.employee_number,
          course_name: course.course_name,
          degree_level: course.degree_level,
        });
        result.unwrap();
        await onSaved();
      } catch (error) {
        setErrorText((error as Error).message);
      } finally {
        setBusy(null);
      }
    };

    return (
      <div
        className="fixed inset-0 z-70 flex items-center justify-center bg-black/60 p-4"
        onClick={onClose}
      >
        <Card
          className="h-[90vh] w-full max-w-6xl overflow-y-auto no-scrollbar border-border bg-surface p-0"
          onClick={(event) => event.stopPropagation()}
        >
          <CardHeader className="sticky top-0 z-10 flex flex-row items-center justify-between border-b border-border bg-surface px-5 py-3">
            <CardTitle>
              <Text size="xl" weight="bold">
                Admin Actions
              </Text>
            </CardTitle>
            <Button className="px-2 py-2" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 px-5 py-5">
            {errorText && <Text className="text-danger">{errorText}</Text>}
            <Card className="gap-3 border-border p-4">
              <CardTitle>
                <Text weight="semibold">Edit Employee Attributes</Text>
              </CardTitle>
              <CardContent className="grid grid-cols-1 gap-3 p-0 md:grid-cols-2">
                <EmployeeField
                  label="Employee Number"
                  value={String(employee.employee_number)}
                  onChange={() => undefined}
                  disabled
                />
                <EmployeeField
                  label="First Name"
                  value={form.first_name}
                  onChange={(value) => setForm({ ...form, first_name: value })}
                />
                <EmployeeField
                  label="Middle Name"
                  value={form.middle_name}
                  onChange={(value) => setForm({ ...form, middle_name: value })}
                />
                <EmployeeField
                  label="Last Name"
                  value={form.last_name}
                  onChange={(value) => setForm({ ...form, last_name: value })}
                />
                <EmployeeField
                  label="DepEd Email"
                  value={form.deped_email}
                  onChange={(value) => setForm({ ...form, deped_email: value })}
                />
                <EmployeeField
                  label="Designation"
                  value={form.designation}
                  onChange={(value) => setForm({ ...form, designation: value })}
                />
                <EmployeeField
                  label="Date Joined"
                  type="date"
                  value={form.date_joined}
                  onChange={(value) => setForm({ ...form, date_joined: value })}
                />
                <EmployeeField
                  label="Date of Latest Promotion"
                  type="date"
                  value={form.date_of_latest_promotion}
                  onChange={(value) =>
                    setForm({ ...form, date_of_latest_promotion: value })
                  }
                />
                <EmployeeField
                  label="Contact Number"
                  value={form.contact_number}
                  onChange={(value) => setForm({ ...form, contact_number: value })}
                />
                <EmployeeField
                  label="Plantilla Number"
                  value={form.plantilla_number}
                  onChange={(value) => setForm({ ...form, plantilla_number: value })}
                />
                <EmployeeField
                  label="Date of Original Appointment"
                  type="date"
                  value={form.date_of_original_appointment}
                  onChange={(value) =>
                    setForm({ ...form, date_of_original_appointment: value })
                  }
                />
                <EmployeeField
                  label="BP Number"
                  type="number"
                  value={form.bp_number}
                  onChange={(value) => setForm({ ...form, bp_number: value })}
                />
                <EmployeeField
                  label="Address"
                  value={form.address}
                  onChange={(value) => setForm({ ...form, address: value })}
                />
                <EmployeeField
                  label="Civil Status"
                  value={form.civil_status}
                  onChange={(value) => setForm({ ...form, civil_status: value })}
                />
                <EmployeeField
                  label="Date of Birth"
                  type="date"
                  value={form.date_of_birth}
                  onChange={(value) => setForm({ ...form, date_of_birth: value })}
                />
                <EmployeeField
                  label="Salary Grade"
                  type="number"
                  value={form.salary_grade}
                  onChange={(value) => setForm({ ...form, salary_grade: value })}
                />
                <EmployeeField
                  label="Salary"
                  value={form.salary}
                  onChange={(value) => setForm({ ...form, salary: value })}
                />
                <EmployeeField
                  label="Employment Status"
                  value={form.employment_status}
                  onChange={(value) => setForm({ ...form, employment_status: value })}
                />
                <EmployeeField
                  label="TIN"
                  value={form.tin}
                  onChange={(value) => setForm({ ...form, tin: value })}
                />
                <EmployeeField
                  label="Place of Birth"
                  value={form.place_of_birth}
                  onChange={(value) => setForm({ ...form, place_of_birth: value })}
                />
              </CardContent>
              <CardAction>
                <Button onClick={onSaveEmployee} disabled={busy === "employee"}>
                  Save Employee
                </Button>
              </CardAction>
            </Card>

            <Card className="gap-3 border-border p-4">
              <CardTitle>
                <Text weight="semibold">Add Course</Text>
              </CardTitle>
              <CardContent className="grid grid-cols-1 gap-3 p-0 md:grid-cols-2">
                <EmployeeField
                  label="Course Name"
                  value={newCourse.course_name}
                  onChange={(value) => setNewCourse({ ...newCourse, course_name: value })}
                />
                <div className="space-y-1">
                  <Label>Degree Level</Label>
                  <select
                    className="bg-surface border-border rounded-lg border px-2.5 py-1 text-sm"
                    value={newCourse.degree_level}
                    onChange={(event) =>
                      setNewCourse({
                        ...newCourse,
                        degree_level: event.target.value as DegreeLevel,
                      })
                    }
                  >
                    <option value="bachelor">bachelor</option>
                    <option value="master">master</option>
                    <option value="doctorate">doctorate</option>
                  </select>
                </div>
                <EmployeeField
                  label="Units Completed"
                  type="number"
                  value={newCourse.units_completed}
                  onChange={(value) => setNewCourse({ ...newCourse, units_completed: value })}
                />
                <div className="flex items-center gap-2 pt-7">
                  <input
                    id="new-course-finished"
                    type="checkbox"
                    checked={newCourse.is_finished}
                    onChange={(event) =>
                      setNewCourse({ ...newCourse, is_finished: event.target.checked })
                    }
                  />
                  <Label htmlFor="new-course-finished">Course Finished</Label>
                </div>
              </CardContent>
              <CardAction>
                <Button onClick={onAddCourse} disabled={busy === "addCourse"}>
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
                  const currentCourseKey = courseKey(course);
                  const isEditing = editCourseKey === currentCourseKey;

                  return (
                    <div key={currentCourseKey} className="rounded-md border border-border p-3">
                      {!isEditing && (
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Text weight="semibold">{course.course_name}</Text>
                            <Text size="sm" className="text-text-muted">
                              {course.degree_level} | Units: {course.units_completed ?? "N/A"} | Finished:{" "}
                              {course.is_finished ? "Yes" : "No"}
                            </Text>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              className="px-2 py-2"
                              onClick={() => {
                                setEditCourseKey(currentCourseKey);
                                setEditCourseForm({
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
                              onClick={() => onDeleteCourse(course)}
                              disabled={busy === `delete:${currentCourseKey}`}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {isEditing && (
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <EmployeeField
                            label="Course Name"
                            value={editCourseForm.course_name}
                            onChange={(value) =>
                              setEditCourseForm({ ...editCourseForm, course_name: value })
                            }
                          />
                          <div className="space-y-1">
                            <Label>Degree Level</Label>
                            <select
                              className="bg-surface border-border rounded-lg border px-2.5 py-1 text-sm"
                              value={editCourseForm.degree_level}
                              onChange={(event) =>
                                setEditCourseForm({
                                  ...editCourseForm,
                                  degree_level: event.target.value as DegreeLevel,
                                })
                              }
                            >
                              <option value="bachelor">bachelor</option>
                              <option value="master">master</option>
                              <option value="doctorate">doctorate</option>
                            </select>
                          </div>
                          <EmployeeField
                            label="Units Completed"
                            type="number"
                            value={editCourseForm.units_completed}
                            onChange={(value) =>
                              setEditCourseForm({ ...editCourseForm, units_completed: value })
                            }
                          />
                          <div className="flex items-center gap-2 pt-7">
                            <input
                              id={`edit-finished-${currentCourseKey}`}
                              type="checkbox"
                              checked={editCourseForm.is_finished}
                              onChange={(event) =>
                                setEditCourseForm({
                                  ...editCourseForm,
                                  is_finished: event.target.checked,
                                })
                              }
                            />
                            <Label htmlFor={`edit-finished-${currentCourseKey}`}>
                              Course Finished
                            </Label>
                          </div>
                          <div className="col-span-full flex gap-2">
                            <Button onClick={onSaveCourse} disabled={busy === "editCourse"}>
                              Save Course
                            </Button>
                            <Button
                              variant="glass"
                              onClick={() => setEditCourseKey(null)}
                              disabled={busy === "editCourse"}
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
          </CardContent>
        </Card>
      </div>
    );
  }
  const [nameSearchTerm, setNameSearchTerm] = useState("");
  const [selectedEmployeeNumber, setSelectedEmployeeNumber] = useState<number | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const { data, isLoading, refresh, error } = useServerQuery(employeeSearchQuery);
  const employees = data ?? [];

  const selectedEmployee = useMemo(
    () =>
      selectedEmployeeNumber == null
        ? null
        : employees.find((employee) => employee.employee_number === selectedEmployeeNumber) ?? null,
    [employees, selectedEmployeeNumber],
  );

  const onInputChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const nextSearch = evt.target.value;
      setNameSearchTerm(nextSearch);
      void refresh(nextSearch);
    },
    [refresh],
  );

  const refreshEmployees = useCallback(async () => {
    await refresh(nameSearchTerm);
  }, [nameSearchTerm, refresh]);

  return (
    <main className="flex flex-col min-w-0 space-y-6 p-4 md:p-8 w-full h-screen">
      <Card className="gap-0 border-border p-0">
        <CardHeader className="flex flex-row items-center justify-between px-4 py-2">
          <CardTitle>
            <Text size="2xl" weight="bold" className="px-2 py-1 leading-none">
              Employees
            </Text>
          </CardTitle>
          <CardAction>
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <Label className="relative w-full min-w-56 md:w-72">
                <Search className="text-text-muted absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                <Input
                  className="pl-8"
                  placeholder="Search by name or filters."
                  value={nameSearchTerm}
                  onChange={onInputChange}
                />
                <Button
                  className="px-3 py-2"
                  aria-label="search employees"
                  onClick={() => {
                    void refresh(nameSearchTerm);
                  }}
                >
                  <Search className="size-4" />
                </Button>
              </Label>
            </div>
          </CardAction>
        </CardHeader>
      </Card>

      <Card className="h-full w-full gap-0 border-border py-0 mb-6 overflow-y-scroll no-scrollbar">
        <CardContent className="flex-1 w-full h-full px-5 py-3">
          {isLoading && (
            <div className="flex h-40 items-center justify-center">
              <Text className="text-text-muted">Loading employees...</Text>
            </div>
          )}

          {!isLoading && error && (
            <div className="flex flex-col items-center justify-center gap-3 h-40">
              <Text className="text-danger">Failed to load employees.</Text>
              <Button
                onClick={() => {
                  void refresh(nameSearchTerm);
                }}
              >
                Retry
              </Button>
            </div>
          )}

          {!isLoading && !error && employees && (
            <div className="overflow-x-scroll overflow-y-scroll no-scrollbar min-w-0 h-full">
              <table className="min-w-362.5 h-full text-left text-sm">
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
                      <td
                        colSpan={9}
                        className="py-6 text-center text-text-muted"
                      >
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
                          onClick={() => setSelectedEmployeeNumber(employee.employee_number)}
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
                      <td className="py-3 pr-4">
                        {employee.date_of_latest_promotion}
                      </td>
                      <td className="py-3 pr-4">{employee.contact_number}</td>
                      <td className="py-3 pr-4">
                        SG {employee.salary_grade} | PHP {employee.salary}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <EmployeeInfoModal
        employee={selectedEmployee}
        open={selectedEmployee != null}
        onClose={() => {
          setSelectedEmployeeNumber(null);
          setIsAdminModalOpen(false);
        }}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      <AdminActionsModal
        employee={selectedEmployee}
        open={isAdminModalOpen && selectedEmployee != null}
        onClose={() => setIsAdminModalOpen(false)}
        onSaved={refreshEmployees}
      />
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card className="border-border">
      <CardContent className="flex flex-col space-y-1 px-5 py-5">
        <Text size="3xl" weight="bold">
          {value}
        </Text>
        <Text size="2xl" weight="semibold" className="text-text-muted">
          {title}
        </Text>
      </CardContent>
    </Card>
  );
}

function ActivityCard({
  title,
  employees,
}: {
  title: string;
  employees: OverviewActivityEmployee[];
}) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>
          <Text weight="semibold">{title}</Text>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {employees.map((e) => (
          <div
            key={e.employee_number}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex flex-row items-center gap-1">
              <Text weight="medium">
                {e.last_name}, {e.first_name}
              </Text>
              <Text size="xs" className="text-text-muted">
                ({e.designation})
              </Text>
            </div>
            <Text size="xs" className="text-text-muted">
              {title === "Recently Promoted"
                ? e.date_of_latest_promotion
                : e.date_joined}
            </Text>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function OverviewDashboard() {
  const { data: stats, isLoading, refresh, error } = useServerQuery(
    overviewDashboardStatsQuery,
  );

  const resolvedStats: OverviewDashboardStats = stats ?? {
    totalEmployees: 0,
    permanentCount: 0,
    teacherCount: 0,
    principalCount: 0,
    averageSalaryGrade: 0,
    recentlyPromoted: [],
    recentlyJoined: [],
    designationDistribution: {},
  };

  return (
    <main className="min-w-0 space-y-8 p-4 md:p-8">
      <Card className="gap-0 border-border p-0">
        <CardHeader className="flex flex-row items-center justify-between px-4 py-2">
          <CardTitle>
            <Text size="2xl" weight="bold" className="px-2 py-1 leading-none">
              Overview
            </Text>
          </CardTitle>
          <CardAction>
            <div className="flex items-center gap-2">
              <Button
                className="px-3 py-2"
                aria-label="refresh overview"
                onClick={() => refresh()}
              >
                Refresh
              </Button>
            </div>
          </CardAction>
        </CardHeader>
      </Card>

      {error && (
        <Card className="border-border">
          <CardContent className="flex items-center justify-between gap-4 px-5 py-5">
            <Text className="text-danger">Failed to load overview statistics.</Text>
            <Button onClick={() => refresh()}>Retry</Button>
          </CardContent>
        </Card>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total Employees" value={resolvedStats.totalEmployees} />
        <StatCard title="Permanent" value={resolvedStats.permanentCount} />
        <StatCard title="Teachers" value={resolvedStats.teacherCount} />
        <StatCard title="Principals" value={resolvedStats.principalCount} />
        <StatCard title="Avg Salary Grade" value={resolvedStats.averageSalaryGrade} />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ActivityCard
          title="Recently Promoted"
          employees={resolvedStats.recentlyPromoted}
        />
        <ActivityCard
          title="Recently Joined"
          employees={resolvedStats.recentlyJoined}
        />
      </section>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>
            <Text weight="semibold">Designation Distribution</Text>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(resolvedStats.designationDistribution).map(
            ([role, count]) => (
              <div
                key={role}
                className="flex items-center justify-between text-sm"
              >
                <Text>{role}</Text>
                <Badge>{count}</Badge>
              </div>
            ),
          )}
          {!isLoading &&
            Object.keys(resolvedStats.designationDistribution).length === 0 && (
              <Text size="sm" className="text-text-muted">
                No designation data available.
              </Text>
            )}
        </CardContent>
      </Card>
    </main>
  );
}

export default function Dashboard() {
  const subPages = {
    overview: {
      component: OverviewDashboard,
    },
    employees: {
      component: EmployeeDashboard,
    },
  };

  const [activeSubPage, setActiveSubPage] = useState("overview");

  return (
    <TooltipProvider delayDuration={120}>
      <div className="grid h-screen w-screen overflow-x-hidden grid-cols-1 bg-background text-text lg:grid-cols-[250px_1fr]">
        <aside className="border-border-muted bg-surface/90 p-6 lg:border-r">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-xl bg-accent/35 p-2">
              <GraduationCap className="size-5 text-accent-strong" />
            </div>
            <div>
              <Text size="lg" weight="semibold">
                Dashboard
              </Text>
            </div>
          </div>

          <nav className="space-y-2">
            {Object.entries(subPages).map(([name]) => (
              <Button
                key={name}
                variant="glass"
                className={
                  activeSubPage === name
                    ? "w-full justify-start gap-3 bg-accent text-text hover:bg-accent-strong"
                    : "w-full justify-start gap-3 bg-transparent text-text-muted hover:bg-muted hover:text-text"
                }
                onClick={() => setActiveSubPage(name)}
              >
                <Text size="sm" weight="medium" className="text-inherit">
                  {name}
                </Text>
              </Button>
            ))}
          </nav>
        </aside>

        {(() => {
          const Comp =
            subPages[activeSubPage as keyof typeof subPages].component;
          return <Comp />;
        })()}
      </div>
    </TooltipProvider>
  );
}
