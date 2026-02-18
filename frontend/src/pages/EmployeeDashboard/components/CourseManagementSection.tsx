import type { Dispatch, SetStateAction } from "react";
import { Pencil, Trash2 } from "lucide-react";

import type { Course, DegreeLevel } from "@/domain/employees/types";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Card from "@/components/Card";
import CardAction from "@/components/CardAction";
import CardContent from "@/components/CardContent";
import CardTitle from "@/components/CardTitle";
import Label from "@/components/Label";
import Text from "@/components/Text";

import type { CourseFormState, FieldErrorMap } from "../types";
import { courseKey } from "../utils";
import { EmployeeField } from "./EmployeeField";

interface CourseManagementSectionProps {
  courses: Course[];
  newCourse: CourseFormState;
  setNewCourse: Dispatch<SetStateAction<CourseFormState>>;
  newCourseErrors: FieldErrorMap;
  onAddCourse: () => Promise<void>;
  addBusy: boolean;
  editKey: string | null;
  setEditKey: Dispatch<SetStateAction<string | null>>;
  editForm: CourseFormState;
  setEditForm: Dispatch<SetStateAction<CourseFormState>>;
  editErrors: FieldErrorMap;
  onSaveEdit: () => Promise<void>;
  editBusy: boolean;
  onDeleteCourse: (course: Course) => Promise<void>;
  deleteBusyKey: string | null;
}

export function CourseManagementSection({
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
}: CourseManagementSectionProps) {
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
              className="bg-card border-border rounded-lg border px-2.5 py-1 text-sm"
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
              <Text size="xs" className="text-destructive">
                {newCourseErrors.degree_level}
              </Text>
            )}
          </div>
          <EmployeeField
            label="Units Completed"
            type="number"
            value={newCourse.units_completed}
            error={newCourseErrors.units_completed}
            onChange={(v) => setNewCourse((s) => ({ ...s, units_completed: v }))}
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
            <Text size="sm" className="text-muted-foreground">
              No courses available.
            </Text>
          )}
          {courses.map((course) => {
            const currentKey = courseKey(course);
            const isEditing = editKey === currentKey;
            return (
              <div key={currentKey} className="rounded-md border border-border p-3">
                {!isEditing && (
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Text weight="semibold">{course.course_name}</Text>
                      <Text size="sm" className="text-muted-foreground">
                        {course.degree_level} | Units: {course.units_completed ?? "N/A"} |
                        Finished: {course.is_finished ? "Yes" : "No"}
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
                              course.units_completed == null ? "" : String(course.units_completed),
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
                        onChange={(v) => setEditForm((s) => ({ ...s, course_name: v }))}
                      />
                      <div className="space-y-1">
                        <Label>Degree Level</Label>
                        <select
                          className="bg-card border-border rounded-lg border px-2.5 py-1 text-sm"
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
                          <Text size="xs" className="text-destructive">
                            {editErrors.degree_level}
                          </Text>
                        )}
                      </div>
                      <EmployeeField
                        label="Units Completed"
                        type="number"
                        value={editForm.units_completed}
                        error={editErrors.units_completed}
                        onChange={(v) => setEditForm((s) => ({ ...s, units_completed: v }))}
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
                      <Button disabled={editBusy} onClick={() => void onSaveEdit()}>
                        Save Course
                      </Button>
                      <Button variant="glass" disabled={editBusy} onClick={() => setEditKey(null)}>
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
