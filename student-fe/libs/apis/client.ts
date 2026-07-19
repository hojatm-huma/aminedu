import axios from "axios";

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g. https://api.example.com
    headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const redirectToLogin = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
    }
};

let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
    const { accountApi } = await import("./accounts");
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;
    if (!refreshToken) throw new Error("No refresh token");

    const { data } = await accountApi.refreshToken(refreshToken);
    localStorage.setItem("access_token", data.access);
    if (data.refresh) localStorage.setItem("refresh_token", data.refresh);
    return data.access;
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const isRefreshCall = originalRequest?.url?.includes("/accounts/token/refresh/");

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isRefreshCall) {
            originalRequest._retry = true;

            try {
                refreshPromise = refreshPromise ?? refreshAccessToken();
                const accessToken = await refreshPromise;
                refreshPromise = null;

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                refreshPromise = null;
                redirectToLogin();
                return Promise.reject(refreshError);
            }
        }

        if (error.response?.status === 401 && isRefreshCall) {
            redirectToLogin();
        }

        return Promise.reject(error);
    }
);