import {
  Navigate,
  Outlet,
} from "react-router-dom";

type StoredUser = {
  role?: string;
};

const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export default function AdminRoute() {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token || !storedUser) {
    clearSession();
    return <Navigate to="/login" replace />;
  }

  let user: StoredUser;

  try {
    user = JSON.parse(storedUser) as StoredUser;
  } catch {
    clearSession();
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "Administrator") {
    clearSession();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
