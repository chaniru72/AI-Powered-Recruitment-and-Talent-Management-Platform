import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  FileText,
  Mail,
  RefreshCw,
  UserRound,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getHiringManagerCandidateDetails,
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

  return "Unable to load candidate details.";
}

export default function HiringManagerCandidateDetails() {
  const { applicationId } = useParams<{
    applicationId: string;
  }>();

  const [candidate, setCandidate] =
    useState<HiringManagerCandidate | null>(null);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  const numericApplicationId =
    Number(applicationId);

  const loadCandidate = useCallback(async () => {
    if (
      !applicationId ||
      !Number.isInteger(numericApplicationId) ||
      numericApplicationId <= 0
    ) {
      setCandidate(null);
      setErrorMessage(
        "The candidate application ID is invalid.",
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const candidateData =
        await getHiringManagerCandidateDetails(
          numericApplicationId,
        );

      setCandidate(candidateData);
    } catch (error) {
      setCandidate(null);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [
    applicationId,
    numericApplicationId,
  ]);

  useEffect(() => {
    void loadCandidate();
  }, [loadCandidate]);

  const backendNotConfigured =
    errorMessage.includes(
      "API endpoint is not configured",
    ) ||
    errorMessage.includes(
      "endpoint must include :applicationId",
    );

  return (
    <div className="recruiter-applicants-page">
      <section className="recruiter-applicants-heading">
        <div>
          <span>Candidate review</span>

          <h1>Candidate details</h1>

          <p>
            Review the selected candidate application
            using information returned by the secured
            backend API.
          </p>
        </div>

        <Link
          to="/hiring-manager/candidates"
          className="recruiter-refresh-button"
        >
          <ArrowLeft size={17} />
          Back to candidates
        </Link>
      </section>

      {loading ? (
        <section className="recruiter-applicant-content">
          <div className="recruiter-applicant-state">
            <RefreshCw
              size={28}
              className="is-spinning"
            />

            <h3>Loading candidate details</h3>

            <p>
              Please wait while TalentSync retrieves
              the candidate application.
            </p>
          </div>
        </section>
      ) : errorMessage ? (
        <section className="recruiter-applicant-content">
          <div className="recruiter-applicant-state is-error">
            <AlertCircle size={29} />

            <h3>
              {backendNotConfigured
                ? "Backend connection pending"
                : "Unable to load candidate"}
            </h3>

            <p>
              {backendNotConfigured
                ? "The candidate details interface is ready. Connect the Hiring Manager candidate details endpoint when the backend becomes available."
                : errorMessage}
            </p>

            <button
              type="button"
              onClick={() => void loadCandidate()}
            >
              <RefreshCw size={17} />
              Try again
            </button>
          </div>
        </section>
      ) : candidate ? (
        <section className="recruiter-applicant-content">
          <header>
            <div>
              <span>Application record</span>

              <h2>{candidate.candidateName}</h2>

              <p>{candidate.jobTitle}</p>
            </div>

            <span
              className={`recruiter-application-status recruiter-application-status-${candidate.status.toLowerCase()}`}
            >
              {formatStatus(candidate.status)}
            </span>
          </header>

          <div className="recruiter-applicant-list">
            <article className="recruiter-applicant-card">
              <span className="recruiter-applicant-avatar">
                <UserRound size={23} />
              </span>

              <div className="recruiter-applicant-main">
                <div className="recruiter-applicant-title">
                  <div>
                    <h3>Candidate information</h3>

                    <p>
                      Application ID: {candidate.id}
                    </p>
                  </div>
                </div>

                <div className="recruiter-applicant-details">
                  <span>
                    <Mail size={14} />
                    {candidate.candidateEmail}
                  </span>

                  <span>
                    <CalendarDays size={14} />
                    Applied{" "}
                    {formatDate(candidate.appliedAt)}
                  </span>

                  <span>
                    <CalendarDays size={14} />
                    Updated{" "}
                    {formatDate(candidate.updatedAt)}
                  </span>
                </div>
              </div>
            </article>

            <article className="recruiter-applicant-card">
              <span className="recruiter-applicant-avatar">
                <FileText size={23} />
              </span>

              <div className="recruiter-applicant-main">
                <div className="recruiter-applicant-title">
                  <div>
                    <h3>Cover letter</h3>

                    <p>
                      Submitted with the candidate
                      application.
                    </p>
                  </div>
                </div>

                {candidate.coverLetter ? (
                  <p className="recruiter-cover-letter">
                    {candidate.coverLetter}
                  </p>
                ) : (
                  <div className="recruiter-applicant-state">
                    <FileText size={25} />

                    <h3>No cover letter available</h3>

                    <p>
                      The backend did not return a cover
                      letter for this application.
                    </p>
                  </div>
                )}
              </div>
            </article>
          </div>
        </section>
      ) : (
        <section className="recruiter-applicant-content">
          <div className="recruiter-applicant-state">
            <UserRound size={29} />

            <h3>Candidate not available</h3>

            <p>
              No candidate information was returned by
              the backend.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}