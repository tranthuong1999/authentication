import { api } from "../api/axios";

export interface User {
    _id: string;
    email: string;
    createdAt?: string;
}

export interface AuthResponse {
    message: string;
    user: User;
}

export async function register(
    email: string,
    password: string
) {
    const response =
        await api.post<AuthResponse>(
            "/auth/register",
            {
                email,
                password,
            }
        );

    return response.data;
}

export async function login(
    email: string,
    password: string
) {
    const response =
        await api.post<AuthResponse>(
            "/auth/login",
            {
                email,
                password,
            }
        );

    return response.data;
}

export async function getMe() {
    const response =
        await api.get<AuthResponse>("/api/me");

    return response.data.user;
}

export async function refresh() {
    const response =
        await api.post(
            "/auth/refresh"
        );

    return response.data;
}

export async function logout() {
    const response =
        await api.post(
            "/auth/logout"
        );

    return response.data;
}