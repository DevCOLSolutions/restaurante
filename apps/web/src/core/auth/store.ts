import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthState, User } from "./types"
import { UserRole } from "./types"

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      restaurantId: null,
      permissions: [],
      isAuthenticated: false,

      login: (user: User) =>
        set({
          user,
          role: user.role,
          restaurantId: user.restaurantId,
          permissions: getPermissionsForRole(user.role),
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          role: null,
          restaurantId: null,
          permissions: [],
          isAuthenticated: false,
        }),

      setRole: (role: UserRole) =>
        set({
          role,
          permissions: getPermissionsForRole(role),
          isAuthenticated: true,
          user: {
            id: "dev-user",
            name: `Developer (${role})`,
            email: `dev@${role.toLowerCase()}.rest`,
            role,
            restaurantId: "rest-001",
          },
        }),
    }),
    {
      name: "rest2025-auth",
    },
  ),
)

function getPermissionsForRole(role: UserRole): string[] {
  const base = ["view:menu"]
  switch (role) {
    case UserRole.GlobalManager:
      return [...base, "view:dashboard", "view:tables", "view:orders", "view:reports", "view:cocina", "manage:users", "manage:menu", "manage:settings", "manage:tables"]
    case UserRole.Mesero:
      return [...base, "view:dashboard", "view:tables", "view:orders", "view:cocina", "create:order", "edit:order", "close:order"]
    case UserRole.AreaCocina:
      return [...base, "view:cocina", "update:order-status", "view:orders"]
    case UserRole.ConsumidorFinal:
      return [...base, "create:order", "view:own-orders", "manage:cart"]
    default:
      return base
  }
}
