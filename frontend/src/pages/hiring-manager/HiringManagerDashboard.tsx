import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Sparkles,
  UserCheck,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  getHiringManagerDashboard,
  type HiringManagerDashboardData,
} from "../../services/hiringManagerService";

import "../recruiter/RecruiterDashboard.css";

type StoredUser = {
  fullName?: string;
  name?: string;
  email?: string;
};

type SummaryCard = {
  title: string;
  value: number | null;
  description: string;
  icon: LucideIcon;
  tone: string;
};

function getHiringManagerName(): string {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return "";
  }

  try {
    const user = JSON.parse(storedUser) as StoredUser;

    const name =
      user.fullName?.trim() ||
      user.name?.trim() ||
      user.email?.split("@")[0] ||
      "";

    return name.split(/\s+/)[0] ?? "";
  } catch {
    return "";
  }
}

function formatDate(value?: string | null): string {
  if (!value) {
    return "Date not available";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function formatStatus(status: string): string {
  return status.replace(
    /([a-z])([A-Z])/g,
    "$1 $2",
  );
}

export default function HiringManagerDashboard() {
  const [dashboard, setDashboard] =
    useState<HiringManagerDashboardData | null>(
      null,
    );

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  const hiringManagerName = useMemo(
    getHiringManagerName,
    [],
  );

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const dashboardData =
        await getHiringManagerDashboard();

      setDashboard(dashboardData);
    } catch (error) {
      setDashboard(null);

      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          "Unable to load hiring manager dashboard data.",
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const summaryCards: SummaryCard[] = [
    {
      title: "Total Candidates",
      value:
        dashboard?.summary.totalCandidates ?? null,
      description:
        "Candidates available for hiring review",
      icon: UsersRound,
      tone: "coral",
    },
    {
      title: "Under Review",
      value:
        dashboard?.summary
          .underReviewCandidates ?? null,
      description:
        "Applications currently being reviewed",
      icon: Clock3,
      tone: "purple",
    },
    {
      title: "Shortlisted",
      value:
        dashboard?.summary.shortlistedCandidates ??
        null,
      description:
        "Candidates selected for the next stage",
      icon: CheckCircle2,
      tone: "green",
    },
    {
      title: "Hired",
      value:
        dashboard?.summary.hiredCandidates ?? null,
      description:
        "Candidates with completed hiring decisions",
      icon: UserCheck,
      tone: "orange",
    },
  ];

  const backendNotConfigured =
    errorMessage.includes(
      "API endpoint is not configured",
    );

  return (
    <div className="recruiter-dashboard">
      <section className="recruiter-hero">
        <span className="recruiter-hero-circle recruiter-circle-one" />
        <span className="recruiter-hero-circle recruiter-circle-two" />

        <div className="recruiter-hero-copy">
          <span className="recruiter-eyebrow">
            <Sparkles size={15} />
            Hiring decision workspace
          </span>

          <h1>
            Make informed hiring decisions
            {hiringManagerName && (
              <span>, {hiringManagerName}.</span>
            )}
          </h1>

          <p>
            Review candidates and monitor hiring
            progress using information returned by
            the secured backend API.
          </p>

          <button
            type="button"
            className="recruiter-refresh-button"
            onClick={() => void loadDashboard()}
            disabled={loading}
          >
            <RefreshCw
              size={17}
              className={
                loading ? "is-spinning" : ""
              }
            />

            {loading
              ? "Loading dashboard"
              : "Refresh dashboard"}
          </button>
        </div>

        <aside className="recruiter-status-card">
          <header>
            <div>
              <span>System connection</span>

              <h2>
                {loading
                  ? "Checking candidate data"
                  : dashboard
                    ? "Dashboard connected"
                    : "Backend connection pending"}
              </h2>
            </div>

            {dashboard ? (
              <CheckCircle2 size={24} />
            ) : (
              <AlertCircle size={24} />
            )}
          </header>

          <p>
            {loading
              ? "Please wait while TalentSync checks the hiring manager API."
              : dashboard
                ? "Candidate information is being loaded through the secured backend API."
                : backendNotConfigured
                  ? "The frontend is ready. The Hiring Manager backend endpoint can be connected later."
                  : "The dashboard could not retrieve data from the backend API."}
          </p>

          <div className="recruiter-connection-status">
            <span
              className={
                dashboard
                  ? "is-connected"
                  : loading
                    ? "is-loading"
                    : "is-pending"
              }
            />

            <strong>
              {dashboard
                ? "Connected"
                : loading
                  ? "Checking"
                  : "Awaiting backend"}
            </strong>
          </div>
        </aside>
      </section>

      <section className="recruiter-summary-section">
        <header className="recruiter-section-header">
          <div>
            <span>Hiring overview</span>
            <h2>Candidate pipeline</h2>

            <p>
              Dashboard values are calculated from
              candidate records returned by the
              backend.
            </p>
          </div>

          <Link
            to="/hiring-manager/candidates"
            className="recruiter-refresh-button"
          >
            View candidates
          </Link>
        </header>

        <div className="recruiter-summary-grid">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className={`recruiter-summary-card recruiter-summary-${card.tone}`}
              >
                <span className="recruiter-summary-icon">
                  <Icon size={21} />
                </span>

                <div>
                  <span>{card.title}</span>

                  <strong>
                    {loading
                      ? "..."
                      : card.value ?? "—"}
                  </strong>

                  <p>{card.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="recruiter-panel">
        <header className="recruiter-section-header">
          <div>
            <span>Recent activity</span>
            <h2>Recently updated candidates</h2>

            <p>
              Candidates are ordered using the latest
              update date returned by the backend.
            </p>
          </div>
        </header>

        {loading ? (
          <div className="recruiter-loading-state">
            <RefreshCw
              size={24}
              className="is-spinning"
            />

            <p>Loading candidates...</p>
          </div>
        ) : errorMessage ? (
          <div className="recruiter-empty-state">
            <AlertCircle size={27} />

            <h3>
              {backendNotConfigured
                ? "Backend endpoint not configured"
                : "Unable to load candidates"}
            </h3>

            <p>{errorMessage}</p>

            <button
              type="button"
              className="recruiter-refresh-button"
              onClick={() => void loadDashboard()}
            >
              <RefreshCw size={17} />
              Try again
            </button>
          </div>
        ) : dashboard &&
          dashboard.recentCandidates.length > 0 ? (
          <div className="recruiter-record-list">
            {dashboard.recentCandidates.map(
              (candidate) => (
                <article
                  key={candidate.id}
                  className="recruiter-record-item"
                >
                  <span className="recruiter-record-icon">
                    <UsersRound size={20} />
                  </span>

                  <div className="recruiter-record-copy">
                    <h3>
                      {candidate.candidateName}
                    </h3>

                    <p>{candidate.jobTitle}</p>

                    <small>
                      Updated:{" "}
                      {formatDate(candidate.updatedAt)}
                    </small>
                  </div>

                  <span className="recruiter-status-badge">
                    {formatStatus(candidate.status)}
                  </span>
                </article>
              ),
            )}
          </div>
        ) : (
          <div className="recruiter-empty-state">
            <UsersRound size={27} />

            <h3>No candidates available</h3>

            <p>
              Candidate records will appear here when
              they are returned by the backend.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}