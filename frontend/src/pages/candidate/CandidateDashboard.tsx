import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Award,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getCandidateDashboardData,
  type CandidateDashboardData,
} from "../../services/candidateDashboardService";

import type {
  ApplicationStatus,
  CandidateApplication,
} from "../../types/application";

import "./CandidateDashboard.css";
import "./CandidateActivity.css";

type StoredUser = {
  name?: string;
  fullName?: string;
  firstName?: string;
};

function getStoredCandidateName(): string {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return "Candidate";
    }

    const user = JSON.parse(storedUser) as StoredUser;

    const name =
      user.fullName ??
      user.name ??
      user.firstName ??
      "Candidate";

    return name.trim().split(/\s+/)[0] || "Candidate";
  } catch {
    return "Candidate";
  }
}

function hasText(value?: string | null): boolean {
  return Boolean(value?.trim());
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatApplicationStatus(
  status: ApplicationStatus,
): string {
  switch (status) {
    case "UnderReview":
      return "Under review";

    case "Shortlisted":
      return "Shortlisted";

    case "Rejected":
      return "Rejected";

    case "Hired":
      return "Hired";

    case "Withdrawn":
      return "Withdrawn";

    default:
      return "Applied";
  }
}

function getApplicationTone(
  status: ApplicationStatus,
): "applied" | "review" | "shortlisted" {
  switch (status) {
    case "Shortlisted":
    case "Hired":
      return "shortlisted";

    case "UnderReview":
    case "Rejected":
    case "Withdrawn":
      return "review";

    default:
      return "applied";
  }
}

function countApplicationsByStatus(
  applications: CandidateApplication[],
  status: ApplicationStatus,
): number {
  return applications.filter(
    (application) => application.status === status,
  ).length;
}

export default function CandidateDashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] =
    useState<CandidateDashboardData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await getCandidateDashboardData();

      setDashboardData(data);
    } catch {
      setDashboardData(null);
      setErrorMessage(
        "We could not load your dashboard information. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const profile = dashboardData?.profile ?? null;
  const applications = dashboardData?.applications ?? [];
  const jobs = dashboardData?.jobs ?? [];

  const candidateName = useMemo(() => {
    const profileName = profile?.fullName?.trim();

    if (profileName) {
      return profileName.split(/\s+/)[0];
    }

    return getStoredCandidateName();
  }, [profile]);

  const profileChecklist = useMemo(() => {
    const personalDetailsComplete =
      hasText(profile?.phone) &&
      hasText(profile?.location);

    const skillsEducationComplete =
      hasText(profile?.skills) &&
      hasText(profile?.education);

    const experienceComplete = hasText(
      profile?.experienceSummary,
    );

    const resumeComplete = hasText(profile?.resumeUrl);

    return [
      {
        title: "Personal details",
        complete: personalDetailsComplete,
      },
      {
        title: "Skills and education",
        complete: skillsEducationComplete,
      },
      {
        title: "Work experience",
        complete: experienceComplete,
      },
      {
        title: "Résumé",
        complete: resumeComplete,
      },
    ];
  }, [profile]);

  const profileCompletion = useMemo(() => {
    if (!profile) {
      return 0;
    }

    const completedItems = profileChecklist.filter(
      (item) => item.complete,
    ).length;

    return Math.round(
      (completedItems / profileChecklist.length) * 100,
    );
  }, [profile, profileChecklist]);

  const nextProfileAction = useMemo(() => {
    if (!profile) {
      return "Create your candidate profile to improve your opportunities.";
    }

    const firstIncompleteItem = profileChecklist.find(
      (item) => !item.complete,
    );

    if (!firstIncompleteItem) {
      return "Your main profile sections are complete.";
    }

    return `Complete your ${firstIncompleteItem.title.toLowerCase()} section.`;
  }, [profile, profileChecklist]);

  const openJobs = useMemo(() => {
    return [...jobs]
      .filter((job) => job.status === "Open")
      .sort((firstJob, secondJob) => {
        const firstDate = new Date(
          firstJob.createdAt,
        ).getTime();

        const secondDate = new Date(
          secondJob.createdAt,
        ).getTime();

        return secondDate - firstDate;
      });
  }, [jobs]);

  const featuredJob = openJobs[0] ?? null;
  const additionalJobs = openJobs.slice(1, 3);

  const recentApplications = useMemo(() => {
    return [...applications]
      .sort((firstApplication, secondApplication) => {
        const firstDate = new Date(
          firstApplication.appliedAt,
        ).getTime();

        const secondDate = new Date(
          secondApplication.appliedAt,
        ).getTime();

        return secondDate - firstDate;
      })
      .slice(0, 3);
  }, [applications]);

  const underReviewCount = countApplicationsByStatus(
    applications,
    "UnderReview",
  );

  const shortlistedCount = countApplicationsByStatus(
    applications,
    "Shortlisted",
  );

  const hiredCount = countApplicationsByStatus(
    applications,
    "Hired",
  );

  const statistics = [
    {
      title: "Applications",
      value: applications.length,
      change: "Submitted applications",
      icon: FileText,
      tone: "coral",
    },
    {
      title: "Under Review",
      value: underReviewCount,
      change: "Currently being reviewed",
      icon: Eye,
      tone: "purple",
    },
    {
      title: "Shortlisted",
      value: shortlistedCount,
      change: "Moved forward",
      icon: CheckCircle2,
      tone: "sage",
    },
    {
      title: "Open Jobs",
      value: openJobs.length,
      change: "Available opportunities",
      icon: TrendingUp,
      tone: "peach",
    },
  ];

  const journeyStages = [
    {
      title: "Submitted",
      value: applications.length,
      description: "Total applications",
      icon: FileText,
      tone: "coral",
    },
    {
      title: "Under Review",
      value: underReviewCount,
      description: "Being reviewed",
      icon: Eye,
      tone: "peach",
    },
    {
      title: "Shortlisted",
      value: shortlistedCount,
      description: "Moved forward",
      icon: CalendarDays,
      tone: "purple",
    },
    {
      title: "Hired",
      value: hiredCount,
      description: "Successful outcomes",
      icon: Award,
      tone: "sage",
    },
  ];

  if (isLoading) {
    return (
      <div className="clear-dashboard">
        <section className="clear-lifecycle">
          <div
            style={{
              minHeight: "320px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <LoaderCircle
              size={36}
              className="animate-spin"
            />

            <p>Loading your dashboard...</p>
          </div>
        </section>
      </div>
    );
  }

  if (errorMessage || !dashboardData) {
    return (
      <div className="clear-dashboard">
        <section className="clear-lifecycle">
          <div
            style={{
              minHeight: "320px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "12px",
              textAlign: "center",
            }}
          >
            <AlertCircle size={38} />

            <h2>Dashboard unavailable</h2>

            <p>{errorMessage}</p>

            <button
              type="button"
              onClick={() => void loadDashboard()}
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="clear-dashboard">
      <section className="clear-intro">
        <div className="clear-intro-decoration clear-decoration-one" />
        <div className="clear-intro-decoration clear-decoration-two" />

        <div className="clear-intro-copy">
          <span className="clear-eyebrow">
            <Sparkles size={15} />
            Candidate command centre
          </span>

          <h1>
            Your next opportunity starts here,
            <span>{candidateName}.</span>
          </h1>

          <p>
            Review your real application progress, discover
            available jobs, and continue building your profile.
          </p>

          <div className="clear-intro-actions">
            <button
              type="button"
              className="clear-primary-button"
              onClick={() => navigate("/candidate/jobs")}
            >
              Explore opportunities
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              className="clear-secondary-button"
              onClick={() => navigate("/candidate/profile")}
            >
              Update profile
            </button>
          </div>
        </div>

        <aside className="clear-focus-card">
          <header>
            <div>
              <span>Profile readiness</span>

              <h2>
                {profileCompletion === 100
                  ? "Profile complete"
                  : "Keep building your profile"}
              </h2>
            </div>

            <Target size={22} />
          </header>

          <div className="clear-focus-content">
            <div
              className="clear-profile-ring"
              style={
                {
                  "--progress-angle": `${profileCompletion * 3.6}deg`,
                } as CSSProperties
              }
            >
              <div>
                <strong>{profileCompletion}%</strong>
                <span>Complete</span>
              </div>
            </div>

            <div className="clear-focus-copy">
              <span>Next best action</span>

              <p>{nextProfileAction}</p>

              <div>
                <small>Open roles</small>
                <strong>{openJobs.length}</strong>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/candidate/profile")}
          >
            Update profile
            <ArrowUpRight size={16} />
          </button>
        </aside>
      </section>

      {dashboardData.unavailableSections.length > 0 && (
        <section className="clear-lifecycle">
          <header className="clear-section-header">
            <div>
              <span>Live data notice</span>

              <h2>Some information is temporarily unavailable</h2>

              <p>
                Unavailable sections:{" "}
                {dashboardData.unavailableSections.join(", ")}.
                The available dashboard data is still shown.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadDashboard()}
            >
              Retry
              <RefreshCw size={15} />
            </button>
          </header>
        </section>
      )}

      <section className="clear-lifecycle">
        <header className="clear-section-header">
          <div>
            <span>Candidate journey</span>

            <h2>Your recruitment lifecycle</h2>

            <p>
              Follow your actual applications from submission
              to final outcomes.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/candidate/applications")
            }
          >
            View applications
            <ArrowRight size={15} />
          </button>
        </header>

        <div className="clear-lifecycle-track">
          <span className="clear-track-line" />

          {journeyStages.map((stage, index) => {
            const Icon = stage.icon;

            return (
              <article
                key={stage.title}
                className={`clear-stage clear-stage-${stage.tone}`}
              >
                <div className="clear-stage-icon">
                  <Icon size={20} />
                </div>

                <div className="clear-stage-content">
                  <strong>{stage.value}</strong>
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                </div>

                {index < journeyStages.length - 1 && (
                  <ArrowRight
                    size={17}
                    className="clear-stage-arrow"
                  />
                )}
              </article>
            );
          })}
        </div>
      </section>

      <div className="clear-bento">
        <section className="clear-featured-job">
          {featuredJob ? (
            <>
              <div className="clear-featured-top">
                <span className="clear-featured-label">
                  <Sparkles size={14} />
                  Latest open opportunity
                </span>

                <div className="clear-job-match">
                  <span>{featuredJob.status}</span>
                </div>
              </div>

              <div className="clear-featured-company">
                <span>
                  <BriefcaseBusiness size={25} />
                </span>

                <div>
                  <small>Recently published role</small>
                  <h2>{featuredJob.title}</h2>
                  <p>{featuredJob.organizationName}</p>
                </div>
              </div>

              <div className="clear-featured-details">
                <span>
                  <MapPin size={15} />
                  {featuredJob.location ||
                    "Location not specified"}
                </span>

                <span>
                  <Clock3 size={15} />
                  {featuredJob.employmentType ||
                    "Employment type not specified"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate("/candidate/jobs")}
              >
                View opportunity
                <ArrowUpRight size={17} />
              </button>
            </>
          ) : (
            <>
              <div className="clear-featured-top">
                <span className="clear-featured-label">
                  <BriefcaseBusiness size={14} />
                  Open opportunities
                </span>
              </div>

              <div className="clear-featured-company">
                <span>
                  <BriefcaseBusiness size={25} />
                </span>

                <div>
                  <small>Live job information</small>
                  <h2>No open jobs available</h2>

                  <p>
                    New opportunities will appear when recruiters
                    publish them.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/candidate/jobs")}
              >
                Browse jobs
                <ArrowUpRight size={17} />
              </button>
            </>
          )}
        </section>

        <section className="clear-performance">
          <header>
            <div>
              <span>Performance</span>
              <h2>Career activity</h2>
            </div>

            <TrendingUp size={21} />
          </header>

          <div className="clear-statistics">
            {statistics.map((statistic) => {
              const Icon = statistic.icon;

              return (
                <article
                  key={statistic.title}
                  className={`clear-statistic clear-statistic-${statistic.tone}`}
                >
                  <span className="clear-statistic-icon">
                    <Icon size={18} />
                  </span>

                  <div>
                    <span>{statistic.title}</span>
                    <small>{statistic.change}</small>
                  </div>

                  <strong>{statistic.value}</strong>
                </article>
              );
            })}
          </div>
        </section>

        <section className="clear-opportunities">
          <header className="clear-section-header">
            <div>
              <span>Available now</span>
              <h2>More opportunities</h2>
            </div>

            <button
              type="button"
              onClick={() => navigate("/candidate/jobs")}
            >
              View all
              <ArrowRight size={15} />
            </button>
          </header>

          <div className="clear-opportunity-list">
            {additionalJobs.length === 0 ? (
              <p>
                No additional open opportunities are currently
                available.
              </p>
            ) : (
              additionalJobs.map((job) => (
                <article
                  key={job.id}
                  className="clear-opportunity-item"
                >
                  <span className="clear-opportunity-icon">
                    <BriefcaseBusiness size={20} />
                  </span>

                  <div className="clear-opportunity-copy">
                    <h3>{job.title}</h3>
                    <p>{job.organizationName}</p>

                    <div>
                      <span>
                        <MapPin size={13} />
                        {job.location ||
                          "Location not specified"}
                      </span>

                      <span>
                        <Clock3 size={13} />
                        {job.employmentType ||
                          "Type not specified"}
                      </span>
                    </div>
                  </div>

                  <div className="clear-opportunity-action">
                    <strong>{job.status}</strong>

                    <button
                      type="button"
                      onClick={() =>
                        navigate("/candidate/jobs")
                      }
                    >
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="clear-profile-checklist">
          <header>
            <span>Profile strength</span>
            <h2>Build a stronger profile</h2>

            <p>
              Complete your actual profile information to help
              recruiters understand your background.
            </p>
          </header>

          <div className="clear-checklist">
            {profileChecklist.map((item) => (
              <div
                key={item.title}
                className={
                  item.complete
                    ? "is-complete"
                    : "is-incomplete"
                }
              >
                <span>
                  {item.complete ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Clock3 size={18} />
                  )}

                  {item.title}
                </span>

                {item.complete ? (
                  <strong>Complete</strong>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/candidate/profile")
                    }
                  >
                    Add details
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="clear-activity">
          <header className="clear-section-header">
            <div>
              <span>Recent activity</span>
              <h2>Application timeline</h2>

              <p>
                Your latest applications returned by the backend.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/candidate/applications")
              }
            >
              View all
              <ArrowRight size={15} />
            </button>
          </header>

          <div className="clear-activity-list">
            {recentApplications.length === 0 ? (
              <p>
                You have not submitted any applications yet.
              </p>
            ) : (
              recentApplications.map((application) => {
                const tone = getApplicationTone(
                  application.status,
                );

                const formattedStatus =
                  formatApplicationStatus(
                    application.status,
                  );

                return (
                  <article
                    key={application.id}
                    className="clear-activity-item"
                  >
                    <span
                      className={`clear-activity-marker clear-status-${tone}`}
                    />

                    <div className="clear-activity-copy">
                      <strong>{application.jobTitle}</strong>

                      <span>
                        Application #{application.id}
                      </span>
                    </div>

                    <span className="clear-activity-date">
                      <CalendarDays size={14} />
                      {formatDate(application.appliedAt)}
                    </span>

                    <span
                      className={`clear-activity-status clear-status-${tone}`}
                    >
                      {formattedStatus}
                    </span>

                    <button
                      type="button"
                      aria-label={`View ${application.jobTitle} application`}
                      onClick={() =>
                        navigate("/candidate/applications")
                      }
                    >
                      <Eye size={17} />
                    </button>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}