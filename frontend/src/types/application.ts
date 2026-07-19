export type ApplicationStatus =
  | "Submitted"
  | "UnderReview"
  | "Shortlisted"
  | "InterviewScheduled"
  | "Rejected"
  | "Hired"
  | "Withdrawn";

export interface JobApplication {
  id: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  location: string;
  appliedDate: string;
  status: ApplicationStatus;
}

export interface ApplicationListResponse {
  applications: JobApplication[];
  totalCount: number;
}