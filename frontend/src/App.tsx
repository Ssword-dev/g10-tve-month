import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Loading from "@/Loading";
import LandingPage from "@/pages/Landing";

const LoginPage = React.lazy(() => import("@/pages/Login"));
const SignupPage = React.lazy(() => import("@/pages/Signup"));
const DashboardLayout = React.lazy(() => import("@/layouts/Dashboard"));
const OverviewDashboardPage = React.lazy(
  () => import("@/pages/OverviewDashboard"),
);
const EmployeeDashboardPage = React.lazy(
  () => import("@/pages/EmployeeDashboard"),
);

function App() {
  return (
    <Router>
      <React.Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<OverviewDashboardPage />} />
            <Route path="employees" element={<EmployeeDashboardPage />} />
          </Route>
        </Routes>
      </React.Suspense>
    </Router>
  );
}

export default App;
