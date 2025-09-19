// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

type AuthState = {
    role: "vendor" | "client";
};

type AuthContextType = {
    user: AuthState | null;
    loading: boolean;
    login: (data: AuthState) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthState | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
        setLoading(false);
    }, []);

    const login = (data: AuthState) => {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    const isAuthenticated = () => !!user;

    const value = { user, loading, login, logout, isAuthenticated }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
}
