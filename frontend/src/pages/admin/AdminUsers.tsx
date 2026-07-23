import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  RefreshCcw,
  Search,
  ShieldCheck,
  UserCog,
  UsersRound,
} from "lucide-react";

import adminService, {
  type AdminUser,
  type UserRole,
} from "../../services/adminService";

import "./AdminUsers.css";

type LoadState = "idle" | "loading" | "success" | "error";
type ActiveFilter = "" | "true" | "false";

const roleOptions: UserRole[] = [
  "Candidate",
  "Recruiter",
  "HiringManager",
  "Administrator",
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(value));
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");
  const [activeFilter, setActiveFilter] =
    useState<ActiveFilter>("");

  const [selectedRoles, setSelectedRoles] = useState<
    Record<number, UserRole>
  >({});

  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadUsers = async () => {
    try {
      setLoadState("loading");
      setErrorMessage("");
      setSuccessMessage("");

      const activeValue =
        activeFilter === ""
          ? ""
          : activeFilter === "true";

      const data = await adminService.getUsers({
        searchTerm,
        role: roleFilter,
        isActive: activeValue,
      });

      setUsers(data);

      const roleMap: Record<number, UserRole> = {};

      data.forEach((user) => {
        roleMap[user.id] = user.role;
      });

      setSelectedRoles(roleMap);
      setLoadState("success");
    } catch {
      setLoadState("error");
      setErrorMessage(
        "Unable to load users. Please check admin access and backend connection.",
      );
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void loadUsers();
  };

  const handleStatusChange = async (
    user: AdminUser,
    isActive: boolean,
  ) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      const updatedUser = await adminService.updateUserStatus(
        user.id,
        isActive,
      );

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === updatedUser.id
            ? updatedUser
            : currentUser,
        ),
      );

      setSuccessMessage(
        `${updatedUser.fullName} status updated successfully.`,
      );
    } catch {
      setErrorMessage(
        "Unable to update user status. Admin self-protection may have blocked this action.",
      );
    }
  };

  const handleRoleChange = async (user: AdminUser) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      const selectedRole = selectedRoles[user.id];

      const updatedUser = await adminService.updateUserRole(
        user.id,
        selectedRole,
      );

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === updatedUser.id
            ? updatedUser
            : currentUser,
        ),
      );

      setSuccessMessage(
        `${updatedUser.fullName} role changed to ${updatedUser.role}.`,
      );
    } catch {
      setErrorMessage(
        "Unable to update user role. Admin self-protection may have blocked this action.",
      );
    }
  };

  return (
    <main className="admin-users-page">
      <section className="admin-users-hero">
        <div>
          <p>Admin User Management</p>
          <h1>Manage platform users</h1>
          <span>
            Search users, filter by role or status, activate or deactivate
            accounts, and update user roles securely.
          </span>
        </div>

        <div className="admin-users-hero-card">
          <UsersRound size={24} />
          <strong>{users.length}</strong>
          <small>Users shown</small>
        </div>
      </section>

      <section className="admin-users-toolbar">
        <form onSubmit={handleSearchSubmit} className="admin-users-search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <button type="submit">Search</button>
        </form>

        <select
          value={roleFilter}
          onChange={(event) =>
            setRoleFilter(event.target.value as UserRole | "")
          }
          aria-label="Filter users by role"
        >
          <option value="">All roles</option>
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        <select
          value={activeFilter}
          onChange={(event) =>
            setActiveFilter(event.target.value as ActiveFilter)
          }
          aria-label="Filter users by account status"
        >
          <option value="">All statuses</option>
          <option value="true">Active only</option>
          <option value="false">Inactive only</option>
        </select>

        <button
          type="button"
          className="admin-users-refresh"
          onClick={() => void loadUsers()}
        >
          <RefreshCcw size={17} />
          Apply filters
        </button>
      </section>

      {successMessage && (
        <div className="admin-users-message success">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="admin-users-message error">
          {errorMessage}
        </div>
      )}

      {loadState === "loading" && (
        <div className="admin-users-state">Loading users...</div>
      )}

      {loadState !== "loading" && (
        <section className="admin-users-table-card">
          <div className="admin-users-table-header">
            <div>
              <p>User Directory</p>
              <h2>Registered accounts</h2>
            </div>

            <ShieldCheck size={22} />
          </div>

          <div className="admin-users-table-scroll">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Change Role</th>
                  <th>Account Action</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="admin-users-empty">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="admin-users-person">
                          <span>
                            <UserCog size={18} />
                          </span>

                          <div>
                            <strong>{user.fullName}</strong>
                            <small>{user.email}</small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="admin-users-role">
                          {user.role}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`admin-users-status ${
                            user.isActive
                              ? "is-active"
                              : "is-inactive"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>{formatDate(user.createdAt)}</td>

                      <td>
                        <div className="admin-users-role-editor">
                          <select
                            value={selectedRoles[user.id] ?? user.role}
                            onChange={(event) =>
                              setSelectedRoles((current) => ({
                                ...current,
                                [user.id]: event.target.value as UserRole,
                              }))
                            }
                          >
                            {roleOptions.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => void handleRoleChange(user)}
                            disabled={
                              (selectedRoles[user.id] ?? user.role) ===
                              user.role
                            }
                          >
                            Save
                          </button>
                        </div>
                      </td>

                      <td>
                        <button
                          type="button"
                          className={`admin-users-action ${
                            user.isActive
                              ? "danger"
                              : "primary"
                          }`}
                          onClick={() =>
                            void handleStatusChange(
                              user,
                              !user.isActive,
                            )
                          }
                        >
                          {user.isActive
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
