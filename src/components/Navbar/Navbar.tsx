import {NavbarItem} from "./NavItem.tsx";
import {Icon} from "../Icons/Icon.tsx";

import  "./navbar.css"
import {useAuth} from "../../context/auth/AuthContext.tsx";
import React, {useEffect, useRef} from "react";

export  default function  Navbar() {

    const {user, logout} = useAuth();
    const [open, setOpen] = React.useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return <header className="header">
        <nav className="navbar">
            <div className="navbar-item">
                <div className="">
                    <Icon>

                    </Icon>
                </div>
                <p> </p>
                <span >
                    THE PAGODA DOJO
                </span>
            </div>
            <div className="navbar-actions">
                <NavbarItem
                    icon= {
                        <Icon>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 8H0V6H6V0H8V6H14V8H8V14H6V8Z" fill="white"/>
                            </svg>
                        </Icon>
                    }
                    onClick={() => console.log("Button Clicked!")}

                />
                <NavbarItem icon= {
                    <Icon>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.146 15.3707 4.888 14.112C3.63 12.8533 3.00067 11.316 3 9.5C2.99933 7.684 3.62867 6.14667 4.888 4.888C6.14733 3.62933 7.68467 3 9.5 3C11.3153 3 12.853 3.62933 14.113 4.888C15.373 6.14667 16.002 7.684 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5633 11.8133 14.0007 10.7507 14 9.5C13.9993 8.24933 13.562 7.187 12.688 6.313C11.814 5.439 10.7513 5.00133 9.5 5C8.24867 4.99867 7.18633 5.43633 6.313 6.313C5.43967 7.18967 5.002 8.252 5 9.5C4.998 10.748 5.43567 11.8107 6.313 12.688C7.19033 13.5653 8.25267 14.0027 9.5 14Z" fill="white"/>
                        </svg>
                    </Icon>
                } onClick={() => console.log("Button Clicked!")}

                />

                <NavbarItem icon= {
                    <Icon>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 21H14C14 22.1 13.1 23 12 23C10.9 23 10 22.1 10 21ZM21 19V20H3V19L5 17V11C5 7.9 7 5.2 10 4.3V4C10 2.9 10.9 2 12 2C13.1 2 14 2.9 14 4V4.3C17 5.2 19 7.9 19 11V17L21 19ZM17 11C17 8.2 14.8 6 12 6C9.2 6 7 8.2 7 11V18H17V11Z" fill="white"/>
                        </svg>
                    </Icon>
                }/>
                <div className="navbar-item-wrapper" ref={menuRef}>
                    <button
                        className="navbar-icon-btn"
                        onClick={() => setOpen(!open)}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M6.16797 18.849C6.41548 18.0252 6.92194 17.3032 7.61222 16.79C8.30249 16.2768 9.13982 15.9997 9.99997 16H14C14.8612 15.9997 15.6996 16.2774 16.3904 16.7918C17.0811 17.3062 17.5874 18.0298 17.834 18.855M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10Z" stroke="#CED4DA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>

                    {open && (
                        <div className="dropdown">
                            <p className="dropdown-username">{user?.name ?? "Guest"}</p>
                            <button className="dropdown-item" onClick={logout}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    </header>
}