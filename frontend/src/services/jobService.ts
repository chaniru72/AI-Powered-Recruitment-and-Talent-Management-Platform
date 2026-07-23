import httpClient from "./httpClient";

export type JobStatus = "Draft" | "Open" | "Closed" | "Archived";

export interface JobResponse {
  id: number;
  organizationId: number;
  organizationName: string;
  recruiterUserId: number;
  recruiterName: string;
  title: string;
  description: string;
  requiredSkills: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  salaryRange: string;
  status: JobStatus;
  applicationDeadline: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getJobs(): Promise<JobResponse[]> {
  const response = await httpClient.get<JobResponse[]>("/api/jobs");

  return response.data;
}

export async function getJobById(id: number): Promise<JobResponse> {
  const response = await httpClient.get<JobResponse>(`/api/jobs/${id}`);

  return response.data;
}
