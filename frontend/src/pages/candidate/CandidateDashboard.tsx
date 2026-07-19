import { type CSSProperties } from "react";

import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  MapPin,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./CandidateDashboard.css";

type StoredUser = {
  name?: string;
  fullName?: string;
  firstName?: string;
};

const statistics = [
  {
    title: "Applications",
    value: 12,
    change: "+3 this week",
    icon: FileText,
    tone: "coral",
  },
  {
    title: "Interviews",
    value: 4,
    change: "2 upcoming",
    icon: CalendarDays,
    tone: "purple",
  },
  {
    title: "Shortlisted",
    value: 6,
    change: "50% success rate",
    icon: CheckCircle2,
    tone: "sage",
  },
  {
    title: "Profile Views",
    value: 48,
    change: "+18% this month",
    icon: TrendingUp,
    tone: "peach",
  },
];

const journeyStages = [
  {
    title: "Applied",
    value: 12,
    description: "Total applications",
    icon: FileText,
    tone: "coral",
  },
  {
    title: "Under Review",
    value: 8,
    description: "Being reviewed",
    icon: Eye,
    tone: "peach",
  },
  {
    title: "Interview",
    value: 4,
    description: "Interview stage",
    icon: CalendarDays,
    tone: "purple",
  },
  {
    title: "Shortlisted",
    value: 6,
    description: "Successful progress",
    icon: Award,
    tone: "sage",
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
    id: 1,
    job: "React Developer",
    company: "TechVision",
    date: "18 Jul 2026",
    status: "Shortlisted",
    tone: "shortlisted",
  },
  {
    id: 2,
    job: "Software Engineer Intern",
    company: "CodeLabs",
    date: "16 Jul 2026",
    status: "Under review",
    tone: "review",
  },
  {
    id: 3,
    job: "Junior Web Developer",
    company: "NextWave",
    date: "13 Jul 2026",
    status: "Applied",
    tone: "applied",
  },
];

function getCandidateName() {
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

    return name.trim().split(/\s+/)[0];
  } catch {
    return "Candidate";
  }
}

export default function CandidateDashboard() {
  const navigate = useNavigate();

  const candidateName = getCandidateName();
  const profileCompletion = 82;
  const featuredJob = recommendedJobs[0];
  const additionalJobs = recommendedJobs.slice(1);

  return (
    <div className="clear-dashboard">
      {/* Compact welcome and profile focus */}
      <section className="clear-intro">
        <div className="clear-intro-decoration clear-decoration-one" />
        <div className="clear-intro-decoration clear-decoration-two" />

        <div className="clear-intro-copy">
          <span className="clear-eyebrow">
            <Sparkles size={15} />
            AI-powered candidate command centre
          </span>

          <h1>
            Your next opportunity starts here,
            <span>{candidateName}.</span>
          </h1>

          <p>
            Review your progress, discover your strongest job matches,
            and continue building a profile recruiters will notice.
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
              <h2>Almost recruiter-ready</h2>
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

              <p>
                Add your work experience to improve your job matches.
              </p>

              <div>
                <small>Best match</small>
                <strong>94%</strong>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/candidate/profile")}
          >
            Complete profile
            <ArrowUpRight size={16} />
          </button>
        </aside>
      </section>

      {/* Recruitment lifecycle */}
      <section className="clear-lifecycle">
        <header className="clear-section-header">
          <div>
            <span>Candidate journey</span>
            <h2>Your recruitment lifecycle</h2>
            <p>
              Follow every opportunity from application to shortlist.
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

      {/* Asymmetric workspace */}
      <div className="clear-bento">
        {/* Featured opportunity */}
        <section className="clear-featured-job">
          <div className="clear-featured-top">
            <span className="clear-featured-label">
              <Sparkles size={14} />
              Featured opportunity
            </span>

            <div
              className="clear-job-match"
              style={
                {
                  "--match-angle": `${featuredJob.match * 3.6}deg`,
                } as CSSProperties
              }
            >
              <span>{featuredJob.match}%</span>
            </div>
          </div>

          <div className="clear-featured-company">
            <span>
              <BriefcaseBusiness size={25} />
            </span>

            <div>
              <small>Best match for your profile</small>
              <h2>{featuredJob.title}</h2>
              <p>{featuredJob.company}</p>
            </div>
          </div>

          <div className="clear-featured-details">
            <span>
              <MapPin size={15} />
              {featuredJob.location}
            </span>

            <span>
              <Clock3 size={15} />
              {featuredJob.type}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/candidate/jobs")}
          >
            View opportunity
            <ArrowUpRight size={17} />
          </button>
        </section>

        {/* Connected statistics */}
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

        {/* Additional opportunities */}
        <section className="clear-opportunities">
          <header className="clear-section-header">
            <div>
              <span>Recommended</span>
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
            {additionalJobs.map((job) => (
              <article
                key={job.id}
                className="clear-opportunity-item"
              >
                <span className="clear-opportunity-icon">
                  <BriefcaseBusiness size={20} />
                </span>

                <div className="clear-opportunity-copy">
                  <h3>{job.title}</h3>
                  <p>{job.company}</p>

                  <div>
                    <span>
                      <MapPin size={13} />
                      {job.location}
                    </span>

                    <span>
                      <Clock3 size={13} />
                      {job.type}
                    </span>
                  </div>
                </div>

                <div className="clear-opportunity-action">
                  <strong>{job.match}% match</strong>

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
            ))}
          </div>
        </section>

        {/* Profile checklist */}
        <section className="clear-profile-checklist">
          <header>
            <span>Profile strength</span>
            <h2>Build a stronger profile</h2>
            <p>Complete every step to rank higher.</p>
          </header>

          <div className="clear-checklist">
            <div className="is-complete">
              <span>
                <CheckCircle2 size={18} />
                Personal details
              </span>

              <strong>Complete</strong>
            </div>

            <div className="is-complete">
              <span>
                <CheckCircle2 size={18} />
                Skills and education
              </span>

              <strong>Complete</strong>
            </div>

            <div className="is-incomplete">
              <span>
                <Clock3 size={18} />
                Work experience
              </span>

              <button
                type="button"
                onClick={() =>
                  navigate("/candidate/profile")
                }
              >
                Add details
              </button>
            </div>
          </div>
        </section>

        {/* Application activity timeline */}
        <section className="clear-activity">
          <header className="clear-section-header">
            <div>
              <span>Recent activity</span>
              <h2>Application timeline</h2>
              <p>
                Your latest application progress and updates.
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
            {recentApplications.map((application) => (
              <article
                key={application.id}
                className="clear-activity-item"
              >
                <span
                  className={`clear-activity-marker clear-status-${application.tone}`}
                />

                <div className="clear-activity-copy">
                  <strong>{application.job}</strong>
                  <span>{application.company}</span>
                </div>

                <span className="clear-activity-date">
                  <CalendarDays size={14} />
                  {application.date}
                </span>

                <span
                  className={`clear-activity-status clear-status-${application.tone}`}
                >
                  {application.status}
                </span>

                <button
                  type="button"
                  aria-label={`View ${application.job} application`}
                  onClick={() =>
                    navigate("/candidate/applications")
                  }
                >
                  <Eye size={17} />
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}