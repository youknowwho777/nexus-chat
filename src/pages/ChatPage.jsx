import { useEffect, useMemo, useRef, useState } from "react";
import { Settings } from "lucide-react";
import { fetchUsers } from "../services/userApi.js";
import { fetchConversation, sendMessage } from "../services/messageApi.js";

const backgrounds = {
  space: "/phase-1/chat-page/chat-background.png",
  login: "/phase-1/login-page/login-background.png",
  aurora: "/phase-1/login-page/alternate-background.png"
};

const chatLogo = "/phase-1/chat-page/chat-logo.png";

const themeStyles = {
  blue: {
    sent: "bg-[#2563eb]",
    active: "bg-[rgba(77,140,255,0.22)]",
    mark: "from-[#4da3ff] to-[#8a5cff]"
  },
  green: {
    sent: "bg-[#0f766e]",
    active: "bg-[rgba(45,212,191,0.20)]",
    mark: "from-[#2dd4bf] to-[#22c55e]"
  },
  rose: {
    sent: "bg-[#be185d]",
    active: "bg-[rgba(244,114,182,0.20)]",
    mark: "from-[#fb7185] to-[#a855f7]"
  }
};

function ProfileMark({ className = "", label = "", themeStyle }) {
  const initials = (label || "User")
    .split(" ")
    .map(function (part) {
      return part.charAt(0);
    })
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`flex aspect-square flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${themeStyle.mark} ${className} text-sm font-bold text-white`}
      aria-hidden="true"
    >
      {initials || "N"}
    </div>
  );
}

export default function ChatPage({
  currentUser,
  settings,
  onSettingsClick
}) {
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  const messageListRef = useRef(null);
  const themeStyle = themeStyles[settings.theme] || themeStyles.blue;
  const backgroundImage = backgrounds[settings.background] || backgrounds.space;

  // Load real registered users from MongoDB
  useEffect(function () {
    let isMounted = true;
    setIsLoadingContacts(true);

    fetchUsers()
      .then(function (usersList) {
        if (!isMounted) return;
        // Filter out current user from contacts
        const otherUsers = (usersList || []).filter(function (u) {
          return u.id !== currentUser?.id && u.email !== currentUser?.email;
        });
        setContacts(otherUsers);
      })
      .catch(function (error) {
        console.warn("Could not load contacts:", error.message);
      })
      .finally(function () {
        if (isMounted) setIsLoadingContacts(false);
      });

    return function () {
      isMounted = false;
    };
  }, [currentUser?.id, currentUser?.email]);

  // Load conversation messages from MongoDB when activeContact changes
  useEffect(function () {
    if (!activeContact) {
      setMessages([]);
      return;
    }

    let isMounted = true;
    setIsLoadingMessages(true);

    fetchConversation(activeContact.id)
      .then(function (chatHistory) {
        if (isMounted) {
          setMessages(chatHistory || []);
        }
      })
      .catch(function (error) {
        console.warn("Could not load conversation:", error.message);
        if (isMounted) setMessages([]);
      })
      .finally(function () {
        if (isMounted) setIsLoadingMessages(false);
      });

    return function () {
      isMounted = false;
    };
  }, [activeContact]);

  // Auto-scroll to bottom of conversation
  useEffect(function () {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages.length, activeContact]);

  const filteredContacts = useMemo(function () {
    const query = searchText.trim().toLowerCase();
    if (!query) return contacts;
    return contacts.filter(function (c) {
      return (
        c.username.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query)
      );
    });
  }, [contacts, searchText]);

  function handleContactSelect(contact) {
    setActiveContact(contact);
    setIsMobileChatOpen(true);
  }

  async function handleMessageSubmit(event) {
    event.preventDefault();

    const trimmed = messageText.trim();
    if (!trimmed || !activeContact || isSending) {
      return;
    }

    setMessageText("");
    setIsSending(true);

    try {
      const savedMessage = await sendMessage({
        receiverId: activeContact.id,
        content: trimmed
      });

      if (savedMessage) {
        setMessages(function (prev) {
          return [...prev, savedMessage];
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error.message);
    } finally {
      setIsSending(false);
    }
  }

  function handleSettingsClick(event) {
    event.preventDefault();
    onSettingsClick();
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat font-sans text-white before:absolute before:inset-0 before:bg-[rgba(3,8,20,0.55)] before:content-['']"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="relative z-10 flex h-[100dvh] min-h-screen flex-col">
        {/* Header */}
        <header className="flex min-h-[72px] items-center justify-between gap-[18px] border-b border-white/10 bg-[rgba(5,15,35,0.55)] px-[clamp(14px,3vw,25px)] backdrop-blur-[15px] max-[700px]:min-h-[68px]">
          <div className="flex min-w-0 items-center gap-3 max-[380px]:gap-2">
            <img
              src={chatLogo}
              alt="Nexus Chat Logo"
              className="aspect-square w-[clamp(44px,6vw,52px)] rounded-full object-cover transition duration-300 hover:scale-110"
            />
            <div className="flex flex-col">
              <h2 className="whitespace-nowrap text-[clamp(1.05rem,3vw,1.4rem)] font-semibold">
                Nexus Chat
              </h2>
              <span className="text-[0.75rem] text-[#bfc6d8]">
                Logged in as <strong className="text-white">{currentUser?.name || settings.displayName}</strong>
              </span>
            </div>
          </div>

          <a
            href="/settings"
            onClick={handleSettingsClick}
            aria-label="Open settings"
            title="Settings"
            className="group flex h-[45px] w-[45px] flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white no-underline transition duration-300 hover:bg-white/15 max-[380px]:h-10 max-[380px]:w-10"
          >
            <Settings
              size={32}
              className="transition-transform duration-300 group-hover:rotate-[60deg]"
            />
          </a>
        </header>

        {/* Chat Body */}
        <div
          className={`flex min-h-0 flex-1 overflow-hidden max-[700px]:block max-[700px]:overflow-visible ${
            isMobileChatOpen
              ? "max-[700px]:[&_.chat-area]:flex max-[700px]:[&_.sidebar]:hidden"
              : ""
          }`}
        >
          {/* Sidebar */}
          <aside className="sidebar flex w-[clamp(280px,32vw,360px)] min-w-0 flex-col border-r border-white/10 bg-[rgba(8,18,40,0.45)] p-[clamp(12px,2vw,16px)] backdrop-blur-[18px] max-[900px]:w-[45%] max-[900px]:min-w-[260px] max-[700px]:min-h-[calc(100dvh-68px)] max-[700px]:w-full max-[700px]:min-w-0 max-[700px]:border-r-0">
            <div className="mb-[15px]">
              <input
                id="chat-search"
                type="text"
                value={searchText}
                placeholder="Search registered users..."
                onChange={function (event) {
                  setSearchText(event.target.value);
                }}
                className="w-full rounded-xl border-none bg-white/10 px-[15px] py-3 text-[0.95rem] text-white outline-none placeholder:text-[#bfc6d8]"
              />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-color:#4d8cff_transparent] [scrollbar-width:thin]">
              {isLoadingContacts ? (
                <p className="px-3 py-6 text-center text-sm text-[#c2c9d9]">
                  Loading contacts from database...
                </p>
              ) : filteredContacts.length > 0 ? (
                filteredContacts.map(function (contact) {
                  const isActive = activeContact?.id === contact.id;

                  return (
                    <button
                      key={contact.id}
                      type="button"
                      onClick={function () {
                        handleContactSelect(contact);
                      }}
                      className={`mb-2 flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-[14px] border-0 p-3 text-left text-white transition duration-300 hover:translate-x-[3px] hover:bg-white/10 max-[380px]:p-2.5 ${
                        isActive ? themeStyle.active : "bg-transparent"
                      }`}
                    >
                      <ProfileMark
                        className="w-[50px] max-[380px]:w-11"
                        label={contact.username}
                        themeStyle={themeStyle}
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-base font-semibold">
                          {contact.username}
                        </h4>
                        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[0.8rem] text-[#c2c9d9]">
                          {contact.email}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-8 text-center text-sm text-[#c2c9d9]">
                  {searchText ? (
                    <p>No contacts match your search.</p>
                  ) : (
                    <div>
                      <p className="font-semibold text-white">No other users found</p>
                      <p className="mt-1 text-xs text-[#a0aec0]">
                        Create a second account in another tab/browser to start a real chat!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </aside>

          {/* Main Chat Area */}
          <main className="chat-area flex min-w-0 flex-1 flex-col p-[clamp(22px,4vw,40px)] max-[700px]:hidden max-[700px]:min-h-[calc(100dvh-68px)]">
            {!activeContact ? (
              <div className="m-auto max-w-[600px] text-center max-[900px]:max-w-[420px]">
                <h1 className="mb-[15px] text-[clamp(2rem,5vw,3rem)] font-semibold">
                  Welcome to Nexus Chat
                </h1>
                <p className="mb-2.5 text-[clamp(0.95rem,2vw,1.1rem)] text-[#d2d8e5]">
                  Real-time database-backed communication
                </p>
                <p className="text-[clamp(0.85rem,1.5vw,1rem)] text-[#a0aec0]">
                  Select a contact from the sidebar to load your conversation.
                </p>
              </div>
            ) : (
              <div className="flex h-full min-h-0 w-full flex-col">
                {/* Active Contact Header */}
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <button
                    type="button"
                    aria-label="Back to contacts list"
                    title="Back"
                    onClick={function () {
                      setIsMobileChatOpen(false);
                    }}
                    className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-0 bg-white/10 text-lg text-white max-[700px]:flex"
                  >
                    &lt;
                  </button>
                  <ProfileMark
                    className="w-[50px]"
                    label={activeContact.username}
                    themeStyle={themeStyle}
                  />
                  <div className="min-w-0 text-left">
                    <h3 className="mb-[3px] text-[1.1rem] font-semibold">
                      {activeContact.username}
                    </h3>
                    <p className="text-[0.85rem] text-[#c2c9d9]">
                      {activeContact.email}
                    </p>
                  </div>
                </div>

                {/* Message History List */}
                <div
                  ref={messageListRef}
                  className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto py-[18px]"
                >
                  {isLoadingMessages ? (
                    <div className="m-auto text-sm text-[#c2c9d9]">
                      Loading messages from MongoDB...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="m-auto text-center text-sm text-[#c2c9d9]">
                      <p>No messages yet.</p>
                      <p className="text-xs text-[#a0aec0]">Say hello to {activeContact.username}!</p>
                    </div>
                  ) : (
                    messages.map(function (message, index) {
                      const senderId = typeof message.senderId === "object" ? message.senderId._id : message.senderId;
                      const isSent = senderId === currentUser?.id;

                      return (
                        <div
                          key={message._id || message.id || index}
                          className={`max-w-[min(75%,520px)] rounded-[14px] px-3.5 py-3 text-left leading-[1.4] ${
                            isSent
                              ? `self-end ${themeStyle.sent}`
                              : "self-start bg-white/10"
                          }`}
                        >
                          <p className="break-words">{message.content || message.text}</p>
                          {message.createdAt && (
                            <span className="mt-1 block text-right text-[10px] text-white/60">
                              {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Message Input Form */}
                <form
                  onSubmit={handleMessageSubmit}
                  className="flex gap-2.5 border-t border-white/10 pt-3.5"
                >
                  <input
                    type="text"
                    value={messageText}
                    placeholder="Type a message..."
                    autoComplete="off"
                    onChange={function (event) {
                      setMessageText(event.target.value);
                    }}
                    className="min-w-0 flex-1 rounded-xl border-0 bg-white/10 px-[15px] py-[13px] text-[0.95rem] text-white outline-none placeholder:text-[#bfc6d8]"
                  />
                  <button
                    type="submit"
                    disabled={isSending || !messageText.trim()}
                    aria-label="Send message"
                    title="Send"
                    className={`w-14 rounded-xl border-0 ${themeStyle.sent} text-[12px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-75`}
                  >
                    {isSending ? "..." : "SEND"}
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
