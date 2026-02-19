import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Card from "@/components/Card";
import CardAction from "@/components/CardAction";
import CardContent from "@/components/CardContent";
import CardHeader from "@/components/CardHeader";
import CardTitle from "@/components/CardTitle";
import Accordion from "@/components/Accordion";
import AccordionContent from "@/components/AccordionContent";
import AccordionItem from "@/components/AccordionItem";
import AccordionTrigger from "@/components/AccordionTrigger";
import Text from "@/components/Text";
import { employeeDashboardSummariesQuery } from "@/domain/employees/actions";
import type { EmployeeDashboardSummaries } from "@/domain/employees/types";
import { overviewDashboardStatsQuery } from "@/domain/overview/actions";
import type {
  OverviewActivityEmployee,
  OverviewDashboardStats,
} from "@/domain/overview/types";
import useServerQuery from "@/hooks/useServerQuery";

const emptySummaries: EmployeeDashboardSummaries = {
  teachingEmployeesSummary: {
    teachingStaff: 0,
    noJhsTeachers: 0,
    noShsTeachers: 0,
    noTeachersWithMastersDegree: 0,
    noTeachersWithDoctorateDegree: 0,
  },
  nonTeachingEmployeesSummary: {
    nonTeachingStaff: 0,
    noJhsNonTeachingStaff: 0,
    noShsNonTeachingStaff: 0,
    noNonTeachingStaffWithMastersDegree: 0,
    noNonTeachingStaffWithDoctorateDegree: 0,
  },
  designationFrequencyTable: [],
  employmentStatusDistributionTable: [],
};

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card className="border-border">
      <CardContent className="flex flex-col space-y-1 px-5 py-5">
        <Text size="3xl" weight="bold">
          {value}
        </Text>
        <Text size="2xl" weight="semibold" className="text-muted-foreground">
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
  employees: OverviewActivityEmployee[];
}) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>
          <Text weight="semibold">{title}</Text>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {employees.map((employee) => (
          <div
            key={employee.employee_number}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex flex-row items-center gap-1">
              <Text weight="medium">
                {employee.last_name}, {employee.first_name}
              </Text>
              <Text size="xs" className="text-muted-foreground">
                ({employee.designation})
              </Text>
            </div>
            <Text size="xs" className="text-muted-foreground">
              {title === "Recently Promoted"
                ? employee.date_of_latest_promotion
                : employee.date_joined}
            </Text>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function OverviewDashboard() {
  const {
    data: stats,
    isLoading,
    refresh,
    error,
  } = useServerQuery(overviewDashboardStatsQuery);
  const {
    data: dashboardSummariesData,
    isLoading: isDashboardSummariesLoading,
    error: dashboardSummariesError,
    refresh: refreshDashboardSummaries,
  } = useServerQuery(employeeDashboardSummariesQuery);
  const resolvedStats: OverviewDashboardStats = stats ?? {
    totalEmployees: 0,
    permanentCount: 0,
    nonPermanentCount: 0,
    teacherCount: 0,
    principalCount: 0,
    averageSalaryGrade: 0,
    recentlyPromoted: [],
    recentlyJoined: [],
    designationDistribution: {},
  };
  const dashboardSummaries = dashboardSummariesData ?? emptySummaries;

  return (
    <main className="min-w-0 space-y-8 p-4 md:p-8">
      <Card className="gap-0 border-border p-0">
        <CardHeader className="flex flex-row items-center justify-between px-4 py-2">
          <CardTitle>
            <Text size="2xl" weight="bold" className="px-2 py-1 leading-none">
              SPRCNHS School Employee Management Overview
            </Text>
          </CardTitle>
          <CardAction>
            <Button className="px-3 py-2" onClick={() => refresh()}>
              Refresh
            </Button>
          </CardAction>
        </CardHeader>
      </Card>

      {error && (
        <Card className="border-border">
          <CardContent className="flex items-center justify-between gap-4 px-5 py-5">
            <Text className="text-destructive">
              Failed to load overview statistics.
            </Text>
            <Button onClick={() => refresh()}>Retry</Button>
          </CardContent>
        </Card>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={resolvedStats.totalEmployees}
        />
        <StatCard title="Permanent" value={resolvedStats.permanentCount} />
        <StatCard
          title="Non-Permanent"
          value={resolvedStats.nonPermanentCount}
        />
        <StatCard
          title="Avg Salary Grade"
          value={resolvedStats.averageSalaryGrade}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ActivityCard
          title="Recently Promoted"
          employees={resolvedStats.recentlyPromoted}
        />
        <ActivityCard
          title="Recently Joined"
          employees={resolvedStats.recentlyJoined}
        />
      </section>

      <Card className="border-border py-0">
        <CardHeader className="px-5 py-3">
          <CardTitle>
            <Text weight="semibold">Employee Summary</Text>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 py-0">
          {dashboardSummariesError ? (
            <div className="pb-4">
              <Text className="text-destructive">
                Failed to load employee summary data.
              </Text>
              <Button
                className="mt-2 px-3 py-1.5"
                onClick={() => refreshDashboardSummaries()}
              >
                Retry
              </Button>
            </div>
          ) : (
            <Accordion type="single" defaultValue="teaching-employees">
              <AccordionItem value="teaching-employees">
                <AccordionTrigger>Teaching Employees</AccordionTrigger>
                <AccordionContent>
                  {isDashboardSummariesLoading ? (
                    <Text size="sm" className="text-muted-foreground">
                      Loading summary...
                    </Text>
                  ) : (
                    <div className="flex flex-col gap-2 space-y-1">
                      <Text size="sm">
                        Teaching Staff:{" "}
                        {
                          dashboardSummaries.teachingEmployeesSummary
                            .teachingStaff
                        }
                      </Text>
                      <Text size="sm">
                        No. JHS Teachers:{" "}
                        {
                          dashboardSummaries.teachingEmployeesSummary
                            .noJhsTeachers
                        }
                      </Text>
                      <Text size="sm">
                        No. SHS Teachers:{" "}
                        {
                          dashboardSummaries.teachingEmployeesSummary
                            .noShsTeachers
                        }
                      </Text>
                      <Text size="sm">
                        No. w/ Masters:{" "}
                        {
                          dashboardSummaries.teachingEmployeesSummary
                            .noTeachersWithMastersDegree
                        }
                      </Text>
                      <Text size="sm">
                        No. w/ Doctorate:{" "}
                        {
                          dashboardSummaries.teachingEmployeesSummary
                            .noTeachersWithDoctorateDegree
                        }
                      </Text>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="non-teaching-employees">
                <AccordionTrigger>Non Teaching Employees</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2">
                  {isDashboardSummariesLoading ? (
                    <Text size="sm" className="text-muted-foreground">
                      Loading summary...
                    </Text>
                  ) : (
                    <div className="space-y-1">
                      <Text size="sm">
                        Non-Teaching Staff:{" "}
                        {
                          dashboardSummaries.nonTeachingEmployeesSummary
                            .nonTeachingStaff
                        }
                      </Text>
                      <Text size="sm">
                        No. JHS Non-Teaching:{" "}
                        {
                          dashboardSummaries.nonTeachingEmployeesSummary
                            .noJhsNonTeachingStaff
                        }
                      </Text>
                      <Text size="sm">
                        No. SHS Non-Teaching:{" "}
                        {
                          dashboardSummaries.nonTeachingEmployeesSummary
                            .noShsNonTeachingStaff
                        }
                      </Text>
                      <Text size="sm">
                        No. w/ Masters:{" "}
                        {
                          dashboardSummaries.nonTeachingEmployeesSummary
                            .noNonTeachingStaffWithMastersDegree
                        }
                      </Text>
                      <Text size="sm">
                        No. w/ Doctorate:{" "}
                        {
                          dashboardSummaries.nonTeachingEmployeesSummary
                            .noNonTeachingStaffWithDoctorateDegree
                        }
                      </Text>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="designation-frequency-table">
                <AccordionTrigger>Designation Frequency Table</AccordionTrigger>
                <AccordionContent>
                  {isDashboardSummariesLoading ? (
                    <Text size="sm" className="text-muted-foreground">
                      Loading summary...
                    </Text>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-border/70 border-b text-muted-foreground">
                            <th className="py-2 pr-4 font-medium">
                              Designation
                            </th>
                            <th className="py-2 pr-4 font-medium">
                              Number of occurence
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardSummaries.designationFrequencyTable.map(
                            (row) => (
                              <tr
                                key={row.designation}
                                className="border-border/70 border-b last:border-b-0"
                              >
                                <td className="py-2 pr-4">
                                  {row.designation || "Unspecified"}
                                </td>
                                <td className="py-2 pr-4">{row.occurrence}</td>
                              </tr>
                            ),
                          )}
                          {dashboardSummaries.designationFrequencyTable
                            .length === 0 && (
                            <tr>
                              <td
                                colSpan={2}
                                className="py-3 text-center text-muted-foreground"
                              >
                                No designation data available.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="employment-status-distribution-table">
                <AccordionTrigger>
                  Employment Status Distribution Table
                </AccordionTrigger>
                <AccordionContent>
                  {isDashboardSummariesLoading ? (
                    <Text size="sm" className="text-muted-foreground">
                      Loading summary...
                    </Text>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-border/70 border-b text-muted-foreground">
                            <th className="py-2 pr-4 font-medium">
                              Employment Status
                            </th>
                            <th className="py-2 pr-4 font-medium">
                              Number of occurence
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardSummaries.employmentStatusDistributionTable.map(
                            (row) => (
                              <tr
                                key={row.employmentStatus}
                                className="border-border/70 border-b last:border-b-0"
                              >
                                <td className="py-2 pr-4">
                                  {row.employmentStatus || "Unspecified"}
                                </td>
                                <td className="py-2 pr-4">{row.occurrence}</td>
                              </tr>
                            ),
                          )}
                          {dashboardSummaries.employmentStatusDistributionTable
                            .length === 0 && (
                            <tr>
                              <td
                                colSpan={2}
                                className="py-3 text-center text-muted-foreground"
                              >
                                No employment status data available.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
