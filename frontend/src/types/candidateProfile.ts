export interface CandidateProfile {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  skills: string;
  education: string;
  experienceSummary: string;
  resumeUrl: string | null;
  updatedAt: string;
}

export interface UpdateCandidateProfileRequest {
  phone: string;
  location: string;
  skills: string;
  education: string;
  experienceSummary: string;
}

export interface UpdateCandidateProfileResponse {
  message: string;
  profile: CandidateProfile;
}

export interface ResumeUploadResponse {
  message: string;
  data: {
    fileName: string;
    downloadUrl: string;
    uploadedAt: string;
  };
}