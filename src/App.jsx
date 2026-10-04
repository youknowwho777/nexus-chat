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
import { fetchUserProfile, updateUserProfile } from "./services/userApi.js";

const storageKeys = {
  token: "nexus:token",
  user: "nexus:user",
  chats: "nexus:chats",
  settings: "nexus:settings"
};

const defaultSettings = {
  displayName: "Siddu",
  email: "siddu@nexus.dev",
  theme: "blue",
  background: "space",
  aiAssistant: true
};

function readStorage(key, fallback) {
  try {
    const savedValue = window.localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function ProtectedRoute({ currentUser, children }) {
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(function () {
    return readStorage(storageKeys.user, null);
  });
  const [chats, setChats] = useState(function () {
    return readStorage(storageKeys.chats, createInitialChats());
  });
  const [settings, setSettings] = useState(function () {
    return {
      ...defaultSettings,
      ...readStorage(storageKeys.settings, {})
    };
  });

  // Verify and refresh profile from database on app load if token exists
  useEffect(function () {
    const token = window.localStorage.getItem(storageKeys.token);
    if (!token) return;

    fetchUserProfile()
      .then(function (userProfile) {
        if (userProfile) {
          setCurrentUser(function (existing) {
            return {
              ...existing,
              id: userProfile.id,
              name: userProfile.username,
              email: userProfile.email
            };
          });

          setSettings(function (prev) {
            return {
              ...prev,
              displayName: userProfile.username || prev.displayName,
              email: userProfile.email || prev.email,
              theme: userProfile.theme || prev.theme,
              background: userProfile.background || prev.background,
              aiAssistant: userProfile.aiAssistant !== undefined ? userProfile.aiAssistant : prev.aiAssistant
            };
          });
        }
      })
      .catch(function () {
        // If token expired or invalid, reset session
        window.localStorage.removeItem(storageKeys.token);
        window.localStorage.removeItem(storageKeys.user);
        setCurrentUser(null);
      });
  }, []);

  useEffect(function () {
    if (currentUser) {
      writeStorage(storageKeys.user, currentUser);
      return;
    }

    window.localStorage.removeItem(storageKeys.user);
  }, [currentUser]);

  useEffect(function () {
    writeStorage(storageKeys.chats, chats);
  }, [chats]);

  useEffect(function () {
    writeStorage(storageKeys.settings, settings);
  }, [settings]);

  function handleLoginSuccess(userDetails) {
    if (userDetails.token) {
      window.localStorage.setItem(storageKeys.token, userDetails.token);
    }

    const nextUser = {
      id: userDetails.id,
      name: userDetails.username || settings.displayName,
      email: userDetails.email
    };

    setCurrentUser(nextUser);
    setSettings(function (currentSettings) {
      return {
        ...currentSettings,
        displayName: userDetails.username || currentSettings.displayName,
        email: userDetails.email,
        theme: userDetails.theme || currentSettings.theme,
        background: userDetails.background || currentSettings.background,
        aiAssistant: userDetails.aiAssistant !== undefined ? userDetails.aiAssistant : currentSettings.aiAssistant
      };
    });
    navigate("/chat");
  }

  function handleAccountCreated(userDetails) {
    if (userDetails.token) {
      window.localStorage.setItem(storageKeys.token, userDetails.token);
      const nextUser = {
        id: userDetails.id,
        name: userDetails.username,
        email: userDetails.email
      };
      setCurrentUser(nextUser);
      setSettings(function (currentSettings) {
        return {
          ...currentSettings,
          displayName: userDetails.username,
          email: userDetails.email
        };
      });
      navigate("/chat");
      return;
    }

    navigate("/");
  }

  async function handleSettingsChange(nextSettings) {
    setSettings(nextSettings);
    setCurrentUser(function (user) {
      if (!user) {
        return user;
      }

      return {
        ...user,
        name: nextSettings.displayName,
        email: nextSettings.email
      };
    });

    try {
      await updateUserProfile({
        username: nextSettings.displayName,
        theme: nextSettings.theme,
        background: nextSettings.background,
        aiAssistant: nextSettings.aiAssistant
      });
    } catch (error) {
      console.warn("Could not sync settings to database:", error.message);
    }
  }

  function handleLogout() {
    window.localStorage.removeItem(storageKeys.token);
    window.localStorage.removeItem(storageKeys.user);
    setCurrentUser(null);
    navigate("/");
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LoginPage
            onCreateAccountClick={function () {
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
            onLoginClick={function () {
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
              onSettingsClick={function () {
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
              onBackClick={function () {
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

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
