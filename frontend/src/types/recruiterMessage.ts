export interface RecruiterConversation {
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

export interface RecruiterChatMessage {
  id: number;
  conversationId: number;
  senderUserId: number;
  senderName?: string | null;
  content: string;
  sentAt: string;
  isRead?: boolean;
}

export interface RecruiterConversationDetails {
  conversation: RecruiterConversation;
  messages: RecruiterChatMessage[];
}

export interface SendRecruiterMessageRequest {
  content: string;
}