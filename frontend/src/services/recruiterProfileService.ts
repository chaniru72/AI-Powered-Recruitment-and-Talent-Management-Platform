import httpClient from "./httpClient";

import type {
  RecruiterProfile,
  UpdateRecruiterProfileRequest,
  UpdateRecruiterProfileResponse,
} from "../types/recruiterProfile";

const recruiterProfileEndpoint =
  import.meta.env.VITE_RECRUITER_PROFILE_ENDPOINT;

function requireRecruiterProfileEndpoint(): string {
  if (!recruiterProfileEndpoint) {
    throw new Error(
      "Recruiter profile API endpoint is not configured.",
    );
  }

  return recruiterProfileEndpoint;
}

export async function getRecruiterProfile(): Promise<RecruiterProfile> {
  const endpoint = requireRecruiterProfileEndpoint();

  const response =
    await httpClient.get<RecruiterProfile>(endpoint);

  return response.data;
}

export async function updateRecruiterProfile(
  profileData: UpdateRecruiterProfileRequest,
): Promise<UpdateRecruiterProfileResponse> {
  const endpoint = requireRecruiterProfileEndpoint();

  const response =
    await httpClient.put<UpdateRecruiterProfileResponse>(
      endpoint,
      profileData,
    );

  return response.data;
}