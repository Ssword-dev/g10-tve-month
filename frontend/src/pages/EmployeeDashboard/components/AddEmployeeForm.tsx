import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { cn } from "@_ssword/classes";
import { addEmployeeAction } from "@/domain/employees/actions";
import Button from "@/components/Button";
import Card from "@/components/Card";
import CardAction from "@/components/CardAction";
import CardContent from "@/components/CardContent";
import CardHeader from "@/components/CardHeader";
import CardTitle from "@/components/CardTitle";
import Field from "@/components/Field";
import FieldError from "@/components/FieldError";
import FieldLabel from "@/components/FieldLabel";
import Input from "@/components/Input";
import type { Props } from "@/components/types";

import { filterEmployeesQuery } from "../queries";
import { createEmployeeSchema } from "../schemas";
import type { EmployeeFormState } from "../types";
import { toAddEmployeePayload } from "../utils";

interface FieldDefinition<TKey extends string> extends Props<typeof Input> {
  name: TKey;
  type?: Props<typeof Input>["type"];
  label: string;
}

export function AddEmployeeForm({ closeModal }: { closeModal: () => void }) {
  const [currentPage, setCurrentPage] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<z.input<typeof createEmployeeSchema>, unknown, EmployeeFormState>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      employee_number: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      deped_email: "",
      designation: "",
      employment_status: "",
      date_joined: "",
      date_of_latest_promotion: "",
      date_of_original_appointment: "",
      date_of_birth: "",
      contact_number: "",
      plantilla_number: "",
      bp_number: "",
      salary_grade: "",
      salary: "",
      address: "",
      civil_status: "",
      tin: "",
      place_of_birth: "",
    },
  });

  const submitEmployeePayload = async (data: EmployeeFormState) => {
    try {
      const result = await addEmployeeAction(toAddEmployeePayload(data));
      result.unwrap();
      filterEmployeesQuery.refresh();
      closeModal();
    } catch (error) {
      console.error("Failed to add employee:", error);
    }
  };

  const fieldCategories = [
    [
      { name: "employee_number", label: "Employee Number", type: "number", placeholder: "Enter employee number", required: true },
      { name: "first_name", label: "First Name", placeholder: "Enter first name", required: true },
      { name: "middle_name", label: "Middle Name", placeholder: "Enter middle name" },
      { name: "last_name", label: "Last Name", placeholder: "Enter last name", required: true },
      { name: "date_of_birth", label: "Date of Birth", type: "date" },
      { name: "place_of_birth", label: "Place of Birth", placeholder: "Enter place of birth" },
      { name: "civil_status", label: "Civil Status", placeholder: "Enter civil status" },
      { name: "tin", label: "TIN", placeholder: "Enter TIN" },
    ],
    [
      { name: "deped_email", label: "DepEd Email", type: "email", placeholder: "Enter DepEd email" },
      { name: "contact_number", label: "Contact Number", placeholder: "Enter contact number" },
      { name: "address", label: "Address", placeholder: "Enter address" },
    ],
    [
      { name: "designation", label: "Designation", placeholder: "Enter designation", required: true },
      {
        name: "employment_status",
        label: "Employment Status",
        placeholder: "Enter employment status",
        required: true,
      },
      { name: "date_joined", label: "Date Joined", type: "date" },
      { name: "date_of_latest_promotion", label: "Latest Promotion", type: "date" },
      { name: "date_of_original_appointment", label: "Original Appointment", type: "date" },
      { name: "plantilla_number", label: "Plantilla Number", placeholder: "Enter plantilla number" },
    ],
    [
      { name: "salary_grade", label: "Salary Grade", type: "number", placeholder: "Enter salary grade" },
      { name: "salary", label: "Salary", placeholder: "Enter salary" },
      { name: "bp_number", label: "BP Number", type: "number", placeholder: "Enter BP number" },
    ],
  ] as const;

  const FormField = ({
    name,
    label,
    type,
    placeholder,
    required,
  }: FieldDefinition<keyof EmployeeFormState>) => {
    return (
      <Controller
        key={name}
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <Field className="grid gap-1.5">
            <FieldLabel htmlFor={name} className="text-sm font-medium text-muted-foreground">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FieldLabel>
            <Input
              id={name}
              {...field}
              type={type || "text"}
              placeholder={placeholder}
              aria-invalid={!!fieldState.error}
              value={field.value ?? ""}
              className={cn(
                "bg-card border-border text-foreground placeholder:text-muted-foreground/50",
                "focus:border-primary focus:ring-1 focus:ring-primary/30",
                "transition-colors duration-200",
                fieldState.error && "border-destructive focus:border-destructive focus:ring-destructive/30",
              )}
            />
            <FieldError errors={fieldState.error ? [fieldState.error] : []} />
          </Field>
        )}
      />
    );
  };

  const isLastPage = currentPage === fieldCategories.length - 1;
  const isFirstPage = currentPage === 0;

  return (
    <Card asChild className="w-full h-full border-border bg-card shadow-lg overflow-hidden">
      <form onSubmit={handleSubmit(submitEmployeePayload)}>
        <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
          <CardTitle className="text-xl font-semibold text-foreground">Add New Employee</CardTitle>
        </CardHeader>

        <div className="flex justify-center gap-1.5 px-6 pt-3">
          {fieldCategories.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1.5 w-6 rounded-full transition-colors",
                index === currentPage ? "bg-primary" : index < currentPage ? "bg-primary/40" : "bg-border",
              )}
            />
          ))}
        </div>

        <CardContent className="flex-1 px-6 py-2 overflow-y-auto">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {fieldCategories[currentPage].map((fieldDefinition) => (
              <FormField key={fieldDefinition.name} {...fieldDefinition} />
            ))}
          </div>
        </CardContent>

        <CardAction className="flex justify-between border-t border-border bg-muted/20 px-6 py-2">
          <div>
            {!isFirstPage && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentPage((p) => p - 1)}
                className="border-border bg-card text-foreground hover:bg-muted"
              >
                Previous
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            {!isLastPage ? (
              <Button
                type="button"
                onClick={() => setCurrentPage((p) => p + 1)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? "Saving..." : "Save Employee"}
              </Button>
            )}
          </div>
        </CardAction>
      </form>
    </Card>
  );
}
