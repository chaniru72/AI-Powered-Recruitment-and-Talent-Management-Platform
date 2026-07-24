import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  CalendarDays,
  Mail,
  RefreshCw,
  Search,
  UserRound,
  UsersRound,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  getHiringManagerCandidates,
  type HiringManagerCandidate,
} from "../../services/hiringManagerService";

import "../recruiter/RecruiterApplicants.css";

function formatStatus(status: string): string {
  return status.replace(
    /([a-z])([A-Z])/g,
    "$1 $2",
  );
}

function formatDate(value: string): string {
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

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load hiring manager candidates.";
}

export default function HiringManagerCandidates() {
  const [candidates, setCandidates] = useState<
    HiringManagerCandidate[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");
  const [jobFilter, setJobFilter] =
    useState("All");

  const navigate = useNavigate();

  const loadCandidates = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const candidateList =
        await getHiringManagerCandidates();

      setCandidates(candidateList);
    } catch (error) {
      setCandidates([]);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCandidates();
  }, [loadCandidates]);

  const jobOptions = useMemo(() => {
    const jobs = new Map<number, string>();

    candidates.forEach((candidate) => {
      jobs.set(
        candidate.jobId,
        candidate.jobTitle,
      );
    });

    return Array.from(jobs.entries()).map(
      ([jobId, jobTitle]) => ({
        jobId,
        jobTitle,
      }),
    );
  }, [candidates]);

  const statusOptions = useMemo(() => {
    return Array.from(
      new Set(
        candidates.map(
          (candidate) => candidate.status,
        ),
      ),
    );
  }, [candidates]);

  const filteredCandidates = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return candidates.filter((candidate) => {
      const matchesSearch =
        !normalizedSearch ||
        candidate.candidateName
          .toLowerCase()
          .includes(normalizedSearch) ||
        candidate.candidateEmail
          .toLowerCase()
          .includes(normalizedSearch) ||
        candidate.jobTitle
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" ||
        candidate.status === statusFilter;

      const matchesJob =
        jobFilter === "All" ||
        candidate.jobId === Number(jobFilter);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesJob
      );
    });
  }, [
    candidates,
    searchTerm,
    statusFilter,
    jobFilter,
  ]);

  const backendNotConfigured =
    errorMessage.includes(
      "API endpoint is not configured",
    );

  return (
    <div className="recruiter-applicants-page">
      <section className="recruiter-applicants-heading">
        <div>
          <span>Hiring review</span>

          <h1>Review candidates</h1>

          <p>
            Search and review candidate applications
            returned by the secured Hiring Manager
            backend API.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadCandidates()}
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
            aria-label="Search candidates"
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </label>

        <select
          aria-label="Filter candidates by job"
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
          aria-label="Filter candidates by status"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="All">
            All statuses
          </option>

          {statusOptions.map((status) => (
            <option
              key={status}
              value={status}
            >
              {formatStatus(status)}
            </option>
          ))}
        </select>
      </section>

      {errorMessage && !loading && (
        <div
          className="recruiter-applicant-message is-error"
          role="alert"
        >
          <AlertCircle size={19} />

          <span>
            {backendNotConfigured
              ? "The candidates interface is ready. Connect the Hiring Manager candidates endpoint when the backend becomes available."
              : errorMessage}
          </span>
        </div>
      )}

      <section className="recruiter-applicant-content">
        <header>
          <div>
            <span>Candidate applications</span>
            <h2>Candidate records</h2>

            <p>
              All candidate information shown here is
              returned by the backend API.
            </p>
          </div>

          <strong>
            {loading || errorMessage
              ? "—"
              : filteredCandidates.length}
          </strong>
        </header>

        {loading ? (
          <div className="recruiter-applicant-state">
            <RefreshCw
              size={28}
              className="is-spinning"
            />

            <h3>Loading candidates</h3>

            <p>
              Please wait while TalentSync checks the
              Hiring Manager API.
            </p>
          </div>
        ) : errorMessage ? (
          <div className="recruiter-applicant-state is-error">
            <UsersRound size={29} />

            <h3>Backend connection pending</h3>

            <p>
              Candidate records will appear after the
              Hiring Manager candidates endpoint is
              connected.
            </p>

            <button
              type="button"
              onClick={() => void loadCandidates()}
            >
              Try again
            </button>
          </div>
        ) : candidates.length === 0 ? (
          <div className="recruiter-applicant-state">
            <UsersRound size={29} />

            <h3>No candidates available</h3>

            <p>
              Candidate applications will appear here
              when returned by the backend.
            </p>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="recruiter-applicant-state">
            <Search size={29} />

            <h3>No matching candidates</h3>

            <p>
              Change the search term, job, or status
              filter.
            </p>
          </div>
        ) : (
          <div className="recruiter-applicant-list">
            {filteredCandidates.map((candidate) => (
              <article
                key={candidate.id}
                className="recruiter-applicant-card"
              >
                <span className="recruiter-applicant-avatar">
                  <UserRound size={23} />
                </span>

                <div className="recruiter-applicant-main">
                  <div className="recruiter-applicant-title">
                    <div>
                      <h3>
                        {candidate.candidateName}
                      </h3>

                      <p>{candidate.jobTitle}</p>
                    </div>

                    <span
                      className={`recruiter-application-status recruiter-application-status-${candidate.status.toLowerCase()}`}
                    >
                      {formatStatus(
                        candidate.status,
                      )}
                    </span>
                  </div>

                  <div className="recruiter-applicant-details">
                    <span>
                      <Mail size={14} />
                      {candidate.candidateEmail}
                    </span>

                    <span>
                      <CalendarDays size={14} />
                      Applied{" "}
                      {formatDate(
                        candidate.appliedAt,
                      )}
                    </span>
                  </div>

                  {candidate.coverLetter && (
                    <p className="recruiter-cover-letter">
                      {candidate.coverLetter}
                    </p>
                  )}

                  <div className="recruiter-applicant-actions">
                    <span className="recruiter-match-score">
                      Last updated{" "}
                      {formatDate(
                        candidate.updatedAt,
                      )}
                    </span>

                    <div className="recruiter-status-control">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/hiring-manager/candidates/${candidate.id}`,
                          )
                        }
                      >
                        View details
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}