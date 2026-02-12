import { useMemo, useState } from "react";
import {
  Bell,
  ChartColumnIncreasing,
  GraduationCap,
  LayoutDashboard,
  Search,
  Settings,
  Users,
} from "lucide-react";

import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import CardDescription from "../components/CardDescription";
import CardHeader from "../components/CardHeader";
import CardTitle from "../components/CardTitle";
import Input from "../components/Input";
import Separator from "../components/Separator";
import Text from "../components/Text";

type Employee = {
  first_name: string;
  middle_name: string;
  last_name: string;
  deped_email: string;
  employee_number: number;
  designation: string;
  date_joined: string;
  date_of_latest_promotion: string;
  contact_number: string;
  plantilla_number: string;
  date_of_original_appointment: string;
  bp_number: string;
  address: string;
  civil_status: string;
  date_of_birth: string;
  salary_grade: number;
  salary: string;
  employment_status: string;
  tin: string;
  place_of_birth: string;
};

const pages = ["Overview", "Employees", "Settings"] as const;

const employees: Employee[] = [
  {
    first_name: "Juan",
    middle_name: "Santos",
    last_name: "Dela Cruz",
    deped_email: "juan.delacruz@deped.gov.ph",
    employee_number: 10001,
    designation: "Teacher I",
    date_joined: "2015-06-01",
    date_of_latest_promotion: "2020-03-15",
    contact_number: "09171234567",
    plantilla_number: "PLANT001",
    date_of_original_appointment: "2015-06-01",
    bp_number: "BP001",
    address: "123 Padre Faura St., Manila",
    civil_status: "Single",
    date_of_birth: "1985-03-20",
    salary_grade: 11,
    salary: "25000.00",
    employment_status: "Permanent",
    tin: "12345678901",
    place_of_birth: "Manila",
  },
  {
    first_name: "Maria",
    middle_name: "Angeles",
    last_name: "Santos",
    deped_email: "maria.santos@deped.gov.ph",
    employee_number: 10002,
    designation: "Teacher II",
    date_joined: "2014-08-15",
    date_of_latest_promotion: "2019-11-20",
    contact_number: "09179876543",
    plantilla_number: "PLANT002",
    date_of_original_appointment: "2014-08-15",
    bp_number: "BP002",
    address: "456 Rizal Ave., Quezon City",
    civil_status: "Married",
    date_of_birth: "1982-07-10",
    salary_grade: 13,
    salary: "32000.00",
    employment_status: "Permanent",
    tin: "12345678902",
    place_of_birth: "Quezon City",
  },
  {
    first_name: "Antonio",
    middle_name: "Reyes",
    last_name: "Garcia",
    deped_email: "antonio.garcia@deped.gov.ph",
    employee_number: 10003,
    designation: "Master Teacher I",
    date_joined: "2012-01-10",
    date_of_latest_promotion: "2021-05-10",
    contact_number: "09181111111",
    plantilla_number: "PLANT003",
    date_of_original_appointment: "2012-01-10",
    bp_number: "BP003",
    address: "789 Burgos St., Makati",
    civil_status: "Married",
    date_of_birth: "1978-11-25",
    salary_grade: 16,
    salary: "45000.00",
    employment_status: "Permanent",
    tin: "12345678903",
    place_of_birth: "Makati",
  },
  {
    first_name: "Rosa",
    middle_name: "Flores",
    last_name: "Martinez",
    deped_email: "rosa.martinez@deped.gov.ph",
    employee_number: 10004,
    designation: "Teacher I",
    date_joined: "2016-09-20",
    date_of_latest_promotion: "2021-08-15",
    contact_number: "09182222222",
    plantilla_number: "PLANT004",
    date_of_original_appointment: "2016-09-20",
    bp_number: "BP004",
    address: "321 Taft Ave., Manila",
    civil_status: "Single",
    date_of_birth: "1988-05-14",
    salary_grade: 11,
    salary: "25000.00",
    employment_status: "Permanent",
    tin: "12345678904",
    place_of_birth: "Manila",
  },
  {
    first_name: "Carlos",
    middle_name: "Manuel",
    last_name: "Lopez",
    deped_email: "carlos.lopez@deped.gov.ph",
    employee_number: 10005,
    designation: "Principal III",
    date_joined: "2010-06-15",
    date_of_latest_promotion: "2020-12-01",
    contact_number: "09183333333",
    plantilla_number: "PLANT005",
    date_of_original_appointment: "2010-06-15",
    bp_number: "BP005",
    address: "654 España Ave., Manila",
    civil_status: "Married",
    date_of_birth: "1975-09-30",
    salary_grade: 20,
    salary: "62000.00",
    employment_status: "Permanent",
    tin: "12345678905",
    place_of_birth: "Manila",
  },
];

const monthlySummary = [
  { label: "Newly Joined This Month", value: 2 },
  { label: "Promotions This Quarter", value: 3 },
  { label: "Avg Salary Grade", value: 14 },
  { label: "Teacher Roles", value: 4 },
];

function OverviewContent() {
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {monthlySummary.map((stat) => (
          <Card key={stat.label} className="gap-0 border-border py-0">
            <CardContent className="space-y-2 px-5 py-5">
              <Text size="sm" className="text-text-muted">
                {stat.label}
              </Text>
              <Text size="3xl" weight="semibold">
                {stat.value}
              </Text>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="gap-0 border-border py-0">
        <CardHeader className="px-5 py-4">
          <CardTitle asChild>
            <h3>Employee Composition</h3>
          </CardTitle>
          <CardDescription className="text-text-muted">
            Quick analysis summary based on current employee records.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-3">
          <div className="rounded-lg bg-background p-4">
            <Text size="xs" className="text-text-muted">
              Permanent
            </Text>
            <Text size="2xl" weight="semibold">
              100%
            </Text>
          </div>
          <div className="rounded-lg bg-background p-4">
            <Text size="xs" className="text-text-muted">
              Principal Positions
            </Text>
            <Text size="2xl" weight="semibold">
              1 / 5
            </Text>
          </div>
          <div className="rounded-lg bg-background p-4">
            <Text size="xs" className="text-text-muted">
              Mean Salary
            </Text>
            <Text size="2xl" weight="semibold">
              ₱37,400
            </Text>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function EmployeesContent({ data }: { data: Employee[] }) {
  return (
    <Card className="gap-0 border-border py-0">
      <CardHeader className="px-5 py-4">
        <CardTitle asChild>
          <h3>Employees</h3>
        </CardTitle>
        <CardDescription className="text-text-muted">
          Scroll inside the container below for large tables.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="px-5 py-4">
        <div className="h-[62vh] max-h-[680px] w-full overflow-auto rounded-lg border border-border-muted">
          <table className="min-w-[1480px] text-left text-sm">
            <thead className="bg-surface sticky top-0 z-10">
              <tr className="border-border-muted border-b text-text-muted">
                <th className="py-2 pr-4 font-medium">Employee #</th>
                <th className="py-2 pr-4 font-medium">Full Name</th>
                <th className="py-2 pr-4 font-medium">Email</th>
                <th className="py-2 pr-4 font-medium">Designation</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">Date Joined</th>
                <th className="py-2 pr-4 font-medium">Promotion</th>
                <th className="py-2 pr-4 font-medium">Contact</th>
                <th className="py-2 pr-4 font-medium">Salary</th>
                <th className="py-2 pr-4 font-medium">Civil Status</th>
                <th className="py-2 pr-4 font-medium">Birth</th>
                <th className="py-2 pr-4 font-medium">Address</th>
                <th className="py-2 pr-4 font-medium">Plantilla</th>
                <th className="py-2 pr-4 font-medium">BP #</th>
                <th className="py-2 pr-4 font-medium">TIN</th>
                <th className="py-2 font-medium">Place of Birth</th>
              </tr>
            </thead>
            <tbody>
              {data.map((employee) => (
                <tr
                  key={employee.employee_number}
                  className="border-border-muted border-b align-top last:border-b-0"
                >
                  <td className="py-3 pr-4">{employee.employee_number}</td>
                  <td className="py-3 pr-4">
                    <Text weight="medium" className="leading-tight">
                      {employee.last_name}, {employee.first_name} {employee.middle_name}
                    </Text>
                  </td>
                  <td className="py-3 pr-4">{employee.deped_email}</td>
                  <td className="py-3 pr-4">{employee.designation}</td>
                  <td className="py-3 pr-4">
                    <Badge className="rounded-full bg-success/20 px-2.5 py-1 text-xs text-success">
                      {employee.employment_status}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4">{employee.date_joined}</td>
                  <td className="py-3 pr-4">{employee.date_of_latest_promotion}</td>
                  <td className="py-3 pr-4">{employee.contact_number}</td>
                  <td className="py-3 pr-4">SG {employee.salary_grade} • ₱{employee.salary}</td>
                  <td className="py-3 pr-4">{employee.civil_status}</td>
                  <td className="py-3 pr-4">{employee.date_of_birth}</td>
                  <td className="py-3 pr-4">{employee.address}</td>
                  <td className="py-3 pr-4">{employee.plantilla_number}</td>
                  <td className="py-3 pr-4">{employee.bp_number}</td>
                  <td className="py-3 pr-4">{employee.tin}</td>
                  <td className="py-3">{employee.place_of_birth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredEmployees = useMemo(() => employees, []);

  return (
    <div className="grid min-h-screen grid-cols-1 overflow-x-hidden bg-background text-text lg:grid-cols-[250px_1fr]">
      <aside className="border-border-muted bg-surface/90 p-6 lg:border-r">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-accent/35 p-2">
            <GraduationCap className="size-5 text-accent-strong" />
          </div>
          <div>
            <Text size="sm" className="text-text-muted">
              School EMS
            </Text>
            <Text asChild size="lg" weight="semibold">
              <h1>Admin Panel</h1>
            </Text>
          </div>
        </div>

        <nav className="space-y-2">
          {pages.map((label, index) => {
            const icon =
              label === "Overview"
                ? LayoutDashboard
                : label === "Employees"
                  ? Users
                  : Settings;
            const Icon = icon;
            const active = index === activeIndex;

            return (
              <Button
                key={label}
                variant="glass"
                className={
                  active
                    ? "w-full justify-start gap-3 bg-accent text-text hover:bg-accent-strong"
                    : "w-full justify-start gap-3 bg-transparent text-text-muted hover:bg-muted hover:text-text"
                }
                onClick={() => setActiveIndex(index)}
              >
                <Icon className="size-4" />
                <Text size="sm" weight="medium" className="text-inherit">
                  {label}
                </Text>
              </Button>
            );
          })}
        </nav>
      </aside>

      <main className="min-w-0 space-y-6 overflow-x-hidden p-4 md:p-8">
        <Card className="gap-0 border-border py-0">
          <CardHeader className="px-4 py-4 md:px-6 md:py-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle asChild>
                  <h2 className="text-2xl">Employees Dashboard</h2>
                </CardTitle>
                <CardDescription className="text-text-muted">
                  {activeIndex === 0
                    ? "Overview analytics and summary statistics."
                    : activeIndex === 1
                      ? "Employees table view from employees_table fields only."
                      : "Dashboard settings (placeholder)."}
                </CardDescription>
              </div>

              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <label className="relative w-full min-w-56 md:w-72">
                  <Search className="text-text-muted absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                  <Input className="pl-8" placeholder="Search employee number or name" />
                </label>
                <Button className="px-3 py-2" aria-label="notifications">
                  <Bell className="size-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {activeIndex === 0 && <OverviewContent />}

        {activeIndex === 1 && <EmployeesContent data={filteredEmployees} />}

        {activeIndex === 2 && (
          <Card className="gap-0 border-border py-0">
            <CardHeader className="px-5 py-4">
              <CardTitle asChild>
                <h3>Settings</h3>
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="px-5 py-4">
              <div className="flex items-center gap-2 rounded-lg bg-background p-4">
                <ChartColumnIncreasing className="size-4 text-text-muted" />
                <Text className="text-text-muted">Settings section placeholder.</Text>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
