export type InterviewStatus =
  | "Scheduled"
  | "Completed"
  | "Cancelled"
  | "Rescheduled";

export type InterviewMode =
  | "Online"
  | "Onsite"
  | "Phone";

export interface HiringManagerInterview {
  id: number;
  applicationId: number;
  candidateId: number;
  candidateName: string;
  jobId: number;
  jobTitle: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  mode: InterviewMode;
  location?: string | null;
  meetingLink?: string | null;
  status: InterviewStatus;
  notes?: string | null;
}

export interface InterviewEvaluation {
  id?: number;
  interviewId: number;
  technicalScore: number;
  communicationScore: number;
  experienceScore: number;
  overallScore: number;
  comments: string;
}

export type HiringDecisionStatus =
  | "Approved"
  | "Rejected"
  | "AdditionalInterview";

export interface HiringDecision {
  interviewId: number;
  applicationId: number;
  status: HiringDecisionStatus;
  comments: string;
}