import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/misc";
import type { FieldPath, UseFormRegister } from "react-hook-form";

type SignupFormShape = Record<string, string>;

interface SignupFormFieldProps<TFormValues extends SignupFormShape> {
  id: FieldPath<TFormValues>;
  label: string;
  type?: "text" | "email" | "password" | "date" | "number";
  placeholder?: string;
  register: UseFormRegister<TFormValues>;
  error?: string;
}

export function SignupFormField<TFormValues extends SignupFormShape>({
  id,
  label,
  type = "text",
  placeholder,
  register,
  error,
}: SignupFormFieldProps<TFormValues>) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} {...register(id)} />
      {error ? (
        <Text size="xs" className="text-destructive">
          {error}
        </Text>
      ) : null}
    </div>
  );
}
