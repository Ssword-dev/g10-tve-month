import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/misc";
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
            className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between"
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
        <CardHeader className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>
            <Text
              size="lg"
              weight="bold"
              className="px-2 py-1 leading-tight sm:text-2xl"
            >
              SPRCNHS School Employee Management Overview
            </Text>
          </CardTitle>
          <CardAction>
            <Button
              className="w-full px-3 py-2 sm:w-auto"
              onClick={() => refresh()}
            >
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

      <Card className="border-border py-0">
        <CardHeader className="px-5 py-3">
          <CardTitle>
            <Text size="3xl" weight="bold">
              Employee Summary
            </Text>
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
            <Accordion type="single" defaultValue="staff-summary-table">
              <AccordionItem value="staff-summary-table">
                <AccordionTrigger>
                  <Text weight="semibold" size="base">
                    Teaching and Non-Teaching Summary
                  </Text>
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
                            <th className="py-2 pr-4 font-medium">Metric</th>
                            <th className="py-2 pr-4 font-medium">Teaching</th>
                            <th className="py-2 pr-4 font-medium">
                              Non-Teaching
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-border/70 border-b">
                            <td className="py-2 pr-4">Total Staff</td>
                            <td className="py-2 pr-4">
                              {
                                dashboardSummaries.teachingEmployeesSummary
                                  .teachingStaff
                              }
                            </td>
                            <td className="py-2 pr-4">
                              {
                                dashboardSummaries.nonTeachingEmployeesSummary
                                  .nonTeachingStaff
                              }
                            </td>
                          </tr>
                          <tr className="border-border/70 border-b">
                            <td className="py-2 pr-4">JHS</td>
                            <td className="py-2 pr-4">
                              {
                                dashboardSummaries.teachingEmployeesSummary
                                  .noJhsTeachers
                              }
                            </td>
                            <td className="py-2 pr-4">
                              {
                                dashboardSummaries.nonTeachingEmployeesSummary
                                  .noJhsNonTeachingStaff
                              }
                            </td>
                          </tr>
                          <tr className="border-border/70 border-b">
                            <td className="py-2 pr-4">SHS</td>
                            <td className="py-2 pr-4">
                              {
                                dashboardSummaries.teachingEmployeesSummary
                                  .noShsTeachers
                              }
                            </td>
                            <td className="py-2 pr-4">
                              {
                                dashboardSummaries.nonTeachingEmployeesSummary
                                  .noShsNonTeachingStaff
                              }
                            </td>
                          </tr>
                          <tr className="border-border/70 border-b">
                            <td className="py-2 pr-4">With Masters</td>
                            <td className="py-2 pr-4">
                              {
                                dashboardSummaries.teachingEmployeesSummary
                                  .noTeachersWithMastersDegree
                              }
                            </td>
                            <td className="py-2 pr-4">
                              {
                                dashboardSummaries.nonTeachingEmployeesSummary
                                  .noNonTeachingStaffWithMastersDegree
                              }
                            </td>
                          </tr>
                          <tr className="border-border/70 border-b last:border-b-0">
                            <td className="py-2 pr-4">With Doctorate</td>
                            <td className="py-2 pr-4">
                              {
                                dashboardSummaries.teachingEmployeesSummary
                                  .noTeachersWithDoctorateDegree
                              }
                            </td>
                            <td className="py-2 pr-4">
                              {
                                dashboardSummaries.nonTeachingEmployeesSummary
                                  .noNonTeachingStaffWithDoctorateDegree
                              }
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="designation-frequency-table">
                <AccordionTrigger>
                  <Text weight="semibold" size="base">
                    Designation Frequency Table
                  </Text>
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
                  <Text weight="semibold" size="base">
                    Employment Status Distribution Table
                  </Text>
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

              <AccordionItem value="number-of-permanent-and-non-permanent-employees">
                <AccordionTrigger>
                  <Text weight="semibold" size="base">
                    Total number of permanent, non-permanent, and all employees.
                  </Text>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-border/70 border-b text-muted-foreground">
                          <th className="py-2 pr-4 font-medium">Metric</th>
                          <th className="py-2 pr-4 font-medium">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-border/70 border-b">
                          <td className="py-2 pr-4">Permanent</td>
                          <td className="py-2 pr-4">
                            {resolvedStats.permanentCount}
                          </td>
                        </tr>
                        <tr className="border-border/70 border-b">
                          <td className="py-2 pr-4">Non-Permanent</td>
                          <td className="py-2 pr-4">
                            {resolvedStats.nonPermanentCount}
                          </td>
                        </tr>
                        <tr className="border-border/70 border-b">
                          <td className="py-2 pr-4">Total Employees</td>
                          <td className="py-2 pr-4">
                            {resolvedStats.totalEmployees}
                          </td>
                        </tr>
                        <tr className="border-border/70 border-b last:border-b-0">
                          <td className="py-2 pr-4">Avg Salary Grade</td>
                          <td className="py-2 pr-4">
                            {resolvedStats.averageSalaryGrade}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </CardContent>
      </Card>

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
    </main>
  );
}
