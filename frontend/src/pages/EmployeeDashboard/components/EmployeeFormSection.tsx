import type { Dispatch, SetStateAction } from "react";

import Button from "@/components/Button";
import Card from "@/components/Card";
import CardAction from "@/components/CardAction";
import CardContent from "@/components/CardContent";
import CardTitle from "@/components/CardTitle";
import Text from "@/components/Text";

import type { EmployeeFormState, FieldErrorMap } from "../types";
import { EmployeeField } from "./EmployeeField";

interface EmployeeFormSectionProps {
  form: EmployeeFormState;
  setForm: Dispatch<SetStateAction<EmployeeFormState>>;
  errors: FieldErrorMap;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

export function EmployeeFormSection({
  form,
  setForm,
  errors,
  onSave,
  isSaving,
}: EmployeeFormSectionProps) {
  return (
    <Card className="gap-3 border-border p-4">
      <CardTitle>
        <Text weight="semibold">Edit Employee Attributes</Text>
      </CardTitle>
      <CardContent className="grid grid-cols-1 gap-3 p-0 md:grid-cols-2">
        <EmployeeField
          label="First Name"
          value={form.first_name}
          error={errors.first_name}
          onChange={(v) => setForm((s) => ({ ...s, first_name: v }))}
        />
        <EmployeeField
          label="Middle Name"
          value={form.middle_name}
          onChange={(v) => setForm((s) => ({ ...s, middle_name: v }))}
        />
        <EmployeeField
          label="Last Name"
          value={form.last_name}
          error={errors.last_name}
          onChange={(v) => setForm((s) => ({ ...s, last_name: v }))}
        />
        <EmployeeField
          label="DepEd Email"
          value={form.deped_email}
          onChange={(v) => setForm((s) => ({ ...s, deped_email: v }))}
        />
        <EmployeeField
          label="Designation"
          value={form.designation}
          error={errors.designation}
          onChange={(v) => setForm((s) => ({ ...s, designation: v }))}
        />
        <EmployeeField
          label="Employment Status"
          value={form.employment_status}
          error={errors.employment_status}
          onChange={(v) => setForm((s) => ({ ...s, employment_status: v }))}
        />
        <EmployeeField
          label="Date Joined"
          type="date"
          value={form.date_joined}
          error={errors.date_joined}
          onChange={(v) => setForm((s) => ({ ...s, date_joined: v }))}
        />
        <EmployeeField
          label="Latest Promotion"
          type="date"
          value={form.date_of_latest_promotion}
          error={errors.date_of_latest_promotion}
          onChange={(v) =>
            setForm((s) => ({ ...s, date_of_latest_promotion: v }))
          }
        />
        <EmployeeField
          label="Original Appointment"
          type="date"
          value={form.date_of_original_appointment}
          error={errors.date_of_original_appointment}
          onChange={(v) =>
            setForm((s) => ({ ...s, date_of_original_appointment: v }))
          }
        />
        <EmployeeField
          label="Date of Birth"
          type="date"
          value={form.date_of_birth}
          error={errors.date_of_birth}
          onChange={(v) => setForm((s) => ({ ...s, date_of_birth: v }))}
        />
        <EmployeeField
          label="Contact Number"
          value={form.contact_number}
          onChange={(v) => setForm((s) => ({ ...s, contact_number: v }))}
        />
        <EmployeeField
          label="Plantilla Number"
          value={form.plantilla_number}
          onChange={(v) => setForm((s) => ({ ...s, plantilla_number: v }))}
        />
        <EmployeeField
          label="BP Number"
          type="number"
          value={String(form.bp_number)}
          error={errors.bp_number}
          onChange={(v) => setForm((s) => ({ ...s, bp_number: v }))}
        />
        <EmployeeField
          label="Salary Grade"
          type="number"
          value={String(form.salary_grade)}
          error={errors.salary_grade}
          onChange={(v) => setForm((s) => ({ ...s, salary_grade: v }))}
        />
        <EmployeeField
          label="Salary"
          value={form.salary}
          onChange={(v) => setForm((s) => ({ ...s, salary: v }))}
        />
        <EmployeeField
          label="Address"
          value={form.address}
          onChange={(v) => setForm((s) => ({ ...s, address: v }))}
        />
        <EmployeeField
          label="Civil Status"
          value={form.civil_status}
          onChange={(v) => setForm((s) => ({ ...s, civil_status: v }))}
        />
        <EmployeeField
          label="TIN"
          value={form.tin}
          onChange={(v) => setForm((s) => ({ ...s, tin: v }))}
        />
        <EmployeeField
          label="Place of Birth"
          value={form.place_of_birth}
          onChange={(v) => setForm((s) => ({ ...s, place_of_birth: v }))}
        />
      </CardContent>
      <CardAction className="sticky bottom-0 bg-card/95 py-3">
        <Button disabled={isSaving} onClick={() => void onSave()}>
          Save Employee
        </Button>
      </CardAction>
    </Card>
  );
}
