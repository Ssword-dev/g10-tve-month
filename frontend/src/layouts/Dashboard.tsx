import Button from "@/components/Button";
import Tooltip from "@/components/Tooltip";
import TooltipContent from "@/components/TooltipContent";
import TooltipProvider from "@/components/TooltipProvider";
import TooltipTrigger from "@/components/TooltipTrigger";
import Text from "@/components/Text";
import {
  currentAdminProfilePictureQuery,
  currentAdminSessionQuery,
  logoutAction,
} from "@/domain/auth/actions";
import { getAuthRole } from "@/domain/auth/session";
import useServerQuery from "@/hooks/useServerQuery";
import { GraduationCap, Info, LogOut, Settings } from "lucide-react";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import { cn } from "@_ssword/classes";

export default function Dashboard() {
  const match = useMatch("/dashboard/:subRoute");
  const subRoute = useMemo(() => match?.params.subRoute ?? "overview", [match]);

  const navigate = useNavigate();
  const { data: sessionData } = useServerQuery(currentAdminSessionQuery);
  const { data: profilePictureData } = useServerQuery(
    currentAdminProfilePictureQuery,
  );
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const role = getAuthRole(sessionData);

  const subRoutes =
    role === "admin" ? ["overview", "employees"] : ["employees"];

  const handleNavigate = useCallback(
    (route: string) => {
      navigate(`/dashboard/${route}`);
    },
    [navigate],
  );

  const goToAboutUs = useCallback(
    () => handleNavigate("about-us"),
    [handleNavigate],
  );

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
  const defaultAvatarUrl = "/default-profile.svg";
  const avatarUrl =
    profilePictureData?.avatar_url ??
    currentUser?.avatar_url ??
    defaultAvatarUrl;

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
              <div className="flex items-center gap-3 rounded-lg border border-border/70 bg-muted/35 px-3 py-2">
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="h-9 w-9 rounded-full border border-border/60 object-cover"
                  onError={(event) => {
                    event.currentTarget.src = defaultAvatarUrl;
                  }}
                />
                <Text size="sm" weight="semibold" className="truncate">
                  {currentUser.first_name} {currentUser.last_name}
                </Text>
                <Tooltip open={settingsOpen} onOpenChange={setSettingsOpen}>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="ml-auto px-2 py-1 text-muted-foreground hover:text-foreground"
                      onClick={() => setSettingsOpen((current) => !current)}
                    >
                      <Settings className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    align="end"
                    sideOffset={8}
                    className="w-52 rounded-lg border border-border bg-card p-2 text-foreground shadow-lg"
                  >
                    <div className="space-y-1 text-sm">
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left hover:bg-muted"
                        onClick={() => {
                          setSettingsOpen(false);
                          goToAboutUs();
                        }}
                      >
                        <Info className="size-4 text-muted-foreground" />
                        About Us
                      </button>
                      {role === "admin" ? (
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left hover:bg-muted disabled:opacity-50"
                          onClick={() => {
                            setSettingsOpen(false);
                            void logout();
                          }}
                          disabled={isLoggingOut}
                        >
                          <LogOut className="size-4 text-muted-foreground" />
                          {isLoggingOut ? "Signing out..." : "Sign out"}
                        </button>
                      ) : null}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            ) : null}
          </div>
        </aside>

        <main className="overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </TooltipProvider>
  );
}
