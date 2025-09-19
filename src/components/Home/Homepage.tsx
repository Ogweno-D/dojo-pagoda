import React from "react";
import { useNavigate } from "@tanstack/react-router";
import "./homepage.css"

function HomePage() {
    const navigate = useNavigate();

    const handleEnterPortal = () => {
        navigate({ to: "/login" });
    };

    return (
        <div className="home-container">
            <div className="home-hero">
                <h1 className="home-title"> Welcome to the pagoda dojo</h1>
                <p className="home-subtitle">
                    Manage subjects, tasks, and settings all in one place.
                </p>
                <button className="btn-primary" onClick={handleEnterPortal}>
                    Dojo
                </button>
            </div>
        </div>
    );
}

export default HomePage;
