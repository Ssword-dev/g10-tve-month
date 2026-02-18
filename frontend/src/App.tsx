import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Button from "@/components/Button";
import Loading from "@/Loading";
import Text from "@/components/Text";
import { currentAdminSessionQuery } from "@/domain/auth/actions";
import useServerQuery from "@/hooks/useServerQuery";
import LandingPage from "@/pages/Landing";

const LoginPage = React.lazy(() => import("@/pages/Login"));
const SignupPage = React.lazy(() => import("@/pages/Signup"));
const DashboardLayout = React.lazy(() => import("@/layouts/Dashboard"));
const OverviewDashboardPage = React.lazy(
  () => import("@/pages/OverviewDashboard"),
);
const EmployeeDashboardPage = React.lazy(
  () => import("@/pages/EmployeeDashboard/page"),
);

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
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
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

function App() {
  return (
    <Router>
      <React.Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
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
              <RequireAdminRoute>
                <DashboardLayout />
              </RequireAdminRoute>
            }
          >
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<OverviewDashboardPage />} />
            <Route path="employees" element={<EmployeeDashboardPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
    </Router>
  );
}

export default App;
