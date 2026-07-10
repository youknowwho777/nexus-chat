import { useState } from "react";

const chatBackground = "/phase-1/chat-page/chat-background.png";

const themeOptions = [
  {
    value: "blue",
    label: "Blue"
  },
  {
    value: "green",
    label: "Green"
  },
  {
    value: "rose",
    label: "Rose"
  }
];

const backgroundOptions = [
  {
    value: "space",
    label: "Space"
  },
  {
    value: "login",
    label: "Login"
  },
  {
    value: "aurora",
    label: "Aurora"
  }
];

export default function SettingsPage({
  currentUser,
  settings,
  onSettingsChange,
  onBackClick,
  onLogoutClick
}){
  const [draftSettings, setDraftSettings] = useState(settings);
  const hasChanges = JSON.stringify(draftSettings) !== JSON.stringify(settings);

  function handleBackClick(event){
    event.preventDefault();
    onBackClick();
  }

  function updateDraft(name, value){
    setDraftSettings(function(currentSettings){
      return {
        ...currentSettings,
        [name]: value
      };
    });
  }

  function handleSubmit(event){
    event.preventDefault();
    onSettingsChange({
      ...draftSettings,
      displayName: draftSettings.displayName.trim() || settings.displayName,
      email: draftSettings.email.trim() || settings.email
    });
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
        &lt;
      </a>

      <main className="relative z-10 w-[min(100%,560px)] rounded-[20px] border border-white/10 bg-[rgba(8,18,40,0.45)] p-[clamp(20px,5vw,30px)] backdrop-blur-[20px]">
        <div className="mb-[25px] text-center">
          <h1 className="text-[clamp(1.6rem,5vw,2rem)] font-semibold">
            Nexus Settings
          </h1>
          <p className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-[#c2c9d9]">
            {currentUser?.email || settings.email}
          </p>
        </div>

        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#d2d8e5]">Profile name</span>
            <input
              type="text"
              value={draftSettings.displayName}
              onChange={function(event){
                updateDraft("displayName", event.target.value);
              }}
              className="rounded-xl border-0 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-[#bfc6d8]"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#d2d8e5]">Email</span>
            <input
              type="email"
              value={draftSettings.email}
              onChange={function(event){
                updateDraft("email", event.target.value);
              }}
              className="rounded-xl border-0 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-[#bfc6d8]"
            />
          </label>

          <fieldset className="flex flex-col gap-2 border-0 p-0">
            <legend className="text-sm font-semibold text-[#d2d8e5]">Theme</legend>
            <div className="grid grid-cols-3 gap-2 max-[420px]:grid-cols-1">
              {themeOptions.map(function(option){
                const isSelected = draftSettings.theme === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={function(){
                      updateDraft("theme", option.value);
                    }}
                    className={`rounded-xl border border-white/10 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 ${isSelected ? "bg-white/20" : "bg-white/5"}`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-2 border-0 p-0">
            <legend className="text-sm font-semibold text-[#d2d8e5]">Background</legend>
            <div className="grid grid-cols-3 gap-2 max-[420px]:grid-cols-1">
              {backgroundOptions.map(function(option){
                const isSelected = draftSettings.background === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={function(){
                      updateDraft("background", option.value);
                    }}
                    className={`rounded-xl border border-white/10 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 ${isSelected ? "bg-white/20" : "bg-white/5"}`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="flex items-center justify-between gap-4 rounded-xl bg-white/5 p-4">
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-[#d2d8e5]">AI assistant</span>
              <span className="block text-xs text-[#c2c9d9]">Frontend preference saved locally for now.</span>
            </span>
            <input
              type="checkbox"
              checked={draftSettings.aiAssistant}
              onChange={function(event){
                updateDraft("aiAssistant", event.target.checked);
              }}
              className="h-5 w-5 flex-shrink-0 accent-blue-500"
            />
          </label>

          <div className="mt-2 grid grid-cols-[1fr_auto] gap-3 max-[420px]:grid-cols-1">
            <button
              type="submit"
              disabled={!hasChanges}
              className="rounded-xl border-0 bg-blue-600 px-4 py-3 font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              Save Settings
            </button>
            <button
              type="button"
              onClick={onLogoutClick}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-bold text-white transition hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
