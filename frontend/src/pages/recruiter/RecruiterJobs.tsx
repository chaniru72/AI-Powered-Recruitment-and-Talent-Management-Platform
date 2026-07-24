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
  MapPin,
  RefreshCw,
  Search,
  UsersRound,
} from "lucide-react";

import {
  getJobs,
  type JobResponse,
} from "../../services/jobService";

import "./RecruiterJobs.css";

type StoredUser = {
  userId?: number | string;
};

function getRecruiterUserId(): number | null {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    const user = JSON.parse(storedUser) as StoredUser;
    const parsedUserId = Number(user.userId);

    return Number.isFinite(parsedUserId)
      ? parsedUserId
      : null;
  } catch {
    return null;
  }
}

function formatDate(value: string | null) {
  if (!value) {
    return "No deadline";
  }

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

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const recruiterUserId = useMemo(
    getRecruiterUserId,
    [],
  );

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const jobList = await getJobs();
      setJobs(jobList);
    } catch {
      setJobs([]);
      setErrorMessage(
        "Unable to load recruiter jobs. The backend API may not be connected yet.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  const recruiterJobs = useMemo(() => {
    if (recruiterUserId === null) {
      return [];
    }

    return jobs.filter(
      (job) =>
        job.recruiterUserId === recruiterUserId,
    );
  }, [jobs, recruiterUserId]);

  const filteredJobs = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return recruiterJobs.filter((job) => {
      const matchesSearch =
        !normalizedSearch ||
        job.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        job.organizationName
          .toLowerCase()
          .includes(normalizedSearch) ||
        job.requiredSkills
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" ||
        job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    recruiterJobs,
    searchTerm,
    statusFilter,
  ]);

  return (
    <div className="recruiter-jobs-page">
      <section className="recruiter-jobs-heading">
        <div>
          <span>Job management</span>

          <h1>Manage job postings</h1>

          <p>
            Review vacancies created through your recruiter
            account. Create, update and delete actions will
            be connected after the backend contract is
            confirmed.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadJobs()}
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

      <section className="recruiter-jobs-filters">
        <label>
          <Search size={18} />

          <input
            type="search"
            value={searchTerm}
            placeholder="Search title, company or skill"
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </label>

        <select
          aria-label="Filter jobs by status"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="All">All statuses</option>
          <option value="Draft">Draft</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
          <option value="Archived">Archived</option>
        </select>
      </section>

      <section className="recruiter-jobs-content">
        <header>
          <div>
            <span>Your vacancies</span>
            <h2>Recruiter jobs</h2>
          </div>

          <strong>
            {loading || errorMessage
              ? "—"
              : filteredJobs.length}
          </strong>
        </header>

        {loading ? (
          <div className="recruiter-jobs-state">
            <RefreshCw
              size={27}
              className="is-spinning"
            />

            <h3>Loading job postings</h3>

            <p>
              Please wait while the recruitment API is
              checked.
            </p>
          </div>
        ) : errorMessage ? (
          <div className="recruiter-jobs-state is-error">
            <AlertCircle size={28} />

            <h3>Backend connection pending</h3>

            <p>{errorMessage}</p>

            <button
              type="button"
              onClick={() => void loadJobs()}
            >
              Try again
            </button>
          </div>
        ) : recruiterUserId === null ? (
          <div className="recruiter-jobs-state">
            <UsersRound size={28} />

            <h3>Recruiter session unavailable</h3>

            <p>
              Job records will appear after a real recruiter
              login provides the user ID.
            </p>
          </div>
        ) : recruiterJobs.length === 0 ? (
          <div className="recruiter-jobs-state">
            <BriefcaseBusiness size={28} />

            <h3>No jobs available</h3>

            <p>
              Jobs created by this recruiter will appear
              here after they are returned by the backend.
            </p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="recruiter-jobs-state">
            <Search size={28} />

            <h3>No matching jobs</h3>

            <p>
              Change the search term or status filter.
            </p>
          </div>
        ) : (
          <div className="recruiter-jobs-list">
            {filteredJobs.map((job) => (
              <article
                key={job.id}
                className="recruiter-job-card"
              >
                <span className="recruiter-job-icon">
                  <BriefcaseBusiness size={22} />
                </span>

                <div className="recruiter-job-copy">
                  <div className="recruiter-job-title-row">
                    <div>
                      <h3>{job.title}</h3>
                      <p>{job.organizationName}</p>
                    </div>

                    <span
                      className={`recruiter-job-status recruiter-job-status-${job.status.toLowerCase()}`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="recruiter-job-details">
                    <span>
                      <MapPin size={14} />
                      {job.location}
                    </span>

                    <span>
                      <BriefcaseBusiness size={14} />
                      {job.employmentType}
                    </span>

                    <span>
                      <CalendarDays size={14} />
                      {formatDate(
                        job.applicationDeadline,
                      )}
                    </span>
                  </div>

                  <div className="recruiter-job-skills">
                    {job.requiredSkills
                      .split(",")
                      .map((skill) => skill.trim())
                      .filter(Boolean)
                      .map((skill) => (
                        <span key={skill}>
                          {skill}
                        </span>
                      ))}
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