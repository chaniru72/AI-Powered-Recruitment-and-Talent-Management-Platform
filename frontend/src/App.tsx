import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import CandidateRoute from "./components/routes/CandidateRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import LoginPage from "./pages/auth/LoginPage";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CandidateJobs from "./pages/candidate/CandidateJobs";
import CandidateApplications from "./pages/candidate/CandidateApplications";
import CandidateMessages from "./pages/candidate/CandidateMessages";
import CandidateProfile from "./pages/candidate/CandidateProfile";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route element={<CandidateRoute />}>
        <Route
          path="/candidate"
          element={<DashboardLayout />}
        >
          <Route
            index
            element={
              <Navigate
                to="/candidate/dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={<CandidateDashboard />}
          />

          <Route
            path="jobs"
            element={<CandidateJobs />}
          />

          <Route
            path="applications"
            element={<CandidateApplications />}
          />

          <Route
            path="messages"
            element={<CandidateMessages />}
          />

          <Route
            path="profile"
            element={<CandidateProfile />}
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}
