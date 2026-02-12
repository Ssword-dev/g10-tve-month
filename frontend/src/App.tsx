import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing";
import Loading from "./Loading";

const LoginPage = React.lazy(() => import("./pages/Login"));
const SignupPage = React.lazy(() => import("./pages/Signup"));

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

        <Route path="/dashboard/admin"></Route>
      </Routes>
    </Router>
  );
}

export default App;
