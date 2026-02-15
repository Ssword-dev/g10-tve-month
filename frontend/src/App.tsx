import React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Loading from "@/Loading";
import LandingPage from "@/pages/Landing";

const LoginPage = React.lazy(() => import("@/pages/Login"));
const SignupPage = React.lazy(() => import("@/pages/Signup"));
const DashboardLayout = React.lazy(() => import("@/layouts/Dashboard"));
const OverviewDashboardPage = React.lazy(() => import("@/pages/OverviewDashboard"));
const EmployeeDashboardPage = React.lazy(() => import("@/pages/EmployeeDashboard"));

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <React.Suspense fallback={<Loading />}>
              <LoginPage />
            </React.Suspense>
          }
        />

        <Route
          path="/signup"
          element={
            <React.Suspense fallback={<Loading />}>
              <SignupPage />
            </React.Suspense>
          }
        />

        <Route
          path="/dashboard"
          element={
            <React.Suspense fallback={<Loading />}>
              <DashboardLayout />
            </React.Suspense>
          }
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route
            path="overview"
            element={
              <React.Suspense fallback={<Loading />}>
                <OverviewDashboardPage />
              </React.Suspense>
            }
          />
          <Route
            path="employees"
            element={
              <React.Suspense fallback={<Loading />}>
                <EmployeeDashboardPage />
              </React.Suspense>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
