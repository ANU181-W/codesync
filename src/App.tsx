import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Navbar } from "./components/Navbar";
import { ProblemList } from "./components/ProblemList";
import { ProblemView } from "./components/ProblemView";
import { Dashboard } from "./components/Dashboard";
import { UserProfile } from "./components/UserProfile";
import { Room } from "./components/Room";
import { Login } from "./components/Auth/Login";
import { Signup } from "./components/Auth/Signup";
import { AdminDashboard } from "./components/Admin/AdminDashboard";
import { Theme } from "./types";
import { authAPI } from "./data/api.tsx";

function App() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authAPI
        .getCurrentUser()
        .then((userData) => {
          setUser(userData);
        })
        .catch((err) => {
          console.error("Error fetching user profile:", err);
          localStorage.removeItem("token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  console.log("Fetched User:", user);
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          {user ? (
            <>
              <Navbar
                theme={theme}
                onThemeChange={setTheme}
                onUserClick={() => setShowUserProfile(true)}
                user={user}
                onLogout={handleLogout}
              />

              <main className="h-[calc(100vh-4rem)]">
                <Routes>
                  <Route
                    path="/"
                    element={<Navigate to="/problems" replace />}
                  />
                  <Route path="/problems" element={<ProblemList />} />
                  <Route path="/problems/:id" element={<ProblemView />} />
                  <Route
                    path="/dashboard"
                    element={<Dashboard user={user} />}
                  />
                  <Route path="/room/:roomId" element={<Room user={user} />} />

                  {/* Admin Access Route with Role Check */}
                  <Route
                    path="/admin/*"
                    element={
                      user?.role === "Admin" ? (
                        <AdminDashboard />
                      ) : (
                        <Navigate to="/dashboard" replace />
                      )
                    }
                  />

                  <Route
                    path="/login"
                    element={<Navigate to="/problems" replace />}
                  />
                  <Route
                    path="/signup"
                    element={<Navigate to="/problems" replace />}
                  />
                </Routes>

                {showUserProfile && (
                  <UserProfile
                    user={user}
                    onClose={() => setShowUserProfile(false)}
                  />
                )}
              </main>
            </>
          ) : (
            <Routes>
              <Route path="/login" element={<Login onLogin={setUser} />} />
              <Route path="/signup" element={<Signup onSignup={setUser} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          )}
        </div>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
