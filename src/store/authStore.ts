import { create } from "zustand";
import type { User } from "@/types/post";

interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoggedIn: false,

  setAuth: (token, user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }

    set({
      token,
      user,
      isLoggedIn: true,
    });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    }

    set({
      token: null,
      user: null,
      isLoggedIn: false,
    });
  },

  initialize: () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        set({
          token,
          user: JSON.parse(user) as User,
          isLoggedIn: true,
        });
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        set({
          token: null,
          user: null,
          isLoggedIn: false,
        });
      }
    }
  },
}));