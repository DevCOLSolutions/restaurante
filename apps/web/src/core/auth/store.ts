import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface SimpleUser {
  id: string
  name: string
  email: string
  role: string
  restaurantId: string
  sucursalId?: string
}

interface AuthState {
  user: SimpleUser | null
  isAuthenticated: boolean
  login: (user: SimpleUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (user) =>
        set({ user, isAuthenticated: true }),

      logout: () =>
        set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "rest2025-auth",
    },
  ),
)
