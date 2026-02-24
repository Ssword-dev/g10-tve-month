import type { ComponentProps } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/misc";

interface EmployeeFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: ComponentProps<typeof Input>["type"];
  disabled?: boolean;
}

export function EmployeeField({
  label,
  value,
  onChange,
  error,
  type = "text",
  disabled = false,
}: EmployeeFieldProps) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && (
        <Text size="xs" className="text-destructive">
          {error}
        </Text>
      )}
    </div>
  );
}
