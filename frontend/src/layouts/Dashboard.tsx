import Button from "@/components/Button";
import Text from "@/components/Text";
import {
  currentAdminProfilePictureQuery,
  currentAdminSessionQuery,
  logoutAction,
} from "@/domain/auth/actions";
import { getAuthRole } from "@/domain/auth/session";
import useServerQuery from "@/hooks/useServerQuery";
import { Info, LogOut, Settings } from "lucide-react";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@_ssword/classes";
import websiteIconSource from "../assets/website_icon.png";

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
  const settingsMenuRef = useRef<HTMLDivElement | null>(null);
  const role = getAuthRole(sessionData);

  const subRoutes =
    role === "admin"
      ? [
          { name: "overview", label: "Overview" },
          { name: "employees", label: "Employees" },
        ]
      : [{ name: "employees", label: "Employees" }];

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
  const profilePictureUrl = profilePictureData?.avatar_url;
  const resolvedProfilePictureUrl =
    profilePictureUrl && profilePictureUrl !== defaultAvatarUrl
      ? profilePictureUrl
      : null;
  const avatarUrl =
    resolvedProfilePictureUrl ?? currentUser?.avatar_url ?? defaultAvatarUrl;

  useEffect(() => {
    if (!settingsOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsMenuRef.current &&
        !settingsMenuRef.current.contains(event.target as Node)
      ) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [settingsOpen]);

  return (
    <div className="grid h-screen w-screen overflow-x-hidden grid-cols-1 bg-background text-foreground lg:grid-cols-[250px_1fr]">
      <aside className="border-border/70 bg-card/90 p-6 lg:border-r flex flex-col">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-accent/35 p-2">
            <img src={websiteIconSource} className="size-5" />
          </div>
          <Text size="lg" weight="semibold">
            Dashboard
          </Text>
        </div>

        <nav className="space-y-2">
          {subRoutes.map((route) => {
            const isActive = route.name === subRoute;

            return (
              <Button
                key={route.name}
                variant="glass"
                className={cn("px-2 py-1", {
                  "w-full justify-start gap-3 bg-primary text-primary-foreground hover:bg-primary/90":
                    isActive,
                  "w-full justify-start gap-3 bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground":
                    !isActive,
                })}
                onClick={() => handleNavigate(route.name)}
              >
                <Text size="sm" weight="medium" className="text-inherit">
                  {route.label}
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
              <div className="relative ml-auto" ref={settingsMenuRef}>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="px-2 py-1 text-muted-foreground hover:text-foreground"
                  onClick={() => setSettingsOpen((current) => !current)}
                >
                  <Settings className="size-4" />
                </Button>

                {settingsOpen ? (
                  <div className="absolute bottom-full right-0 z-50 mb-2 w-52 rounded-lg border border-border bg-card p-2 text-foreground shadow-lg">
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
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </aside>

      <main className="overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
