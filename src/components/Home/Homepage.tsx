import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import "./homepage.css";

function HomePage() {
    const navigate = useNavigate();
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleEnterPortal = () => {
        navigate({ to: "/login" });
    };

    // pulse animation
    useEffect(() => {
        const button = buttonRef.current;
        if (!button) return;

        let scale = 1;
        let growing = true;

        const pulse = () => {
            if (growing) {
                scale += 0.002;
                if (scale >= 1.05) growing = false;
            } else {
                scale -= 0.002;
                if (scale <= 0.95) growing = true;
            }
            button.style.transform = `scale(${scale})`;
            requestAnimationFrame(pulse);
        };

        pulse();
    }, []);

    return (
        <div className="home-container">
            <div className="home-hero">
                <h1 className="home-title" style={{fontSize:"4rem"}}>Welcome to the Pagoda Dojo</h1>
                <h2 className="home-subtitle" style={{color:"#e5e7eb", fontSize:"2rem"}}>
                    Manage subjects, tasks, and settings all in one place.
                </h2>
                <h3 style={{fontSize:"1.2rem", fontStyle:"italic", fontWeight:"bold"}}>
                    To learn is to live and to live is to learn
                </h3>


                <button
                    ref={buttonRef}
                    className="btn btn-outline"
                    onClick={handleEnterPortal}
                    style={{
                        transition: "all 0.3s ease-in-out",
                        boxShadow: "0 0 0 rgba(0,0,0,0)",
                        fontSize:"1.5rem"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.1)";
                        e.currentTarget.style.boxShadow =
                            "0 6px 20px rgba(0,0,0,0.3)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow =
                            "0 0 0 rgba(0,0,0,0)";
                    }}
                >
                    Dojo
                </button>
            </div>
        </div>
    );
}

export default HomePage;
