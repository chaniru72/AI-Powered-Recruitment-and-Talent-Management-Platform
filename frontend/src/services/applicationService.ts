import httpClient from "./httpClient";
import type { CandidateApplication } from "../types/application";

export async function getMyApplications(): Promise<
  CandidateApplication[]
> {
  const response = await httpClient.get<CandidateApplication[]>(
    "/api/applications/my",
  );

  return response.data;
}