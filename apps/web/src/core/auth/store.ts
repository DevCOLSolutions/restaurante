import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface SimpleUser {
  id: string
  name: string
  email: string
  role: string
  roles: string[]
  restaurantId: string
  sucursalId?: string
}

interface AuthState {
  user: SimpleUser | null
  isAuthenticated: boolean
  expiresAt: string | null
  login: (user: SimpleUser, expiresAt?: string) => void
  setExpiresAt: (expiresAt: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      expiresAt: null,

      login: (user, expiresAt) =>
        set({ user, isAuthenticated: true, expiresAt: expiresAt ?? null }),

      setExpiresAt: (expiresAt) => set({ expiresAt }),

      logout: () =>
        set({ user: null, isAuthenticated: false, expiresAt: null }),
    }),
    {
      name: "rest2025-auth",
    },
  ),
)
