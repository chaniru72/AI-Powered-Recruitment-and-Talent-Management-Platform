import httpClient from "./httpClient";

import type {
  CandidateChatMessage,
  CandidateConversation,
  CandidateConversationDetails,
  SendCandidateMessageRequest,
} from "../types/candidateMessage";

const candidateMessagesEndpoint =
  import.meta.env.VITE_CANDIDATE_MESSAGES_ENDPOINT;

function requireCandidateMessagesEndpoint(): string {
  if (!candidateMessagesEndpoint) {
    throw new Error(
      "Candidate messages API endpoint is not configured.",
    );
  }

  return candidateMessagesEndpoint;
}

export async function getCandidateConversations(): Promise<
  CandidateConversation[]
> {
  const endpoint = requireCandidateMessagesEndpoint();

  const response =
    await httpClient.get<CandidateConversation[]>(endpoint);

  return response.data;
}

export async function getCandidateConversation(
  conversationId: number,
): Promise<CandidateConversationDetails> {
  const endpoint = requireCandidateMessagesEndpoint();

  const response =
    await httpClient.get<CandidateConversationDetails>(
      `${endpoint}/${conversationId}`,
    );

  return response.data;
}

export async function sendCandidateMessage(
  conversationId: number,
  content: string,
): Promise<CandidateChatMessage> {
  const endpoint = requireCandidateMessagesEndpoint();

  const request: SendCandidateMessageRequest = {
    content,
  };

  const response =
    await httpClient.post<CandidateChatMessage>(
      `${endpoint}/${conversationId}/messages`,
      request,
    );

  return response.data;
}