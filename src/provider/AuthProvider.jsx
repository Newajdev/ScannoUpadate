"use client";
import { createContext, useEffect, useState } from "react";
export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [loadding, setLoading] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const saved = sessionStorage.getItem("chatMessages");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    sessionStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const UserActivity = {
    isArabic,
    setIsArabic,
    messages,
    setMessages,
    loadding,
    setLoading,
  };
  return (
    <AuthContext.Provider value={UserActivity}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
