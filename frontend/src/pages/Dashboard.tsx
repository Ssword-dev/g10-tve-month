import { GraduationCap, Search } from "lucide-react";

import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Card from "@/components/Card";
import CardContent from "@/components/CardContent";
import CardHeader from "@/components/CardHeader";
import CardTitle from "@/components/CardTitle";
import Input from "@/components/Input";
import Text from "@/components/Text";
import React, {
  useCallback,
  useEffect,
  // useMemo,
  useState,
} from "react";
import CardAction from "@/components/CardAction";
import Label from "@/components/Label";
import Tooltip from "@/components/Tooltip";
import TooltipTrigger from "@/components/TooltipTrigger";
import TooltipContent from "@/components/TooltipContent";
import TooltipProvider from "@/components/TooltipProvider";
import useServerAction from "@/hooks/useServerAction";
import useServerQuery from "@/hooks/useServerQuery";

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

function EmployeeDetailsTooltip({ employee }: { employee: Employee }) {
  return (
    <div className="w-90 space-y-3 text-xs leading-relaxed">
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
          {employee.salary_grade} + ₱{employee.salary}
        </p>
      </section>
    </div>
  );
}

function EmployeeDashboard() {
  const [nameSearchTerm, setNameSearchTerm] = useState("");
  const getAllEmployeesThatSatisfies = useServerAction<
    { name: string },
    Employee[]
  >({
    name: "getAllEmployees",
    apiUrl: "/api/getAllEmployeesThatSatisfies",
  });

  const queryFn = useCallback(
    (name: string) => getAllEmployeesThatSatisfies({ name }),
    [getAllEmployeesThatSatisfies],
  );

  const {
    data: employees,
    isLoading,
    refresh,
    error,
  } = useServerQuery(
    "EmployeeDashboard:getAllEmployeesThatSatisfies",
    queryFn,
    [nameSearchTerm],
  );

  const onInputChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setNameSearchTerm(evt.target.value);
    },
    [],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <main className="flex flex-col min-w-0 space-y-6 p-4 md:p-8 w-full h-screen">
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
                <Input
                  className="pl-8"
                  placeholder="Search by name or filters."
                  onChange={onInputChange}
                />
                <Button className="px-3 py-2" aria-label="search employees">
                  <Search className="size-4" />
                </Button>
              </Label>
            </div>
          </CardAction>
        </CardHeader>
      </Card>

      <Card className="h-full w-full gap-0 border-border py-0 mb-6 overflow-y-scroll no-scrollbar">
        <CardContent className="flex-1 w-full h-full px-5 py-3">
          {isLoading && (
            <div className="flex h-40 items-center justify-center">
              <Text className="text-text-muted">Loading employees...</Text>
            </div>
          )}

          {!isLoading && error && (
            <div className="flex flex-col items-center justify-center gap-3 h-40">
              <Text className="text-danger">Failed to load employees.</Text>
              <Button onClick={refresh}>Retry</Button>
            </div>
          )}

          {!isLoading && !error && employees && (
            <div className="overflow-x-scroll overflow-y-scroll no-scrollbar min-w-0 h-full">
              <table className="min-w-362.5 h-full text-left text-sm">
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
                  </tr>
                </thead>
                <tbody>
                  {employees.length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
                        className="py-6 text-center text-text-muted"
                      >
                        No employees found.
                      </td>
                    </tr>
                  )}

                  {employees.map((employee) => (
                    <tr
                      key={employee.employee_number}
                      className="border-border-muted border-b align-top last:border-b-0"
                    >
                      <td className="py-3 pr-4">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="text-primary cursor-help text-left hover:underline">
                              {employee.employee_number}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            align="start"
                            sideOffset={8}
                            className="max-w-none rounded-lg border border-border bg-surface p-3 text-text shadow-lg"
                          >
                            <EmployeeDetailsTooltip employee={employee} />
                          </TooltipContent>
                        </Tooltip>
                      </td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
  const getAllEmployees = useServerAction<{ name: string }, Employee[]>({
    name: "getAllEmployees",
    apiUrl: "/api/getAllEmployees",
  });

  const queryFn = useCallback(
    (name: string) => getAllEmployees({ name }),
    [getAllEmployees],
  );

  const {
    data: employees = [],
    isLoading,
    refresh,
    error,
  } = useServerQuery("allEmployeeQuery", queryFn);

  const [stats, setStats] = useState({
    totalEmployees: 0,
    permanentCount: 0,
    teacherCount: 0,
    principalCount: 0,
    averageSalaryGrade: 0,
    recentlyPromoted: [] as Employee[],
    recentlyJoined: [] as Employee[],
    designationDistribution: {} as Record<string, number>,
  });

  useEffect(() => {
    if (!employees.length) return;

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
      employees.reduce((acc, e) => acc + e.salary_grade, 0) / totalEmployees,
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

    setStats({
      totalEmployees,
      permanentCount,
      teacherCount,
      principalCount,
      averageSalaryGrade,
      recentlyPromoted,
      recentlyJoined,
      designationDistribution,
    });
  }, [employees]);

  return (
    <main className="min-w-0 space-y-8 p-4 md:p-8">
      <Card className="gap-0 border-border p-0">
        <CardHeader className="flex flex-row items-center justify-between px-4 py-2">
          <CardTitle>
            <Text size="2xl" weight="bold" className="px-2 py-1 leading-none">
              Overview
            </Text>
          </CardTitle>
          <CardAction>
            <div className="flex items-center gap-2">
              <Button
                className="px-3 py-2"
                aria-label="refresh overview"
                onClick={() => refresh()}
              >
                Refresh
              </Button>
            </div>
          </CardAction>
        </CardHeader>
      </Card>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total Employees" value={stats.totalEmployees} />
        <StatCard title="Permanent" value={stats.permanentCount} />
        <StatCard title="Teachers" value={stats.teacherCount} />
        <StatCard title="Principals" value={stats.principalCount} />
        <StatCard title="Avg Salary Grade" value={stats.averageSalaryGrade} />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ActivityCard
          title="Recently Promoted"
          employees={stats.recentlyPromoted}
        />
        <ActivityCard
          title="Recently Joined"
          employees={stats.recentlyJoined}
        />
      </section>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>
            <Text weight="semibold">Designation Distribution</Text>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(stats.designationDistribution).map(
            ([role, count]) => (
              <div
                key={role}
                className="flex items-center justify-between text-sm"
              >
                <Text>{role}</Text>
                <Badge>{count}</Badge>
              </div>
            ),
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default function Dashboard() {
  const subPages = {
    overview: {
      component: OverviewDashboard,
    },
    employees: {
      component: EmployeeDashboard,
    },
  };

  const [activeSubPage, setActiveSubPage] = useState("overview");

  return (
    <TooltipProvider delayDuration={120}>
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
            {Object.entries(subPages).map(([name]) => (
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
                <Text size="sm" weight="medium" className="text-inherit">
                  {name}
                </Text>
              </Button>
            ))}
          </nav>
        </aside>

        {(() => {
          const Comp =
            subPages[activeSubPage as keyof typeof subPages].component;
          return <Comp />;
        })()}
      </div>
    </TooltipProvider>
  );
}
