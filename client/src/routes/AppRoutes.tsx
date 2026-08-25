import { useEffect } from "react";
import {
    Navigate,
    Route,
    Routes,
    useLocation,
    useNavigate,
} from "react-router-dom";

import Home from "../components/Home";
import LoginForm from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";
import {
    GOOGLE_ERROR_MESSAGES,
} from "../utils/googleAuth";
import { showAuthError } from "../utils/toast";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import Chat from "../pages/Chat";

function GoogleAuthErrorHandler() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(
            location.search
        );

        const error = params.get("error");

        if (!error) {
            return;
        }

        showAuthError(
            GOOGLE_ERROR_MESSAGES[error] ||
            "Google sign-in failed."
        );

        navigate(location.pathname, {
            replace: true,
        });
    }, [
        location.pathname,
        location.search,
        navigate,
    ]);

    return null;
}

function LoginPage() {
    return (
        <div className="auth-page">
            <LoginForm />
        </div>
    );
}

function RegisterPage() {
    return (
        <div className="auth-page">
            <RegisterForm />
        </div>
    );
}

export function AppRoutes() {
    return (
        <>
            <GoogleAuthErrorHandler />

            <Routes>
                <Route
                    element={
                        <PrivateRoute />
                    }
                >
                    <Route
                        path="/"
                        element={<Home />}
                    />
                    <Route
                        path="/chat"
                        element={<Chat />}
                    />
                </Route>

                <Route
                    element={
                        <PublicRoute />
                    }
                >
                    <Route
                        path="/login"
                        element={
                            <LoginPage />
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <RegisterPage />
                        }
                    />
                </Route>

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />
            </Routes>
        </>
    );
}
