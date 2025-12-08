import { create } from "zustand";
import { API_URL } from "../constants/api";

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: false,
    isCheckingAuth: true,

    register: async (name, email, cnic, password) => {
        set({ isLoading: true });

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, cnic, password }),
            });

            const data = await response.json();
            if (!response.ok)
                throw new Error(data.message || "Registration failed! Something went wrong.");

            // Save to localStorage
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);

            set({ user: data.user, token: data.token, isLoading: false });

            return { success: true };
        } catch (error) {
            console.log("Registration error:", error);
            set({ isLoading: false });
            return { success: false, error: error.message };
        }
    },

    login: async (email, password) => {
        set({ isLoading: true });

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok)
                throw new Error(data.message || "Login failed! Something went wrong.");

            // Save to localStorage
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);

            set({ user: data.user, token: data.token, isLoading: false });

            return { success: true };
        } catch (error) {
            console.log("Login error:", error);
            set({ isLoading: false });
            return { success: false, error: error.message };
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const token = localStorage.getItem("token");
            const userJson = localStorage.getItem("user");
            const user = userJson ? JSON.parse(userJson) : null;
            set({ user, token });
        } catch (error) {
            console.log("Error checking auth:", error);
            set({ user: null, token: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    logout: () => {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            set({ user: null, token: null, isCheckingAuth: false });
        } catch (error) {
            console.log("Error during logout:", error);
        }
    },
}));
