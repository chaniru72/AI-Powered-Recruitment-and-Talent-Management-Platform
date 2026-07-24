import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Mail,
  RefreshCw,
  Search,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";

import {
  getRecruiterApplications,
  updateRecruiterApplicationStatus,
  type RecruiterApplication,
} from "../../services/recruiterApplicationService";

import type { ApplicationStatus } from "../../types/application";

import "./RecruiterApplicants.css";

const applicationStatuses: ApplicationStatus[] = [
  "Applied",
  "UnderReview",
  "Shortlisted",
  "Rejected",
  "Hired",
  "Withdrawn",
];

function formatStatus(status: ApplicationStatus) {
  switch (status) {
    case "UnderReview":
      return "Under Review";

    default:
      return status;
  }
}

function formatDate(value: string) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load recruiter applications.";
}

export default function RecruiterApplicants() {
  const [applications, setApplications] = useState<
    RecruiterApplication[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<string>("All");
  const [jobFilter, setJobFilter] =
    useState<string>("All");

  const [selectedStatuses, setSelectedStatuses] =
    useState<Record<number, ApplicationStatus>>({});

  const [updatingApplicationId, setUpdatingApplicationId] =
    useState<number | null>(null);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const applicationList =
        await getRecruiterApplications();

      setApplications(applicationList);

      setSelectedStatuses(
        Object.fromEntries(
          applicationList.map((application) => [
            application.id,
            application.status,
          ]),
        ),
      );
    } catch (error) {
      setApplications([]);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  const jobOptions = useMemo(() => {
    const jobs = new Map<number, string>();

    applications.forEach((application) => {
      jobs.set(
        application.jobId,
        application.jobTitle,
      );
    });

    return Array.from(jobs.entries()).map(
      ([jobId, jobTitle]) => ({
        jobId,
        jobTitle,
      }),
    );
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return applications.filter((application) => {
      const matchesSearch =
        !normalizedSearch ||
        application.candidateName
          .toLowerCase()
          .includes(normalizedSearch) ||
        application.candidateEmail
          .toLowerCase()
          .includes(normalizedSearch) ||
        application.jobTitle
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" ||
        application.status === statusFilter;

      const matchesJob =
        jobFilter === "All" ||
        application.jobId === Number(jobFilter);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesJob
      );
    });
  }, [
    applications,
    searchTerm,
    statusFilter,
    jobFilter,
  ]);

  const handleStatusSelection = (
    applicationId: number,
    status: ApplicationStatus,
  ) => {
    setSelectedStatuses((current) => ({
      ...current,
      [applicationId]: status,
    }));
  };

  const handleStatusUpdate = async (
    application: RecruiterApplication,
  ) => {
    const selectedStatus =
      selectedStatuses[application.id];

    if (
      !selectedStatus ||
      selectedStatus === application.status
    ) {
      return;
    }

    setUpdatingApplicationId(application.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const updatedApplication =
        await updateRecruiterApplicationStatus(
          application.id,
          selectedStatus,
        );

      setApplications((current) =>
        current.map((item) =>
          item.id === updatedApplication.id
            ? updatedApplication
            : item,
        ),
      );

      setSelectedStatuses((current) => ({
        ...current,
        [updatedApplication.id]:
          updatedApplication.status,
      }));

      setSuccessMessage(
        `${updatedApplication.candidateName}'s application status was updated successfully.`,
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setUpdatingApplicationId(null);
    }
  };

  const backendNotConfigured =
    errorMessage.includes(
      "API endpoint is not configured",
    );

  return (
    <div className="recruiter-applicants-page">
      <section className="recruiter-applicants-heading">
        <div>
          <span>Talent pipeline</span>

          <h1>Manage applicants</h1>

          <p>
            Review candidates, examine AI match scores and
            update application progress using backend
            recruitment data.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadApplications()}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={
              loading ? "is-spinning" : ""
            }
          />

          {loading ? "Loading" : "Refresh"}
        </button>
      </section>

      <section className="recruiter-applicant-filters">
        <label>
          <Search size={18} />

          <input
            type="search"
            value={searchTerm}
            placeholder="Search candidate, email or job"
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </label>

        <select
          aria-label="Filter applicants by job"
          value={jobFilter}
          onChange={(event) =>
            setJobFilter(event.target.value)
          }
        >
          <option value="All">All jobs</option>

          {jobOptions.map((job) => (
            <option
              key={job.jobId}
              value={job.jobId}
            >
              {job.jobTitle}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter applicants by status"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="All">
            All statuses
          </option>

          {applicationStatuses.map((status) => (
            <option
              key={status}
              value={status}
            >
              {formatStatus(status)}
            </option>
          ))}
        </select>
      </section>

      {successMessage && (
        <div
          className="recruiter-applicant-message is-success"
          role="status"
        >
          <CheckCircle2 size={19} />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && !loading && (
        <div
          className="recruiter-applicant-message is-error"
          role="alert"
        >
          <AlertCircle size={19} />

          <span>
            {backendNotConfigured
              ? "The applicants interface is ready. Connect the recruiter applications endpoint when the backend becomes available."
              : errorMessage}
          </span>
        </div>
      )}

      <section className="recruiter-applicant-content">
        <header>
          <div>
            <span>Recruitment applications</span>
            <h2>Applicant records</h2>

            <p>
              Candidate information returned by the secured
              backend API.
            </p>
          </div>

          <strong>
            {loading || errorMessage
              ? "—"
              : filteredApplications.length}
          </strong>
        </header>

        {loading ? (
          <div className="recruiter-applicant-state">
            <RefreshCw
              size={28}
              className="is-spinning"
            />

            <h3>Loading applicants</h3>

            <p>
              Please wait while TalentSync checks the
              recruitment API.
            </p>
          </div>
        ) : errorMessage ? (
          <div className="recruiter-applicant-state is-error">
            <UsersRound size={29} />

            <h3>Backend connection pending</h3>

            <p>
              Applicant records will appear after the
              recruiter applications API is connected.
            </p>

            <button
              type="button"
              onClick={() => void loadApplications()}
            >
              Try again
            </button>
          </div>
        ) : applications.length === 0 ? (
          <div className="recruiter-applicant-state">
            <UsersRound size={29} />

            <h3>No applicants available</h3>

            <p>
              Applications submitted for recruiter jobs
              will appear here.
            </p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="recruiter-applicant-state">
            <Search size={29} />

            <h3>No matching applicants</h3>

            <p>
              Change the search term, job or status filter.
            </p>
          </div>
        ) : (
          <div className="recruiter-applicant-list">
            {filteredApplications.map(
              (application) => {
                const selectedStatus =
                  selectedStatuses[application.id] ??
                  application.status;

                const statusChanged =
                  selectedStatus !== application.status;

                const isUpdating =
                  updatingApplicationId ===
                  application.id;

                return (
                  <article
                    key={application.id}
                    className="recruiter-applicant-card"
                  >
                    <span className="recruiter-applicant-avatar">
                      <UserRound size={23} />
                    </span>

                    <div className="recruiter-applicant-main">
                      <div className="recruiter-applicant-title">
                        <div>
                          <h3>
                            {application.candidateName}
                          </h3>

                          <p>
                            {application.jobTitle}
                          </p>
                        </div>

                        <span
                          className={`recruiter-application-status recruiter-application-status-${application.status.toLowerCase()}`}
                        >
                          {formatStatus(
                            application.status,
                          )}
                        </span>
                      </div>

                      <div className="recruiter-applicant-details">
                        <span>
                          <Mail size={14} />
                          {application.candidateEmail}
                        </span>

                        <span>
                          <CalendarDays size={14} />
                          Applied{" "}
                          {formatDate(
                            application.appliedAt,
                          )}
                        </span>
                      </div>

                      {application.coverLetter && (
                        <p className="recruiter-cover-letter">
                          {application.coverLetter}
                        </p>
                      )}

                      <div className="recruiter-applicant-actions">
                        <div className="recruiter-match-score">
                          <Sparkles size={15} />

                          <span>
                            {application.matchScore != null
                              ? `${application.matchScore}% match`
                              : "AI match pending"}
                          </span>
                        </div>

                        <div className="recruiter-status-control">
                          <select
                            aria-label={`Update ${application.candidateName}'s application status`}
                            value={selectedStatus}
                            disabled={isUpdating}
                            onChange={(event) =>
                              handleStatusSelection(
                                application.id,
                                event.target
                                  .value as ApplicationStatus,
                              )
                            }
                          >
                            {applicationStatuses.map(
                              (status) => (
                                <option
                                  key={status}
                                  value={status}
                                >
                                  {formatStatus(status)}
                                </option>
                              ),
                            )}
                          </select>

                          <button
                            type="button"
                            disabled={
                              !statusChanged || isUpdating
                            }
                            onClick={() =>
                              void handleStatusUpdate(
                                application,
                              )
                            }
                          >
                            {isUpdating
                              ? "Updating..."
                              : "Update status"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        )}
      </section>
    </div>
  );
}