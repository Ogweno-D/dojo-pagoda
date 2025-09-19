import React, { useState } from "react";
import "./settings.css";
import { useAuth } from "../../context/auth/AuthContext.tsx";
import { useMutate } from "../../hooks/api/useMutate.tsx";
import { useToast } from "../../hooks/toast/useToast.tsx";

function Settings() {
    const [darkMode, setDarkMode] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);

    const { user, loading, error, refetchUser } = useAuth();
    const showToast = useToast();

    // Mutate hook for profile update
    const { mutate: updateMutate, loading: updateLoading } = useMutate<
        { user: any; message: string }, // Response shape
        { name: string; email: string } // Request body shape
    >(`/api/admin/users/profile`);

    const [name, setName] = useState(user?.name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");

    if (loading) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return <p className="error">Error: {String(error)}</p>;
    }

    if (!user) {
        return <p>No user data available</p>;
    }

    const handleSaveProfile = async () => {
        try {
            await updateMutate(`/api/admin/users/profile`, "PUT", { name, email });
            await refetchUser(); // refresh context data
            showToast({ variant: "success", title: "Profile updated successfully!" });
        } catch (err) {
            showToast({ variant: "error", title: "Failed to update profile" });
        }
    };

    return (
        <div className="settings-container">
            <h1 className="settings-title">Settings</h1>
            <p className="settings-subtitle">
                Manage your account preferences and dashboard settings.
            </p>

            <div className="settings-grid">
                {/* Profile Settings */}
                <div className="settings-card">
                    <h2 className="card-title">Profile</h2>
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Your name"
                            value={user.name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="your@email.com"
                            value={user.email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button
                        className=" btn btn-primary"
                        onClick={handleSaveProfile}
                        disabled={updateLoading}
                    >
                        {updateLoading ? "Saving..." : "Save Profile"}
                    </button>
                </div>

                {/* Account Settings */}
                <div className="settings-card">
                    <h2 className="card-title">Account</h2>
                    <div className="form-group">
                        <label className="form-label">Change Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                        />
                    </div>
                    <button className="btn btn-primary">Update Password</button>
                </div>

                {/* Notifications */}
                <div className="settings-card">
                    <h2 className="card-title">Notifications</h2>
                    <div className="toggle-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={emailNotifications}
                                onChange={() => setEmailNotifications(!emailNotifications)}
                            />
                            Email Notifications
                        </label>
                    </div>
                    <div className="toggle-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={pushNotifications}
                                onChange={() => setPushNotifications(!pushNotifications)}
                            />
                            Push Notifications
                        </label>
                    </div>
                </div>

                {/* Theme */}
                <div className="settings-card">
                    <h2 className="card-title">Appearance</h2>
                    <div className="toggle-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={darkMode}
                                onChange={() => setDarkMode(!darkMode)}
                            />
                            Enable Dark Mode
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
