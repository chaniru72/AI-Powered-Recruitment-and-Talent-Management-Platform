export type ApplicationStatus =
  | "Applied"
  | "UnderReview"
  | "Shortlisted"
  | "Rejected"
  | "Hired"
  | "Withdrawn";

export interface CandidateApplication {
  id: number;
  jobId: number;
  jobTitle: string;
  candidateUserId: number;
  candidateName: string;
  candidateEmail: string;
  coverLetter: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
}