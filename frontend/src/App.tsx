import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import CandidateRoute from "./components/routes/CandidateRoute";
import RecruiterRoute from "./components/routes/RecruiterRoute";

import DashboardLayout from "./layouts/DashboardLayout";
import RecruiterLayout from "./layouts/RecruiterLayout";

import LoginPage from "./pages/auth/LoginPage";

import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CandidateJobs from "./pages/candidate/CandidateJobs";
import CandidateApplications from "./pages/candidate/CandidateApplications";
import CandidateMessages from "./pages/candidate/CandidateMessages";
import CandidateProfile from "./pages/candidate/CandidateProfile";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import RecruiterJobs from "./pages/recruiter/RecruiterJobs";
import RecruiterApplicants from "./pages/recruiter/RecruiterApplicants";
import RecruiterMessages from "./pages/recruiter/RecruiterMessages";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";

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

      <Route element={<RecruiterRoute />}>
        <Route
          path="/recruiter"
          element={<RecruiterLayout />}
        >
          <Route
            index
            element={
              <Navigate
                to="/recruiter/dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={<RecruiterDashboard />}
          />

          <Route
            path="jobs"
            element={<RecruiterJobs />}
          />

          <Route
            path="applicants"
            element={<RecruiterApplicants />}
          />

          <Route
            path="messages"
            element={<RecruiterMessages />}
          />

          <Route
            path="profile"
            element={<RecruiterProfile />}
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