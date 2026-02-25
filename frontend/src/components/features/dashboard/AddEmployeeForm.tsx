import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { Plus, Trash2 } from "lucide-react";

import { cn } from "@_ssword/classes";
import { addEmployeeAction } from "@/domain/employees/actions";
import type { AddEmployeeCoursePayload } from "@/domain/employees/payloads";
import type { DegreeLevel } from "@/domain/employees/types";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Props } from "@/components/ui/types";

import { filterEmployeesQuery } from "@/pages/EmployeeDashboard/queries";
import { createEmployeeSchema } from "@/pages/EmployeeDashboard/schemas";
import type { EmployeeFormState } from "@/pages/EmployeeDashboard/types";
import { toAddEmployeePayload } from "@/pages/EmployeeDashboard/utils";

interface FieldDefinition<TKey extends string> extends Props<typeof Input> {
  name: TKey;
  type?: Props<typeof Input>["type"];
  label: string;
}

type CourseDraft = {
  id: string;
  course_name: string;
  degree_level: DegreeLevel;
  units_completed: string;
  is_finished: boolean;
};

const emptyCourseDraft = (): CourseDraft => ({
  id: crypto.randomUUID(),
  course_name: "",
  degree_level: "bachelor",
  units_completed: "",
  is_finished: false,
});

export function AddEmployeeForm({ closeModal }: { closeModal: () => void }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [courseDraft, setCourseDraft] = useState<CourseDraft>(emptyCourseDraft);
  const [courseDraftError, setCourseDraftError] = useState<string | null>(null);
  const [initialCourses, setInitialCourses] = useState<CourseDraft[]>([]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<z.input<typeof createEmployeeSchema>, unknown, EmployeeFormState>(
    {
      resolver: zodResolver(createEmployeeSchema),
      defaultValues: {
        employee_number: "",
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
        salary_grade: "",
        salary: "",
        address: "",
        civil_status: "",
        tin: "",
        place_of_birth: "",
      },
    },
  );

  const submitEmployeePayload = async (data: EmployeeFormState) => {
    try {
      const courses: AddEmployeeCoursePayload[] = initialCourses.map((course) => ({
        course_name: course.course_name.trim(),
        degree_level: course.degree_level,
        units_completed:
          course.units_completed.trim() === ""
            ? null
            : Number(course.units_completed),
        is_finished: course.is_finished ? 1 : 0,
      }));

      const result = await addEmployeeAction({
        ...toAddEmployeePayload(data),
        courses,
      });
      result.unwrap();
      filterEmployeesQuery.refresh();
      closeModal();
    } catch (error) {
      console.error("Failed to add employee:", error);
    }
  };

  const fieldCategories = [
    [
      {
        name: "employee_number",
        label: "Employee Number",
        type: "number",
        placeholder: "Enter employee number",
        required: true,
      },
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
    [
      {
        name: "salary_grade",
        label: "Salary Grade",
        type: "number",
        placeholder: "Enter salary grade",
      },
      {
        name: "salary",
        label: "Salary",
        type: "number",
        placeholder: "Enter salary",
      },
      {
        name: "bp_number",
        label: "BP Number",
        type: "number",
        placeholder: "Enter BP number",
      },
    ],
  ] as const;

  const FormField = ({
    name,
    label,
    type,
    placeholder,
    required,
  }: FieldDefinition<keyof EmployeeFormState>) => {
    return (
      <Controller
        key={name}
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <Field className="grid gap-1.5">
            <FieldLabel
              htmlFor={name}
              className="text-sm font-medium text-muted-foreground"
            >
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FieldLabel>
            <Input
              id={name}
              {...field}
              type={type || "text"}
              placeholder={placeholder}
              aria-invalid={!!fieldState.error}
              value={field.value ?? ""}
              className={cn(
                "bg-card border-border text-foreground placeholder:text-muted-foreground/50",
                "focus:border-primary focus:ring-1 focus:ring-primary/30",
                "transition-colors duration-200",
                fieldState.error &&
                  "border-destructive focus:border-destructive focus:ring-destructive/30",
              )}
            />
            <FieldError errors={fieldState.error ? [fieldState.error] : []} />
          </Field>
        )}
      />
    );
  };

  const isFirstPage = currentPage === 0;
  const lastPageIndex = fieldCategories.length;
  const isCoursesPage = currentPage === lastPageIndex;
  const isFinalPage = currentPage === lastPageIndex;
  const currentFieldCategory = fieldCategories[Math.min(currentPage, fieldCategories.length - 1)];
  const goToNextPage = () => setCurrentPage((page) => Math.min(page + 1, lastPageIndex));
  const onSaveEmployee = handleSubmit((data) => {
    void submitEmployeePayload(data);
  });

  const addInitialCourse = () => {
    const courseName = courseDraft.course_name.trim();
    if (courseName === "") {
      setCourseDraftError("Course name is required.");
      return;
    }

    const duplicate = initialCourses.some(
      (course) =>
        course.course_name.trim().toLowerCase() === courseName.toLowerCase() &&
        course.degree_level === courseDraft.degree_level,
    );

    if (duplicate) {
      setCourseDraftError("Course already exists in the initial list.");
      return;
    }

    if (
      courseDraft.units_completed.trim() !== "" &&
      !/^\d+$/.test(courseDraft.units_completed.trim())
    ) {
      setCourseDraftError("Units completed must be numeric.");
      return;
    }

    setCourseDraftError(null);
    setInitialCourses((current) => [...current, { ...courseDraft, course_name: courseName }]);
    setCourseDraft(emptyCourseDraft());
  };

  return (
    <Card
      asChild
      className="w-full h-full border-border bg-card shadow-lg overflow-hidden"
    >
      <form onSubmit={(event) => event.preventDefault()}>
        <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
          <CardTitle className="text-xl font-semibold text-foreground">
            Add New Employee
          </CardTitle>
        </CardHeader>

        <div className="flex justify-center gap-1.5 px-6 pt-3">
          {[...fieldCategories, "courses"].map((_, index) => (
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
          {!isCoursesPage ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {currentFieldCategory.map((fieldDefinition) => (
                <FormField key={fieldDefinition.name} {...fieldDefinition} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field className="grid gap-1.5">
                  <FieldLabel>Course Name</FieldLabel>
                  <Input
                    value={courseDraft.course_name}
                    onChange={(event) =>
                      setCourseDraft((current) => ({
                        ...current,
                        course_name: event.target.value,
                      }))
                    }
                    placeholder="Enter course name"
                  />
                </Field>

                <Field className="grid gap-1.5">
                  <FieldLabel>Degree Level</FieldLabel>
                  <select
                    className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                    value={courseDraft.degree_level}
                    onChange={(event) =>
                      setCourseDraft((current) => ({
                        ...current,
                        degree_level: event.target.value as DegreeLevel,
                      }))
                    }
                  >
                    <option value="bachelor">bachelor</option>
                    <option value="master">master</option>
                    <option value="doctorate">doctorate</option>
                  </select>
                </Field>

                <Field className="grid gap-1.5">
                  <FieldLabel>Units Completed</FieldLabel>
                  <Input
                    type="number"
                    value={courseDraft.units_completed}
                    onChange={(event) =>
                      setCourseDraft((current) => ({
                        ...current,
                        units_completed: event.target.value,
                      }))
                    }
                    placeholder="Optional"
                  />
                </Field>

                <div className="flex items-center gap-2 pt-8">
                  <input
                    id="initial-course-finished"
                    type="checkbox"
                    checked={courseDraft.is_finished}
                    onChange={(event) =>
                      setCourseDraft((current) => ({
                        ...current,
                        is_finished: event.target.checked,
                      }))
                    }
                  />
                  <FieldLabel htmlFor="initial-course-finished">
                    Course Finished
                  </FieldLabel>
                </div>
              </div>

              {courseDraftError ? (
                <p className="text-sm text-destructive">{courseDraftError}</p>
              ) : null}

              <div className="flex justify-end">
                <Button type="button" onClick={addInitialCourse}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add Course
                </Button>
              </div>

              <div className="space-y-2">
                {initialCourses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No courses added. You can still create the employee without courses.
                  </p>
                ) : (
                  initialCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-start justify-between rounded-md border border-border p-3"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{course.course_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {course.degree_level} | Units:{" "}
                          {course.units_completed.trim() === ""
                            ? "N/A"
                            : course.units_completed}{" "}
                          | Finished: {course.is_finished ? "Yes" : "No"}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="px-2 py-2"
                        onClick={() =>
                          setInitialCourses((current) =>
                            current.filter((entry) => entry.id !== course.id),
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </CardContent>

        <CardAction className="flex justify-between w-full border-t border-border bg-muted/20 px-6 py-2">
          {!isFirstPage && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentPage((p) => p - 1)}
              className="border-border bg-card text-foreground hover:bg-muted px-2 py-1"
            >
              Previous
            </Button>
          )}

          {!isFinalPage ? (
            <Button
              type="button"
              onClick={goToNextPage}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-2 py-1"
            >
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onSaveEmployee}
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-2 py-1"
            >
              {isSubmitting ? "Saving..." : "Save Employee"}
            </Button>
          )}
        </CardAction>
      </form>
    </Card>
  );
}
