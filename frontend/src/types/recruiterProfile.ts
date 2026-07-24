export interface RecruiterProfile {
  id?: number;
  userId?: number;
  fullName: string;
  email: string;
  role: string;
  phone?: string | null;
  organizationName?: string | null;
  designation?: string | null;
  bio?: string | null;
  updatedAt?: string | null;
}

export interface UpdateRecruiterProfileRequest {
  phone: string;
  organizationName: string;
  designation: string;
  bio: string;
}

export interface UpdateRecruiterProfileResponse {
  message: string;
  profile: RecruiterProfile;
}