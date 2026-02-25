import type { Employee } from "@/domain/employees/types";
import { Text } from "@/components/ui/misc";

interface FieldItem {
  value: keyof Employee;
  label: string;
}

interface FilterModalIncludeColumnsSectionProps {
  availableFields: FieldItem[];
  include: (keyof Employee)[] | "ALL";
  onToggle: (field: keyof Employee) => void;
}

export function FilterModalIncludeColumnsSection({
  availableFields,
  include,
  onToggle,
}: FilterModalIncludeColumnsSectionProps) {
  return (
    <section className="grid grid-cols-1 gap-4">
      <div className="rounded-lg border border-border bg-muted/20 p-3">
        <Text size="sm" weight="semibold" className="mb-2">
          Include Columns
        </Text>
        <div className="grid max-h-52 grid-cols-2 gap-2 overflow-y-auto">
          {availableFields.map((field) => {
            const includeOrder = include === "ALL" ? [] : include;
            const selected =
              includeOrder.length > 0 && includeOrder.includes(field.value);
            const selectedOrder = selected
              ? includeOrder.indexOf(field.value) + 1
              : null;

            return (
              <label
                key={`include-${field.value}`}
                className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-muted/50"
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => onToggle(field.value)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-semibold transition-colors ${
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/40 text-muted-foreground"
                  }`}
                >
                  {selectedOrder ?? ""}
                </span>
                <span className="text-xs">{field.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </section>
  );
}
