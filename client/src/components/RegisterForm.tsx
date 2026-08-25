import { useState } from "react";

import {
    API_URL,
    consumeGoogleAuthError,
} from "../utils/googleAuth";

import { register, getMe } from "../services/auth.service";

export function RegisterForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState(
        consumeGoogleAuthError
    );

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setMessage("");

        try {
            await register(email, password);

            const user = await getMe();

            setMessage(
                `Welcome ${user.email}`
            );
        } catch (error: any) {
            setMessage(
                error.response?.data?.message ||
                "Register failed"
            );
        }
    }

    function handleGoogleRegister() {
        window.location.href =
            `${API_URL}/auth/google/register`;
    }

    return (
        <div>
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
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
                    />
                </div>

                <button type="submit">
                    Register
                </button>
            </form>

            <div>
                <span>OR</span>
            </div>

            <button
                type="button"
                onClick={handleGoogleRegister}
            >
                Sign up with Google
            </button>

            {message && (
                <p>{message}</p>
            )}
        </div>
    );
}
