import { useEffect, useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type {
  AnyFieldFilter,
  DegreeLevel,
  Employee,
  CourseDegreeFilter,
  FilterEmployeesPayload,
  FilterExpression,
} from "@/domain/employees/types";
import Button from "@/components/Button";
import Card from "@/components/Card";
import CardAction from "@/components/CardAction";
import CardContent from "@/components/CardContent";
import CardHeader from "@/components/CardHeader";
import CardTitle from "@/components/CardTitle";
import Dialog from "@/components/Dialog";
import DialogContent from "@/components/DialogContent";
import Input from "@/components/Input";
import Text from "@/components/Text";

import {
  booleanOperators,
  dateOperators,
  employeeFields,
  numberOperators,
  stringOperators,
  type EmployeeFieldType,
} from "./filterBuilderShared";
import { defaultEmployeeFilter } from "../queries";
import { SortField } from "./SortField";
import { SortableItem } from "./SortableItem";
import { FilterModalIncludeColumnsSection } from "./FilterModalIncludeColumnsSection";
import { FilterModalCourseDegreeFiltersSection } from "./FilterModalCourseDegreeFiltersSection";

type NullMode = "is_not_null" | "is_null" | "nullable";

type RuleState = {
  id: string;
  operator: string;
  value: string;
  valueTo: string;
  valuesCsv: string;
};

type ColumnFilterState = {
  id: string;
  field: keyof Employee;
  nullMode: NullMode;
  rules: RuleState[];
};

type SortRuleState = {
  id: string;
  basis: keyof Employee;
  direction: "asc" | "desc";
};

type CourseFilterMode = "has_specific" | "has_any" | "only_has";

type CourseFilterState = {
  id: string;
  mode: CourseFilterMode;
  degree_level: DegreeLevel;
  course_name: string;
};

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filter: FilterEmployeesPayload) => void;
  initialFilter?: FilterEmployeesPayload;
  allowedFields?: Array<keyof Employee>;
}

const createRule = (fieldType: EmployeeFieldType): RuleState => {
  if (fieldType === "number") {
    return {
      id: crypto.randomUUID(),
      operator: "gte",
      value: "",
      valueTo: "",
      valuesCsv: "",
    };
  }

  if (fieldType === "date") {
    return {
      id: crypto.randomUUID(),
      operator: "gte",
      value: "",
      valueTo: "",
      valuesCsv: "",
    };
  }

  if (fieldType === "boolean") {
    return {
      id: crypto.randomUUID(),
      operator: "eq",
      value: "true",
      valueTo: "",
      valuesCsv: "",
    };
  }

  return {
    id: crypto.randomUUID(),
    operator: "startsWith",
    value: "",
    valueTo: "",
    valuesCsv: "",
  };
};

const getFieldMeta = (field: keyof Employee) =>
  employeeFields.find((entry) => entry.value === field) ?? employeeFields[0];

const getOperators = (fieldType: EmployeeFieldType) => {
  if (fieldType === "number") return numberOperators;
  if (fieldType === "date") return dateOperators;
  if (fieldType === "boolean") return booleanOperators;
  return stringOperators;
};

function toComparison(rule: RuleState, fieldType: EmployeeFieldType) {
  if (rule.operator === "between") {
    if (fieldType === "number") {
      const min = Number(rule.value);
      const max = Number(rule.valueTo);
      if (Number.isNaN(min) || Number.isNaN(max)) return null;
      return { type: "between", min, max };
    }

    if (fieldType === "date") {
      if (!rule.value || !rule.valueTo) return null;
      return { type: "between", from: rule.value, to: rule.valueTo };
    }

    return null;
  }

  if (rule.operator === "in") {
    const operands = rule.valuesCsv
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    if (operands.length === 0) return null;
    return { type: "in", operands };
  }

  if (fieldType === "number") {
    const operand = Number(rule.value);
    if (Number.isNaN(operand)) return null;
    return { type: rule.operator, operand };
  }

  if (fieldType === "boolean") {
    return { type: rule.operator, operand: rule.value === "true" };
  }

  if (!rule.value.trim()) return null;
  return { type: rule.operator, operand: rule.value.trim() };
}

const defaultFields: FilterEmployeesPayload["fields"] =
  defaultEmployeeFilter.fields;

const normalizeSortRules = (
  rules: NonNullable<FilterEmployeesPayload["sort"]>,
): SortRuleState[] =>
  rules.map((rule) => ({
    id: crypto.randomUUID(),
    basis: rule.basis,
    direction: rule.direction,
  }));

const normalizeCourseFilters = (
  filters: NonNullable<FilterEmployeesPayload["course_filters"]>,
): CourseFilterState[] =>
  filters.map((filter) => ({
    id: crypto.randomUUID(),
    mode: filter.mode,
    degree_level: filter.degree_level,
    course_name: filter.course_name ?? "",
  }));

const degreeLevelOptions: DegreeLevel[] = ["bachelor", "master", "doctorate"];

export function FilterModal({
  open,
  onClose,
  onApply,
  initialFilter,
  allowedFields,
}: FilterModalProps) {
  const [fields, setFields] = useState<FilterEmployeesPayload["fields"]>(
    initialFilter?.fields ?? defaultFields,
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFilterState[]>([]);
  const [sortRules, setSortRules] = useState<SortRuleState[]>(
    normalizeSortRules(initialFilter?.sort ?? defaultEmployeeFilter.sort ?? []),
  );
  const [courseFilters, setCourseFilters] = useState<CourseFilterState[]>(
    normalizeCourseFilters(initialFilter?.course_filters ?? []),
  );
  const sortSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const availableFields = useMemo(() => {
    if (!allowedFields || allowedFields.length === 0) {
      return employeeFields;
    }

    const allowed = new Set(allowedFields);
    return employeeFields.filter((field) => allowed.has(field.value));
  }, [allowedFields]);

  useEffect(() => {
    if (availableFields.length === 0) {
      return;
    }

    const allowed = new Set(availableFields.map((field) => field.value));

    setColumnFilters((current) =>
      current.filter((columnFilter) => allowed.has(columnFilter.field)),
    );

    setFields((current) => {
      const nextInclude =
        current.include === "ALL"
          ? "ALL"
          : current.include.filter((field) => allowed.has(field));

      return { include: nextInclude, exclude: "NONE" };
    });

    setSortRules((current) =>
      current.filter((rule) => allowed.has(rule.basis)),
    );
  }, [availableFields]);

  const usedFields = useMemo(
    () => new Set(columnFilters.map((columnFilter) => columnFilter.field)),
    [columnFilters],
  );
  const usedSortFields = useMemo(
    () => new Set(sortRules.map((rule) => rule.basis)),
    [sortRules],
  );

  const addColumnFilter = () => {
    const next = availableFields.find((field) => !usedFields.has(field.value));
    if (!next) return;

    setColumnFilters((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        field: next.value,
        nullMode: "is_not_null",
        rules: [createRule(next.type)],
      },
    ]);
  };

  const removeColumnFilter = (id: string) => {
    setColumnFilters((current) =>
      current.filter((columnFilter) => columnFilter.id !== id),
    );
  };

  const updateColumnFilter = (
    id: string,
    updater: (current: ColumnFilterState) => ColumnFilterState,
  ) => {
    setColumnFilters((current) =>
      current.map((columnFilter) =>
        columnFilter.id === id ? updater(columnFilter) : columnFilter,
      ),
    );
  };

  const addRule = (columnId: string) => {
    updateColumnFilter(columnId, (columnFilter) => {
      const meta = getFieldMeta(columnFilter.field);
      return {
        ...columnFilter,
        rules: [...columnFilter.rules, createRule(meta.type)],
      };
    });
  };

  const removeRule = (columnId: string, ruleId: string) => {
    updateColumnFilter(columnId, (columnFilter) => {
      const nextRules = columnFilter.rules.filter((rule) => rule.id !== ruleId);
      return {
        ...columnFilter,
        rules:
          nextRules.length > 0
            ? nextRules
            : [createRule(getFieldMeta(columnFilter.field).type)],
      };
    });
  };

  const addSortRule = () => {
    const nextField = availableFields.find(
      (field) => !usedSortFields.has(field.value),
    );
    if (!nextField) {
      return;
    }

    setSortRules((current) => [
      ...current,
      { id: crypto.randomUUID(), basis: nextField.value, direction: "asc" },
    ]);
  };

  const updateSortRule = (
    id: string,
    basis: keyof Employee,
    direction: "asc" | "desc",
  ) => {
    setSortRules((current) =>
      current.map((rule) =>
        rule.id === id ? { ...rule, basis, direction } : rule,
      ),
    );
  };

  const removeSortRule = (id: string) => {
    setSortRules((current) => current.filter((rule) => rule.id !== id));
  };

  const addCourseFilter = () => {
    setCourseFilters((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        mode: "has_any",
        degree_level: "bachelor",
        course_name: "",
      },
    ]);
  };

  const updateCourseFilter = (
    id: string,
    updater: (current: CourseFilterState) => CourseFilterState,
  ) => {
    setCourseFilters((current) =>
      current.map((courseFilter) =>
        courseFilter.id === id ? updater(courseFilter) : courseFilter,
      ),
    );
  };

  const removeCourseFilter = (id: string) => {
    setCourseFilters((current) =>
      current.filter((courseFilter) => courseFilter.id !== id),
    );
  };

  const reorderSortRules = (activeId: string, overId: string) => {
    if (activeId === overId) return;

    setSortRules((current) => {
      const oldIndex = current.findIndex((rule) => rule.id === activeId);
      const newIndex = current.findIndex((rule) => rule.id === overId);

      if (oldIndex === -1 || newIndex === -1) {
        return current;
      }

      return arrayMove(current, oldIndex, newIndex);
    });
  };

  const toggleIncludeColumn = (field: keyof Employee) => {
    setFields((current) => {
      const currentInclude = current.include === "ALL" ? [] : current.include;
      const isSelected = currentInclude.includes(field);
      const nextInclude = isSelected
        ? currentInclude.filter((item) => item !== field)
        : [...currentInclude, field];

      return {
        include: nextInclude.length === 0 ? "ALL" : nextInclude,
        exclude: "NONE",
      };
    });
  };

  const buildColumnExpression = (
    columnFilter: ColumnFilterState,
  ): FilterExpression | null => {
    const meta = getFieldMeta(columnFilter.field);
    const comparisons = columnFilter.rules
      .map((rule) => toComparison(rule, meta.type))
      .filter(
        (
          comparison,
        ): comparison is NonNullable<AnyFieldFilter["comparisons"]>[number] =>
          comparison !== null,
      );

    if (columnFilter.nullMode === "is_null") {
      return {
        field: columnFilter.field,
        null: { is_null: true },
      } as AnyFieldFilter;
    }

    if (columnFilter.nullMode === "nullable") {
      if (comparisons.length === 0) return null;

      return {
        type: "or",
        filters: [
          { field: columnFilter.field, comparisons } as AnyFieldFilter,
          {
            field: columnFilter.field,
            null: { is_null: true },
          } as AnyFieldFilter,
        ],
      };
    }

    if (comparisons.length === 0) {
      return {
        field: columnFilter.field,
        null: { is_null: false },
      } as AnyFieldFilter;
    }

    return {
      field: columnFilter.field,
      comparisons,
      null: { is_null: false },
    } as AnyFieldFilter;
  };

  const handleApply = () => {
    const expressions = columnFilters
      .map(buildColumnExpression)
      .filter(
        (expression): expression is FilterExpression => expression !== null,
      );

    const where =
      expressions.length === 0
        ? undefined
        : expressions.length === 1
          ? expressions[0]
          : ({ type: "and", filters: expressions } as FilterExpression);

    const normalizedFields: FilterEmployeesPayload["fields"] = {
      include:
        fields.include === "ALL" ? "ALL" : Array.from(new Set(fields.include)),
      exclude: "NONE",
    };

    const normalizedCourseFilters: CourseDegreeFilter[] = [];
    for (const courseFilter of courseFilters) {
      const mode = courseFilter.mode;
      const degree_level = courseFilter.degree_level;
      const courseName = courseFilter.course_name.trim();

      if (mode === "has_specific") {
        if (!courseName) {
          continue;
        }

        normalizedCourseFilters.push({
          mode,
          degree_level,
          course_name: courseName,
        });
        continue;
      }

      normalizedCourseFilters.push({
        mode,
        degree_level,
      });
    }

    onApply({
      fields: normalizedFields,
      where,
      page: initialFilter?.page ?? 1,
      limit: initialFilter?.limit ?? 50,
      sort: sortRules.map(({ basis, direction }) => ({ basis, direction })),
      course_filters:
        normalizedCourseFilters.length > 0
          ? normalizedCourseFilters
          : undefined,
    });
    onClose();
  };

  const handleReset = () => {
    setFields(defaultFields);
    setColumnFilters([]);
    setSortRules(normalizeSortRules(defaultEmployeeFilter.sort ?? []));
    setCourseFilters([]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="h-[92vh] w-[96vw] max-w-6xl overflow-y-auto p-0 no-scrollbar">
        <Card className="flex h-full min-h-0 flex-col border-border bg-card p-0 no-scrollbar">
          <CardHeader className="border-b border-border px-6 py-4">
            <CardTitle className="text-xl font-semibold text-foreground">
              Filters
            </CardTitle>
          </CardHeader>

          {/* scrollbar looks ugly in this container and has niche uses. */}
          <CardContent className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto px-6 py-4 no-scrollbar">
            <FilterModalIncludeColumnsSection
              availableFields={availableFields}
              include={fields.include}
              onToggle={toggleIncludeColumn}
            />

            <section className="rounded-lg border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <Text weight="semibold">Column Filters (AND)</Text>
                <Button
                  type="button"
                  size="sm"
                  className="px-2 py-1"
                  onClick={addColumnFilter}
                  disabled={usedFields.size >= availableFields.length}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Column
                </Button>
              </div>

              <div className="space-y-3">
                {columnFilters.length === 0 ? (
                  <Text size="sm" className="text-muted-foreground">
                    Add a column filter to start building conditions.
                  </Text>
                ) : (
                  columnFilters.map((columnFilter) => {
                    const meta = getFieldMeta(columnFilter.field);
                    const operators = getOperators(meta.type);

                    return (
                      <div
                        key={columnFilter.id}
                        className="space-y-3 rounded-md border border-border bg-muted/15 p-3"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            value={columnFilter.field}
                            onChange={(event) => {
                              const nextField = event.target
                                .value as keyof Employee;
                              updateColumnFilter(columnFilter.id, () => {
                                const nextMeta = getFieldMeta(nextField);
                                return {
                                  ...columnFilter,
                                  field: nextField,
                                  nullMode: "is_not_null",
                                  rules: [createRule(nextMeta.type)],
                                };
                              });
                            }}
                            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
                          >
                            {availableFields.map((field) => {
                              const usedByOther =
                                usedFields.has(field.value) &&
                                field.value !== columnFilter.field;
                              return (
                                <option
                                  key={field.value}
                                  value={field.value}
                                  disabled={usedByOther}
                                >
                                  {field.label}
                                </option>
                              );
                            })}
                          </select>

                          <select
                            value={columnFilter.nullMode}
                            onChange={(event) =>
                              updateColumnFilter(
                                columnFilter.id,
                                (current) => ({
                                  ...current,
                                  nullMode: event.target.value as NullMode,
                                }),
                              )
                            }
                            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
                          >
                            <option value="is_not_null">
                              is not null (default)
                            </option>
                            {meta.nullable && (
                              <option value="nullable">
                                nullable (allow unknown)
                              </option>
                            )}
                            {meta.nullable && (
                              <option value="is_null">is null only</option>
                            )}
                          </select>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="ml-auto px-2 py-1 text-muted-foreground hover:text-destructive"
                            onClick={() => removeColumnFilter(columnFilter.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {columnFilter.rules.map((rule) => (
                          <div
                            key={rule.id}
                            className="flex flex-wrap items-center gap-2"
                          >
                            <select
                              value={rule.operator}
                              onChange={(event) =>
                                updateColumnFilter(
                                  columnFilter.id,
                                  (current) => ({
                                    ...current,
                                    rules: current.rules.map((entry) =>
                                      entry.id === rule.id
                                        ? {
                                            ...entry,
                                            operator: event.target.value,
                                            value: "",
                                            valueTo: "",
                                            valuesCsv: "",
                                          }
                                        : entry,
                                    ),
                                  }),
                                )
                              }
                              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
                            >
                              {operators.map((operator) => (
                                <option
                                  key={operator.value}
                                  value={operator.value}
                                >
                                  {operator.label}
                                </option>
                              ))}
                            </select>

                            {rule.operator === "between" ? (
                              <>
                                <Input
                                  type={
                                    meta.type === "date" ? "date" : "number"
                                  }
                                  value={rule.value}
                                  onChange={(event) =>
                                    updateColumnFilter(
                                      columnFilter.id,
                                      (current) => ({
                                        ...current,
                                        rules: current.rules.map((entry) =>
                                          entry.id === rule.id
                                            ? {
                                                ...entry,
                                                value: event.target.value,
                                              }
                                            : entry,
                                        ),
                                      }),
                                    )
                                  }
                                  className="w-36"
                                />
                                <Input
                                  type={
                                    meta.type === "date" ? "date" : "number"
                                  }
                                  value={rule.valueTo}
                                  onChange={(event) =>
                                    updateColumnFilter(
                                      columnFilter.id,
                                      (current) => ({
                                        ...current,
                                        rules: current.rules.map((entry) =>
                                          entry.id === rule.id
                                            ? {
                                                ...entry,
                                                valueTo: event.target.value,
                                              }
                                            : entry,
                                        ),
                                      }),
                                    )
                                  }
                                  className="w-36"
                                />
                              </>
                            ) : rule.operator === "in" ? (
                              <Input
                                value={rule.valuesCsv}
                                onChange={(event) =>
                                  updateColumnFilter(
                                    columnFilter.id,
                                    (current) => ({
                                      ...current,
                                      rules: current.rules.map((entry) =>
                                        entry.id === rule.id
                                          ? {
                                              ...entry,
                                              valuesCsv: event.target.value,
                                            }
                                          : entry,
                                      ),
                                    }),
                                  )
                                }
                                placeholder="value1, value2"
                                className="min-w-56"
                              />
                            ) : meta.type === "boolean" ? (
                              <select
                                value={rule.value}
                                onChange={(event) =>
                                  updateColumnFilter(
                                    columnFilter.id,
                                    (current) => ({
                                      ...current,
                                      rules: current.rules.map((entry) =>
                                        entry.id === rule.id
                                          ? {
                                              ...entry,
                                              value: event.target.value,
                                            }
                                          : entry,
                                      ),
                                    }),
                                  )
                                }
                                className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
                              >
                                <option value="true">true</option>
                                <option value="false">false</option>
                              </select>
                            ) : (
                              <Input
                                type={
                                  meta.type === "number"
                                    ? "number"
                                    : meta.type === "date"
                                      ? "date"
                                      : "text"
                                }
                                value={rule.value}
                                onChange={(event) =>
                                  updateColumnFilter(
                                    columnFilter.id,
                                    (current) => ({
                                      ...current,
                                      rules: current.rules.map((entry) =>
                                        entry.id === rule.id
                                          ? {
                                              ...entry,
                                              value: event.target.value,
                                            }
                                          : entry,
                                      ),
                                    }),
                                  )
                                }
                                className="w-56"
                              />
                            )}

                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="px-2 py-1 text-muted-foreground hover:text-destructive"
                              onClick={() =>
                                removeRule(columnFilter.id, rule.id)
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}

                        <Button
                          type="button"
                          size="sm"
                          className="px-2 py-1"
                          onClick={() => addRule(columnFilter.id)}
                        >
                          <Plus className="mr-1 h-4 w-4" />
                          Add Condition
                        </Button>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            <FilterModalCourseDegreeFiltersSection
              courseFilters={courseFilters}
              degreeLevelOptions={degreeLevelOptions}
              onAdd={addCourseFilter}
              onRemove={removeCourseFilter}
              onUpdateMode={(id, mode) =>
                updateCourseFilter(id, (current) => ({ ...current, mode }))
              }
              onUpdateDegreeLevel={(id, degreeLevel) =>
                updateCourseFilter(id, (current) => ({
                  ...current,
                  degree_level: degreeLevel,
                }))
              }
              onUpdateCourseName={(id, courseName) =>
                updateCourseFilter(id, (current) => ({
                  ...current,
                  course_name: courseName,
                }))
              }
            />

            <section className="rounded-lg border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <Text weight="semibold">Sort</Text>
                <Button
                  type="button"
                  size="sm"
                  className="px-2 py-1"
                  onClick={addSortRule}
                  disabled={usedSortFields.size >= availableFields.length}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Sort
                </Button>
              </div>

              <div className="space-y-2">
                {sortRules.length === 0 ? (
                  <Text size="sm" className="text-muted-foreground">
                    No sort rules added. Backend default ordering will be used.
                  </Text>
                ) : (
                  <DndContext
                    sensors={sortSensors}
                    collisionDetection={closestCenter}
                    onDragEnd={({ active, over }) => {
                      if (!over) return;
                      reorderSortRules(String(active.id), String(over.id));
                    }}
                  >
                    <SortableContext
                      items={sortRules.map((rule) => rule.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {sortRules.map((rule) => (
                          <SortableItem key={rule.id} id={rule.id}>
                            <SortField
                              allowedFields={availableFields.map(
                                (field) => field.value,
                              )}
                              basis={rule.basis}
                              direction={rule.direction}
                              onChange={(basis, direction) =>
                                updateSortRule(rule.id, basis, direction)
                              }
                              onRemove={() => removeSortRule(rule.id)}
                            />
                          </SortableItem>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </section>
          </CardContent>

          <CardAction className="border-t border-border px-6 py-4">
            <div className="ml-auto flex items-center gap-3">
              <Button
                variant="primary"
                className="px-2 py-1"
                onClick={handleApply}
              >
                Apply Filters
              </Button>
              <Button
                type="button"
                variant="outline"
                className="px-2 py-1"
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>
          </CardAction>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
