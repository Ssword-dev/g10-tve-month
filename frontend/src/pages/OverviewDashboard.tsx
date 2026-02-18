import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Card from "@/components/Card";
import CardAction from "@/components/CardAction";
import CardContent from "@/components/CardContent";
import CardHeader from "@/components/CardHeader";
import CardTitle from "@/components/CardTitle";
import Text from "@/components/Text";
import { overviewDashboardStatsQuery } from "@/domain/overview/actions";
import type {
  OverviewActivityEmployee,
  OverviewDashboardStats,
} from "@/domain/overview/types";
import useServerQuery from "@/hooks/useServerQuery";

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
  const resolvedStats: OverviewDashboardStats = stats ?? {
    totalEmployees: 0,
    permanentCount: 0,
    teacherCount: 0,
    principalCount: 0,
    averageSalaryGrade: 0,
    recentlyPromoted: [],
    recentlyJoined: [],
    designationDistribution: {},
  };

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

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Employees"
          value={resolvedStats.totalEmployees}
        />
        <StatCard title="Permanent" value={resolvedStats.permanentCount} />
        <StatCard title="Teachers" value={resolvedStats.teacherCount} />
        <StatCard title="Principals" value={resolvedStats.principalCount} />
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

      <Card className="border-border">
        <CardHeader>
          <CardTitle>
            <Text weight="semibold">Designation Distribution</Text>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(resolvedStats.designationDistribution).map(
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
          {!isLoading &&
            Object.keys(resolvedStats.designationDistribution).length === 0 && (
              <Text size="sm" className="text-muted-foreground">
                No designation data available.
              </Text>
            )}
        </CardContent>
      </Card>
    </main>
  );
}
