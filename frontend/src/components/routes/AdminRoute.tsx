import { Navigate, Outlet } from "react-router-dom";

type StoredUser = {
  role?: string;
};

export default function AdminRoute() {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token || !storedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(storedUser) as StoredUser;
    const role = user.role?.toLowerCase();

    if (role !== "administrator") {
      return <Navigate to="/login" replace />;
    }

    return <Outlet />;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }
}