import axios from "axios";
export const api = axios.create({ baseURL: "/api" });
export function setUser(id: number){ api.defaults.headers.common["X-User-Id"] = String(id); }
