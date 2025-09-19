import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { validateEmail, validatePassword } from "../../utils/validationHelper.tsx";
import { useToast } from "../../hooks/toast/useToast.tsx";
import { useAuth } from "../../context/auth/AuthContext.tsx";

import "./auth.css"

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<{ email: string; password: string }>({
        email: "",
        password: "",
    });

    const [animate, setAnimate] = useState(false); // for slide-in animation

    const navigate = useNavigate();
    const showToast = useToast();
    const { login } = useAuth();

    useEffect(() => {
        setTimeout(() => setAnimate(true), 50);
    }, []);

    function validateForm() {
        const validationErrors = {
            email: validateEmail(email),
            password: validatePassword(password),
        };
        setErrors(validationErrors);
        return !validationErrors.email && !validationErrors.password;
    }

    function handleBlur(field: "email" | "password") {
        setErrors((prev) => ({
            ...prev,
            [field]: field === "email" ? validateEmail(email) : validatePassword(password),
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!validateForm()) {
            showToast({
                variant: "error",
                message: "Check login details",
                autoClose: 5000,
            });
            return;
        }

        // Determine role based on email
        let role: "vendor" | "client" = "client"; // default to client
        if (email.includes("vendor")) role = "vendor";

        // Log in using the lean AuthContext
        login({ role });

        showToast({
            variant: "success",
            message: "Login successful!",
            autoClose: 3000,
        });

        // Navigate based on role
        navigate({ to: role === "vendor" ? "/dashboard" : "/dashboard" });
    }

    return (
        <div className={`login-page ${animate ? "slide-in" : ""}`}>
            <div className="auth-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => handleBlur("email")}
                        className={errors.email ? "input-error" : ""}
                    />
                    {errors.email && <p className="error">{errors.email}</p>}

                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => handleBlur("password")}
                        className={errors.password ? "input-error" : ""}
                    />
                    {errors.password && <p className="error">{errors.password}</p>}

                    <button type="submit" className="auth-button">
                        Login
                    </button>
                </form>

                <div className="auth-links">
                    <Link to="/register">Create an account</Link>
                    <Link to="/forgot-password">Forgot Password?</Link>
                </div>
            </div>
        </div>
    );
}
