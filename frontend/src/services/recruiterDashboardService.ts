import httpClient from "./httpClient";

export interface RecruiterDashboardSummary {
  activeJobs: number;
  totalApplications: number;
  shortlistedCandidates: number;
  upcomingInterviews: number;
}

export interface RecruiterDashboardJob {
  jobId: number;
  title: string;
  status: string;
  applicantCount: number;
  closingDate?: string | null;
}

export interface RecruiterDashboardApplicant {
  applicationId: number;
  candidateId: number;
  candidateName: string;
  jobTitle: string;
  status: string;
  appliedAt: string;
  matchScore?: number | null;
}

export interface RecruiterDashboardInterview {
  interviewId: number;
  candidateName: string;
  jobTitle: string;
  scheduledAt: string;
  interviewType?: string | null;
}

export interface RecruiterDashboardData {
  summary: RecruiterDashboardSummary;
  activeJobs: RecruiterDashboardJob[];
  recentApplicants: RecruiterDashboardApplicant[];
  upcomingInterviews: RecruiterDashboardInterview[];
}

interface RecruiterDashboardApiResponse {
  message?: string;
  data: RecruiterDashboardData;
}

const dashboardEndpoint =
  import.meta.env.VITE_RECRUITER_DASHBOARD_ENDPOINT;

export async function getRecruiterDashboard(): Promise<RecruiterDashboardData> {
  if (!dashboardEndpoint) {
    throw new Error(
      "Recruiter dashboard API endpoint is not configured.",
    );
  }

  const response =
    await httpClient.get<RecruiterDashboardApiResponse>(
      dashboardEndpoint,
    );

  return response.data.data;
}