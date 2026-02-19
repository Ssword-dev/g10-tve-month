import { X } from "lucide-react";

import { cn } from "@_ssword/classes";
import type {
  AnyFieldFilter,
  BooleanComparison,
  DateComparison,
  NumberComparison,
  StringComparison,
} from "@/domain/employees/types";
import Button from "@/components/Button";
import Card from "@/components/Card";

import { employeeFields } from "./filterBuilderShared";
import { FieldSelector } from "./FieldSelector";
import { OperatorSelector } from "./OperatorSelector";
import { SortableItem } from "./SortableItem";
import { ValueInput } from "./ValueInput";

interface FilterConditionProps {
  id: string;
  filter: AnyFieldFilter;
  onChange: (filter: AnyFieldFilter) => void;
  onRemove: () => void;
}

export function FilterCondition({ id, filter, onChange, onRemove }: FilterConditionProps) {
  const fieldInfo = employeeFields.find((f) => f.value === filter.field);
  const fieldType = fieldInfo?.type || "string";
  type FilterComparison = NonNullable<AnyFieldFilter["comparisons"]>[number];

  const updateComparison = (comparison: FilterComparison, index: number) => {
    const newComparisons = [...((filter.comparisons || []) as FilterComparison[])];
    newComparisons[index] = comparison;
    onChange({ ...filter, comparisons: newComparisons } as AnyFieldFilter);
  };

  const removeComparison = (index: number) => {
    const newComparisons = filter.comparisons?.filter((_, i) => i !== index);
    onChange({ ...filter, comparisons: newComparisons } as AnyFieldFilter);
  };

  const addComparison = () => {
    const defaultComparison: FilterComparison =
      fieldType === "number"
        ? ({ type: "eq", operand: 0 } as NumberComparison)
        : fieldType === "boolean"
          ? ({ type: "eq", operand: true } as BooleanComparison)
          : ({ type: "eq", operand: "" } as StringComparison | DateComparison);
    onChange({
      ...filter,
      comparisons: [
        ...((filter.comparisons || []) as FilterComparison[]),
        defaultComparison,
      ],
    } as AnyFieldFilter);
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
      <Card className="border-border bg-card p-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FieldSelector value={filter.field} onChange={(field) => onChange({ ...filter, field })} />
            <Button
              type="button"
              variant={filter.null ? "default" : "outline"}
              size="sm"
              onClick={toggleNull}
              className={cn(
                "px-2 py-1 text-xs",
                filter.null && "bg-primary text-primary-foreground",
              )}
            >
              {filter.null?.is_null ? "IS NULL" : filter.null ? "NOT NULL" : "Nullable"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="ml-auto px-2 py-1 text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {!filter.null && (
            <div className="space-y-2 pl-2">
              {filter.comparisons?.map((comp, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <OperatorSelector
                    fieldType={fieldType}
                    value={comp.type}
                    onChange={(type) =>
                      updateComparison({ ...comp, type } as FilterComparison, idx)
                    }
                  />
                  <ValueInput
                    fieldType={fieldType}
                    operator={comp.type}
                    value={
                      "operand" in comp
                        ? comp.operand
                        : "operands" in comp
                          ? comp.operands
                          : "min" in comp
                          ? { min: comp.min, max: comp.max }
                          : { min: comp.from, max: comp.to }
                    }
                    onChange={(val) => {
                      if ("min" in comp && "max" in comp) {
                        updateComparison({ ...comp, min: val.min, max: val.max }, idx);
                      } else if ("from" in comp && "to" in comp) {
                        updateComparison({ ...comp, from: val.min, to: val.max }, idx);
                      } else if ("operands" in comp) {
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
                    className="px-2 py-1 text-muted-foreground hover:text-destructive"
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
                className="px-2 py-1 text-xs text-primary"
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
