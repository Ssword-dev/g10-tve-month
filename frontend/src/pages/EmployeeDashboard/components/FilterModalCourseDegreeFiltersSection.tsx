import type { DegreeLevel } from "@/domain/employees/types";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Text from "@/components/Text";
import { Plus, X } from "lucide-react";

type CourseFilterMode = "has_specific" | "has_any" | "only_has";

interface CourseFilterState {
  id: string;
  mode: CourseFilterMode;
  degree_level: DegreeLevel;
  course_name: string;
}

interface FilterModalCourseDegreeFiltersSectionProps {
  courseFilters: CourseFilterState[];
  degreeLevelOptions: DegreeLevel[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdateMode: (id: string, mode: CourseFilterMode) => void;
  onUpdateDegreeLevel: (id: string, degreeLevel: DegreeLevel) => void;
  onUpdateCourseName: (id: string, courseName: string) => void;
}

export function FilterModalCourseDegreeFiltersSection({
  courseFilters,
  degreeLevelOptions,
  onAdd,
  onRemove,
  onUpdateMode,
  onUpdateDegreeLevel,
  onUpdateCourseName,
}: FilterModalCourseDegreeFiltersSectionProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Text weight="semibold">Course Degree Filters (AND)</Text>
        <Button
          type="button"
          size="sm"
          className="w-full px-2 py-1 sm:w-auto"
          onClick={onAdd}
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Course Filter
        </Button>
      </div>

      <div className="space-y-3">
        {courseFilters.length === 0 ? (
          <Text size="sm" className="text-muted-foreground">
            Add course filters for degree-based matching.
          </Text>
        ) : (
          courseFilters.map((courseFilter) => (
            <div
              key={courseFilter.id}
              className="space-y-3 rounded-md border border-border bg-muted/15 p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={courseFilter.mode}
                  onChange={(event) =>
                    onUpdateMode(
                      courseFilter.id,
                      event.target.value as CourseFilterMode,
                    )
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm sm:w-auto"
                >
                  <option value="has_specific">has specific</option>
                  <option value="has_any">has any</option>
                  <option value="only_has">only has</option>
                </select>

                <select
                  value={courseFilter.degree_level}
                  onChange={(event) =>
                    onUpdateDegreeLevel(
                      courseFilter.id,
                      event.target.value as DegreeLevel,
                    )
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm sm:w-auto"
                >
                  {degreeLevelOptions.map((degreeLevel) => (
                    <option key={degreeLevel} value={degreeLevel}>
                      {degreeLevel}
                    </option>
                  ))}
                </select>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="px-2 py-1 text-muted-foreground hover:text-destructive sm:ml-auto"
                  onClick={() => onRemove(courseFilter.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {courseFilter.mode === "has_specific" ? (
                <Input
                  value={courseFilter.course_name}
                  onChange={(event) =>
                    onUpdateCourseName(courseFilter.id, event.target.value)
                  }
                  placeholder="Course name contains..."
                  className="w-full"
                />
              ) : null}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
