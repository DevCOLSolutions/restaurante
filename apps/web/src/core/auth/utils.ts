import type { UserRole } from "./types"

const ROLE_PRIORITY: Record<string, number> = {
  GlobalManager: 5,
  AdminSucursal: 4,
  Mesero: 3,
  Cocinero: 3,
  ConsumidorFinal: 2,
}

export function getDashboardPathForRole(role: UserRole): string {
  switch (role) {
    case "GlobalManager":
      return "/app/global-manager"
    case "AdminSucursal":
      return "/app/admin-sucursal"
    case "Mesero":
      return "/app/mesero"
    case "Cocinero":
      return "/app/cocina"
    case "ConsumidorFinal":
      return "/app/consumidor"
    default:
      return "/app/global-manager"
  }
}

export function getPrimaryDashboardForRoles(roles: string[]): string {
  const sorted = [...roles].sort((a, b) => (ROLE_PRIORITY[b] ?? 0) - (ROLE_PRIORITY[a] ?? 0))
  return getDashboardPathForRole((sorted[0] ?? "GlobalManager") as UserRole)
}
