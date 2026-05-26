export const UserRole = {
  GlobalManager: "GlobalManager",
  Mesero: "Mesero",
  AreaCocina: "AreaCocina",
  ConsumidorFinal: "ConsumidorFinal",
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  restaurantId: string
  avatar?: string
}

export interface AuthState {
  user: User | null
  role: UserRole | null
  restaurantId: string | null
  permissions: string[]
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  setRole: (role: UserRole) => void
}
