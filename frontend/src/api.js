import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
    withCredentials: true, // Important for Sanctum
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expiré ou invalide
            localStorage.removeItem("authToken");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
