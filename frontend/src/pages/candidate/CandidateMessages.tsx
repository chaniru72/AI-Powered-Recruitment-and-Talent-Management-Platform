import {
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  CheckCheck,
  MessageCircle,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  UserRound,
} from "lucide-react";

interface Conversation {
  id: number;
  name: string;
  role: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface ChatMessage {
  id: number;
  conversationId: number;
  content: string;
  time: string;
  sender: "candidate" | "recruiter";
}

const initialConversations: Conversation[] = [
  {
    id: 1,
    name: "Sarah Fernando",
    role: "Recruiter · TechNova",
    lastMessage: "Your interview has been scheduled.",
    time: "10:30 AM",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Daniel Perera",
    role: "Hiring Manager · Vertex Labs",
    lastMessage: "Thank you for submitting your application.",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: "Maya Silva",
    role: "Recruiter · CloudCore",
    lastMessage: "Could you send your updated résumé?",
    time: "18 Jul",
    unread: 0,
    online: true,
  },
];

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    conversationId: 1,
    content:
      "Hello! We reviewed your application for the Frontend Developer position.",
    time: "10:15 AM",
    sender: "recruiter",
  },
  {
    id: 2,
    conversationId: 1,
    content:
      "Thank you for the update. I am very interested in the opportunity.",
    time: "10:18 AM",
    sender: "candidate",
  },
  {
    id: 3,
    conversationId: 1,
    content:
      "Great! Your online interview has been scheduled for tomorrow at 2:00 PM.",
    time: "10:30 AM",
    sender: "recruiter",
  },
  {
    id: 4,
    conversationId: 2,
    content:
      "Thank you for submitting your application. Our team will review it soon.",
    time: "Yesterday",
    sender: "recruiter",
  },
  {
    id: 5,
    conversationId: 3,
    content:
      "Could you send your updated résumé before the interview?",
    time: "18 Jul",
    sender: "recruiter",
  },
];

export default function CandidateMessages() {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);

  const [messages, setMessages] =
    useState<ChatMessage[]>(initialMessages);

  const [selectedConversationId, setSelectedConversationId] =
    useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const selectedConversation = conversations.find(
    (conversation) =>
      conversation.id === selectedConversationId,
  );

  const filteredConversations = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return conversations.filter((conversation) => {
      return (
        conversation.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        conversation.role
          .toLowerCase()
          .includes(normalizedSearch)
      );
    });
  }, [conversations, searchTerm]);

  const selectedMessages = messages.filter(
    (message) =>
      message.conversationId === selectedConversationId,
  );

  function selectConversation(conversationId: number) {
    setSelectedConversationId(conversationId);

    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              unread: 0,
            }
          : conversation,
      ),
    );
  }

  function handleSendMessage(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedMessage = newMessage.trim();

    if (!trimmedMessage || !selectedConversation) {
      return;
    }

    const currentTime = new Intl.DateTimeFormat(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      },
    ).format(new Date());

    const message: ChatMessage = {
      id: Date.now(),
      conversationId: selectedConversation.id,
      content: trimmedMessage,
      time: currentTime,
      sender: "candidate",
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      message,
    ]);

    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.id === selectedConversation.id
          ? {
              ...conversation,
              lastMessage: trimmedMessage,
              time: currentTime,
            }
          : conversation,
      ),
    );

    setNewMessage("");
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

          <div className="max-h-[360px] overflow-y-auto md:max-h-[575px]">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle
                  size={30}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm text-slate-500">
                  No conversations found.
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

                      {conversation.online && (
                        <span
                          className="absolute bottom-0 right-0
                            h-3 w-3 rounded-full border-2
                            border-white bg-emerald-500"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className="truncate text-sm font-bold
                            text-slate-900"
                        >
                          {conversation.name}
                        </p>

                        <span
                          className="shrink-0 text-[11px]
                            text-slate-400"
                        >
                          {conversation.time}
                        </span>
                      </div>

                      <p
                        className="mt-0.5 truncate text-xs
                          text-slate-500"
                      >
                        {conversation.role}
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <p
                          className="min-w-0 flex-1 truncate
                            text-xs text-slate-500"
                        >
                          {conversation.lastMessage}
                        </p>

                        {conversation.unread > 0 && (
                          <span
                            className="flex h-5 min-w-5
                              items-center justify-center
                              rounded-full bg-blue-600 px-1
                              text-[10px] font-bold text-white"
                          >
                            {conversation.unread}
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
          {selectedConversation ? (
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
                      {selectedConversation.name}
                    </h2>

                    <p className="truncate text-xs text-slate-500">
                      {selectedConversation.role}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Conversation options"
                  className="flex h-10 w-10 items-center
                    justify-center rounded-xl text-slate-500
                    transition hover:bg-slate-100"
                >
                  <MoreVertical size={20} />
                </button>
              </header>

              <div
                className="flex flex-1 flex-col gap-4
                  overflow-y-auto bg-slate-50 p-4 sm:p-6"
              >
                <div className="text-center">
                  <span
                    className="rounded-full bg-white px-3 py-1
                      text-xs text-slate-400 shadow-sm"
                  >
                    Conversation started
                  </span>
                </div>

                {selectedMessages.map((message) => {
                  const isCandidate =
                    message.sender === "candidate";

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
                          className={`mt-1.5 flex items-center
                            justify-end gap-1 text-[10px]
                            ${
                              isCandidate
                                ? "text-blue-100"
                                : "text-slate-400"
                            }`}
                        >
                          <span>{message.time}</span>

                          {isCandidate && (
                            <CheckCheck size={13} />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="border-t border-slate-200 bg-white p-4"
              >
                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    aria-label="Attach file"
                    className="flex h-11 w-11 shrink-0 items-center
                      justify-center rounded-xl text-slate-500
                      transition hover:bg-slate-100"
                  >
                    <Paperclip size={20} />
                  </button>

                  <textarea
                    rows={1}
                    value={newMessage}
                    onChange={(event) =>
                      setNewMessage(event.target.value)
                    }
                    placeholder="Type your message..."
                    className="max-h-32 min-h-11 flex-1 resize-none
                      rounded-xl border border-slate-200
                      bg-slate-50 px-4 py-3 text-sm
                      text-slate-900 outline-none
                      transition focus:border-blue-500
                      focus:bg-white focus:ring-4
                      focus:ring-blue-100"
                  />

                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="flex h-11 w-11 shrink-0 items-center
                      justify-center rounded-xl bg-blue-600
                      text-white transition hover:bg-blue-700
                      disabled:cursor-not-allowed
                      disabled:opacity-50"
                  >
                    <Send size={19} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div
              className="flex flex-1 items-center justify-center
                p-8 text-center"
            >
              <div>
                <MessageCircle
                  size={42}
                  className="mx-auto text-slate-300"
                />

                <h2
                  className="mt-4 text-lg font-bold text-slate-900"
                >
                  Select a conversation
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Choose a conversation to view its messages.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}