import { useEffect, useMemo, useState } from "react";
import ChatPage from "./pages/ChatPage.jsx";
import CreateAccountPage from "./pages/CreateAccountPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

function getCurrentPage(){
  const path = window.location.pathname;

  if(path.includes("create-account")){
    return "create-account";
  }

  if(path.includes("settings")){
    return "settings";
  }

  if(path.includes("chat")){
    return "chat";
  }

  return "login";
}

export default function App(){
  const [page, setPage] = useState(getCurrentPage);

  useEffect(function(){
    function handlePopState(){
      setPage(getCurrentPage());
    }

    window.addEventListener("popstate", handlePopState);

    return function(){
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigation = useMemo(function(){
    return {
      goToLogin: function(){
        window.history.pushState({}, "", "/");
        setPage("login");
      },
      goToCreateAccount: function(){
        window.history.pushState({}, "", "/create-account");
        setPage("create-account");
      },
      goToChat: function(){
        window.history.pushState({}, "", "/chat");
        setPage("chat");
      },
      goToSettings: function(){
        window.history.pushState({}, "", "/settings");
        setPage("settings");
      }
    };
  }, []);

  if(page === "chat"){
    return <ChatPage onSettingsClick={navigation.goToSettings} />;
  }

  if(page === "settings"){
    return (
      <SettingsPage
        onBackClick={navigation.goToChat}
        onLogoutClick={navigation.goToLogin}
      />
    );
  }

  if(page === "create-account"){
    return <CreateAccountPage onLoginClick={navigation.goToLogin} />;
  }

  return (
    <LoginPage
      onCreateAccountClick={navigation.goToCreateAccount}
      onLoginSuccess={navigation.goToChat}
    />
  );
}
