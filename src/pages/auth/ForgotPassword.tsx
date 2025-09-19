import React, { useState } from "react";
import {Link, useNavigate} from "@tanstack/react-router";
import { validateEmail } from "../../utils/validationHelper";
import { useToast } from "../../hooks/toast/useToast.tsx";

import "./auth.css"

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const showToast = useToast();
    const navigate = useNavigate();

    function handleBlur() {
        setError(validateEmail(email));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const emailError = validateEmail(email);
        setError(emailError);

        if (!emailError) {

            try {
                // Call EmailJS API
                 console.log("Trying to send an email");
                showToast({
                    variant: "success",
                    message: "Password reset link sent!",
                    autoClose: 3000,
                })
                setEmail("")
                setTimeout(() => {
                    navigate({ to: "/login" });
                }, 1500);
            } catch (error) {
                console.error(error);
                showToast({
                    variant: "error",
                    message: "Failed to send email. Try again later.",
                    autoClose: 3000,
                });
            }

        } else {
            showToast({
                variant: "error",
                message: "Enter a valid email",
                autoClose: 3000,
            });
        }
    }


    return (
        <div className={"auth-container"}>
            <h2>Forgot Password</h2>
            <form className={"auth-form"} onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleBlur}
                    className={error ? "input-error" : ""}
                />
                {error && <p className="error">{error}</p>}


                <button className={"auth-button"} type="submit">Send Reset Link</button>
            </form>


            <div className="auth-links">
                <Link to="/login">Back to Login</Link>
            </div>
        </div>
    );
}