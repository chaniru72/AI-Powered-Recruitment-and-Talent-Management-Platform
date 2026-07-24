import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AdminRoute from "./components/routes/AdminRoute";
import CandidateRoute from "./components/routes/CandidateRoute";
import RecruiterRoute from "./components/routes/RecruiterRoute";
import HiringManagerRoute from "./components/routes/HiringManagerRoute";

import AdminLayout from "./layouts/AdminLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import RecruiterLayout from "./layouts/RecruiterLayout";
import HiringManagerLayout from "./layouts/HiringManagerLayout";

import LoginPage from "./pages/auth/LoginPage";

import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CandidateJobs from "./pages/candidate/CandidateJobs";
import CandidateApplications from "./pages/candidate/CandidateApplications";
import CandidateMessages from "./pages/candidate/CandidateMessages";
import CandidateProfile from "./pages/candidate/CandidateProfile";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import RecruiterJobs from "./pages/recruiter/RecruiterJobs";
import RecruiterApplicants from "./pages/recruiter/RecruiterApplicants";
import RecruiterInterviews from "./pages/recruiter/RecruiterInterviews";
import RecruiterMessages from "./pages/recruiter/RecruiterMessages";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";

import HiringManagerDashboard from "./pages/hiring-manager/HiringManagerDashboard";
import HiringManagerCandidates from "./pages/hiring-manager/HiringManagerCandidates";
import HiringManagerCandidateDetails from "./pages/hiring-manager/HiringManagerCandidateDetails";

import HiringManagerInterviews from "./pages/hiringManager/HiringManagerInterviews";
import HiringManagerEvaluation from "./pages/hiringManager/HiringManagerEvaluation";
import HiringManagerDecisions from "./pages/hiringManager/HiringManagerDecisions";

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
            path="interviews"
            element={<RecruiterInterviews />}
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

      <Route element={<AdminRoute />}>
        <Route
          path="/admin"
          element={<AdminLayout />}
        >
          <Route
            index
            element={
              <Navigate
                to="/admin/dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="users"
            element={<AdminUsers />}
          />
        </Route>
      </Route>

      <Route element={<HiringManagerRoute />}>
        <Route
          path="/hiring-manager"
          element={<HiringManagerLayout />}
        >
          <Route
            index
            element={
              <Navigate
                to="/hiring-manager/dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={<HiringManagerDashboard />}
          />

          <Route
            path="candidates"
            element={<HiringManagerCandidates />}
          />

          <Route
            path="candidates/:applicationId"
            element={<HiringManagerCandidateDetails />}
          />

          <Route
            path="interviews"
            element={<HiringManagerInterviews />}
          />

          <Route
            path="interviews/:interviewId/evaluation"
            element={<HiringManagerEvaluation />}
          />

          <Route
            path="interviews/:interviewId/applications/:applicationId/decision"
            element={<HiringManagerDecisions />}
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