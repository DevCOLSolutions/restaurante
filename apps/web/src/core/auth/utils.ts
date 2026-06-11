import type { UserRole } from "./types"

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
