import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/misc";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  currentAdminProfilePictureQuery,
  currentAdminSessionQuery,
  logoutAction,
} from "@/domain/auth/actions";
import { getAuthRole } from "@/domain/auth/session";
import useServerQuery from "@/hooks/useServerQuery";
import {
  AccessibilityIcon,
  ChevronRightIcon,
  CircleQuestionMarkIcon,
  Code2Icon,
  ContactRoundIcon,
  GraduationCapIcon,
  HouseIcon,
  LogOut,
  PaletteIcon,
  RocketIcon,
  Settings,
  SettingsIcon,
  SlidersHorizontalIcon,
  UsersIcon,
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@_ssword/classes";
import websiteIconSource from "@/assets/website_icon.png";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DashboardFooter } from "@/components/features/dashboard/DashboardFooter";

const ParentRouteContext = React.createContext(false);

function Route({
  name,
  label,
  icon: Icon,
  isActive,
  onNavigate,
}: {
  name: string;
  label: string;
  icon?: React.ComponentType;
  isActive: boolean;
  onNavigate: (route: string) => void;
}) {
  const isInsideParentRoute = React.useContext(ParentRouteContext);

  if (isInsideParentRoute) {
    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton
          onClick={() => onNavigate(name)}
          isActive={isActive}
          className={cn({
            "bg-accent text-accent-foreground": isActive,
          })}
        >
          {Icon ? <Icon /> : null}
          <Text
            size="sm"
            weight="medium"
            className="text-inherit group-data-[collapsible=icon]:hidden"
          >
            {label}
          </Text>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  }

  return (
    <SidebarMenuItem>
      <TooltipProvider>
        <SidebarMenuButton
          tooltip={label}
          onClick={() => onNavigate(name)}
          className={cn("hover:cursor-pointer", {
            "bg-accent text-accent-foreground": isActive,
          })}
        >
          {Icon ? <Icon /> : null}
          <Text
            size="sm"
            weight="medium"
            className="text-inherit group-data-[collapsible=icon]:hidden"
          >
            {label}
          </Text>
        </SidebarMenuButton>
      </TooltipProvider>
    </SidebarMenuItem>
  );
}

function ParentRoute({
  label,
  icon: Icon,
  isActive,
  children,
}: {
  label: string;
  icon: React.ComponentType;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <Collapsible asChild className="group/collapsible" defaultOpen={isActive}>
      <SidebarMenuItem>
        <TooltipProvider>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={label}>
              <Icon />
              <Text
                size="sm"
                weight="medium"
                className="text-inherit group-data-[collapsible=icon]:hidden"
              >
                {label}
              </Text>
              <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
        </TooltipProvider>
        <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
          <ParentRouteContext.Provider value>
            <SidebarMenuSub>{children}</SidebarMenuSub>
          </ParentRouteContext.Provider>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function DashboardSubroutes({
  currentPath,
  onNavigate,
  role,
}: {
  currentPath: string;
  onNavigate: (route: string) => void;
  role: ReturnType<typeof getAuthRole>;
}) {
  const isSettingsActive =
    currentPath === "/dashboard/settings" ||
    currentPath === "/dashboard/settings/" ||
    currentPath.startsWith("/dashboard/settings/");

  const isAboutActive =
    currentPath.startsWith("/dashboard/about/the-team") ||
    currentPath.startsWith("/dashboard/about/the-school") ||
    currentPath.startsWith("/dashboard/contact-us");

  return (
    <SidebarMenu className="flex flex-col gap-2">
      <Route
        name="home"
        label="Home"
        icon={HouseIcon}
        isActive={currentPath.startsWith("/dashboard/home")}
        onNavigate={onNavigate}
      />

      {role === "admin" ? (
        <Route
          name="overview"
          label="Overview"
          icon={RocketIcon}
          isActive={currentPath.startsWith("/dashboard/overview")}
          onNavigate={onNavigate}
        />
      ) : null}

      <Route
        name="employees"
        label="Employees"
        icon={UsersIcon}
        isActive={currentPath.startsWith("/dashboard/employees")}
        onNavigate={onNavigate}
      />

      <ParentRoute
        label="Settings"
        icon={SettingsIcon}
        isActive={isSettingsActive}
      >
        <Route
          name="settings"
          label="General"
          icon={SlidersHorizontalIcon}
          isActive={
            currentPath === "/dashboard/settings" ||
            currentPath === "/dashboard/settings/"
          }
          onNavigate={onNavigate}
        />
        <Route
          name="settings/appearance"
          label="Appearance"
          icon={PaletteIcon}
          isActive={currentPath.startsWith("/dashboard/settings/appearance")}
          onNavigate={onNavigate}
        />
        <Route
          name="settings/accessibility"
          label="Accessibility"
          icon={AccessibilityIcon}
          isActive={currentPath.startsWith("/dashboard/settings/accessibility")}
          onNavigate={onNavigate}
        />
      </ParentRoute>

      <ParentRoute
        label="About Us"
        icon={CircleQuestionMarkIcon}
        isActive={isAboutActive}
      >
        <Route
          name="about/the-school"
          label="The School"
          isActive={currentPath.startsWith("/dashboard/about/the-school")}
          icon={GraduationCapIcon}
          onNavigate={onNavigate}
        />

        <Route
          name="about/the-team"
          label="The Developers"
          isActive={currentPath.startsWith("/dashboard/about/the-team")}
          icon={Code2Icon}
          onNavigate={onNavigate}
        />
        <Route
          name="contact-us"
          label="Contact Us"
          isActive={currentPath.startsWith("/dashboard/contact-us")}
          icon={ContactRoundIcon}
          onNavigate={onNavigate}
        />
      </ParentRoute>
    </SidebarMenu>
  );
}

export default function Dashboard() {
  const location = useLocation();
  const currentPath = useMemo(() => location.pathname, [location.pathname]);
  const navigate = useNavigate();
  const { data: sessionData } = useServerQuery(currentAdminSessionQuery);
  const { data: profilePictureData } = useServerQuery(
    currentAdminProfilePictureQuery,
  );
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsMenuRef = useRef<HTMLDivElement | null>(null);
  const role = getAuthRole(sessionData);

  const handleNavigate = useCallback(
    (route: string) => {
      navigate(`/dashboard/${route}`);
    },
    [navigate],
  );

  const goToSettings = useCallback(
    () => handleNavigate("settings"),
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
    <SidebarProvider>
      <Sidebar
        variant="sidebar"
        className="border-r border-border/70 bg-card lg:bg-card/90"
      >
        <SidebarHeader className="mb-6 gap-0 px-5 pt-5 md:px-6 md:pt-6">
          <div className="flex items-center gap-3">
            <Link to="/dashboard/home" className="shrink-0">
              <img
                className="w-6 aspect-square select-none"
                src={websiteIconSource}
              />
            </Link>
            <Link
              to="/dashboard/home"
              className="min-w-0 group-data-[collapsible=icon]:hidden"
            >
              <Text size="sm" weight="semibold" className="truncate leading-5">
                SPRCNHS SEMS
              </Text>
            </Link>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {/** padding here makes a better fit. */}
          <SidebarGroup className="px-3 md:px-4">
            <DashboardSubroutes
              currentPath={currentPath}
              onNavigate={handleNavigate}
              role={role}
            />
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="px-3 pb-5 pt-6 md:px-4 md:pb-6">
          {currentUser ? (
            <div className="flex items-center gap-3 rounded-lg border border-border/70 bg-muted/35 px-3 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:px-0">
              <img
                src={avatarUrl}
                alt="Profile"
                className="h-9 w-9 rounded-full border border-border/60 object-cover"
                onError={(event) => {
                  event.currentTarget.src = defaultAvatarUrl;
                }}
              />
              <Text
                size="sm"
                weight="semibold"
                className="truncate group-data-[collapsible=icon]:hidden"
              >
                {currentUser.first_name} {currentUser.last_name}
              </Text>
              <div
                className="relative ml-auto group-data-[collapsible=icon]:hidden"
                ref={settingsMenuRef}
              >
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
                          goToSettings();
                        }}
                      >
                        <Settings className="size-4 text-muted-foreground" />
                        Settings
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
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="h-svh overflow-y-auto bg-background text-foreground">
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border/70 bg-card/95 px-4 py-3 backdrop-blur">
          <SidebarTrigger className="px-2 py-1" />
          <div className="flex flex-row gap-2">
            {!sessionData?.authenticated && (
              <>
                <Button
                  className="px-2 py-1"
                  variant="outline"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </Button>
                <Button
                  className="px-2 py-1"
                  variant="primary"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex min-h-full flex-1 flex-col">
          <main className="flex-1">
            <Outlet />
          </main>
          <DashboardFooter />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
