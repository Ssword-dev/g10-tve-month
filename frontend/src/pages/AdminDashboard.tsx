import { GraduationCap, Search } from "lucide-react";

import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import CardHeader from "@/components/CardHeader";
import CardTitle from "@/components/CardTitle";
import Input from "@/components/Input";
import Text from "../components/Text";
import {
  // useMemo,
  useState,
} from "react";
import CardAction from "@/components/CardAction";
import Label from "@/components/Label";

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

// Hardcoded for now, shaped strictly from employees_table schema.
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

function EmployeeDashboard() {
  return (
    <main className="min-w-0 space-y-6 p-4 md:p-8">
      <Card className="gap-0 border-border p-0">
        <CardHeader className="flex flex-row items-center justify-between px-4 py-2">
          <CardTitle>
            <Text size="2xl" weight="bold" className="px-2 py-1 leading-none">
              Employees
            </Text>
          </CardTitle>
          <CardAction>
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <Label className="relative w-full min-w-56 md:w-72">
                <Search className="text-text-muted absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                <Input className="pl-8" placeholder="Search by name or filters." />
                <Button className="px-3 py-2" aria-label="notifications">
                  <Search className="size-4" />
                </Button>
              </Label>
            </div>
          </CardAction>
        </CardHeader>
      </Card>

      <Card className="gap-0 border-border py-0 w-full">
        <CardContent className="px-5 py-3">
          <div className="overflow-x-scroll">
            <table className="min-w-362.5 text-left text-sm">
              <thead>
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
                {employees.map((employee) => (
                  <tr
                    key={employee.employee_number}
                    className="border-border-muted border-b align-top last:border-b-0"
                  >
                    <td className="py-3 pr-4">{employee.employee_number}</td>
                    <td className="py-3 pr-4">
                      <Text weight="medium" className="leading-tight">
                        {employee.last_name}, {employee.first_name}{" "}
                        {employee.middle_name}
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
                    <td className="py-3 pr-4">
                      {employee.date_of_latest_promotion}
                    </td>
                    <td className="py-3 pr-4">{employee.contact_number}</td>
                    <td className="py-3 pr-4">
                      SG {employee.salary_grade} • ₱{employee.salary}
                    </td>
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
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card className="border-border">
      <CardContent className="flex flex-col space-y-1 px-5 py-5">
        <Text size="3xl" weight="bold">
          {value}
        </Text>
        <Text size="2xl" weight="semibold" className="text-text-muted">
          {title}
        </Text>
      </CardContent>
    </Card>
  );
}

function ActivityCard({
  title,
  employees,
}: {
  title: string;
  employees: Employee[];
}) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>
          <Text weight="semibold">{title}</Text>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {employees.map((e) => (
          <div
            key={e.employee_number}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex flex-row items-center gap-1">
              <Text weight="medium">
                {e.last_name}, {e.first_name}
              </Text>
              <Text size="xs" className="text-text-muted">
                ({e.designation})
              </Text>
            </div>
            <Text size="xs" className="text-text-muted">
              {title === "Recently Promoted"
                ? e.date_of_latest_promotion
                : e.date_joined}
            </Text>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function OverviewDashboard() {
  const totalEmployees = employees.length;

  const permanentCount = employees.filter(
    (e) => e.employment_status === "Permanent",
  ).length;

  const teacherCount = employees.filter((e) =>
    e.designation.toLowerCase().includes("teacher"),
  ).length;

  const principalCount = employees.filter((e) =>
    e.designation.toLowerCase().includes("principal"),
  ).length;

  const averageSalaryGrade = Math.round(
    employees.reduce((acc, e) => acc + e.salary_grade, 0) / employees.length,
  );

  const recentlyPromoted = [...employees]
    .sort(
      (a, b) =>
        new Date(b.date_of_latest_promotion).getTime() -
        new Date(a.date_of_latest_promotion).getTime(),
    )
    .slice(0, 3);

  const recentlyJoined = [...employees]
    .sort(
      (a, b) =>
        new Date(b.date_joined).getTime() - new Date(a.date_joined).getTime(),
    )
    .slice(0, 3);

  const designationDistribution = employees.reduce<Record<string, number>>(
    (acc, e) => {
      acc[e.designation] = (acc[e.designation] || 0) + 1;
      return acc;
    },
    {},
  );

  return (
    <main className="min-w-0 space-y-8 p-4 md:p-8">
      {/* KPI SECTION */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total Employees" value={totalEmployees} />
        <StatCard title="Permanent" value={permanentCount} />
        <StatCard title="Teachers" value={teacherCount} />
        <StatCard title="Principals" value={principalCount} />
        <StatCard title="Avg Salary Grade" value={averageSalaryGrade} />
      </section>

      {/* ACTIVITY SECTION */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ActivityCard title="Recently Promoted" employees={recentlyPromoted} />
        <ActivityCard title="Recently Joined" employees={recentlyJoined} />
      </section>

      {/* DISTRIBUTION SECTION */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>
            <Text weight="semibold">Designation Distribution</Text>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(designationDistribution).map(([role, count]) => (
            <div
              key={role}
              className="flex items-center justify-between text-sm"
            >
              <Text>{role}</Text>
              <Badge>{count}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}

export default function AdminDashboard() {
  const subPages = {
    overview: {
      component: OverviewDashboard,
    },
    employees: {
      component: EmployeeDashboard,
    },
  };

  const [activeSubPage, setActiveSubPage] = useState("overview");

  // const filteredEmployees = useMemo(() => employees, []);

  return (
    <div className="grid h-screen w-screen overflow-x-hidden grid-cols-1 bg-background text-text lg:grid-cols-[250px_1fr]">
      <aside className="border-border-muted bg-surface/90 p-6 lg:border-r">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-accent/35 p-2">
            <GraduationCap className="size-5 text-accent-strong" />
          </div>
          <div>
            <Text size="lg" weight="semibold">
              Dashboard
            </Text>
          </div>
        </div>

        <nav className="space-y-2">
          {Object.entries(subPages).map(
            ([
              name,
              // item
            ]) => (
              <Button
                key={name}
                variant="glass"
                className={
                  activeSubPage === name
                    ? "w-full justify-start gap-3 bg-accent text-text hover:bg-accent-strong"
                    : "w-full justify-start gap-3 bg-transparent text-text-muted hover:bg-muted hover:text-text"
                }
                onClick={() => setActiveSubPage(name)}
              >
                {/* <item.icon className="size-4" /> */}
                <Text size="sm" weight="medium" className="text-inherit">
                  {name}
                </Text>
              </Button>
            ),
          )}
        </nav>
      </aside>
      {(() => {
        const Comp = subPages[activeSubPage as keyof typeof subPages].component;
        return <Comp />;
      })()}
    </div>
  );
}
