import clsx from "clsx";
import * as React from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useToast } from "../../hooks/toast/useToast.tsx";
import {useAuth} from "../../context/auth/AuthContext.tsx";

import "./sidebar.css"

interface SidebarItemProps {
    icon: React.ReactNode;
    text: string;
    to?: string;
    collapsed?: boolean;
    onClick?: () => void;
    isLogout?: boolean;
}

export function SidebarItem({
                                icon,
                                text,
                                to,
                                collapsed,
                                onClick,
                                isLogout,
                            }: SidebarItemProps) {
    const routerState = useRouterState();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const addToast = useToast();

    const handleLogout = React.useCallback(() => {
        if (isLogout) {
            logout();
            navigate({ to: "/login" });
            addToast({
                variant: "success",
                message: "Log out successful",
                autoClose: 3000,
            });
        }
    }, [isLogout, logout, navigate, addToast]);

    const baseClasses = clsx("sidebar-item", {
        collapsed,
    });

    const content = (
        <>
            <span className="sidebar-item-icon">{icon}</span>
            {!collapsed && <span className="sidebar-text">{text}</span>}
        </>
    );

    if (isLogout) {
        return (
            <button
                className={baseClasses}
                onClick={handleLogout}
                aria-label={collapsed ? text : undefined}
            >
                {content}
            </button>
        );
    }

    const isActive = routerState.location.pathname === to;

    return (
        <Link
            to={to}
            className={clsx(baseClasses, { active: isActive })}
            onClick={onClick}
            aria-label={collapsed ? text : undefined}
            aria-current={isActive ? "page" : undefined}
        >
            {content}
        </Link>
    );
}