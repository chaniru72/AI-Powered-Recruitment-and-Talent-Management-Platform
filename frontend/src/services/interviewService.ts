import httpClient from "./httpClient";
import type {
  CreateInterviewRequest,
  InterviewResponse,
} from "../types/interview";

export async function createInterview(
  request: CreateInterviewRequest,
): Promise<InterviewResponse> {
  const response = await httpClient.post<InterviewResponse>(
    "/api/interviews",
    request,
  );

  return response.data;
}

export async function getInterviewsForApplication(
  applicationId: number,
): Promise<InterviewResponse[]> {
  const response = await httpClient.get<InterviewResponse[]>(
    `/api/interviews/applications/${applicationId}`,
  );

  return response.data;
}
