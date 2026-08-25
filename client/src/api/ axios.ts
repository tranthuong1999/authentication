import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:4000",
    withCredentials: true,
});

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
    accessToken = token;
}

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest =
            error.config as typeof error.config & {
                _retry?: boolean;
            };

        const isRefreshRequest =
            originalRequest.url ===
            "/auth/refresh";

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isRefreshRequest
        ) {
            originalRequest._retry = true;

            try {
                await api.post(
                    "/auth/refresh"
                );

                return api(originalRequest);
            } catch (refreshError) {
                return Promise.reject(
                    refreshError
                );
            }
        }

        return Promise.reject(error);
    }
);