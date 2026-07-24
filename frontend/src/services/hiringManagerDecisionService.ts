import httpClient from "./httpClient";

import type {
  HiringDecision,
} from "../types/hiringManager";

const decisionsEndpoint =
  import.meta.env.VITE_HIRING_MANAGER_DECISIONS_ENDPOINT;

function getEndpoint(): string {
  if (!decisionsEndpoint) {
    throw new Error(
      "Hiring Manager decisions API endpoint is not configured.",
    );
  }

  return decisionsEndpoint;
}

export async function submitHiringDecision(
  decision: HiringDecision,
): Promise<HiringDecision> {
  const response = await httpClient.post<HiringDecision>(
    getEndpoint(),
    decision,
  );

  return response.data;
}