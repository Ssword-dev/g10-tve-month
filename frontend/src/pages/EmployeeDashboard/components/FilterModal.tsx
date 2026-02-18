import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";

import type {
  AnyFieldFilter,
  Employee,
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

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filter: FilterEmployeesPayload) => void;
  initialFilter?: FilterEmployeesPayload;
}

const createRule = (fieldType: EmployeeFieldType): RuleState => {
  if (fieldType === "number") {
    return { id: crypto.randomUUID(), operator: "gte", value: "", valueTo: "", valuesCsv: "" };
  }

  if (fieldType === "date") {
    return { id: crypto.randomUUID(), operator: "gte", value: "", valueTo: "", valuesCsv: "" };
  }

  if (fieldType === "boolean") {
    return { id: crypto.randomUUID(), operator: "eq", value: "true", valueTo: "", valuesCsv: "" };
  }

  return { id: crypto.randomUUID(), operator: "startsWith", value: "", valueTo: "", valuesCsv: "" };
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

const defaultFields: FilterEmployeesPayload["fields"] = {
  include: "ALL",
  exclude: "NONE",
};

export function FilterModal({ open, onClose, onApply, initialFilter }: FilterModalProps) {
  const [fields, setFields] = useState<FilterEmployeesPayload["fields"]>(
    initialFilter?.fields ?? defaultFields,
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFilterState[]>([]);

  const usedFields = useMemo(
    () => new Set(columnFilters.map((columnFilter) => columnFilter.field)),
    [columnFilters],
  );

  const addColumnFilter = () => {
    const next = employeeFields.find((field) => !usedFields.has(field.value));
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
    setColumnFilters((current) => current.filter((columnFilter) => columnFilter.id !== id));
  };

  const updateColumnFilter = (id: string, updater: (current: ColumnFilterState) => ColumnFilterState) => {
    setColumnFilters((current) =>
      current.map((columnFilter) => (columnFilter.id === id ? updater(columnFilter) : columnFilter)),
    );
  };

  const addRule = (columnId: string) => {
    updateColumnFilter(columnId, (columnFilter) => {
      const meta = getFieldMeta(columnFilter.field);
      return { ...columnFilter, rules: [...columnFilter.rules, createRule(meta.type)] };
    });
  };

  const removeRule = (columnId: string, ruleId: string) => {
    updateColumnFilter(columnId, (columnFilter) => {
      const nextRules = columnFilter.rules.filter((rule) => rule.id !== ruleId);
      return {
        ...columnFilter,
        rules: nextRules.length > 0 ? nextRules : [createRule(getFieldMeta(columnFilter.field).type)],
      };
    });
  };

  const toggleIncludeColumn = (field: keyof Employee) => {
    const currentInclude = fields.include === "ALL" ? [] : fields.include;
    const nextInclude = currentInclude.includes(field)
      ? currentInclude.filter((item) => item !== field)
      : [...currentInclude, field];

    setFields({ include: nextInclude.length === 0 ? "ALL" : nextInclude, exclude: "NONE" });
  };

  const toggleExcludeColumn = (field: keyof Employee) => {
    const currentExclude = fields.exclude === "NONE" ? [] : fields.exclude;
    const nextExclude = currentExclude.includes(field)
      ? currentExclude.filter((item) => item !== field)
      : [...currentExclude, field];

    setFields({ include: "ALL", exclude: nextExclude.length === 0 ? "NONE" : nextExclude });
  };

  const buildColumnExpression = (columnFilter: ColumnFilterState): FilterExpression | null => {
    const meta = getFieldMeta(columnFilter.field);
    const comparisons = columnFilter.rules
      .map((rule) => toComparison(rule, meta.type))
      .filter((comparison): comparison is NonNullable<AnyFieldFilter["comparisons"]>[number] => comparison !== null);

    if (columnFilter.nullMode === "is_null") {
      return { field: columnFilter.field, null: { is_null: true } } as AnyFieldFilter;
    }

    if (columnFilter.nullMode === "nullable") {
      if (comparisons.length === 0) return null;

      return {
        type: "or",
        filters: [
          { field: columnFilter.field, comparisons } as AnyFieldFilter,
          { field: columnFilter.field, null: { is_null: true } } as AnyFieldFilter,
        ],
      };
    }

    if (comparisons.length === 0) {
      return { field: columnFilter.field, null: { is_null: false } } as AnyFieldFilter;
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
      .filter((expression): expression is FilterExpression => expression !== null);

    const where =
      expressions.length === 0
        ? undefined
        : expressions.length === 1
          ? expressions[0]
          : ({ type: "and", filters: expressions } as FilterExpression);

    onApply({
      fields,
      where,
      page: initialFilter?.page ?? 1,
      limit: initialFilter?.limit ?? 50,
      sort: initialFilter?.sort ?? [],
    });
    onClose();
  };

  const handleReset = () => {
    setFields(defaultFields);
    setColumnFilters([]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="h-[92vh] w-[96vw] max-w-6xl overflow-y-auto p-0">
        <Card className="flex h-full min-h-0 flex-col border-border bg-card p-0">
          <CardHeader className="border-b border-border px-6 py-4">
            <CardTitle className="text-xl font-semibold text-foreground">Filters</CardTitle>
          </CardHeader>

          <CardContent className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto px-6 py-4">
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-border bg-muted/20 p-3">
                <Text size="sm" weight="semibold" className="mb-2">
                  Include Columns
                </Text>
                <div className="grid max-h-52 grid-cols-2 gap-2 overflow-y-auto">
                  {employeeFields.map((field) => {
                    const selected = fields.include !== "ALL" && fields.include.includes(field.value);
                    return (
                      <label key={`include-${field.value}`} className="flex items-center gap-2 rounded-md p-2 hover:bg-muted/50">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleIncludeColumn(field.value)}
                        />
                        <span className="text-xs">{field.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-muted/20 p-3">
                <Text size="sm" weight="semibold" className="mb-2">
                  Exclude Columns
                </Text>
                <div className="grid max-h-52 grid-cols-2 gap-2 overflow-y-auto">
                  {employeeFields.map((field) => {
                    const selected = fields.exclude !== "NONE" && fields.exclude.includes(field.value);
                    return (
                      <label key={`exclude-${field.value}`} className="flex items-center gap-2 rounded-md p-2 hover:bg-muted/50">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleExcludeColumn(field.value)}
                        />
                        <span className="text-xs">{field.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <Text weight="semibold">Column Filters (AND)</Text>
                <Button type="button" size="sm" onClick={addColumnFilter} disabled={usedFields.size >= employeeFields.length}>
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
                      <div key={columnFilter.id} className="space-y-3 rounded-md border border-border bg-muted/15 p-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            value={columnFilter.field}
                            onChange={(event) => {
                              const nextField = event.target.value as keyof Employee;
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
                            {employeeFields.map((field) => {
                              const usedByOther = usedFields.has(field.value) && field.value !== columnFilter.field;
                              return (
                                <option key={field.value} value={field.value} disabled={usedByOther}>
                                  {field.label}
                                </option>
                              );
                            })}
                          </select>

                          <select
                            value={columnFilter.nullMode}
                            onChange={(event) =>
                              updateColumnFilter(columnFilter.id, (current) => ({
                                ...current,
                                nullMode: event.target.value as NullMode,
                              }))
                            }
                            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
                          >
                            <option value="is_not_null">is not null (default)</option>
                            {meta.nullable && <option value="nullable">nullable (allow unknown)</option>}
                            {meta.nullable && <option value="is_null">is null only</option>}
                          </select>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="ml-auto text-muted-foreground hover:text-destructive"
                            onClick={() => removeColumnFilter(columnFilter.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {columnFilter.rules.map((rule) => (
                          <div key={rule.id} className="flex flex-wrap items-center gap-2">
                            <select
                              value={rule.operator}
                              onChange={(event) =>
                                updateColumnFilter(columnFilter.id, (current) => ({
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
                                }))
                              }
                              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
                            >
                              {operators.map((operator) => (
                                <option key={operator.value} value={operator.value}>
                                  {operator.label}
                                </option>
                              ))}
                            </select>

                            {rule.operator === "between" ? (
                              <>
                                <Input
                                  type={meta.type === "date" ? "date" : "number"}
                                  value={rule.value}
                                  onChange={(event) =>
                                    updateColumnFilter(columnFilter.id, (current) => ({
                                      ...current,
                                      rules: current.rules.map((entry) =>
                                        entry.id === rule.id ? { ...entry, value: event.target.value } : entry,
                                      ),
                                    }))
                                  }
                                  className="w-36"
                                />
                                <Input
                                  type={meta.type === "date" ? "date" : "number"}
                                  value={rule.valueTo}
                                  onChange={(event) =>
                                    updateColumnFilter(columnFilter.id, (current) => ({
                                      ...current,
                                      rules: current.rules.map((entry) =>
                                        entry.id === rule.id ? { ...entry, valueTo: event.target.value } : entry,
                                      ),
                                    }))
                                  }
                                  className="w-36"
                                />
                              </>
                            ) : rule.operator === "in" ? (
                              <Input
                                value={rule.valuesCsv}
                                onChange={(event) =>
                                  updateColumnFilter(columnFilter.id, (current) => ({
                                    ...current,
                                    rules: current.rules.map((entry) =>
                                      entry.id === rule.id ? { ...entry, valuesCsv: event.target.value } : entry,
                                    ),
                                  }))
                                }
                                placeholder="value1, value2"
                                className="min-w-56"
                              />
                            ) : meta.type === "boolean" ? (
                              <select
                                value={rule.value}
                                onChange={(event) =>
                                  updateColumnFilter(columnFilter.id, (current) => ({
                                    ...current,
                                    rules: current.rules.map((entry) =>
                                      entry.id === rule.id ? { ...entry, value: event.target.value } : entry,
                                    ),
                                  }))
                                }
                                className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
                              >
                                <option value="true">true</option>
                                <option value="false">false</option>
                              </select>
                            ) : (
                              <Input
                                type={meta.type === "number" ? "number" : meta.type === "date" ? "date" : "text"}
                                value={rule.value}
                                onChange={(event) =>
                                  updateColumnFilter(columnFilter.id, (current) => ({
                                    ...current,
                                    rules: current.rules.map((entry) =>
                                      entry.id === rule.id ? { ...entry, value: event.target.value } : entry,
                                    ),
                                  }))
                                }
                                className="w-56"
                              />
                            )}

                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => removeRule(columnFilter.id, rule.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}

                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
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
          </CardContent>

          <CardAction className="border-t border-border px-6 py-4">
            <div className="ml-auto flex items-center gap-3">
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button type="button" onClick={handleApply}>
                Apply Filters
              </Button>
            </div>
          </CardAction>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
