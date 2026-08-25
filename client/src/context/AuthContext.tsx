import {
    createContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";


import {
    register as registerApi,
    getMe,
    logout as logoutApi,
    login as loginApi,
    type User,
} from "../services/auth.service";

interface AuthContextValue {
    user: User | null;
    loading: boolean;

    register: (
        email: string,
        password: string
    ) => Promise<void>;

    logout: () => Promise<void>;

    login: (
        email: string,
        password: string
    ) => Promise<void>;
}

export const AuthContext =
    createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [user, setUser] =
        useState<User | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        async function initializeAuth() {
            try {
                const user = await getMe();

                setUser(user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        initializeAuth();
    }, []);

    async function register(
        email: string,
        password: string
    ) {
        await registerApi(
            email,
            password
        );

        const user = await getMe();

        setUser(user);
    }

    async function logout() {
        await logoutApi();

        setUser(null);
    }

    async function login(
        email: string,
        password: string
    ) {
        await loginApi(
            email,
            password
        );

        const user = await getMe();

        setUser(user);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                register,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}