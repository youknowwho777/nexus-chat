import { useEffect, useMemo, useRef, useState } from "react";
import { initialChats, sendMessageAsync } from "../data/chats.js";

const chatBackground = "/phase-1/chat-page/chat-background.png";
const chatLogo = "/phase-1/chat-page/chat-logo.png";

function ProfileMark({ className = "" }){
  return (
    <div
      className={`aspect-square flex-shrink-0 rounded-full bg-gradient-to-br from-[#4da3ff] to-[#8a5cff] ${className}`}
      aria-hidden="true"
    />
  );
}

export default function ChatPage({ onSettingsClick }){
  const [chats, setChats] = useState(initialChats);
  const [activeChat, setActiveChat] = useState("");
  const [searchText, setSearchText] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const messageListRef = useRef(null);

  const chatNames = useMemo(function(){
    const normalizedSearch = searchText.trim().toLowerCase();

    return Object.keys(chats).filter(function(name){
      const chat = chats[name];

      return name.toLowerCase().includes(normalizedSearch)
        || chat.preview.toLowerCase().includes(normalizedSearch);
    });
  }, [chats, searchText]);

  const selectedChat = activeChat ? chats[activeChat] : null;

  useEffect(function(){
    if(messageListRef.current){
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [activeChat, selectedChat?.messages.length]);

  function handleChatSelect(name){
    setActiveChat(name);
    setIsMobileChatOpen(true);
  }

  async function handleMessageSubmit(event){
    event.preventDefault();

    const trimmedMessage = messageText.trim();
    const targetChat = activeChat;

    if(!trimmedMessage || !targetChat || isSending){
      return;
    }

    setMessageText("");
    setIsSending(true);
    const sentMessage = await sendMessageAsync(trimmedMessage);

    setChats(function(currentChats){
      const currentChat = currentChats[targetChat];

      return {
        ...currentChats,
        [targetChat]: {
          ...currentChat,
          preview: sentMessage.text,
          messages: [...currentChat.messages, sentMessage]
        }
      };
    });
    setIsSending(false);
  }

  function handleSettingsClick(event){
    event.preventDefault();
    onSettingsClick();
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat font-sans text-white before:absolute before:inset-0 before:bg-[rgba(3,8,20,0.55)] before:content-['']"
      style={{ backgroundImage: `url(${chatBackground})` }}
    >
      <div className="relative z-10 flex h-[100dvh] min-h-screen flex-col">
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
            className="flex h-[45px] w-[45px] flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-[22px] text-white no-underline transition duration-300 hover:rotate-[60deg] hover:bg-white/15 max-[380px]:h-10 max-[380px]:w-10 max-[380px]:text-[19px]"
          >
            ⚙
          </a>
        </header>

        <div className={`flex min-h-0 flex-1 overflow-hidden max-[700px]:block max-[700px]:overflow-visible ${isMobileChatOpen ? "max-[700px]:[&_.chat-area]:flex max-[700px]:[&_.sidebar]:hidden" : ""}`}>
          <aside className="sidebar flex w-[clamp(280px,32vw,360px)] min-w-0 flex-col border-r border-white/10 bg-[rgba(8,18,40,0.45)] p-[clamp(12px,2vw,16px)] backdrop-blur-[18px] max-[900px]:w-[45%] max-[900px]:min-w-[260px] max-[700px]:min-h-[calc(100dvh-68px)] max-[700px]:w-full max-[700px]:min-w-0 max-[700px]:border-r-0">
            <div className="mb-[15px]">
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
              {chatNames.map(function(name){
                const chat = chats[name];
                const isActive = activeChat === name;

                return (
                  <button
                    key={name}
                    type="button"
                    onClick={function(){
                      handleChatSelect(name);
                    }}
                    className={`mb-2 flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-[14px] border-0 p-3 text-left text-white transition duration-300 hover:translate-x-[3px] hover:bg-white/10 max-[380px]:p-2.5 ${isActive ? "bg-[rgba(77,140,255,0.22)]" : "bg-transparent"}`}
                  >
                    <ProfileMark className="w-[50px] max-[380px]:w-11" />
                    <div className="min-w-0">
                      <h4 className="mb-1 overflow-hidden text-ellipsis whitespace-nowrap text-base font-semibold">
                        {name === "Siddu" ? "Siddu (You)" : name}
                      </h4>
                      <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[0.85rem] text-[#c2c9d9]">
                        {chat.preview}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

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
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <button
                    type="button"
                    aria-label="Back to chat list"
                    title="Back"
                    onClick={function(){
                      setIsMobileChatOpen(false);
                    }}
                    className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-0 bg-white/10 text-lg text-white max-[700px]:flex"
                  >
                    ←
                  </button>
                  <ProfileMark className="w-[50px]" />
                  <div className="min-w-0 text-left">
                    <h3 className="mb-[3px] text-[1.1rem] font-semibold">
                      {activeChat}
                    </h3>
                    <p className="text-[0.85rem] text-[#c2c9d9]">
                      {selectedChat.status}
                    </p>
                  </div>
                </div>

                <div
                  ref={messageListRef}
                  className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto py-[18px]"
                >
                  {selectedChat.messages.map(function(message, index){
                    const isSent = message.type === "sent";

                    return (
                      <div
                        key={`${message.type}-${message.text}-${index}`}
                        className={`max-w-[min(75%,520px)] rounded-[14px] px-3.5 py-3 text-left leading-[1.4] ${isSent ? "self-end bg-[#2563eb]" : "self-start bg-white/10"}`}
                      >
                        {message.text}
                      </div>
                    );
                  })}
                </div>

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
                    className="w-12 rounded-xl border-0 bg-[#2563eb] text-[17px] text-white disabled:cursor-not-allowed disabled:opacity-75"
                  >
                    ➤
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
