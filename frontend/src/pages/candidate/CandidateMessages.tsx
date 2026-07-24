import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  AlertCircle,
  CheckCheck,
  LoaderCircle,
  MessageCircle,
  MoreVertical,
  Paperclip,
  RefreshCw,
  Search,
  Send,
  UserRound,
} from "lucide-react";

import {
  getCandidateConversation,
  getCandidateConversations,
  sendCandidateMessage,
} from "../../services/candidateMessageService";

import type {
  CandidateConversation,
  CandidateConversationDetails,
} from "../../types/candidateMessage";

type StoredUser = {
  id?: number | string;
  userId?: number | string;
};

function getStoredUserId(): number | null {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    const user = JSON.parse(storedUser) as StoredUser;
    const value = user.userId ?? user.id;
    const userId = Number(value);

    return Number.isFinite(userId) ? userId : null;
  } catch {
    return null;
  }
}

function formatMessageTime(value?: string | null): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
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

function getLoadErrorMessage(error: unknown): string {
  if (
    error instanceof Error &&
    error.message.includes("not configured")
  ) {
    return "The messaging backend endpoint has not been connected yet.";
  }

  return "We could not load your messages. Please try again.";
}

export default function CandidateMessages() {
  const currentUserId = useMemo(() => getStoredUserId(), []);

  const [conversations, setConversations] = useState<
    CandidateConversation[]
  >([]);

  const [conversationDetails, setConversationDetails] =
    useState<CandidateConversationDetails | null>(null);

  const [selectedConversationId, setSelectedConversationId] =
    useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const [isLoadingConversations, setIsLoadingConversations] =
    useState(true);

  const [isLoadingMessages, setIsLoadingMessages] =
    useState(false);

  const [isSending, setIsSending] = useState(false);

  const [pageError, setPageError] = useState("");
  const [conversationError, setConversationError] =
    useState("");

  const loadConversations = useCallback(async () => {
    try {
      setIsLoadingConversations(true);
      setPageError("");

      const data = await getCandidateConversations();

      setConversations(data);

      setSelectedConversationId((currentId) => {
        if (
          currentId !== null &&
          data.some(
            (conversation) => conversation.id === currentId,
          )
        ) {
          return currentId;
        }

        return data[0]?.id ?? null;
      });

      if (data.length === 0) {
        setConversationDetails(null);
      }
    } catch (error) {
      setConversations([]);
      setConversationDetails(null);
      setSelectedConversationId(null);
      setPageError(getLoadErrorMessage(error));
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  const loadConversation = useCallback(
    async (conversationId: number) => {
      try {
        setIsLoadingMessages(true);
        setConversationError("");

        const details =
          await getCandidateConversation(conversationId);

        setConversationDetails(details);

        setConversations((currentConversations) =>
          currentConversations.map((conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  ...details.conversation,
                  unreadCount: 0,
                }
              : conversation,
          ),
        );
      } catch (error) {
        setConversationDetails(null);
        setConversationError(getLoadErrorMessage(error));
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
    if (selectedConversationId === null) {
      setConversationDetails(null);
      return;
    }

    void loadConversation(selectedConversationId);
  }, [loadConversation, selectedConversationId]);

  const filteredConversations = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    if (!normalizedSearch) {
      return conversations;
    }

    return conversations.filter((conversation) => {
      const searchableText = [
        conversation.participantName,
        conversation.participantRole,
        conversation.participantEmail,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [conversations, searchTerm]);

  const selectedConversation = useMemo(() => {
    if (
      conversationDetails?.conversation.id ===
      selectedConversationId
    ) {
      return conversationDetails.conversation;
    }

    return conversations.find(
      (conversation) =>
        conversation.id === selectedConversationId,
    );
  }, [
    conversationDetails,
    conversations,
    selectedConversationId,
  ]);

  function selectConversation(conversationId: number) {
    setSelectedConversationId(conversationId);

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

    const content = newMessage.trim();

    if (
      !content ||
      selectedConversationId === null ||
      isSending
    ) {
      return;
    }

    try {
      setIsSending(true);
      setConversationError("");

      const savedMessage = await sendCandidateMessage(
        selectedConversationId,
        content,
      );

      setConversationDetails((currentDetails) => {
        if (
          !currentDetails ||
          currentDetails.conversation.id !==
            selectedConversationId
        ) {
          return currentDetails;
        }

        return {
          conversation: {
            ...currentDetails.conversation,
            lastMessage: savedMessage.content,
            lastMessageAt: savedMessage.sentAt,
            unreadCount: 0,
          },
          messages: [
            ...currentDetails.messages,
            savedMessage,
          ],
        };
      });

      setConversations((currentConversations) =>
        currentConversations.map((conversation) =>
          conversation.id === selectedConversationId
            ? {
                ...conversation,
                lastMessage: savedMessage.content,
                lastMessageAt: savedMessage.sentAt,
                unreadCount: 0,
              }
            : conversation,
        ),
      );

      setNewMessage("");
    } catch (error) {
      setConversationError(getLoadErrorMessage(error));
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <section>
        <span
          className="inline-flex items-center gap-2 rounded-full
            bg-blue-100 px-3 py-1.5 text-xs font-bold
            text-blue-700"
        >
          <MessageCircle size={15} />
          Candidate messages
        </span>

        <h1
          className="mt-3 text-2xl font-bold text-slate-900
            sm:text-3xl"
        >
          Messages
        </h1>

        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Communicate with recruiters and hiring managers.
        </p>
      </section>

      <section
        className="grid min-h-[650px] overflow-hidden rounded-2xl
          border border-slate-200 bg-white shadow-sm
          md:grid-cols-[320px_1fr]"
      >
        <aside
          className="border-b border-slate-200
            md:border-b-0 md:border-r"
        >
          <div className="border-b border-slate-200 p-4">
            <h2 className="font-bold text-slate-900">
              Conversations
            </h2>

            <label
              className="mt-4 flex h-11 items-center gap-3
                rounded-xl border border-slate-200
                bg-slate-50 px-3 focus-within:border-blue-500"
            >
              <Search
                size={17}
                className="shrink-0 text-slate-400"
              />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search conversations"
                className="h-full min-w-0 flex-1 border-0
                  bg-transparent text-sm outline-none"
              />
            </label>
          </div>

          <div className="max-h-[575px] overflow-y-auto">
            {isLoadingConversations ? (
              <div className="flex flex-col items-center p-8">
                <LoaderCircle
                  size={28}
                  className="animate-spin text-blue-600"
                />

                <p className="mt-3 text-sm text-slate-500">
                  Loading conversations...
                </p>
              </div>
            ) : pageError ? (
              <div className="p-6 text-center">
                <AlertCircle
                  size={30}
                  className="mx-auto text-amber-500"
                />

                <p className="mt-3 text-sm text-slate-600">
                  Messaging is unavailable.
                </p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle
                  size={30}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm text-slate-500">
                  {conversations.length === 0
                    ? "No conversations yet."
                    : "No conversations found."}
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
                    onClick={() =>
                      selectConversation(conversation.id)
                    }
                    className={`flex w-full gap-3 border-b
                      border-slate-100 p-4 text-left transition
                      ${
                        isSelected
                          ? "bg-blue-50"
                          : "hover:bg-slate-50"
                      }`}
                  >
                    <div className="relative shrink-0">
                      <div
                        className="flex h-11 w-11 items-center
                          justify-center rounded-full bg-blue-100
                          text-blue-700"
                      >
                        <UserRound size={22} />
                      </div>

                      {conversation.isOnline && (
                        <span
                          className="absolute bottom-0 right-0
                            h-3 w-3 rounded-full border-2
                            border-white bg-emerald-500"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div
                        className="flex items-start
                          justify-between gap-2"
                      >
                        <p
                          className="truncate text-sm font-bold
                            text-slate-900"
                        >
                          {conversation.participantName}
                        </p>

                        <span
                          className="shrink-0 text-[11px]
                            text-slate-400"
                        >
                          {formatMessageTime(
                            conversation.lastMessageAt,
                          )}
                        </span>
                      </div>

                      <p
                        className="mt-0.5 truncate text-xs
                          text-slate-500"
                      >
                        {conversation.participantRole ||
                          "Recruitment team"}
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <p
                          className="min-w-0 flex-1 truncate
                            text-xs text-slate-500"
                        >
                          {conversation.lastMessage ||
                            "No messages yet"}
                        </p>

                        {(conversation.unreadCount ?? 0) > 0 && (
                          <span
                            className="flex h-5 min-w-5
                              items-center justify-center
                              rounded-full bg-blue-600 px-1
                              text-[10px] font-bold text-white"
                          >
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <div className="flex min-h-[520px] flex-col">
          {isLoadingConversations ? (
            <div
              className="flex flex-1 flex-col items-center
                justify-center p-8 text-center"
            >
              <LoaderCircle
                size={36}
                className="animate-spin text-blue-600"
              />

              <p className="mt-3 text-sm text-slate-500">
                Loading messages...
              </p>
            </div>
          ) : pageError ? (
            <div
              className="flex flex-1 flex-col items-center
                justify-center p-8 text-center"
            >
              <AlertCircle
                size={42}
                className="text-amber-500"
              />

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                Messaging is not available yet
              </h2>

              <p className="mt-2 max-w-md text-sm text-slate-500">
                {pageError}
              </p>

              <button
                type="button"
                onClick={() => void loadConversations()}
                className="mt-5 inline-flex items-center gap-2
                  rounded-xl bg-blue-600 px-4 py-2.5
                  text-sm font-semibold text-white
                  hover:bg-blue-700"
              >
                <RefreshCw size={16} />
                Retry
              </button>
            </div>
          ) : !selectedConversation ? (
            <div
              className="flex flex-1 flex-col items-center
                justify-center p-8 text-center"
            >
              <MessageCircle
                size={44}
                className="text-slate-300"
              />

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                No conversations yet
              </h2>

              <p className="mt-2 max-w-md text-sm text-slate-500">
                Conversations will appear here when a recruiter or
                hiring manager starts a discussion.
              </p>
            </div>
          ) : (
            <>
              <header
                className="flex items-center justify-between
                  border-b border-slate-200 p-4 sm:px-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center
                      justify-center rounded-full bg-blue-100
                      text-blue-700"
                  >
                    <UserRound size={22} />
                  </div>

                  <div className="min-w-0">
                    <h2
                      className="truncate text-sm font-bold
                        text-slate-900 sm:text-base"
                    >
                      {selectedConversation.participantName}
                    </h2>

                    <p className="truncate text-xs text-slate-500">
                      {selectedConversation.participantRole ||
                        selectedConversation.participantEmail ||
                        "Recruitment team"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled
                  aria-label="Conversation options"
                  className="flex h-10 w-10 items-center
                    justify-center rounded-xl text-slate-400"
                >
                  <MoreVertical size={20} />
                </button>
              </header>

              <div
                className="flex flex-1 flex-col gap-4
                  overflow-y-auto bg-slate-50 p-4 sm:p-6"
              >
                {isLoadingMessages ? (
                  <div
                    className="flex flex-1 flex-col items-center
                      justify-center"
                  >
                    <LoaderCircle
                      size={30}
                      className="animate-spin text-blue-600"
                    />

                    <p className="mt-3 text-sm text-slate-500">
                      Loading conversation...
                    </p>
                  </div>
                ) : conversationError ? (
                  <div
                    className="flex flex-1 flex-col items-center
                      justify-center text-center"
                  >
                    <AlertCircle
                      size={34}
                      className="text-amber-500"
                    />

                    <p className="mt-3 text-sm text-slate-500">
                      {conversationError}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        selectedConversationId !== null &&
                        void loadConversation(
                          selectedConversationId,
                        )
                      }
                      className="mt-4 inline-flex items-center
                        gap-2 rounded-xl border
                        border-slate-200 bg-white px-4 py-2
                        text-sm font-semibold text-slate-700"
                    >
                      <RefreshCw size={15} />
                      Retry
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <span
                        className="rounded-full bg-white px-3 py-1
                          text-xs text-slate-400 shadow-sm"
                      >
                        Conversation
                      </span>
                    </div>

                    {conversationDetails?.messages.length === 0 ? (
                      <div
                        className="flex flex-1 flex-col items-center
                          justify-center text-center"
                      >
                        <MessageCircle
                          size={36}
                          className="text-slate-300"
                        />

                        <p className="mt-3 text-sm text-slate-500">
                          No messages in this conversation yet.
                        </p>
                      </div>
                    ) : (
                      conversationDetails?.messages.map((message) => {
                        const isCandidate =
                          currentUserId !== null &&
                          message.senderUserId === currentUserId;

                        return (
                          <div
                            key={message.id}
                            className={`flex ${
                              isCandidate
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[85%] rounded-2xl
                                px-4 py-3 sm:max-w-[70%]
                                ${
                                  isCandidate
                                    ? "rounded-br-md bg-blue-600 text-white"
                                    : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                                }`}
                            >
                              <p className="text-sm leading-6">
                                {message.content}
                              </p>

                              <div
                                className={`mt-2 flex items-center
                                  justify-end gap-1 text-[10px]
                                  ${
                                    isCandidate
                                      ? "text-blue-100"
                                      : "text-slate-400"
                                  }`}
                              >
                                <span>
                                  {formatMessageTime(
                                    message.sentAt,
                                  )}
                                </span>

                                {isCandidate && message.isRead && (
                                  <CheckCheck size={13} />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </>
                )}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="flex items-end gap-3 border-t
                  border-slate-200 bg-white p-4"
              >
                <button
                  type="button"
                  disabled
                  aria-label="Attach file"
                  className="flex h-11 w-11 shrink-0 items-center
                    justify-center rounded-xl text-slate-400"
                >
                  <Paperclip size={20} />
                </button>

                <textarea
                  value={newMessage}
                  onChange={(event) =>
                    setNewMessage(event.target.value)
                  }
                  placeholder="Type a message"
                  rows={1}
                  disabled={
                    isSending ||
                    isLoadingMessages ||
                    Boolean(conversationError)
                  }
                  className="min-h-11 flex-1 resize-none
                    rounded-xl border border-slate-200
                    bg-slate-50 px-4 py-3 text-sm
                    outline-none focus:border-blue-500
                    disabled:cursor-not-allowed
                    disabled:opacity-60"
                />

                <button
                  type="submit"
                  disabled={
                    !newMessage.trim() ||
                    isSending ||
                    isLoadingMessages ||
                    Boolean(conversationError)
                  }
                  aria-label="Send message"
                  className="flex h-11 w-11 shrink-0 items-center
                    justify-center rounded-xl bg-blue-600
                    text-white transition hover:bg-blue-700
                    disabled:cursor-not-allowed
                    disabled:bg-slate-300"
                >
                  {isSending ? (
                    <LoaderCircle
                      size={19}
                      className="animate-spin"
                    />
                  ) : (
                    <Send size={19} />
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}