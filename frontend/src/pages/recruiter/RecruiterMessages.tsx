import "./RecruiterMessages.css";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { isAxiosError } from "axios";
import {
  AlertCircle,
  CheckCheck,
  LoaderCircle,
  MessageCircle,
  RefreshCw,
  Search,
  Send,
  UserRound,
} from "lucide-react";

import {
  getRecruiterConversation,
  getRecruiterConversations,
  sendRecruiterMessage,
} from "../../services/recruiterMessageService";

import type {
  RecruiterChatMessage,
  RecruiterConversation,
} from "../../types/recruiterMessage";

type StoredUser = {
  userId?: number;
};

function getStoredUserId(): number | null {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    const user = JSON.parse(storedUser) as StoredUser;

    return typeof user.userId === "number"
      ? user.userId
      : null;
  } catch {
    return null;
  }
}

function getErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

function formatMessageTime(value?: string | null): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

export default function RecruiterMessages() {
  const currentUserId = getStoredUserId();

  const [conversations, setConversations] = useState<
    RecruiterConversation[]
  >([]);

  const [messages, setMessages] = useState<
    RecruiterChatMessage[]
  >([]);

  const [selectedConversationId, setSelectedConversationId] =
    useState<number | null>(null);

  const [locallySentMessageIds, setLocallySentMessageIds] =
    useState<number[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const [isLoadingConversations, setIsLoadingConversations] =
    useState(true);

  const [isLoadingMessages, setIsLoadingMessages] =
    useState(false);

  const [isSending, setIsSending] = useState(false);
  const [isEndpointPending, setIsEndpointPending] =
    useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const selectedConversation = conversations.find(
    (conversation) =>
      conversation.id === selectedConversationId,
  );

  const filteredConversations = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    if (!normalizedSearch) {
      return conversations;
    }

    return conversations.filter((conversation) => {
      const searchableContent = [
        conversation.participantName,
        conversation.participantRole,
        conversation.participantEmail,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableContent.includes(normalizedSearch);
    });
  }, [conversations, searchTerm]);

  const loadConversations = useCallback(async () => {
    try {
      setIsLoadingConversations(true);
      setErrorMessage("");
      setIsEndpointPending(false);

      const data = await getRecruiterConversations();

      setConversations(data);

      setSelectedConversationId((currentId) => {
        const currentConversationExists = data.some(
          (conversation) => conversation.id === currentId,
        );

        if (currentId && currentConversationExists) {
          return currentId;
        }

        return data[0]?.id ?? null;
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "Recruiter messages API endpoint is not configured."
      ) {
        setIsEndpointPending(true);
        setConversations([]);
        setMessages([]);
        setSelectedConversationId(null);
        return;
      }

      setErrorMessage(
        getErrorMessage(
          error,
          "We could not load recruiter conversations.",
        ),
      );
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  const loadConversation = useCallback(
    async (conversationId: number) => {
      try {
        setIsLoadingMessages(true);
        setErrorMessage("");
        setLocallySentMessageIds([]);

        const data =
          await getRecruiterConversation(conversationId);

        setMessages(data.messages);
      } catch (error) {
        setMessages([]);

        setErrorMessage(
          getErrorMessage(
            error,
            "We could not load this conversation.",
          ),
        );
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (selectedConversationId !== null) {
      void loadConversation(selectedConversationId);
    } else {
      setMessages([]);
    }
  }, [loadConversation, selectedConversationId]);

  function selectConversation(conversationId: number) {
    setSelectedConversationId(conversationId);
    setNewMessage("");
    setErrorMessage("");

    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              unreadCount: 0,
            }
          : conversation,
      ),
    );
  }

  async function handleSendMessage(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedMessage = newMessage.trim();

    if (
      !trimmedMessage ||
      selectedConversationId === null ||
      isEndpointPending
    ) {
      return;
    }

    try {
      setIsSending(true);
      setErrorMessage("");

      const sentMessage = await sendRecruiterMessage(
        selectedConversationId,
        trimmedMessage,
      );

      setMessages((currentMessages) => [
        ...currentMessages,
        sentMessage,
      ]);

      setLocallySentMessageIds((currentIds) => [
        ...currentIds,
        sentMessage.id,
      ]);

      setConversations((currentConversations) =>
        currentConversations.map((conversation) =>
          conversation.id === selectedConversationId
            ? {
                ...conversation,
                lastMessage: sentMessage.content,
                lastMessageAt: sentMessage.sentAt,
              }
            : conversation,
        ),
      );

      setNewMessage("");
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          "We could not send your message.",
        ),
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="recruiter-messages-page">
      <section className="recruiter-messages-hero">
        <div>
          <span className="recruiter-messages-eyebrow">
            <MessageCircle size={16} />
            Recruiter communication
          </span>

          <h1>Messages</h1>

          <p>
            Communicate with candidates through the secured
            messaging service.
          </p>
        </div>

        <button
          type="button"
          className="recruiter-messages-refresh"
          onClick={() => void loadConversations()}
          disabled={isLoadingConversations}
        >
          <RefreshCw
            size={17}
            className={
              isLoadingConversations ? "is-spinning" : ""
            }
          />

          Refresh
        </button>
      </section>

      {isEndpointPending && (
        <div className="recruiter-messages-pending">
          <AlertCircle size={19} />

          <div>
            <strong>Backend connection pending</strong>

            <p>
              The recruiter messages interface is ready.
              Connect the messages API endpoint when the backend
              becomes available.
            </p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="recruiter-messages-error">
          <AlertCircle size={19} />
          <p>{errorMessage}</p>
        </div>
      )}

      <section className="recruiter-messages-workspace">
        <aside className="recruiter-conversations-panel">
          <div className="recruiter-conversations-header">
            <div>
              <span>CONVERSATIONS</span>
              <h2>Candidate chats</h2>
            </div>

            <label className="recruiter-conversation-search">
              <Search size={17} />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search candidates"
                disabled={isEndpointPending}
              />
            </label>
          </div>

          <div className="recruiter-conversations-list">
            {isLoadingConversations ? (
              <div className="recruiter-messages-state">
                <LoaderCircle
                  size={30}
                  className="is-spinning"
                />

                <p>Loading conversations...</p>
              </div>
            ) : isEndpointPending ? (
              <div className="recruiter-messages-state">
                <MessageCircle size={34} />

                <h3>No connected conversations</h3>

                <p>
                  Candidate conversations will appear after the
                  backend API is connected.
                </p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="recruiter-messages-state">
                <MessageCircle size={34} />

                <h3>No conversations found</h3>

                <p>
                  There are no recruiter conversations matching
                  your search.
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const isSelected =
                  conversation.id ===
                  selectedConversationId;

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    className={`recruiter-conversation-item ${
                      isSelected ? "is-selected" : ""
                    }`}
                    onClick={() =>
                      selectConversation(conversation.id)
                    }
                  >
                    <div className="recruiter-conversation-avatar">
                      <UserRound size={21} />

                      {conversation.isOnline && (
                        <span />
                      )}
                    </div>

                    <div className="recruiter-conversation-content">
                      <div className="recruiter-conversation-title">
                        <strong>
                          {conversation.participantName}
                        </strong>

                        <time>
                          {formatMessageTime(
                            conversation.lastMessageAt,
                          )}
                        </time>
                      </div>

                      <p>
                        {conversation.participantRole ||
                          conversation.participantEmail ||
                          "Candidate"}
                      </p>

                      <div className="recruiter-conversation-preview">
                        <span>
                          {conversation.lastMessage ||
                            "No messages yet"}
                        </span>

                        {(conversation.unreadCount ?? 0) > 0 && (
                          <b>
                            {conversation.unreadCount}
                          </b>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <div className="recruiter-chat-panel">
          {selectedConversation ? (
            <>
              <header className="recruiter-chat-header">
                <div className="recruiter-chat-person">
                  <div className="recruiter-chat-avatar">
                    <UserRound size={22} />
                  </div>

                  <div>
                    <h2>
                      {selectedConversation.participantName}
                    </h2>

                    <p>
                      {selectedConversation.participantRole ||
                        selectedConversation.participantEmail ||
                        "Candidate"}
                    </p>
                  </div>
                </div>
              </header>

              <div className="recruiter-chat-messages">
                {isLoadingMessages ? (
                  <div className="recruiter-messages-state">
                    <LoaderCircle
                      size={30}
                      className="is-spinning"
                    />

                    <p>Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="recruiter-messages-state">
                    <MessageCircle size={38} />

                    <h3>No messages yet</h3>

                    <p>
                      Start the conversation by sending a
                      message.
                    </p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isRecruiterMessage =
                      message.senderUserId === currentUserId ||
                      locallySentMessageIds.includes(
                        message.id,
                      );

                    return (
                      <div
                        key={message.id}
                        className={`recruiter-message-row ${
                          isRecruiterMessage
                            ? "is-recruiter"
                            : "is-candidate"
                        }`}
                      >
                        <div className="recruiter-message-bubble">
                          <p>{message.content}</p>

                          <div>
                            <time>
                              {formatMessageTime(
                                message.sentAt,
                              )}
                            </time>

                            {isRecruiterMessage &&
                              message.isRead && (
                                <CheckCheck size={14} />
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form
                className="recruiter-chat-compose"
                onSubmit={handleSendMessage}
              >
                <textarea
                  rows={1}
                  value={newMessage}
                  onChange={(event) =>
                    setNewMessage(event.target.value)
                  }
                  placeholder="Type your message..."
                  disabled={
                    isSending || isEndpointPending
                  }
                />

                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={
                    !newMessage.trim() ||
                    isSending ||
                    isEndpointPending
                  }
                >
                  {isSending ? (
                    <LoaderCircle
                      size={19}
                      className="is-spinning"
                    />
                  ) : (
                    <Send size={19} />
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="recruiter-chat-empty">
              <MessageCircle size={44} />

              <h2>Select a conversation</h2>

              <p>
                Choose a candidate conversation to view its
                messages.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}