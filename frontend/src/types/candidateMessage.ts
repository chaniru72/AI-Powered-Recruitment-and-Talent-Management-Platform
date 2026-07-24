export interface CandidateConversation {
  id: number;
  participantUserId: number;
  participantName: string;
  participantRole?: string | null;
  participantEmail?: string | null;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  unreadCount?: number;
  isOnline?: boolean;
}

export interface CandidateChatMessage {
  id: number;
  conversationId: number;
  senderUserId: number;
  senderName?: string | null;
  content: string;
  sentAt: string;
  isRead?: boolean;
}

export interface CandidateConversationDetails {
  conversation: CandidateConversation;
  messages: CandidateChatMessage[];
}

export interface SendCandidateMessageRequest {
  content: string;
}