import { useState } from "react";

import { useAuthStore } from "../stores/authStore";

import "../styles/auth.css";

const Home = () => {
    const user = useAuthStore(
        (state) => state.user
    );

    const logout = useAuthStore(
        (state) => state.logout
    );

    const [submitting, setSubmitting] =
        useState(false);

    const initial =
        user?.email?.charAt(0).toUpperCase() ||
        "?";

    async function handleLogout() {
        setSubmitting(true);

        try {
            await logout();
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="home-page">
            <div className="home-card">
                <div className="home-card__badge">
                    {initial}
                </div>

                <h1 className="home-card__title">
                    Welcome back
                </h1>

                <p className="home-card__email">
                    {user?.email}
                </p>

                <button
                    type="button"
                    className="auth-btn auth-btn--primary"
                    onClick={handleLogout}
                    disabled={submitting}
                >
                    {submitting
                        ? "Signing out..."
                        : "Sign out"}
                </button>
            </div>
        </div>
    );
};

export default Home;
