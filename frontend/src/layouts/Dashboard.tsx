import Button from "@/components/Button";
import TooltipProvider from "@/components/TooltipProvider";
import Text from "@/components/Text";
import { currentAdminSessionQuery, logoutAction } from "@/domain/auth/actions";
import useServerQuery from "@/hooks/useServerQuery";
import { GraduationCap, LogOut } from "lucide-react";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { cn } from "@_ssword/classes";

export default function Dashboard() {
  const match = useMatch("/dashboard/:subRoute");
  const subRoute = useMemo(() => match?.params.subRoute ?? "overview", [match]);

  const navigate = useNavigate();
  const { data: sessionData } = useServerQuery(currentAdminSessionQuery);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const subRoutes = ["overview", "employees"];

  const handleNavigate = (route: string) => {
    navigate(`/dashboard/${route}`);
  };

  const logout = async () => {
    try {
      setIsLoggingOut(true);
      const result = await logoutAction({});
      result.unwrap();
      await currentAdminSessionQuery.refresh();
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const currentUser = sessionData?.user;

  return (
    <TooltipProvider delayDuration={120}>
      <div className="grid h-screen w-screen overflow-x-hidden grid-cols-1 bg-background text-foreground lg:grid-cols-[250px_1fr]">
        <aside className="border-border/70 bg-card/90 p-6 lg:border-r flex flex-col">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-xl bg-accent/35 p-2">
              <GraduationCap className="size-5 text-primary" />
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
                  className={cn("px-2 py-1", {
                    "w-full justify-start gap-3 bg-primary text-primary-foreground hover:bg-primary/90":
                      isActive,
                    "w-full justify-start gap-3 bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground":
                      !isActive,
                  })}
                  onClick={() => handleNavigate(name)}
                >
                  <Text size="sm" weight="medium" className="text-inherit">
                    {name}
                  </Text>
                </Button>
              );
            })}
          </nav>

          <div className="mt-auto space-y-3 pt-6">
            {currentUser ? (
              <div className="rounded-lg border border-border/70 bg-muted/35 px-3 py-2">
                <Text size="xs" className="text-muted-foreground">
                  Signed in as
                </Text>
                <Text size="sm" weight="semibold">
                  {currentUser.first_name} {currentUser.last_name}
                </Text>
              </div>
            ) : null}
            <Button
              variant="glass"
              className="w-full justify-start gap-2 bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => void logout()}
              disabled={isLoggingOut}
            >
              <LogOut className="size-4" />
              {isLoggingOut ? "Signing out..." : "Sign out"}
            </Button>
          </div>
        </aside>

        <main className="overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </TooltipProvider>
  );
}
