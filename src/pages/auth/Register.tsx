// src/pages/Register.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { validateEmail, validatePassword } from "../../utils/validationHelper";
import { useToast } from "../../hooks/toast/useToast";

import "./auth.css"

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const navigate = useNavigate();
    const showToast = useToast();

    function handleBlur(field: "email" | "password" | "confirmPassword") {
        setErrors((prev) => {
            const newErrors = { ...prev };
            if (field === "email") newErrors.email = validateEmail(email);
            if (field === "password") newErrors.password = validatePassword(password);
            if (field === "confirmPassword")
                newErrors.confirmPassword =
                    password !== confirmPassword ? "Passwords do not match." : "";
            return newErrors;
        });
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const newErrors = {
            email: validateEmail(email),
            password: validatePassword(password),
            confirmPassword:
                password !== confirmPassword ? "Passwords do not match." : "",
        };
        setErrors(newErrors);

        if (!newErrors.email && !newErrors.password && !newErrors.confirmPassword) {
            let existingUsers: { email: string; password: string }[] = [];

            try {
                const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
                if (Array.isArray(storedUsers)) {
                    existingUsers = storedUsers;
                } else {
                    localStorage.setItem("users", JSON.stringify([]));
                }
            } catch (err) {
                console.warn(err + "Invalid users data in localStorage. Resetting...");
                localStorage.setItem("users", JSON.stringify([]));
            }

            const userExists = existingUsers.some((user) => user.email === email);

            if (userExists) {
                showToast({ variant: "error", message: "User already exists!" });
                return;
            }

            const newUser = { email, password };
            existingUsers.push(newUser);
            localStorage.setItem("users", JSON.stringify(existingUsers));

            showToast({ variant: "success", message: "Registration successful!" });

            navigate({ to: "/login" });
        } else {
            showToast({
                variant: "error", message: "Fix the errors above",
                autoClose: 3000
            });
        }
    }

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form
                className={"auth-form"}
                onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className={errors.email ? "input-error" : ""}
                />
                {errors.email && <p className="error">{errors.email}</p>}

                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur("password")}
                    className={errors.password ? "input-error" : ""}
                />
                {errors.password && <p className="error">{errors.password}</p>}

                <label>Confirm Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => handleBlur("confirmPassword")}
                    className={errors.confirmPassword ? "input-error" : ""}
                />
                {errors.confirmPassword && (
                    <p className="error">{errors.confirmPassword}</p>
                )}

                <button className={"auth-button"} type="submit">Register</button>
            </form>

            <div className="auth-links">
                <Link to="/login">Already have an account?</Link>
            </div>
        </div>
    );
}
