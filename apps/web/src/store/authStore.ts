import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { User } from "@/types/api"

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  setToken: (token: string) => void
}

const safeStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value)
    } catch {}
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key)
    } catch {}
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token: string, user: User) =>
        set({ token, user, isAuthenticated: true }),

      logout: () =>
        set({ token: null, user: null, isAuthenticated: false }),

      setToken: (token: string) => set({ token }),
    }),
    {
      name: "rest2025-auth-token",
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)