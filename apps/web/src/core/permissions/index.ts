import { useAuthStore } from "../auth/store"

export function hasPermission(permission: string): boolean {
  const permissions = useAuthStore.getState().permissions
  return permissions.includes(permission)
}

export function usePermission(permission: string): boolean {
  const permissions = useAuthStore((s) => s.permissions)
  return permissions.includes(permission)
}
