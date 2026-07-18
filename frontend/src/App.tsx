import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import LoginPage from "./pages/auth/LoginPage";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";

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
      </Route>

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}