import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, X } from "lucide-react";

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { cn } from "@_ssword/classes";
import type { AndFilter, AnyFieldFilter, FilterExpression, OrFilter } from "@/domain/employees/types";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Card from "@/components/Card";
import CardContent from "@/components/CardContent";
import Text from "@/components/Text";

import { FilterCondition } from "./FilterCondition";
import { SortableItem } from "./SortableItem";

interface LogicalGroupProps {
  id: string;
  group: AndFilter | OrFilter;
  onChange: (group: AndFilter | OrFilter) => void;
  onRemove: () => void;
  level?: number;
}

export function LogicalGroup({
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
            <div className="flex items-center gap-2">
              <button onClick={() => setIsExpanded(!isExpanded)} className="text-text-muted hover:text-text">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              <Badge
                className={cn(
                  "cursor-pointer",
                  group.type === "and" ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary",
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

            {isExpanded && (
              <div className="space-y-2 pl-6">
                <DndContext
                  sensors={useSensors(
                    useSensor(PointerSensor),
                    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
                  )}
                  collisionDetection={closestCenter}
                  onDragEnd={(event) => {
                    const { active, over } = event;
                    if (over && active.id !== over.id) {
                      const oldIndex = group.filters.findIndex((_, i) => `filter-${i}` === active.id);
                      const newIndex = group.filters.findIndex((_, i) => `filter-${i}` === over.id);
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
