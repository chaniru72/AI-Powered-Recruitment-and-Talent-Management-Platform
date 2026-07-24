import httpClient from "./httpClient";

import type {
  ApplicationStatus,
  CandidateApplication,
} from "../types/application";

export type HiringManagerCandidate =
  CandidateApplication;

export interface HiringManagerDashboardSummary {
  totalCandidates: number;
  underReviewCandidates: number;
  shortlistedCandidates: number;
  hiredCandidates: number;
}

export interface HiringManagerDashboardData {
  summary: HiringManagerDashboardSummary;
  recentCandidates: HiringManagerCandidate[];
}

const candidatesEndpoint =
  import.meta.env
    .VITE_HIRING_MANAGER_CANDIDATES_ENDPOINT;

const candidateDetailsEndpoint =
  import.meta.env
    .VITE_HIRING_MANAGER_CANDIDATE_DETAILS_ENDPOINT;

function requireCandidatesEndpoint(): string {
  if (!candidatesEndpoint) {
    throw new Error(
      "Hiring manager candidates API endpoint is not configured.",
    );
  }

  return candidatesEndpoint;
}

function buildCandidateDetailsEndpoint(
  applicationId: number,
): string {
  if (!candidateDetailsEndpoint) {
    throw new Error(
      "Hiring manager candidate details API endpoint is not configured.",
    );
  }

  if (
    !candidateDetailsEndpoint.includes(
      ":applicationId",
    )
  ) {
    throw new Error(
      "Hiring manager candidate details endpoint must include :applicationId.",
    );
  }

  return candidateDetailsEndpoint.replace(
    ":applicationId",
    encodeURIComponent(String(applicationId)),
  );
}

function countCandidatesByStatus(
  candidates: HiringManagerCandidate[],
  status: ApplicationStatus,
): number {
  return candidates.filter(
    (candidate) => candidate.status === status,
  ).length;
}

function parseDate(value: string): number {
  const parsedDate = new Date(value).getTime();

  return Number.isNaN(parsedDate)
    ? 0
    : parsedDate;
}

export async function getHiringManagerCandidates(): Promise<
  HiringManagerCandidate[]
> {
  const endpoint = requireCandidatesEndpoint();

  const response =
    await httpClient.get<HiringManagerCandidate[]>(
      endpoint,
    );

  return response.data;
}

export async function getHiringManagerCandidateDetails(
  applicationId: number,
): Promise<HiringManagerCandidate> {
  const endpoint =
    buildCandidateDetailsEndpoint(applicationId);

  const response =
    await httpClient.get<HiringManagerCandidate>(
      endpoint,
    );

  return response.data;
}

export async function getHiringManagerDashboard(): Promise<
  HiringManagerDashboardData
> {
  const candidates =
    await getHiringManagerCandidates();

  const recentCandidates = [...candidates]
    .sort(
      (firstCandidate, secondCandidate) =>
        parseDate(secondCandidate.updatedAt) -
        parseDate(firstCandidate.updatedAt),
    )
    .slice(0, 5);

  return {
    summary: {
      totalCandidates: candidates.length,

      underReviewCandidates:
        countCandidatesByStatus(
          candidates,
          "UnderReview",
        ),

      shortlistedCandidates:
        countCandidatesByStatus(
          candidates,
          "Shortlisted",
        ),

      hiredCandidates:
        countCandidatesByStatus(
          candidates,
          "Hired",
        ),
    },

    recentCandidates,
  };
}