import httpClient from "./httpClient";

import type {
  RecruiterChatMessage,
  RecruiterConversation,
  RecruiterConversationDetails,
  SendRecruiterMessageRequest,
} from "../types/recruiterMessage";

const recruiterMessagesEndpoint =
  import.meta.env.VITE_RECRUITER_MESSAGES_ENDPOINT;

function requireRecruiterMessagesEndpoint(): string {
  if (!recruiterMessagesEndpoint) {
    throw new Error(
      "Recruiter messages API endpoint is not configured.",
    );
  }

  return recruiterMessagesEndpoint;
}

export async function getRecruiterConversations(): Promise<
  RecruiterConversation[]
> {
  const endpoint = requireRecruiterMessagesEndpoint();

  const response =
    await httpClient.get<RecruiterConversation[]>(endpoint);

  return response.data;
}

export async function getRecruiterConversation(
  conversationId: number,
): Promise<RecruiterConversationDetails> {
  const endpoint = requireRecruiterMessagesEndpoint();

  const response =
    await httpClient.get<RecruiterConversationDetails>(
      `${endpoint}/${conversationId}`,
    );

  return response.data;
}

export async function sendRecruiterMessage(
  conversationId: number,
  content: string,
): Promise<RecruiterChatMessage> {
  const endpoint = requireRecruiterMessagesEndpoint();

  const request: SendRecruiterMessageRequest = {
    content,
  };

  const response =
    await httpClient.post<RecruiterChatMessage>(
      `${endpoint}/${conversationId}/messages`,
      request,
    );

  return response.data;
}