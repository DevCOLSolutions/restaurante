const rolePermissions: Record<string, string[]> = {
  GlobalManager: ["view:menu", "view:dashboard", "view:tables", "view:orders", "view:reports", "view:cocina", "manage:users", "manage:menu", "manage:settings", "manage:tables"],
  AdminSucursal: ["view:menu", "view:dashboard", "view:tables", "view:orders", "view:cocina", "manage:users", "manage:menu", "manage:tables"],
  Mesero: ["view:menu", "view:dashboard", "view:tables", "view:orders", "view:cocina", "create:order", "edit:order", "close:order"],
  AreaCocina: ["view:menu", "view:cocina", "update:order-status", "view:orders"],
  ConsumidorFinal: ["view:menu", "create:order", "view:own-orders", "manage:cart"],
}

export function getPermissionsForRole(role: string): string[] {
  return rolePermissions[role] ?? ["view:menu"]
}

export function hasPermission(role: string, permission: string): boolean {
  return getPermissionsForRole(role).includes(permission)
}
