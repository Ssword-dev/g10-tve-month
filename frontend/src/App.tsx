import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/misc";
import Loading from "@/Loading";
import { currentAdminSessionQuery } from "@/domain/auth/actions";
import useServerQuery from "@/hooks/useServerQuery";

const LoginPage = React.lazy(() => import("@/pages/Login"));
const SignupPage = React.lazy(() => import("@/pages/Signup"));
const DashboardLayout = React.lazy(() => import("@/components/layout/Dashboard"));
const TheSchoolPage = React.lazy(() => import("@/pages/TheSchool"));
const TheTeamPage = React.lazy(() => import("@/pages/TheTeam"));
const SettingsPage = React.lazy(() => import("@/pages/Settings"));
const SettingsAppearancePage = React.lazy(
  () => import("@/pages/SettingsAppearance"),
);
const SettingsAccessibilityPage = React.lazy(
  () => import("@/pages/SettingsAccessibility"),
);
const ContactUsPage = React.lazy(() => import("@/pages/ContactUs"));
const CustomerServicePage = React.lazy(() => import("@/pages/CustomerService"));
const OverviewDashboardPage = React.lazy(
  () => import("@/pages/OverviewDashboard"),
);
const EmployeeDashboardPage = React.lazy(
  () => import("@/pages/EmployeeDashboard/page"),
);
const HomePage = React.lazy(() => import("@/pages/Home"));

function RequireAdminRoute({ children }: { children: React.ReactNode }) {
  const { data, isLoading, error, refresh } = useServerQuery(
    currentAdminSessionQuery,
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
        <div className="space-y-3 text-center">
          <Text className="text-destructive">Failed to validate your session.</Text>
          <Button onClick={() => void refresh()}>Retry</Button>
        </div>
      </main>
    );
  }

  if (!data?.authenticated) {
    return <Navigate to="/dashboard/employees" replace />;
  }

  return <>{children}</>;
}

function RequireDashboardRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, error, refresh } = useServerQuery(currentAdminSessionQuery);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
        <div className="space-y-3 text-center">
          <Text className="text-destructive">Failed to validate your session.</Text>
          <Button onClick={() => void refresh()}>Retry</Button>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}

function DashboardIndexRedirect() {
  const { isLoading } = useServerQuery(currentAdminSessionQuery);

  if (isLoading) {
    return <Loading />;
  }

  return <Navigate to="home" replace />;
}

function GuestOnlyRoute({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useServerQuery(currentAdminSessionQuery);

  if (isLoading) {
    return <Loading />;
  }

  if (data?.authenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function HomeRouteRedirect() {
  const { isLoading } = useServerQuery(currentAdminSessionQuery);

  if (isLoading) {
    return <Loading />;
  }

  return <Navigate to="/dashboard/home" replace />;
}

function App() {
  return (
    <Router>
      <React.Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<HomeRouteRedirect />} />
          <Route path="/home" element={<HomeRouteRedirect />} />
          <Route
            path="/login"
            element={
              <GuestOnlyRoute>
                <LoginPage />
              </GuestOnlyRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestOnlyRoute>
                <SignupPage />
              </GuestOnlyRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <RequireDashboardRoute>
                <DashboardLayout />
              </RequireDashboardRoute>
            }
          >
            <Route index element={<DashboardIndexRedirect />} />
            <Route path="home" element={<HomePage />} />
            <Route
              path="overview"
              element={
                <RequireAdminRoute>
                  <OverviewDashboardPage />
                </RequireAdminRoute>
              }
            />
            <Route path="employees" element={<EmployeeDashboardPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route
              path="settings/appearance"
              element={<SettingsAppearancePage />}
            />
            <Route
              path="settings/accessibility"
              element={<SettingsAccessibilityPage />}
            />
            <Route path="about">
              <Route path="the-school" element={<TheSchoolPage />} />
              <Route path="the-team" element={<TheTeamPage />} />
            </Route>
            <Route path="contact-us" element={<ContactUsPage />} />
            <Route path="customer-service" element={<CustomerServicePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
    </Router>
  );
}

export default App;
