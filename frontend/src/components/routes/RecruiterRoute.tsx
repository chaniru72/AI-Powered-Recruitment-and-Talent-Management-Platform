import {
  Navigate,
  Outlet,
} from "react-router-dom";

type StoredUser = {
  role?: string;
};

export default function RecruiterRoute() {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token || !storedUser) {
    return <Navigate to="/login" replace />;
  }

  let user: StoredUser;

  try {
    user = JSON.parse(storedUser) as StoredUser;
  } catch {
    return <Navigate to="/login" replace />;
  }

  const normalizedRole = user.role
    ?.trim()
    .toLowerCase();

  if (normalizedRole !== "recruiter") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}