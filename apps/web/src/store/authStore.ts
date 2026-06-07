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

const memoryStorage: Record<string, string> = {}

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return window.localStorage.getItem(key)
    } catch {
      return memoryStorage[key] ?? null
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      window.localStorage.setItem(key, value)
    } catch {
      memoryStorage[key] = value
    }
  },
  removeItem: (key: string): void => {
    try {
      window.localStorage.removeItem(key)
    } catch {
      delete memoryStorage[key]
    }
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      setToken: (token) => set({ token }),
    }),
    {
      name: "rest2025-auth",
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)