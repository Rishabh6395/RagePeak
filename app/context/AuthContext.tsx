"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("isLoggedIn");
    if (loggedIn) {
      setUser(true);
    }
  }, []);

  const logout = () => {
    sessionStorage.removeItem("isLoggedIn");
    setUser(null);
  };

  const login = () => {
    sessionStorage.setItem("isLoggedIn", "true");
    setUser(true);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);