import React, {useState} from 'react';
import "./settings.css"

function Settings() {
    const [darkMode, setDarkMode] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);

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
                        <label className="form-label">Display Name</label>
                        <input type="text" className="form-input" placeholder="Your name" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="your@email.com"
                        />
                    </div>
                    <button className="btn-primary">Save Profile</button>
                </div>

                {/* Account Settings */}
                <div className="settings-card">
                    <h2 className="card-title">Account</h2>
                    <div className="form-group">
                        <label className="form-label">Change Password</label>
                        <input type="password" className="form-input" placeholder="••••••••" />
                    </div>
                    <button className="btn-primary">Update Password</button>
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