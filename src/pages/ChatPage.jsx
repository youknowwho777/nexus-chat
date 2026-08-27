import { useEffect, useMemo, useRef, useState } from "react";
import { sendMessageAsync } from "../data/chats.js";
import { Settings } from "lucide-react";

// Chat page responsibilities:
// layout, chat search, selected chat, messages, themes, and settings.

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

// Small avatar made from a chat name.

function ProfileMark({ className = "", label = "", themeStyle }){
  // Default values avoid undefined props.
  const initials = label
    // Take the first letters and keep at most 2.
    .split(" ") 
    .map(function(part){
      return part.charAt(0);  
    })
    .join("")  
    .slice(0, 2)  
    .toUpperCase();
    // Example: Siddu => S, Rishi Chand => RC.

  return (
    <div
      className={`flex aspect-square flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${themeStyle.mark} ${className} text-sm font-bold text-white`}
      aria-hidden="true"
    >
      {initials || "N"} 
    </div>
  );
}

export default function ChatPage({ // Props come from App.jsx.
  chats, // Chat data.
  settings, // User theme, background, and name.
  setChats, // Updates chats without directly mutating state.
  onSettingsClick // App handles settings navigation.
}){
  // State stores values that change while using the page.
  const [activeChat, setActiveChat] = useState("");
  const [searchText, setSearchText] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  
  const messageListRef = useRef(null); // Used to scroll to the latest message.
  const themeStyle = themeStyles[settings.theme] || themeStyles.blue; // Pick theme or fall back to blue.

  const backgroundImage = backgrounds[settings.background] || backgrounds.space; // Pick background or fall back to space.

  const chatNames = useMemo(function(){ 
    const normalizedSearch = searchText.trim().toLowerCase();
    // Return chats that match name or preview text.
    return Object.keys(chats).filter(function(name){
      const chat = chats[name];
      return name.toLowerCase().includes(normalizedSearch)
        || chat.preview.toLowerCase().includes(normalizedSearch);
    });
  }, [chats, searchText]);  
  // Recalculate only when chats or search text changes.

  const selectedChat = activeChat ? chats[activeChat] : null; 
  // selectedChat is the open chat, or null if none is selected.

  useEffect(function(){
    if(activeChat && !chats[activeChat]){
      // Clear selection if the active chat no longer exists.
      setActiveChat("");

      setIsMobileChatOpen(false); // Return mobile view to the chat list.
    }
  }, [activeChat, chats]); 

  useEffect(function(){ // Auto-scroll when opening a chat or adding a message.
    if(messageListRef.current){
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      // scrollHeight is the full message list height.
    }
  }, [activeChat, selectedChat?.messages.length]);
  // Dependencies: selected chat changed or message count changed.

  function handleChatSelect(name){ // Runs when a chat is selected.
    setActiveChat(name);
    setIsMobileChatOpen(true); // On mobile, open the chat panel.
  }

  async function handleMessageSubmit(event){
    event.preventDefault(); // Stop form submit from refreshing the page.

    // Save the target chat in case the user switches chats while sending.
    const trimmedMessage = messageText.trim(); 
    const targetChat = activeChat;

    if(!trimmedMessage || !targetChat || isSending){
      // Stop empty messages, missing chats, or double sends.
      return;
    }

    setMessageText(""); // Clear input after send starts.
    setIsSending(true); // Prevent multiple sends at once.

    try {
      const sentMessage = await sendMessageAsync(trimmedMessage);
      // Temporary helper now; backend will send messages later.

      setChats(function(currentChats){ // Build the next chats state.
        const currentChat = currentChats[targetChat];

        if(!currentChat){
          return currentChats;
        }
        // React state should be copied, then updated.

        return {
          ...currentChats, // Keep other chats the same.
          [targetChat]: {
            ...currentChat, // Keep old data for this chat.
            preview: sentMessage.text, // Show latest text in sidebar.
            messages: [...currentChat.messages, sentMessage] // Add new message.
          }
        };
      });
    } finally {
      setIsSending(false);
    }
  }

  function handleSettingsClick(event){
    event.preventDefault(); // Use React navigation.
    onSettingsClick(); // App handles where to go.
  }

  return (
    <div
    className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat font-sans text-white before:absolute before:inset-0 before:bg-[rgba(3,8,20,0.55)] before:content-['']"
    style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Background image container. */}
      {/* Main page layout from top to bottom. */}
      <div className="relative z-10 flex h-[100dvh] min-h-screen flex-col">
      {/* Header: logo, app name, and settings. */}
        <header className="flex min-h-[72px] items-center justify-between gap-[18px] border-b border-white/10 bg-[rgba(5,15,35,0.55)] px-[clamp(14px,3vw,25px)] backdrop-blur-[15px] max-[700px]:min-h-[68px]">
          <div className="flex min-w-0 items-center gap-3 max-[380px]:gap-2">
            <img
              src={chatLogo}
              alt="Nexus Chat Logo"
              className="aspect-square w-[clamp(44px,6vw,52px)] rounded-full object-cover transition duration-300 hover:scale-110"
            />
            <h2 className="whitespace-nowrap text-[clamp(1.05rem,3vw,1.4rem)] font-semibold">
              Nexus Chat
            </h2>
          </div>

          <a
            href="/settings"
            onClick={handleSettingsClick}
            aria-label="Open settings"
            title="Settings"
            className="group flex h-[45px] w-[45px] flex-shrink-0 items-center justify-center rounded-full
             bg-white/10 text-white no-underline
             transition duration-300 hover:bg-white/15 max-[380px]:h-10 max-[380px]:w-10"
            >
            <Settings
              size={32}
              className="transition-transform duration-300 group-hover:rotate-[60deg]"
            />
          </a>
        </header>

        <div className={`flex min-h-0 flex-1 overflow-hidden max-[700px]:block max-[700px]:overflow-visible ${isMobileChatOpen ? "max-[700px]:[&_.chat-area]:flex max-[700px]:[&_.sidebar]:hidden" : ""}`}>
          <aside className="sidebar flex w-[clamp(280px,32vw,360px)] min-w-0 flex-col border-r border-white/10 bg-[rgba(8,18,40,0.45)] p-[clamp(12px,2vw,16px)] backdrop-blur-[18px] max-[900px]:w-[45%] max-[900px]:min-w-[260px] max-[700px]:min-h-[calc(100dvh-68px)] max-[700px]:w-full max-[700px]:min-w-0 max-[700px]:border-r-0">
            <div className="mb-[15px]">
              {/* Sidebar search input. */}
              <input
                id="chat-search"
                type="text"
                value={searchText}
                placeholder="Search chats..."
                onChange={function(event){
                  setSearchText(event.target.value);
                }}
                className="w-full rounded-xl border-none bg-white/10 px-[15px] py-3 text-[0.95rem] text-white outline-none placeholder:text-[#bfc6d8]"
              />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-color:#4d8cff_transparent] [scrollbar-width:thin]">
              {/* Render chat list in the sidebar. */}
              {chatNames.map(function(name){
                const chat = chats[name];
                const isActive = activeChat === name;
                const displayName = name === "Siddu" ? `${settings.displayName} (You)` : name;

                return (
                  <button
                    key={name}
                    type="button"
                    onClick={function(){
                      handleChatSelect(name);
                    }}
                    className={`mb-2 flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-[14px] border-0 p-3 text-left text-white transition duration-300 hover:translate-x-[3px] hover:bg-white/10 max-[380px]:p-2.5 ${isActive ? themeStyle.active : "bg-transparent"}`}
                  >
                    <ProfileMark
                      className="w-[50px] max-[380px]:w-11"
                      label={displayName}
                      themeStyle={themeStyle}
                    />
                    <div className="min-w-0">
                      <h4 className="mb-1 overflow-hidden text-ellipsis whitespace-nowrap text-base font-semibold">
                        {displayName}
                      </h4>
                      <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[0.85rem] text-[#c2c9d9]">
                        {chat.preview}
                      </p>
                    </div>
                  </button>
                );
              })}

              {chatNames.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-[#c2c9d9]">
                  No chats match your search.
                </p>
              ) : null}
            </div>
          </aside>
          {/* Main chat area. */}
          <main className="chat-area flex min-w-0 flex-1 flex-col p-[clamp(22px,4vw,40px)] max-[700px]:hidden max-[700px]:min-h-[calc(100dvh-68px)]">
            {!selectedChat ? (
              <div className="m-auto max-w-[600px] text-center max-[900px]:max-w-[420px]">
                <h1 className="mb-[15px] text-[clamp(2rem,5vw,3rem)] font-semibold">
                  Welcome to Nexus Chat
                </h1>
                <p className="mb-2.5 text-[clamp(0.95rem,2vw,1.1rem)] text-[#d2d8e5]">
                  Connect Beyond Boundaries
                </p>
                <p className="mb-2.5 text-[clamp(0.95rem,2vw,1.1rem)] text-[#d2d8e5]">
                  Select a friend and start chatting.
                </p>
              </div>
            ) : (
              <div className="flex h-full min-h-0 w-full flex-col">
                {/* Chat header for the open conversation. */}
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                {/* Mobile back button. */}
                  <button
                    type="button"
                    aria-label="Back to chat list"
                    title="Back"
                    onClick={function(){
                      setIsMobileChatOpen(false);
                    }}
                    className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-0 bg-white/10 text-lg text-white max-[700px]:flex"
                  >
                    &lt;
                  </button>
                  <ProfileMark
                    className="w-[50px]"
                    label={activeChat}
                    themeStyle={themeStyle}
                  />
                  <div className="min-w-0 text-left">
                    <h3 className="mb-[3px] text-[1.1rem] font-semibold">
                      {activeChat}
                    </h3>
                    <p className="text-[0.85rem] text-[#c2c9d9]">
                      {selectedChat.status}
                    </p>
                  </div>
                </div>

                {/* Scrollable message list. */}
                <div
                  ref={messageListRef}
                  className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto py-[18px]"
                  >

                  {/* Render all messages for the selected chat. */}
                  {selectedChat.messages.map(function(message, index){
                    const isSent = message.type === "sent";

                    return (
                      <div
                        key={message.id || `${message.type}-${message.text}-${index}`}
                        className={`max-w-[min(75%,520px)] rounded-[14px] px-3.5 py-3 text-left leading-[1.4]
                        ${isSent ? `self-end ${themeStyle.sent}` : "self-start bg-white/10"}`}
                      >
                  {/* Sent messages are right, received messages are left. */}
                        {message.text}
                      </div>
                    );
                  })}
                </div>

      {/* Message input and send button. */}
                <form
                  onSubmit={handleMessageSubmit}
                  className="flex gap-2.5 border-t border-white/10 pt-3.5"
                >
                  <input
                    type="text"
                    value={messageText}
                    placeholder="Type a message..."
                    autoComplete="off"
                    onChange={function(event){
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
                    SEND
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
