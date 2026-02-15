import Button from "@/components/Button";
import TooltipProvider from "@/components/TooltipProvider";
import Text from "@/components/Text";
import { GraduationCap } from "lucide-react";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import { useMemo } from "react";

export default function Dashboard() {
  const match = useMatch("/dashboard/:subRoute");
  const subRoute = useMemo(() => match?.params.subRoute ?? "overview", [match]);

  const navigate = useNavigate();

  const subRoutes = ["overview", "employees"];

  const handleNavigate = (route: string) => {
    navigate(`/dashboard/${route}`);
  };

  return (
    <TooltipProvider delayDuration={120}>
      <div className="grid h-screen w-screen overflow-x-hidden grid-cols-1 bg-background text-text lg:grid-cols-[250px_1fr]">
        <aside className="border-border-muted bg-surface/90 p-6 lg:border-r">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-xl bg-accent/35 p-2">
              <GraduationCap className="size-5 text-accent-strong" />
            </div>
            <Text size="lg" weight="semibold">
              Dashboard
            </Text>
          </div>

          <nav className="space-y-2">
            {subRoutes.map((name) => {
              const isActive = name === subRoute;

              return (
                <Button
                  key={name}
                  variant="glass"
                  className={
                    isActive
                      ? "w-full justify-start gap-3 bg-accent text-text hover:bg-accent-strong"
                      : "w-full justify-start gap-3 bg-transparent text-text-muted hover:bg-muted hover:text-text"
                  }
                  onClick={() => handleNavigate(name)}
                >
                  <Text size="sm" weight="medium" className="text-inherit">
                    {name}
                  </Text>
                </Button>
              );
            })}
          </nav>
        </aside>

        <main className="overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </TooltipProvider>
  );
}
