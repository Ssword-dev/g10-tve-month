import type { Employee } from "@/domain/employees/types";

import Text from "@/components/Text";

interface EmployeeDetailsCardProps {
  employee: Employee;
  showSensitiveFields: boolean;
}

const displayValue = (value: string | number | null | undefined) => {
  if (value == null) {
    return "N/A";
  }

  const resolved = String(value).trim();
  return resolved.length > 0 ? resolved : "N/A";
};

export function EmployeeDetailsCard({
  employee,
  showSensitiveFields,
}: EmployeeDetailsCardProps) {
  return (
    <div className="space-y-3 text-xs leading-relaxed">
      <section className="space-y-1.5">
        <Text size="xs" weight="semibold" className="text-accent">
          Personal Info
        </Text>
        <div className="space-y-1">
          <p>
            <span className="font-semibold">Full Name:</span>{" "}
            {displayValue(employee.last_name)}, {displayValue(employee.first_name)}{" "}
            {displayValue(employee.middle_name)}
          </p>
          {showSensitiveFields ? (
            <>
              <p>
                <span className="font-semibold">DepEd Email:</span>{" "}
                {displayValue(employee.deped_email)}
              </p>
              <p>
                <span className="font-semibold">Date of Birth / Civil Status:</span>{" "}
                {displayValue(employee.date_of_birth)} / {displayValue(employee.civil_status)}
              </p>
              <p>
                <span className="font-semibold">Address:</span>{" "}
                {displayValue(employee.address)}
              </p>
              <p>
                <span className="font-semibold">TIN / Place of Birth:</span>{" "}
                {displayValue(employee.tin)} / {displayValue(employee.place_of_birth)}
              </p>
            </>
          ) : null}
        </div>
      </section>
      <section className="space-y-1.5 border-t border-border pt-2">
        <Text size="xs" weight="semibold" className="text-accent">
          Employment Info
        </Text>
        <div className="space-y-1">
          <p>
            <span className="font-semibold">Designation:</span>{" "}
            {displayValue(employee.designation)}
          </p>
          <p>
            <span className="font-semibold">Employment Status:</span>{" "}
            {displayValue(employee.employment_status)}
          </p>
          {showSensitiveFields ? (
            <>
              <p>
                <span className="font-semibold">Contact Number:</span>{" "}
                {displayValue(employee.contact_number)}
              </p>
              <p>
                <span className="font-semibold">Plantilla # / BP #:</span>{" "}
                {displayValue(employee.plantilla_number)} / {displayValue(employee.bp_number)}
              </p>
            </>
          ) : null}
          <p>
            <span className="font-semibold">
              Date Joined / Latest Promotion / Original Appointment:
            </span>{" "}
            {displayValue(employee.date_joined)} /{" "}
            {displayValue(employee.date_of_latest_promotion)} /{" "}
            {displayValue(employee.date_of_original_appointment)}
          </p>
        </div>
      </section>
      {showSensitiveFields ? (
        <section className="space-y-1.5 border-t border-border pt-2">
          <Text size="xs" weight="semibold" className="text-accent">
            Payroll Info
          </Text>
          <p>
            <span className="font-semibold">Salary Grade + Salary:</span> SG{" "}
            {displayValue(employee.salary_grade)} + PHP {displayValue(employee.salary)}
          </p>
        </section>
      ) : null}
    </div>
  );
}
