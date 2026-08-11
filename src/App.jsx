import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate
} from "react-router-dom";
import { createInitialChats } from "./data/chats.js";
import ChatPage from "./pages/ChatPage.jsx";
import CreateAccountPage from "./pages/CreateAccountPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

const storageKeys = {
  user: "nexus:user",
  chats: "nexus:chats",
  settings: "nexus:settings"
};

const defaultSettings = { // local Storage default values
  displayName: "Siddu",
  email: "siddu@nexus.dev",
  theme: "blue",
  background: "space",
  aiAssistant: true
};

function readStorage(key, fallback){ //helper function to read from local storage
  try {
    const savedValue = window.localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value){  //to write everything
  window.localStorage.setItem(key, JSON.stringify(value));
}

function ProtectedRoute({ currentUser, children }){
  if(!currentUser){
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes(){
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(function(){
    return readStorage(storageKeys.user, null);
  });
  const [chats, setChats] = useState(function(){
    return readStorage(storageKeys.chats, createInitialChats());
  });
  const [settings, setSettings] = useState(function(){
    return {
      ...defaultSettings,
      ...readStorage(storageKeys.settings, {})
    };
  });

  useEffect(function(){
    if(currentUser){
      writeStorage(storageKeys.user, currentUser);
      return;
    }

    window.localStorage.removeItem(storageKeys.user);
  }, [currentUser]);

  useEffect(function(){
    writeStorage(storageKeys.chats, chats);
  }, [chats]);

  useEffect(function(){
    writeStorage(storageKeys.settings, settings);
  }, [settings]);

  function handleLoginSuccess(userDetails){
    const nextUser = {
      name: userDetails.username || settings.displayName,
      email: userDetails.email
    };

    setCurrentUser(nextUser);
    setSettings(function(currentSettings){
      return {
        ...currentSettings,
        email: userDetails.email
      };
    });
    navigate("/chat");
  }

  function handleAccountCreated(userDetails){
    setSettings(function(currentSettings){
      return {
        ...currentSettings,
        displayName: userDetails.username,
        email: userDetails.email
      };
    });
    navigate("/");
  }

  function handleSettingsChange(nextSettings){
    setSettings(nextSettings);
    setCurrentUser(function(user){
      if(!user){
        return user;
      }

      return {
        ...user,
        name: nextSettings.displayName,
        email: nextSettings.email
      };
    });
  }

  function handleLogout(){
    setCurrentUser(null);
    navigate("/");
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LoginPage
            onCreateAccountClick={function(){
              navigate("/create-account");
            }}
            onLoginSuccess={handleLoginSuccess}
          />
        }
      />
      <Route
        path="/create-account"
        element={
          <CreateAccountPage
            onAccountCreated={handleAccountCreated}
            onLoginClick={function(){
              navigate("/");
            }}
          />
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <ChatPage
              chats={chats}
              currentUser={currentUser}
              settings={settings}
              setChats={setChats}
              onSettingsClick={function(){
                navigate("/settings");
              }}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <SettingsPage
              currentUser={currentUser}
              settings={settings}
              onSettingsChange={handleSettingsChange}
              onBackClick={function(){
                navigate("/chat");
              }}
              onLogoutClick={handleLogout}
            />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={currentUser ? "/chat" : "/"} replace />} />
    </Routes>
  );
}

export default function App(){
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
