export type Identifier = string | number;

export type ApplicationStatus =
  | "Applied"
  | "Under Review"
  | "Interview"
  | "Shortlisted"
  | "Rejected"
  | "Withdrawn";

export interface CandidateApplication {
  id: Identifier;
  jobId: Identifier;
  jobTitle: string;
  companyName: string;
  location?: string;
  employmentType?: string;
  companyLogoUrl?: string;
  matchScore?: number;
  status: ApplicationStatus;
  appliedDate: string;
  lastUpdatedDate?: string;
}

export interface ApplicationStatusHistory {
  id: Identifier;
  applicationId: Identifier;
  status: ApplicationStatus;
  changedDate: string;
  note?: string;
}

export interface ApplicationDetails
  extends CandidateApplication {
  jobDescription?: string;
  coverLetter?: string;
  resumeUrl?: string;
  statusHistory?: ApplicationStatusHistory[];
}

export interface ApplicationFilters {
  search?: string;
  status?: ApplicationStatus | "All";
  page?: number;
  pageSize?: number;
}

export interface ApplicationsResponse {
  items: CandidateApplication[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface CreateApplicationRequest {
  jobId: Identifier;
  resumeId?: Identifier;
  coverLetter?: string;
}

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
  note?: string;
}

export interface ApplicationSummary {
  totalApplications: number;
  underReview: number;
  interviews: number;
  shortlisted: number;
}