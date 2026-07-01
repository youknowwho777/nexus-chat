const chatBackground = "/phase-1/chat-page/chat-background.png";

const settingsItems = [
  {
    icon: "👤",
    label: "Profile"
  },
  {
    icon: "✉",
    label: "Change Email"
  },
  {
    icon: "🔒",
    label: "Change Password"
  },
  {
    icon: "▧",
    label: "Change Background"
  },
  {
    icon: "◐",
    label: "Theme"
  },
  {
    icon: "AI",
    label: "AI Preferences"
  },
  {
    icon: "↪",
    label: "Logout"
  }
];

export default function SettingsPage({ onBackClick, onLogoutClick }){
  function handleBackClick(event){
    event.preventDefault();
    onBackClick();
  }

  function handleItemClick(label){
    if(label === "Logout"){
      onLogoutClick();
    }
  }

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-[clamp(16px,4vw,30px)] pb-[30px] pt-[clamp(80px,12vh,110px)] font-sans text-white before:fixed before:inset-0 before:bg-[rgba(3,8,20,0.60)] before:content-['']"
      style={{ backgroundImage: `url(${chatBackground})` }}
    >
      <a
        href="/chat"
        onClick={handleBackClick}
        aria-label="Back to chat"
        title="Back"
        className="absolute left-[clamp(16px,4vw,25px)] top-[clamp(16px,4vw,25px)] z-10 flex h-[clamp(44px,8vw,50px)] w-[clamp(44px,8vw,50px)] items-center justify-center rounded-full bg-white/10 text-[clamp(19px,4vw,22px)] text-white no-underline backdrop-blur-[15px] transition duration-300 hover:-translate-x-1 hover:bg-white/15"
      >
        ←
      </a>

      <main className="relative z-10 w-[min(100%,500px)] rounded-[20px] border border-white/10 bg-[rgba(8,18,40,0.45)] p-[clamp(20px,5vw,30px)] backdrop-blur-[20px]">
        <div className="mb-[25px] text-center">
          <h1 className="text-[clamp(1.6rem,5vw,2rem)] font-semibold">
            Nexus Settings
          </h1>
        </div>

        <div>
          {settingsItems.map(function(item){
            return (
              <button
                key={item.label}
                type="button"
                onClick={function(){
                  handleItemClick(item.label);
                }}
                className="mb-3 flex w-full items-center gap-[15px] rounded-xl border-0 bg-white/5 p-[clamp(14px,4vw,18px)] text-left text-white transition duration-300 hover:translate-x-[5px] hover:bg-white/10 max-[380px]:gap-3"
              >
                <span className="w-[25px] flex-shrink-0 text-center text-xl" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[clamp(0.95rem,3vw,1rem)]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
