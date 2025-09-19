import React, { createContext, useContext, useState, useEffect } from "react";
import { useFetch } from "../../hooks/api/useFetch.tsx";
import type { User } from "../../components/Table/Users/User.type.ts";

interface SingleUserApiResponse {
    user: User;
}

type AuthContextType = {
    user: User | null;
    loading: boolean;
    refetchUser: () => Promise<void>;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // API endpoint for profile
    const url = `/api/admin/users/profile`;
    const fetchOptions = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_ADMIN_BEARER_TOKEN}`, // if using token
        },
    };

    const {
        data,
        loading,
        error,
        refetch: refetchUser,
    } = useFetch<SingleUserApiResponse>(url, fetchOptions);

    const [user, setUser] = useState<User | null>(null);

    // Sync when API returns data
    useEffect(() => {
        if (data?.user) {
            setUser(data.user);
        }
    }, [data]);

    const login = (token: string) => {
        localStorage.setItem("token", token);
        refetchUser();
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    const isAuthenticated = () => !!user;

    const value: AuthContextType = {
        user,
        loading,
        refetchUser,
        login,
        logout,
        isAuthenticated,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
}
