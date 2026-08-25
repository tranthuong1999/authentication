import {
    useContext,
    useState,
} from "react";

import {
    AuthContext,
} from "../context/AuthContext";

import {
    API_URL,
    consumeGoogleAuthError,
} from "../utils/googleAuth";

export default function LoginForm() {
    const auth =
        useContext(AuthContext);

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState(consumeGoogleAuthError);

    if (!auth) {
        return null;
    }

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setError("");

        try {
            await auth?.login(
                email,
                password
            );
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    }

    function handleGoogleLogin() {
        window.location.href =
            `${API_URL}/auth/google/login`;
    }

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Email"
                    />
                </div>

                <div>
                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder="Password"
                    />
                </div>

                {error && (
                    <p>{error}</p>
                )}

                <button type="submit">
                    Login
                </button>
            </form>

            <div>
                <span>OR</span>
            </div>

            <button
                type="button"
                onClick={handleGoogleLogin}
            >
                Sign in with Google
            </button>
        </div>
    );
}
