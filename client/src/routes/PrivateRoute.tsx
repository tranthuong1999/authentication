import {
    Navigate,
    Outlet,
} from "react-router-dom";

import { useAuthStore } from "../stores/authStore";

export function PrivateRoute() {
    const user = useAuthStore(
        (state) => state.user
    );

    const loading = useAuthStore(
        (state) => state.loading
    );

    if (loading) {
        return (
            <div className="auth-loading">
                <div className="auth-spinner" />
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return <Outlet />;
}
