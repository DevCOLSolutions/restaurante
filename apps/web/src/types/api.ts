export interface ApiError {
  status: number
  message: string
  body?: unknown
}

export interface ApiResponse<T> {
  success: boolean
  statusCode: number
  message: string
  data: T | null
  errors: string[] | null
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginUser {
  userId: string
  username: string
  role: string
  restauranteId: string
  sucursalId: string
}

export interface LoginData {
  expiresAt: string
  user: LoginUser
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface AuthResponse {
  token: string
  user: User
}

export interface User {
  id: string
  email: string
  roles: string[]
  name?: string
  avatar?: string
}

export interface Orden {
  id: string
  mesaId: string
  meseroId: string
  items: OrdenItem[]
  total: number
  estado: "pendiente" | "en_preparacion" | "listo" | "entregado" | "pagado"
  createdAt: string
  updatedAt: string
}

export interface OrdenItem {
  id: string
  productoId: string
  nombre: string
  cantidad: number
  precio: number
}

export interface Mesa {
  id: string
  restauranteId: string
  sucursalId: string
  zonaId: string
  numero: number
  nombre: string
  capacidad: number
  estado: "disponible" | "ocupada" | "reservada"
  activa: boolean
  zonaNombre: string
  sucursalNombre: string | null
}

export interface Sucursal {
  id: string
  restauranteId: string
  nombre: string
  direccion: string | null
  telefono: string | null
  cantidadMesas: number
  activa: boolean
  creadoEn: string
  actualizadoEn: string | null
}

export interface Zona {
  id: string
  nombre: string
  descripcion?: string
}

export interface Producto {
  id: string
  nombre: string
  descripcion: string
  precio: number
  categoria: string
  disponible: boolean
}
