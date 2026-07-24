import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  FileText,
  RefreshCw,
  Sparkles,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import {
  getRecruiterDashboard,
  type RecruiterDashboardData,
} from "../../services/recruiterDashboardService";

import "./RecruiterDashboard.css";

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

function getRecruiterName() {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return "Recruiter";
  }

  try {
    const user = JSON.parse(storedUser) as StoredUser;

    const name =
      user.fullName?.trim() ||
      user.name?.trim() ||
      user.email?.split("@")[0] ||
      "Recruiter";

    return name.split(/\s+/)[0];
  } catch {
    return "Recruiter";
  }
}

function formatDate(value?: string | null) {
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

export default function RecruiterDashboard() {
  const [dashboard, setDashboard] =
    useState<RecruiterDashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const recruiterName = useMemo(
    getRecruiterName,
    [],
  );

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const dashboardData =
        await getRecruiterDashboard();

      setDashboard(dashboardData);
    } catch (error) {
      setDashboard(null);

      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          "Unable to load recruiter dashboard data.",
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
      title: "Active Jobs",
      value:
        dashboard?.summary.activeJobs ?? null,
      description:
        "Jobs currently open for applications",
      icon: BriefcaseBusiness,
      tone: "coral",
    },
    {
      title: "Applications",
      value:
        dashboard?.summary.totalApplications ??
        null,
      description:
        "Applications received across your jobs",
      icon: FileText,
      tone: "purple",
    },
    {
      title: "Shortlisted",
      value:
        dashboard?.summary
          .shortlistedCandidates ?? null,
      description:
        "Candidates moved to the shortlist",
      icon: CheckCircle2,
      tone: "green",
    },
    {
      title: "Interviews",
      value:
        dashboard?.summary.upcomingInterviews ??
        null,
      description:
        "Upcoming scheduled interviews",
      icon: CalendarDays,
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
            AI-powered hiring command centre
          </span>

          <h1>
            Build stronger teams,
            <span>{recruiterName}.</span>
          </h1>

          <p>
            Manage vacancies, review applicants and
            coordinate interviews from one recruitment
            workspace.
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
                  ? "Checking recruitment data"
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
              ? "Please wait while TalentSync checks the recruiter dashboard API."
              : dashboard
                ? "Recruitment information is being loaded from the secured backend API."
                : backendNotConfigured
                  ? "The recruiter interface is ready. Add the backend dashboard endpoint when it becomes available."
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
            <span>Recruitment overview</span>
            <h2>Hiring performance</h2>

            <p>
              Live values will appear after the recruiter
              dashboard API is connected.
            </p>
          </div>
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

      <div className="recruiter-dashboard-grid">
        <section className="recruiter-panel recruiter-jobs-panel">
          <header className="recruiter-section-header">
            <div>
              <span>Job management</span>
              <h2>Active jobs</h2>

              <p>
                Vacancies currently managed by your
                recruiter account.
              </p>
            </div>
          </header>

          {loading ? (
            <div className="recruiter-loading-state">
              <RefreshCw
                size={24}
                className="is-spinning"
              />

              <p>Loading active jobs...</p>
            </div>
          ) : dashboard &&
            dashboard.activeJobs.length > 0 ? (
            <div className="recruiter-record-list">
              {dashboard.activeJobs.map((job) => (
                <article
                  key={job.jobId}
                  className="recruiter-record-item"
                >
                  <span className="recruiter-record-icon">
                    <BriefcaseBusiness size={20} />
                  </span>

                  <div className="recruiter-record-copy">
                    <h3>{job.title}</h3>

                    <p>
                      {job.applicantCount} applicant
                      {job.applicantCount === 1
                        ? ""
                        : "s"}
                    </p>

                    <small>
                      Closing:{" "}
                      {formatDate(job.closingDate)}
                    </small>
                  </div>

                  <span className="recruiter-status-badge">
                    {job.status}
                  </span>
                </article>
              ))}
            </div>
          ) : (
            <div className="recruiter-empty-state">
              <BriefcaseBusiness size={27} />

              <h3>No active jobs available</h3>

              <p>
                Job vacancies will appear here after they
                are returned by the backend.
              </p>
            </div>
          )}
        </section>

        <section className="recruiter-panel">
          <header className="recruiter-section-header">
            <div>
              <span>Talent pipeline</span>
              <h2>Recent applicants</h2>

              <p>
                Latest candidates who applied for your
                vacancies.
              </p>
            </div>
          </header>

          {loading ? (
            <div className="recruiter-loading-state">
              <RefreshCw
                size={24}
                className="is-spinning"
              />

              <p>Loading applicants...</p>
            </div>
          ) : dashboard &&
            dashboard.recentApplicants.length > 0 ? (
            <div className="recruiter-record-list">
              {dashboard.recentApplicants.map(
                (applicant) => (
                  <article
                    key={applicant.applicationId}
                    className="recruiter-record-item"
                  >
                    <span className="recruiter-record-icon">
                      <UsersRound size={20} />
                    </span>

                    <div className="recruiter-record-copy">
                      <h3>
                        {applicant.candidateName}
                      </h3>

                      <p>{applicant.jobTitle}</p>

                      <small>
                        Applied:{" "}
                        {formatDate(
                          applicant.appliedAt,
                        )}
                      </small>
                    </div>

                    <div className="recruiter-applicant-meta">
                      {applicant.matchScore != null && (
                        <strong>
                          {applicant.matchScore}% match
                        </strong>
                      )}

                      <span className="recruiter-status-badge">
                        {applicant.status}
                      </span>
                    </div>
                  </article>
                ),
              )}
            </div>
          ) : (
            <div className="recruiter-empty-state">
              <UsersRound size={27} />

              <h3>No applicants available</h3>

              <p>
                Applicant records will appear after the
                backend returns recruitment data.
              </p>
            </div>
          )}
        </section>

        <section className="recruiter-panel recruiter-interviews-panel">
          <header className="recruiter-section-header">
            <div>
              <span>Interview planning</span>
              <h2>Upcoming interviews</h2>

              <p>
                Scheduled interviews connected to your
                recruitment pipeline.
              </p>
            </div>
          </header>

          {loading ? (
            <div className="recruiter-loading-state">
              <RefreshCw
                size={24}
                className="is-spinning"
              />

              <p>Loading interviews...</p>
            </div>
          ) : dashboard &&
            dashboard.upcomingInterviews.length > 0 ? (
            <div className="recruiter-record-list">
              {dashboard.upcomingInterviews.map(
                (interview) => (
                  <article
                    key={interview.interviewId}
                    className="recruiter-record-item"
                  >
                    <span className="recruiter-record-icon">
                      <CalendarDays size={20} />
                    </span>

                    <div className="recruiter-record-copy">
                      <h3>
                        {interview.candidateName}
                      </h3>

                      <p>{interview.jobTitle}</p>

                      <small>
                        {formatDate(
                          interview.scheduledAt,
                        )}
                      </small>
                    </div>

                    {interview.interviewType && (
                      <span className="recruiter-status-badge">
                        {interview.interviewType}
                      </span>
                    )}
                  </article>
                ),
              )}
            </div>
          ) : (
            <div className="recruiter-empty-state">
              <CalendarDays size={27} />

              <h3>No upcoming interviews</h3>

              <p>
                Scheduled interviews will appear here after
                the backend is connected.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}