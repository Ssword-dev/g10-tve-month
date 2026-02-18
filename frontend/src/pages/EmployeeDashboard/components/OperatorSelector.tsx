import {
  booleanOperators,
  dateOperators,
  numberOperators,
  stringOperators,
} from "./filterBuilderShared";

interface OperatorSelectorProps {
  fieldType: string;
  value: string;
  onChange: (value: any) => void;
}

export function OperatorSelector({ fieldType, value, onChange }: OperatorSelectorProps) {
  const operators =
    fieldType === "number"
      ? numberOperators
      : fieldType === "date"
        ? dateOperators
        : fieldType === "boolean"
          ? booleanOperators
          : stringOperators;

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-card border-border rounded-lg border px-3 py-1.5 text-sm"
    >
      {operators.map((op) => (
        <option key={op.value} value={op.value}>
          {op.label}
        </option>
      ))}
    </select>
  );
}
