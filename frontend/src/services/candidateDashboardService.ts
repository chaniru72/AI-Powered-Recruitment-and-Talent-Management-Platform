import { isAxiosError } from "axios";

import { getMyApplications } from "./applicationService";
import { getCandidateProfile } from "./candidateProfileService";
import { getJobs } from "./jobService";

import type { CandidateApplication } from "../types/application";
import type { CandidateProfile } from "../types/candidateProfile";
import type { JobResponse } from "./jobService";

export type CandidateDashboardSection =
  | "profile"
  | "applications"
  | "jobs";

export interface CandidateDashboardData {
  profile: CandidateProfile | null;
  applications: CandidateApplication[];
  jobs: JobResponse[];
  unavailableSections: CandidateDashboardSection[];
}

export async function getCandidateDashboardData(): Promise<
  CandidateDashboardData
> {
  const [
    profileResult,
    applicationsResult,
    jobsResult,
  ] = await Promise.allSettled([
    getCandidateProfile(),
    getMyApplications(),
    getJobs(),
  ]);

  const unavailableSections: CandidateDashboardSection[] = [];

  let profile: CandidateProfile | null = null;
  let applications: CandidateApplication[] = [];
  let jobs: JobResponse[] = [];

  if (profileResult.status === "fulfilled") {
    profile = profileResult.value;
  } else if (
    !isAxiosError(profileResult.reason) ||
    profileResult.reason.response?.status !== 404
  ) {
    unavailableSections.push("profile");
  }

  if (applicationsResult.status === "fulfilled") {
    applications = applicationsResult.value;
  } else {
    unavailableSections.push("applications");
  }

  if (jobsResult.status === "fulfilled") {
    jobs = jobsResult.value;
  } else {
    unavailableSections.push("jobs");
  }

  return {
    profile,
    applications,
    jobs,
    unavailableSections,
  };
}