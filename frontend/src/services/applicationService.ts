import httpClient from "./httpClient";
import type { CandidateApplication } from "../types/application";

export interface ApplyForJobRequest {
  coverLetter: string;
}

export async function getMyApplications(): Promise<
  CandidateApplication[]
> {
  const response = await httpClient.get<CandidateApplication[]>(
    "/api/applications/my",
  );

  return response.data;
}

export async function applyForJob(
  jobId: number,
  coverLetter: string,
): Promise<CandidateApplication> {
  const request: ApplyForJobRequest = { coverLetter };
  const response = await httpClient.post<CandidateApplication>(
    `/api/applications/jobs/${jobId}/apply`,
    request,
  );

  return response.data;
}
