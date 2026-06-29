import { useEffect, useMemo, useState } from "react";
import CreateAccountPage from "./pages/CreateAccountPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

function getCurrentPage(){
  return window.location.pathname.includes("create-account") ? "create-account" : "login";
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
      }
    };
  }, []);

  if(page === "create-account"){
    return <CreateAccountPage onLoginClick={navigation.goToLogin} />;
  }

  return <LoginPage onCreateAccountClick={navigation.goToCreateAccount} />;
}
