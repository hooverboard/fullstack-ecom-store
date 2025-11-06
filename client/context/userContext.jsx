import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  // Check localStorage for logout flag on initial load
  const [isLoggedOut, setIsLoggedOut] = useState(() => {
    return localStorage.getItem("isLoggedOut") === "true";
  });

  // These defaults are correct from our previous step
  axios.defaults.baseURL = "http://localhost:5000"; // Matched to your server's port
  axios.defaults.withCredentials = true;

  useEffect(() => {
    // Don't fetch user if they manually logged out
    if (!user && !isLoggedOut) {
      // --- CORRECTED ROUTE ---
      // The path now matches what your Express server expects.
      axios
        .get("/api/auth/profile")
        .then(({ data }) => {
          setUser(data);
        })
        .catch((error) => {
          // It's good practice to log errors
          console.error("Could not fetch user profile:", error);
        });
    }
  }, []);

  const logout = () => {
    // Clear the user state
    setUser(null);
    // Set logout flag to prevent auto-login and persist it
    setIsLoggedOut(true);
    localStorage.setItem("isLoggedOut", "true");
    // Clear the cookie from browser
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const login = (userData) => {
    // Set user data
    setUser(userData);
    // Clear logout flag to allow future auto-login and persist it
    setIsLoggedOut(false);
    localStorage.removeItem("isLoggedOut");
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, login }}>
      {children}
    </UserContext.Provider>
  );
}
