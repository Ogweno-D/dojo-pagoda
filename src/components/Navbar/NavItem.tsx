// components/Navbar/NavbarItem.tsx
import clsx from "clsx";
import * as React from "react";

interface NavbarItemProps {
    icon: React.ReactNode;
    text?: string;
    ariaLabel?: string;
    onClick?: () => void;
}

export function NavbarItem({ icon, text, ariaLabel, onClick }: NavbarItemProps) {
    return (
        <button
            className={clsx("navbar-item", { "navbar-icon-only": !text })}
            aria-label={ariaLabel}
            onClick={onClick}
        >
            {icon}
            {text && <span className="navbar-text">{text}</span>}
        </button>
    );
}
