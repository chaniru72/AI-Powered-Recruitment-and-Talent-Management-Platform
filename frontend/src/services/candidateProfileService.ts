import httpClient from "./httpClient";

import type {
  CandidateProfile,
  ResumeUploadResponse,
  UpdateCandidateProfileRequest,
  UpdateCandidateProfileResponse,
} from "../types/candidateProfile";

export async function getCandidateProfile(): Promise<CandidateProfile> {
  const response = await httpClient.get<CandidateProfile>(
    "/api/Candidates/me",
  );

  return response.data;
}

export async function updateCandidateProfile(
  profileData: UpdateCandidateProfileRequest,
): Promise<UpdateCandidateProfileResponse> {
  const response =
    await httpClient.put<UpdateCandidateProfileResponse>(
      "/api/Candidates/me",
      profileData,
    );

  return response.data;
}

export async function uploadCandidateResume(
  resumeFile: File,
): Promise<ResumeUploadResponse> {
  const formData = new FormData();
  formData.append("resume", resumeFile);

  const response = await httpClient.post<ResumeUploadResponse>(
    "/api/Candidates/me/resume",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}

export async function downloadCandidateResume(): Promise<Blob> {
  const response = await httpClient.get(
    "/api/Candidates/me/resume",
    {
      responseType: "blob",
    },
  );

  return response.data;
}