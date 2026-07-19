import axios from "axios";

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g. https://api.example.com
    headers: { "Content-Type": "application/json" },
});

// apiClient.interceptors.request.use((config) => {
//     const token = getAccessToken(); // from cookies/session
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
// });