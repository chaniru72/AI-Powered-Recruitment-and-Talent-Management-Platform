import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  LoaderCircle,
  RefreshCcw,
  Search,
} from "lucide-react";

import { getMyApplications } from "../../services/applicationService";
import type {
  ApplicationStatus,
  CandidateApplication,
} from "../../types/application";

const statusLabels: Record<ApplicationStatus, string> = {
  Applied: "Applied",
  UnderReview: "Under Review",
  Shortlisted: "Shortlisted",
  Rejected: "Rejected",
  Hired: "Hired",
  Withdrawn: "Withdrawn",
};

const statusStyles: Record<ApplicationStatus, string> = {
  Applied: "bg-blue-100 text-blue-700",
  UnderReview: "bg-amber-100 text-amber-700",
  Shortlisted: "bg-purple-100 text-purple-700",
  Rejected: "bg-red-100 text-red-700",
  Hired: "bg-emerald-100 text-emerald-700",
  Withdrawn: "bg-slate-100 text-slate-600",
};

function formatDate(value: string) {
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

export default function CandidateApplications() {
  const [applications, setApplications] = useState<
    CandidateApplication[]
  >([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    ApplicationStatus | "All"
  >("All");

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await getMyApplications();
      setApplications(data);
    } catch {
      setErrorMessage(
        "We could not load your applications. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  const filteredApplications = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesSearch =
        application.jobTitle
          .toLowerCase()
          .includes(normalizedSearch) ||
        application.coverLetter
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        selectedStatus === "All" ||
        application.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, selectedStatus]);

  const totalApplications = applications.length;

  const activeApplications = applications.filter(
    (application) =>
      application.status === "Applied" ||
      application.status === "UnderReview" ||
      application.status === "Shortlisted",
  ).length;

  const successfulApplications = applications.filter(
    (application) => application.status === "Hired",
  ).length;

  return (
    <div className="space-y-6">
      <section>
        <span
          className="inline-flex items-center gap-2 rounded-full
            bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700"
        >
          <FileText size={15} />
          Application tracker
        </span>

        <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
          My Applications
        </h1>

        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Track your job applications and their latest status.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <article
          className="rounded-2xl border border-slate-200
            bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-slate-500">
            Total Applications
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {totalApplications}
          </p>
        </article>

        <article
          className="rounded-2xl border border-slate-200
            bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-slate-500">
            Active Applications
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {activeApplications}
          </p>
        </article>

        <article
          className="rounded-2xl border border-slate-200
            bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-slate-500">
            Successful
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {successfulApplications}
          </p>
        </article>
      </section>

      <section
        className="rounded-2xl border border-slate-200
          bg-white p-4 shadow-sm sm:p-5"
      >
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <label
            className="flex h-12 items-center gap-3 rounded-xl
              border border-slate-200 bg-slate-50 px-4
              focus-within:border-blue-500"
          >
            <Search size={18} className="text-slate-400" />

            <input
              type="search"
              placeholder="Search by job title"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              className="h-full w-full border-0 bg-transparent
                text-sm outline-none"
            />
          </label>

          <select
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(
                event.target.value as ApplicationStatus | "All",
              )
            }
            className="h-12 rounded-xl border border-slate-200
              bg-slate-50 px-4 text-sm text-slate-700 outline-none
              focus:border-blue-500"
          >
            <option value="All">All statuses</option>
            <option value="Applied">Applied</option>
            <option value="UnderReview">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Rejected">Rejected</option>
            <option value="Hired">Hired</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>
        </div>
      </section>

      {isLoading && (
        <section
          className="flex min-h-64 items-center justify-center
            rounded-2xl border border-slate-200 bg-white"
        >
          <div className="text-center">
            <LoaderCircle
              size={34}
              className="mx-auto animate-spin text-blue-600"
            />

            <p className="mt-3 text-sm text-slate-500">
              Loading your applications...
            </p>
          </div>
        </section>
      )}

      {!isLoading && errorMessage && (
        <section
          className="rounded-2xl border border-red-200
            bg-red-50 p-6 text-center"
        >
          <AlertCircle
            size={34}
            className="mx-auto text-red-500"
          />

          <p className="mt-3 font-semibold text-red-700">
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={() => void loadApplications()}
            className="mt-4 inline-flex items-center gap-2
              rounded-xl bg-red-600 px-4 py-2 text-sm
              font-bold text-white transition hover:bg-red-700"
          >
            <RefreshCcw size={16} />
            Try Again
          </button>
        </section>
      )}

      {!isLoading &&
        !errorMessage &&
        filteredApplications.length === 0 && (
          <section
            className="rounded-2xl border border-dashed
              border-slate-300 bg-white p-10 text-center"
          >
            <FileText
              size={40}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-4 text-lg font-bold text-slate-800">
              No applications found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Your applications will appear here after you apply
              for a job.
            </p>
          </section>
        )}

      {!isLoading &&
        !errorMessage &&
        filteredApplications.length > 0 && (
          <section className="space-y-4">
            {filteredApplications.map((application) => (
              <article
                key={application.id}
                className="rounded-2xl border border-slate-200
                  bg-white p-5 shadow-sm transition
                  hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className="flex flex-col gap-4
                    sm:flex-row sm:items-start
                    sm:justify-between"
                >
                  <div className="flex gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0
                        items-center justify-center rounded-xl
                        bg-blue-100 text-blue-700"
                    >
                      <BriefcaseBusiness size={23} />
                    </div>

                    <div>
                      <h2
                        className="text-lg font-bold
                          text-slate-900"
                      >
                        {application.jobTitle}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Application #{application.id}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex w-fit rounded-full
                      px-3 py-1.5 text-xs font-bold
                      ${statusStyles[application.status]}`}
                  >
                    {statusLabels[application.status]}
                  </span>
                </div>

                <div
                  className="mt-5 grid gap-3 border-t
                    border-slate-100 pt-4 text-sm
                    text-slate-600 sm:grid-cols-2"
                >
                  <p className="flex items-center gap-2">
                    <CalendarDays
                      size={17}
                      className="text-slate-400"
                    />
                    Applied {formatDate(application.appliedAt)}
                  </p>

                  <p className="flex items-center gap-2">
                    <RefreshCcw
                      size={17}
                      className="text-slate-400"
                    />
                    Updated {formatDate(application.updatedAt)}
                  </p>
                </div>
              </article>
            ))}
          </section>
        )}
    </div>
  );
}