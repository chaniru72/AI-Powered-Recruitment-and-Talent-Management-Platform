import httpClient from "./httpClient";

import type {
  HiringManagerInterview,
  InterviewStatus,
} from "../types/hiringManager";

const interviewsEndpoint =
  import.meta.env.VITE_HIRING_MANAGER_INTERVIEWS_ENDPOINT;

function getEndpoint(): string {
  if (!interviewsEndpoint) {
    throw new Error(
      "Hiring Manager interviews API endpoint is not configured.",
    );
  }

  return interviewsEndpoint;
}

export async function getHiringManagerInterviews(): Promise<
  HiringManagerInterview[]
> {
  const response = await httpClient.get<HiringManagerInterview[]>(
    getEndpoint(),
  );

  return response.data;
}

export async function updateInterviewStatus(
  interviewId: number,
  status: InterviewStatus,
): Promise<HiringManagerInterview> {
  const response =
    await httpClient.patch<HiringManagerInterview>(
      `${getEndpoint()}/${interviewId}/status`,
      { status },
    );

  return response.data;
}