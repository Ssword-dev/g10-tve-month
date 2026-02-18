import type { Employee } from "@/domain/employees/types";

import Text from "@/components/Text";

export function EmployeeDetailsCard({ employee }: { employee: Employee }) {
  return (
    <div className="space-y-3 text-xs leading-relaxed">
      <section className="space-y-1.5">
        <Text size="xs" weight="semibold" className="text-accent">
          Personal Info
        </Text>
        <div className="space-y-1">
          <p>
            <span className="font-semibold">Full Name:</span>{" "}
            {employee.last_name}, {employee.first_name} {employee.middle_name}
          </p>
          <p>
            <span className="font-semibold">DepEd Email:</span>{" "}
            {employee.deped_email}
          </p>
          <p>
            <span className="font-semibold">Date of Birth / Civil Status:</span>{" "}
            {employee.date_of_birth} / {employee.civil_status}
          </p>
          <p>
            <span className="font-semibold">Address:</span> {employee.address}
          </p>
          <p>
            <span className="font-semibold">TIN / Place of Birth:</span>{" "}
            {employee.tin} / {employee.place_of_birth}
          </p>
        </div>
      </section>
      <section className="space-y-1.5 border-t border-border pt-2">
        <Text size="xs" weight="semibold" className="text-accent">
          Employment Info
        </Text>
        <div className="space-y-1">
          <p>
            <span className="font-semibold">Designation:</span>{" "}
            {employee.designation}
          </p>
          <p>
            <span className="font-semibold">Employment Status:</span>{" "}
            {employee.employment_status}
          </p>
          <p>
            <span className="font-semibold">Contact Number:</span>{" "}
            {employee.contact_number}
          </p>
          <p>
            <span className="font-semibold">Plantilla # / BP #:</span>{" "}
            {employee.plantilla_number} / {employee.bp_number}
          </p>
          <p>
            <span className="font-semibold">
              Date Joined / Latest Promotion / Original Appointment:
            </span>{" "}
            {employee.date_joined} / {employee.date_of_latest_promotion} /{" "}
            {employee.date_of_original_appointment}
          </p>
        </div>
      </section>
      <section className="space-y-1.5 border-t border-border pt-2">
        <Text size="xs" weight="semibold" className="text-accent">
          Payroll Info
        </Text>
        <p>
          <span className="font-semibold">Salary Grade + Salary:</span> SG{" "}
          {employee.salary_grade} + PHP {employee.salary}
        </p>
      </section>
    </div>
  );
}
