import httpClient from "./httpClient";

import type {
  ApplicationStatus,
  CandidateApplication,
} from "../types/application";

export interface RecruiterApplication
  extends CandidateApplication {
  matchScore?: number | null;
}

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
}

const applicationsEndpoint =
  import.meta.env.VITE_RECRUITER_APPLICATIONS_ENDPOINT;

function requireApplicationsEndpoint(): string {
  if (!applicationsEndpoint) {
    throw new Error(
      "Recruiter applications API endpoint is not configured.",
    );
  }

  return applicationsEndpoint;
}

export async function getRecruiterApplications(): Promise<
  RecruiterApplication[]
> {
  const endpoint = requireApplicationsEndpoint();

  const response =
    await httpClient.get<RecruiterApplication[]>(
      endpoint,
    );

  return response.data;
}

export async function updateRecruiterApplicationStatus(
  applicationId: number,
  status: ApplicationStatus,
): Promise<RecruiterApplication> {
  const endpoint = requireApplicationsEndpoint();

  const request: UpdateApplicationStatusRequest = {
    status,
  };

  const response =
    await httpClient.put<RecruiterApplication>(
      `${endpoint}/${applicationId}/status`,
      request,
    );

  return response.data;
}