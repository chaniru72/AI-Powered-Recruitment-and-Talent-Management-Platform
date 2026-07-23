import "./CandidateJobs.css";
import { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  BriefcaseBusiness,
  Clock3,
  Filter,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import { applyForJob } from "../../services/applicationService";
import { getJobs, type JobResponse } from "../../services/jobService";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  workMode: string;
  salary: string;
  posted: string;
  match: string;
  skills: string[];
};

export default function CandidateJobs() {
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("All locations");
  const [jobType, setJobType] = useState("All types");
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmittingApplication, setIsSubmittingApplication] =
    useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [appliedJobIds, setAppliedJobIds] = useState<number[]>([]);

  useEffect(() => {
    let isActive = true;

    const loadJobs = async () => {
      try {
        const jobList = await getJobs();

        if (isActive) {
          setJobs(jobList);
        }
      } catch {
        if (isActive) {
          setError(true);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadJobs();

    return () => {
      isActive = false;
    };
  }, []);

  const mappedJobs = useMemo<Job[]>(
    () =>
      jobs.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.organizationName,
        location: job.location,
        type: job.employmentType,
        workMode: job.location.toLowerCase() === "remote" ? "Remote" : "On-site / Hybrid",
        salary: job.salaryRange,
        posted: "Recently posted",
        match: "AI match pending",
        skills: job.requiredSkills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      })),
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    return mappedJobs.filter((job) => {
      const searchValue = searchTerm.toLowerCase();

      const matchesSearch =
        job.title.toLowerCase().includes(searchValue) ||
        job.company.toLowerCase().includes(searchValue) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(searchValue)
        );

      const matchesLocation =
        location === "All locations" ||
        job.location === location;

      const matchesType =
        jobType === "All types" ||
        job.type === jobType;

      return matchesSearch && matchesLocation && matchesType;
    });
  }, [mappedJobs, searchTerm, location, jobType]);

  const toggleSavedJob = (jobId: number) => {
    setSavedJobs((current) =>
      current.includes(jobId)
        ? current.filter((id) => id !== jobId)
        : [...current, jobId]
    );
  };

  const getApplicationErrorMessage = (submitError: unknown) => {
    if (
      typeof submitError === "object" &&
      submitError !== null &&
      "response" in submitError
    ) {
      const response = submitError.response;

      if (
        typeof response === "object" &&
        response !== null &&
        "data" in response
      ) {
        const data = response.data;

        if (typeof data === "string") {
          return data;
        }

        if (typeof data === "object" && data !== null) {
          if ("message" in data && typeof data.message === "string") {
            return data.message;
          }

          if ("error" in data && typeof data.error === "string") {
            return data.error;
          }

          if ("title" in data && typeof data.title === "string") {
            return data.title;
          }
        }
      }
    }

    return "Unable to submit application. Please try again.";
  };

  const openApplySection = (job: Job) => {
    setSelectedJob(job);
    setCoverLetter("");
    setApplicationMessage("");
  };

  const closeApplySection = () => {
    if (isSubmittingApplication) {
      return;
    }

    setSelectedJob(null);
    setCoverLetter("");
  };

  const submitApplication = async () => {
    if (!selectedJob || isSubmittingApplication) {
      return;
    }

    setIsSubmittingApplication(true);
    setApplicationMessage("");

    try {
      await applyForJob(selectedJob.id, coverLetter);
      setAppliedJobIds((current) =>
        current.includes(selectedJob.id)
          ? current
          : [...current, selectedJob.id]
      );
      setApplicationMessage("Application submitted successfully.");
      setSelectedJob(null);
      setCoverLetter("");
    } catch (submitError) {
      setApplicationMessage(getApplicationErrorMessage(submitError));
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setLocation("All locations");
    setJobType("All types");
  };

  return (
    <div className="candidate-jobs-portal space-y-6">
      <section>
        <span
          className="inline-flex items-center gap-2 rounded-full
            bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700"
        >
          <Sparkles size={15} />
          AI job recommendations
        </span>

        <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
          Find your next opportunity
        </h1>

        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Search vacancies and discover jobs matched to your skills.
        </p>
      </section>

      <section
        className="rounded-2xl border border-slate-200
          bg-white p-4 shadow-sm sm:p-5"
      >
        <div className="grid gap-3 lg:grid-cols-[1.5fr_0.8fr_0.8fr_auto]">
          <label
            className="flex h-12 items-center gap-3 rounded-xl
              border border-slate-200 bg-slate-50 px-4
              focus-within:border-blue-500"
          >
            <Search size={18} className="text-slate-400" />

            <input
              type="search"
              placeholder="Search job title, company or skill"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              className="h-full w-full border-0 bg-transparent
                text-sm outline-none"
            />
          </label>

          <select
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="h-12 rounded-xl border border-slate-200
              bg-slate-50 px-4 text-sm text-slate-700 outline-none
              focus:border-blue-500"
          >
            <option>All locations</option>
            <option>Colombo</option>
            <option>Kandy</option>
            <option>Gampaha</option>
            <option>Remote</option>
          </select>

          <select
            value={jobType}
            onChange={(event) => setJobType(event.target.value)}
            className="h-12 rounded-xl border border-slate-200
              bg-slate-50 px-4 text-sm text-slate-700 outline-none
              focus:border-blue-500"
          >
            <option>All types</option>
            <option>Full-time</option>
            <option>Internship</option>
          </select>

          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-12 items-center justify-center
              gap-2 rounded-xl border border-slate-200 px-4
              text-sm font-bold text-slate-600 transition
              hover:bg-slate-100"
          >
            <Filter size={17} />
            Clear
          </button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          {applicationMessage ? (
            <div
              className="rounded-2xl border border-slate-200
                bg-white p-4 text-sm font-semibold text-slate-700
                shadow-sm"
            >
              {applicationMessage}
            </div>
          ) : null}

          {selectedJob ? (
            <section
              className="rounded-2xl border border-blue-200
                bg-white p-5 shadow-sm"
            >
              <h2 className="text-lg font-bold text-slate-900">
                Apply for {selectedJob.title}
              </h2>

              <label className="mt-4 block text-sm font-semibold text-slate-700">
                Cover letter
                <textarea
                  value={coverLetter}
                  onChange={(event) =>
                    setCoverLetter(event.target.value)
                  }
                  rows={5}
                  className="mt-2 w-full rounded-xl border
                    border-slate-200 bg-slate-50 px-4 py-3
                    text-sm text-slate-700 outline-none
                    focus:border-blue-500"
                  placeholder="Optional"
                  disabled={isSubmittingApplication}
                />
              </label>

              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={closeApplySection}
                  disabled={isSubmittingApplication}
                  className="rounded-xl border border-slate-200 px-4
                    py-2 text-sm font-bold text-slate-600 transition
                    hover:bg-slate-100 disabled:cursor-not-allowed
                    disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={submitApplication}
                  disabled={isSubmittingApplication}
                  className="rounded-xl bg-blue-600 px-4 py-2
                    text-sm font-bold text-white shadow-md
                    shadow-blue-200 transition hover:bg-blue-700
                    disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmittingApplication
                    ? "Submitting..."
                    : "Submit Application"}
                </button>
              </div>
            </section>
          ) : null}

          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              <strong className="text-slate-900">
                {filteredJobs.length}
              </strong>{" "}
              jobs found
            </p>

            <select
              aria-label="Sort jobs"
              className="rounded-lg border border-slate-200
                bg-white px-3 py-2 text-xs text-slate-600"
            >
              <option>Best match</option>
              <option>Newest first</option>
              <option>Highest salary</option>
            </select>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
              Loading jobs...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
              Unable to load jobs. Please try again.
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
              No jobs available at the moment.
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <article
                key={job.id}
                className="rounded-2xl border border-slate-200
                  bg-white p-5 shadow-sm transition
                  hover:-translate-y-1 hover:border-blue-200
                  hover:shadow-lg sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <span
                    className="grid h-13 w-13 flex-none place-items-center
                      rounded-2xl bg-blue-100 text-blue-700"
                  >
                    <BriefcaseBusiness size={23} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">
                          {job.title}
                        </h2>

                        <p className="mt-1 text-sm font-medium text-slate-600">
                          {job.company}
                        </p>
                      </div>

                      <button
                        type="button"
                        aria-label="Save job"
                        onClick={() => toggleSavedJob(job.id)}
                        className={`rounded-xl border p-2.5 transition ${
                          savedJobs.includes(job.id)
                            ? "border-blue-200 bg-blue-50 text-blue-600"
                            : "border-slate-200 text-slate-400 hover:text-blue-600"
                        }`}
                      >
                        <Bookmark
                          size={19}
                          fill={
                            savedJobs.includes(job.id)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                    </div>

                    <div
                      className="mt-4 flex flex-wrap gap-x-5
                        gap-y-2 text-xs text-slate-500"
                    >
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        {job.location}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <BriefcaseBusiness size={14} />
                        {job.type} · {job.workMode}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Clock3 size={14} />
                        {job.posted}
                      </span>
                    </div>

                    <p className="mt-4 text-sm font-semibold text-slate-700">
                      {job.salary}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-slate-100 px-3
                            py-1 text-xs font-medium text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div
                      className="mt-5 flex flex-wrap items-center
                        justify-between gap-3 border-t
                        border-slate-100 pt-4"
                    >
                      <span
                        className="inline-flex items-center gap-1.5
                          rounded-full bg-emerald-50 px-3 py-1.5
                          text-xs font-bold text-emerald-700"
                      >
                        <Sparkles size={14} />
                        {job.match}
                      </span>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="rounded-xl border border-blue-200
                            px-4 py-2 text-sm font-bold text-blue-700
                            transition hover:bg-blue-50"
                        >
                          View details
                        </button>

                        <button
                          type="button"
                          onClick={() => openApplySection(job)}
                          disabled={appliedJobIds.includes(job.id)}
                          className="rounded-xl bg-blue-600 px-4
                            py-2 text-sm font-bold text-white
                            shadow-md shadow-blue-200 transition
                            hover:bg-blue-700 disabled:cursor-not-allowed
                            disabled:bg-slate-300 disabled:shadow-none"
                        >
                          {appliedJobIds.includes(job.id)
                            ? "Applied"
                            : "Apply now"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div
              className="rounded-2xl border border-dashed
                border-slate-300 bg-white p-12 text-center"
            >
              <Search
                size={38}
                className="mx-auto text-slate-300"
              />

              <h2 className="mt-4 font-bold text-slate-800">
                No jobs found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search filters.
              </p>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div
            className="rounded-2xl bg-gradient-to-br
              from-blue-700 to-indigo-700 p-5 text-white
              shadow-lg shadow-blue-200"
          >
            <Sparkles size={25} />

            <h2 className="mt-4 text-lg font-bold">
              Improve your matches
            </h2>

            <p className="mt-2 text-sm leading-6 text-blue-100">
              Add more skills and experience to receive better AI job
              recommendations.
            </p>

            <button
              type="button"
              className="mt-5 w-full rounded-xl bg-white px-4
                py-2.5 text-sm font-bold text-blue-700"
            >
              Update profile
            </button>
          </div>

          <div
            className="rounded-2xl border border-slate-200
              bg-white p-5 shadow-sm"
          >
            <h2 className="font-bold text-slate-900">
              Popular searches
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "React",
                "Software Engineer",
                "Internship",
                "Remote",
                "UI/UX",
                "C#",
              ].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setSearchTerm(term)}
                  className="rounded-full border border-slate-200
                    px-3 py-1.5 text-xs font-medium
                    text-slate-600 hover:border-blue-300
                    hover:bg-blue-50 hover:text-blue-700"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
