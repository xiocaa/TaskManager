import axios, { AxiosHeaders } from "axios";

export const api = axios.create({ baseURL: "/api", timeout: 10000 });

let currentUserId: number | undefined;

export function setUser(id?: number) {
    currentUserId = id;
    if (id !== undefined) localStorage.setItem("userId", String(id));
    else localStorage.removeItem("userId");
}

export function loadUserFromStorage() {
    const raw = localStorage.getItem("userId");
    currentUserId = raw ? Number(raw) : undefined;
}

api.interceptors.request.use((config) => {
    if (currentUserId !== undefined) {
        const headers = AxiosHeaders.from(config.headers || {});
        headers.set("X-User-Id", String(currentUserId));
        config.headers = headers;
    }
    return config;
});


