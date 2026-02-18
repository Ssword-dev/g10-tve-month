import { useState } from "react";

import { cn } from "@_ssword/classes";
import type { Employee } from "@/domain/employees/types";
import Button from "@/components/Button";

import { employeeFields } from "./filterBuilderShared";

interface FieldSelectionProps {
  fields: {
    include: (keyof Employee)[] | "ALL";
    exclude: (keyof Employee)[] | "NONE";
  };
  onChange: (fields: {
    include: (keyof Employee)[] | "ALL";
    exclude: (keyof Employee)[] | "NONE";
  }) => void;
}

export function FieldSelection({ fields, onChange }: FieldSelectionProps) {
  const [mode, setMode] = useState<"include" | "exclude">(
    fields.include !== "ALL" ? "include" : "exclude",
  );

  const toggleField = (field: keyof Employee) => {
    if (mode === "include") {
      const current = fields.include === "ALL" ? [] : fields.include;
      const newInclude = current.includes(field)
        ? current.filter((f) => f !== field)
        : [...current, field];
      onChange({
        include: newInclude.length ? newInclude : "ALL",
        exclude: "NONE",
      });
    } else {
      const current = fields.exclude === "NONE" ? [] : fields.exclude;
      const newExclude = current.includes(field)
        ? current.filter((f) => f !== field)
        : [...current, field];
      onChange({
        include: "ALL",
        exclude: newExclude.length ? newExclude : "NONE",
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={mode === "include" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("include")}
          className="text-xs"
        >
          Include
        </Button>
        <Button
          type="button"
          variant={mode === "exclude" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("exclude")}
          className="text-xs"
        >
          Exclude
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border-border rounded-lg border">
        {employeeFields.map((field) => {
          const isSelected =
            mode === "include"
              ? fields.include !== "ALL" && fields.include.includes(field.value)
              : fields.exclude !== "NONE" && fields.exclude.includes(field.value);

          return (
            <label
              key={field.value}
              className={cn(
                "flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors",
                isSelected ? "bg-primary/10 border-primary/30 border" : "hover:bg-muted/30",
              )}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleField(field.value)}
                className="rounded border-border text-primary focus:ring-primary/30"
              />
              <span className="text-sm">{field.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
