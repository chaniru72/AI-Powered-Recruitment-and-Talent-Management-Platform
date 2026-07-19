import { apiRequest } from "./apiClient";

import type {
  ApplicationListResponse,
  JobApplication,
} from "../types/application";

const APPLICATIONS_ENDPOINT = "/candidate/applications";

export function getCandidateApplications(): Promise<ApplicationListResponse> {
  return apiRequest<ApplicationListResponse>(APPLICATIONS_ENDPOINT);
}

export function getCandidateApplication(
  applicationId: number
): Promise<JobApplication> {
  return apiRequest<JobApplication>(
    `${APPLICATIONS_ENDPOINT}/${applicationId}`
  );
}

export function withdrawCandidateApplication(
  applicationId: number
): Promise<void> {
  return apiRequest<void>(
    `${APPLICATIONS_ENDPOINT}/${applicationId}/withdraw`,
    {
      method: "PATCH",
    }
  );
}