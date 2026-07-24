import httpClient from "./httpClient";

import type {
  InterviewEvaluation,
} from "../types/hiringManager";

const evaluationsEndpoint =
  import.meta.env.VITE_HIRING_MANAGER_EVALUATIONS_ENDPOINT;

function getEndpoint(): string {
  if (!evaluationsEndpoint) {
    throw new Error(
      "Hiring Manager evaluations API endpoint is not configured.",
    );
  }

  return evaluationsEndpoint;
}

export async function getInterviewEvaluation(
  interviewId: number,
): Promise<InterviewEvaluation> {
  const response =
    await httpClient.get<InterviewEvaluation>(
      `${getEndpoint()}/interview/${interviewId}`,
    );

  return response.data;
}

export async function submitInterviewEvaluation(
  evaluation: InterviewEvaluation,
): Promise<InterviewEvaluation> {
  const response =
    await httpClient.post<InterviewEvaluation>(
      getEndpoint(),
      evaluation,
    );

  return response.data;
}

export async function updateInterviewEvaluation(
  evaluationId: number,
  evaluation: InterviewEvaluation,
): Promise<InterviewEvaluation> {
  const response =
    await httpClient.put<InterviewEvaluation>(
      `${getEndpoint()}/${evaluationId}`,
      evaluation,
    );

  return response.data;
}