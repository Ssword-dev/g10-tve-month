import Input from "@/components/Input";

interface ValueInputProps {
  fieldType: string;
  operator: string;
  value: any;
  onChange: (value: any) => void;
}

export function ValueInput({ fieldType, operator, value, onChange }: ValueInputProps) {
  if (operator === "is_null" || operator === "not_null") {
    return <div className="text-sm text-muted-foreground px-3">(no value)</div>;
  }

  if (operator === "between") {
    return (
      <div className="flex items-center gap-2">
        <Input
          type={fieldType === "date" ? "date" : fieldType === "number" ? "number" : "text"}
          placeholder={fieldType === "date" ? "From" : "Min"}
          value={value?.min || ""}
          onChange={(e) => onChange({ ...value, min: e.target.value })}
          className="w-28"
        />
        <span className="text-muted-foreground">and</span>
        <Input
          type={fieldType === "date" ? "date" : fieldType === "number" ? "number" : "text"}
          placeholder={fieldType === "date" ? "To" : "Max"}
          value={value?.max || ""}
          onChange={(e) => onChange({ ...value, max: e.target.value })}
          className="w-28"
        />
      </div>
    );
  }

  if (operator === "in") {
    return (
      <Input
        placeholder="Comma-separated values"
        value={Array.isArray(value) ? value.join(", ") : value || ""}
        onChange={(e) => onChange(e.target.value.split(",").map((v) => v.trim()))}
        className="w-48"
      />
    );
  }

  return (
    <Input
      type={fieldType === "date" ? "date" : fieldType === "number" ? "number" : "text"}
      placeholder="Enter value"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-32"
    />
  );
}
