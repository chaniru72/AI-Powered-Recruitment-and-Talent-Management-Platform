import { useMemo, useState } from "react";
import {
  Bookmark,
  BriefcaseBusiness,
  Clock3,
  Filter,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  workMode: string;
  salary: string;
  posted: string;
  match: number;
  skills: string[];
};

const jobs: Job[] = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Nova Technologies",
    location: "Colombo",
    type: "Full-time",
    workMode: "Hybrid",
    salary: "LKR 120,000 - 180,000",
    posted: "2 hours ago",
    match: 94,
    skills: ["React", "TypeScript", "Tailwind CSS"],
  },
  {
    id: 2,
    title: "Junior Software Engineer",
    company: "CloudCore Solutions",
    location: "Remote",
    type: "Full-time",
    workMode: "Remote",
    salary: "LKR 100,000 - 150,000",
    posted: "1 day ago",
    match: 89,
    skills: ["C#", "ASP.NET Core", "SQL"],
  },
  {
    id: 3,
    title: "UI/UX Developer Intern",
    company: "PixelCraft Labs",
    location: "Colombo",
    type: "Internship",
    workMode: "On-site",
    salary: "LKR 35,000 - 50,000",
    posted: "2 days ago",
    match: 84,
    skills: ["Figma", "HTML", "CSS"],
  },
  {
    id: 4,
    title: "React Developer",
    company: "TechVision Lanka",
    location: "Kandy",
    type: "Full-time",
    workMode: "Hybrid",
    salary: "LKR 130,000 - 190,000",
    posted: "3 days ago",
    match: 81,
    skills: ["React", "JavaScript", "REST APIs"],
  },
  {
    id: 5,
    title: "Quality Assurance Intern",
    company: "NextWave Systems",
    location: "Gampaha",
    type: "Internship",
    workMode: "On-site",
    salary: "LKR 30,000 - 45,000",
    posted: "4 days ago",
    match: 76,
    skills: ["Manual Testing", "Postman", "Jira"],
  },
];

export default function CandidateJobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("All locations");
  const [jobType, setJobType] = useState("All types");
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
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
  }, [searchTerm, location, jobType]);

  const toggleSavedJob = (jobId: number) => {
    setSavedJobs((current) =>
      current.includes(jobId)
        ? current.filter((id) => id !== jobId)
        : [...current, jobId]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setLocation("All locations");
    setJobType("All types");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
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

          {filteredJobs.length > 0 ? (
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
                        {job.match}% AI match
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
                          className="rounded-xl bg-blue-600 px-4
                            py-2 text-sm font-bold text-white
                            shadow-md shadow-blue-200 transition
                            hover:bg-blue-700"
                        >
                          Apply now
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