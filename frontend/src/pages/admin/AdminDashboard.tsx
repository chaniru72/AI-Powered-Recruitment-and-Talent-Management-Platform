import { useEffect, useState } from "react";
import {
  Activity,
  BriefcaseBusiness,
  Building2,
  Database,
  FileClock,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import adminService, {
  type AdminAuditLog,
  type AdminDashboard,
  type AdminSystemStatus,
} from "../../services/adminService";

import "./AdminDashboard.css";

type LoadState = "idle" | "loading" | "success" | "error";

export default function AdminDashboard() {
  const [dashboard, setDashboard] =
    useState<AdminDashboard | null>(null);

  const [systemStatus, setSystemStatus] =
    useState<AdminSystemStatus | null>(null);

  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoadState("loading");
        setErrorMessage("");

        const [dashboardData, statusData, auditLogData] =
          await Promise.all([
            adminService.getDashboard(),
            adminService.getSystemStatus(),
            adminService.getAuditLogs(),
          ]);

        setDashboard(dashboardData);
        setSystemStatus(statusData);
        setAuditLogs(auditLogData.slice(0, 5));
        setLoadState("success");
      } catch {
        setLoadState("error");
        setErrorMessage(
          "Unable to load Admin dashboard. Please check admin login token and backend connection.",
        );
      }
    };

    void loadDashboard();
  }, []);

  return (
    <div className="admin-page">
      <section className="admin-hero">
        <div>
          <p className="admin-kicker">Admin Control Center</p>
          <h1>TalentSync AI Administration</h1>
          <span>
            Monitor users, organizations, jobs, system health, and
            admin activity from one secure dashboard.
          </span>
        </div>

        <div className="admin-hero-badge">
          <ShieldCheck size={24} />
          <strong>Administrator</strong>
          <small>Secure access enabled</small>
        </div>
      </section>

      {loadState === "loading" && (
        <div className="admin-state-card">
          Loading admin dashboard...
        </div>
      )}

      {loadState === "error" && (
        <div className="admin-state-card admin-error">
          {errorMessage}
        </div>
      )}

      {dashboard && (
        <>
          <section className="admin-stats-grid">
            <article className="admin-stat-card">
              <span>
                <UsersRound size={22} />
              </span>
              <p>Total Users</p>
              <h2>{dashboard.totalUsers}</h2>
              <small>
                {dashboard.activeUsers} active /{" "}
                {dashboard.inactiveUsers} inactive
              </small>
            </article>

            <article className="admin-stat-card">
              <span>
                <Building2 size={22} />
              </span>
              <p>Organizations</p>
              <h2>{dashboard.totalOrganizations}</h2>
              <small>Recruiter organizations</small>
            </article>

            <article className="admin-stat-card">
              <span>
                <BriefcaseBusiness size={22} />
              </span>
              <p>Total Jobs</p>
              <h2>{dashboard.totalJobs}</h2>
              <small>
                {dashboard.activeJobs} open / {dashboard.closedJobs} closed
              </small>
            </article>

            <article className="admin-stat-card">
              <span>
                <Activity size={22} />
              </span>
              <p>Applications</p>
              <h2>{dashboard.totalApplications}</h2>
              <small>Candidate applications</small>
            </article>
          </section>

          <section className="admin-content-grid">
            <article className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <p>User Roles</p>
                  <h2>Platform user summary</h2>
                </div>
                <UsersRound size={22} />
              </div>

              <div className="admin-role-list">
                <div>
                  <span>Candidates</span>
                  <strong>{dashboard.totalCandidates}</strong>
                </div>
                <div>
                  <span>Recruiters</span>
                  <strong>{dashboard.totalRecruiters}</strong>
                </div>
                <div>
                  <span>Hiring Managers</span>
                  <strong>{dashboard.totalHiringManagers}</strong>
                </div>
                <div>
                  <span>Administrators</span>
                  <strong>{dashboard.totalAdministrators}</strong>
                </div>
              </div>
            </article>

            <article className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <p>System Health</p>
                  <h2>Backend status</h2>
                </div>
                <Database size={22} />
              </div>

              {systemStatus && (
                <div className="admin-system-list">
                  <div>
                    <span>API</span>
                    <strong>{systemStatus.apiStatus}</strong>
                  </div>
                  <div>
                    <span>Database</span>
                    <strong>{systemStatus.databaseStatus}</strong>
                  </div>
                  <div>
                    <span>Environment</span>
                    <strong>{systemStatus.environment}</strong>
                  </div>
                  <div>
                    <span>Version</span>
                    <strong>{systemStatus.version}</strong>
                  </div>
                </div>
              )}
            </article>
          </section>

          <section className="admin-panel admin-audit-panel">
            <div className="admin-panel-header">
              <div>
                <p>Audit Logs</p>
                <h2>Latest admin actions</h2>
              </div>
              <FileClock size={22} />
            </div>

            <div className="admin-audit-list">
              {auditLogs.length === 0 ? (
                <p className="admin-empty-text">
                  No audit logs available.
                </p>
              ) : (
                auditLogs.map((log) => (
                  <article key={log.id} className="admin-audit-item">
                    <div>
                      <strong>{log.action}</strong>
                      <span>{log.details}</span>
                    </div>

                    <small>
                      {log.adminEmail ?? "Unknown admin"}
                    </small>
                  </article>
                ))
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}