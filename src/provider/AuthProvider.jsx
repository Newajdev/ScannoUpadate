"use client";
import { createContext, useState } from "react";

/* eslint-disable-next-line react-refresh/only-export-components */
export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {

    const [isArabic, setIsArabic] = useState(false)
    const [messages, setMessages] = useState([])


    const UserActivity = {
        isArabic,
        setIsArabic,
        messages,
        setMessages
    }
    return (
        <AuthContext.Provider value={UserActivity}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;