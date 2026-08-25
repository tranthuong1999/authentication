import { create } from "zustand";

import {
    register as registerApi,
    getMe,
    logout as logoutApi,
    login as loginApi,
    type User,
} from "../services/auth.service";

interface AuthState {
    user: User | null;
    loading: boolean;

    initialize: () => Promise<void>;
    login: (
        email: string,
        password: string
    ) => Promise<void>;
    register: (
        email: string,
        password: string
    ) => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore =
    create<AuthState>((set) => ({
        user: null,
        loading: true,

        initialize: async () => {
            try {
                const user = await getMe();

                set({ user });
            } catch {
                set({ user: null });
            } finally {
                set({ loading: false });
            }
        },

        login: async (
            email,
            password
        ) => {
            await loginApi(
                email,
                password
            );

            const user = await getMe();

            set({ user });
        },

        register: async (
            email,
            password
        ) => {
            await registerApi(
                email,
                password
            );

            const user = await getMe();

            set({ user });
        },

        logout: async () => {
            await logoutApi();

            set({ user: null });
        },
    }));
