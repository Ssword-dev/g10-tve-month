import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/misc";
import { currentAdminSessionQuery } from "@/domain/auth/actions";
import useServerQuery from "@/hooks/useServerQuery";
import {
  BarChart2Icon,
  PersonStandingIcon,
  SettingsIcon,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function QuickAction({
  title,
  description,
  onClick,
  cta,
  icon: Icon,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  cta: string;
}) {
  return (
    <Card className="border-border hover:scale-105 transition-all duration-200">
      <CardHeader className="flex flex-row items-center gap-2 space-y-1">
        <Icon className="h-6 w-6 text-muted-foreground" />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-rows-[1fr_auto] gap-4 flex-col px-6 pt-0">
        <CardDescription>{description}</CardDescription>
        <Button
          className="flex px-2 py-1 hover:cursor-pointer hover:text-accent-foreground hover:bg-accent transition-colors duration-500"
          onClick={onClick}
        >
          {cta}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { data: sessionData } = useServerQuery(currentAdminSessionQuery);
  const user = sessionData?.user;

  return (
    <main className="min-w-0 space-y-6 p-4 md:p-8">
      <Card className="border-border">
        <CardHeader className="space-y-1">
          <CardTitle asChild>
            <Text size="5xl" weight="bold">
              Home
            </Text>
          </CardTitle>
          <CardDescription>
            <Text size="lg">
              Start here to manage staff records, monitor key dashboards,
              coordinate daily operations, and configure system preferences from
              a single central workspace for school administration.
            </Text>
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pt-0">
          <Text className="text-muted-foreground">
            {user ? `Welcome back, ${user.first_name}.` : "Welcome. "}
          </Text>
        </CardContent>
      </Card>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <QuickAction
          icon={PersonStandingIcon}
          title="Employee Directory"
          description="View, filter, and manage employee records."
          cta="Open Employees"
          onClick={() => navigate("/dashboard/employees")}
        />
        <QuickAction
          icon={BarChart2Icon}
          title="Overview Dashboard"
          description="Review metrics and recent staffing activity."
          cta="Open Overview"
          onClick={() => navigate("/dashboard/overview")}
        />
        <QuickAction
          icon={SettingsIcon}
          title="System Settings"
          description="Configure app behavior and appearance."
          cta="Open Settings"
          onClick={() => navigate("/dashboard/settings")}
        />
      </section>
    </main>
  );
}
