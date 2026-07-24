export type InterviewStatus =
  | "Scheduled"
  | "Rescheduled"
  | "Completed"
  | "Cancelled"
  | "NoShow";

export interface CreateInterviewRequest {
  jobApplicationId: number;
  title: string;
  scheduledAt: string;
  durationMinutes?: number;
  meetingLink?: string;
  location?: string;
  notes?: string;
}

export interface UpdateInterviewRequest {
  title: string;
  scheduledAt: string;
  durationMinutes: number;
  meetingLink: string;
  location: string;
  notes: string;
  status: InterviewStatus;
}

export interface InterviewResponse {
  id: number;
  jobApplicationId: number;
  jobId: number;
  jobTitle: string;
  candidateUserId: number;
  candidateName: string;
  candidateEmail: string;
  title: string;
  scheduledAt: string;
  durationMinutes: number;
  meetingLink: string;
  location: string;
  notes: string;
  status: InterviewStatus;
  createdAt: string;
  updatedAt: string;
}
