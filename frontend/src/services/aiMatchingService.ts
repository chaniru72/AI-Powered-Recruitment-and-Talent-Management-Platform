import httpClient from "./httpClient";

export interface CandidateMatch {
  applicationId: number;
  candidateUserId: number;
  candidateName: string;
  candidateEmail: string;
  jobId: number;
  jobTitle: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendation: string;
}

export async function getCandidateMatches(
  jobId: number,
): Promise<CandidateMatch[]> {
  const response = await httpClient.get<CandidateMatch[]>(
    `/api/ai/jobs/${jobId}/match-candidates`,
    {
      timeout: 120_000,
    },
  );

  return response.data;
}
