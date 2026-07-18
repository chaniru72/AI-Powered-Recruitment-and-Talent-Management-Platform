import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const statistics = [
  {
    title: "Applications",
    value: "12",
    change: "+3 this week",
    icon: FileText,
    color: "bg-blue-500",
  },
  {
    title: "Interviews",
    value: "4",
    change: "2 upcoming",
    icon: CalendarDays,
    color: "bg-violet-500",
  },
  {
    title: "Shortlisted",
    value: "6",
    change: "50% success rate",
    icon: CheckCircle2,
    color: "bg-emerald-500",
  },
  {
    title: "Profile Views",
    value: "48",
    change: "+18% this month",
    icon: TrendingUp,
    color: "bg-orange-500",
  },
];

const recommendedJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Nova Technologies",
    location: "Colombo, Sri Lanka",
    type: "Full-time",
    match: 94,
  },
  {
    id: 2,
    title: "Junior Software Engineer",
    company: "CloudCore Solutions",
    location: "Remote",
    type: "Full-time",
    match: 89,
  },
  {
    id: 3,
    title: "UI/UX Developer Intern",
    company: "PixelCraft Labs",
    location: "Colombo, Sri Lanka",
    type: "Internship",
    match: 84,
  },
];

const recentApplications = [
  {
    job: "React Developer",
    company: "TechVision",
    date: "18 Jul 2026",
    status: "Shortlisted",
    statusStyle: "bg-emerald-50 text-emerald-700",
  },
  {
    job: "Software Engineer Intern",
    company: "CodeLabs",
    date: "16 Jul 2026",
    status: "Under review",
    statusStyle: "bg-amber-50 text-amber-700",
  },
  {
    job: "Junior Web Developer",
    company: "NextWave",
    date: "13 Jul 2026",
    status: "Applied",
    statusStyle: "bg-blue-50 text-blue-700",
  },
];

export default function CandidateDashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section
        className="relative overflow-hidden rounded-3xl
          bg-gradient-to-r from-blue-700 via-blue-600
          to-indigo-600 p-6 text-white shadow-xl
          shadow-blue-200 sm:p-8"
      >
        <div
          className="absolute -right-20 -top-24 h-64 w-64
            rounded-full bg-white/10 blur-2xl"
        />

        <div
          className="absolute -bottom-28 right-32 h-56 w-56
            rounded-full bg-cyan-300/20 blur-3xl"
        />

        <div className="relative z-10 max-w-2xl">
          <span
            className="mb-4 inline-flex items-center gap-2
              rounded-full border border-white/20 bg-white/10
              px-3 py-1.5 text-xs font-semibold"
          >
            <Sparkles size={15} />
            AI-powered career dashboard
          </span>

          <h1 className="text-2xl font-bold sm:text-3xl">
            Welcome back, Vibhavi!
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
            Your profile is attracting recruiters. Complete the remaining
            sections to improve your AI job-match score.
          </p>

          <button
            type="button"
            className="mt-5 inline-flex items-center gap-2 rounded-xl
              bg-white px-4 py-2.5 text-sm font-bold text-blue-700
              shadow-lg transition hover:-translate-y-0.5"
          >
            Complete profile
            <ArrowRight size={17} />
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-200
                bg-white p-5 shadow-sm transition
                hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <span
                  className={`grid h-11 w-11 place-items-center
                    rounded-xl text-white shadow-md ${item.color}`}
                >
                  <Icon size={21} />
                </span>

                <span className="text-2xl font-bold text-slate-900">
                  {item.value}
                </span>
              </div>

              <h2 className="mt-4 text-sm font-semibold text-slate-700">
                {item.title}
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {item.change}
              </p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.8fr]">
        <article
          className="rounded-2xl border border-slate-200
            bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recommended jobs
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Selected using your skills and experience
              </p>
            </div>

            <button
              type="button"
              className="text-sm font-bold text-blue-600 hover:text-blue-700"
            >
              View all
            </button>
          </div>

          <div className="space-y-3">
            {recommendedJobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-col gap-4 rounded-2xl
                  border border-slate-200 p-4 transition
                  hover:border-blue-200 hover:bg-blue-50/40
                  sm:flex-row sm:items-center"
              >
                <span
                  className="grid h-12 w-12 flex-none place-items-center
                    rounded-xl bg-blue-100 text-blue-700"
                >
                  <BriefcaseBusiness size={22} />
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-900">
                    {job.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {job.company}
                  </p>

                  <div
                    className="mt-2 flex flex-wrap items-center
                      gap-x-4 gap-y-1 text-xs text-slate-500"
                  >
                    <span className="flex items-center gap-1">
                      <MapPin size={13} />
                      {job.location}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock3 size={13} />
                      {job.type}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:block">
                  <span
                    className="inline-flex rounded-full bg-emerald-50
                      px-3 py-1 text-xs font-bold text-emerald-700"
                  >
                    {job.match}% match
                  </span>

                  <button
                    type="button"
                    className="text-sm font-bold text-blue-600 sm:mt-3"
                  >
                    View job
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article
          className="rounded-2xl border border-slate-200
            bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-lg font-bold text-slate-900">
            Profile strength
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Complete your profile to rank higher
          </p>

          <div className="mx-auto mt-7 grid h-40 w-40 place-items-center">
            <div
              className="grid h-36 w-36 place-items-center rounded-full"
              style={{
                background:
                  "conic-gradient(#2563eb 0deg 295deg, #e2e8f0 295deg 360deg)",
              }}
            >
              <div
                className="grid h-28 w-28 place-items-center
                  rounded-full bg-white text-center shadow-inner"
              >
                <div>
                  <strong className="block text-3xl text-slate-900">
                    82%
                  </strong>

                  <span className="text-xs text-slate-500">
                    Completed
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Personal details</span>
              <CheckCircle2 size={17} className="text-emerald-500" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">Skills and education</span>
              <CheckCircle2 size={17} className="text-emerald-500" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">Work experience</span>
              <span className="text-xs font-bold text-amber-600">
                Add details
              </span>
            </div>
          </div>
        </article>
      </section>

      <section
        className="rounded-2xl border border-slate-200
          bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent applications
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Track your latest application progress
            </p>
          </div>

          <button
            type="button"
            className="text-sm font-bold text-blue-600"
          >
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <th className="pb-3 font-semibold">Position</th>
                <th className="pb-3 font-semibold">Company</th>
                <th className="pb-3 font-semibold">Applied date</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody>
              {recentApplications.map((application) => (
                <tr
                  key={`${application.job}-${application.company}`}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="py-4 text-sm font-semibold text-slate-800">
                    {application.job}
                  </td>

                  <td className="py-4 text-sm text-slate-600">
                    {application.company}
                  </td>

                  <td className="py-4 text-sm text-slate-500">
                    {application.date}
                  </td>

                  <td className="py-4">
                    <span
                      className={`rounded-full px-3 py-1
                        text-xs font-bold ${application.statusStyle}`}
                    >
                      {application.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}