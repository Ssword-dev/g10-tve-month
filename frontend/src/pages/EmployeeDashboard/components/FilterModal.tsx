import { useState } from "react";
import { Plus } from "lucide-react";

import type {
  AndFilter,
  AnyFieldFilter,
  Employee,
  FilterEmployeesPayload,
  FilterExpression,
  OrFilter,
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
import Label from "@/components/Label";
import Text from "@/components/Text";

import { DragAndDropText } from "./DragAndDropText";
import { FieldSelection } from "./FieldSelection";
import { SortField } from "./SortField";

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filter: FilterEmployeesPayload) => void;
  initialFilter?: FilterEmployeesPayload;
}

export function FilterModal({ open, onClose, onApply, initialFilter }: FilterModalProps) {
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
          filters: [...(filter.where as AndFilter | OrFilter).filters, newFilter],
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

  const updateSort = (index: number, basis: keyof Employee, direction: "asc" | "desc") => {
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
            <CardTitle className="text-xl font-semibold text-text">Filter Employees</CardTitle>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            <DragAndDropText content="Hello world!" />

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
                      onChange={(basis, direction) => updateSort(index, basis, direction)}
                      onRemove={() => removeSort(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Text weight="semibold" size="sm" className="text-text">
                Field Selection
              </Text>
              <FieldSelection
                fields={filter.fields}
                onChange={(fields) => setFilter({ ...filter, fields })}
              />
            </div>

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
            <Button type="button" variant="outline" onClick={handleReset} className="border-border">
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
