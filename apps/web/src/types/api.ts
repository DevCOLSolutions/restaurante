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
  roles?: string[]
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
  numeroOrden: number
  estado: string
  mesaId: string
  mesaNumero: number
  mesaNombre: string
  meseroId: string
  meseroNombre: string
  subtotal: number
  impuesto: number
  descuento: number
  propina: number
  total: number
  notas: string | null
  dedicatoria: string | null
  cerradaEn: string | null
  creadoEn: string
  actualizadoEn: string | null
  productos: OrdenProducto[]
}

export interface OrdenProducto {
  id: string
  itemMenuId: string
  itemMenuNombre: string
  areaCocinaId: string | null
  areaCocinaNombre: string | null
  cantidad: number
  precioUnitario: number
  descuento: number
  subtotal: number
  notas: string | null
  estado: string
  enviadoEn: string | null
  listoEn: string | null
  creadoEn: string
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

export interface UsuarioItem {
  id: string
  email: string
  roles: string[]
  name?: string
  username?: string
  activo?: boolean
}

export interface AdministradorSucursal {
  usuarioId: string
  nombreUsuario: string
  email: string
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
  adminId?: string | null
}

export interface Zona {
  id: string
  restauranteId: string
  sucursalId: string
  nombre: string
  descripcion?: string
  activa: boolean
}

export interface Producto {
  id: string
  nombre: string
  descripcion: string
  precio: number
  categoria: string
  disponible: boolean
}

export interface MenuProducto {
  id: string
  restauranteId: string
  categoriaId: string
  categoriaNombre: string
  areaRecepcionId: string | null
  areaRecepcionNombre: string | null
  nombre: string
  descripcion: string | null
  precio: number
  costo: number
  impuestoPct: number
  disponible: boolean
  esModificable: boolean
  tiempoPrepMin: number
  calorias: number
  etiquetas: string[]
  orden: number
  activo: boolean
  creadoEn: string
}

export interface MenuCategoria {
  id: string
  restauranteId: string
  nombre: string
  descripcion: string | null
  orden: number
  activa: boolean
}

export interface ProductoAreaCocina {
  id: string
  ordenId: string
  numeroOrden: number
  estadoOrden: string
  mesaId: string
  mesaNumero: number
  mesaNombre: string
  itemMenuId: string
  itemMenuNombre: string
  areaCocinaId: string
  areaCocinaNombre: string
  cantidad: number
  precioUnitario: number
  descuento: number
  subtotal: number
  notasProducto: string | null
  estadoProducto: string
  enviadoEn: string | null
  listoEn: string | null
  creadoEn: string
}

export interface Notificacion {
  id: string
  tipo: string
  titulo: string
  mensaje: string
  referenciaId: string | null
  referenciaTipo: string | null
  leida: boolean
  leidaEn: string | null
  creadoEn: string
}

export interface NotificacionesResponse {
  items: Notificacion[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface NotificacionesNoLeidasCount {
  cantidad: number
}

export interface NotificacionDto {
  id: string
  tipo: string
  titulo: string | null
  mensaje: string | null
  referenciaId: string | null
  referenciaTipo: string | null
  leida: boolean
  leidaEn: string | null
  creadoEn: string
}

export interface OrdenDto {
  id: string
  numeroOrden: number
  estado: string
  mesaId: string
  mesaNumero: number | null
  mesaNombre: string | null
  meseroId: string | null
  meseroNombre: string | null
  subtotal: number
  impuesto: number
  descuento: number
  propina: number
  total: number
  notas: string | null
  dedicatoria: string | null
  cerradaEn: string | null
  creadoEn: string
  actualizadoEn: string | null
  productos: OrdenProductoDto[]
}

export interface OrdenProductoDto {
  id: string
  itemMenuId: string
  itemMenuNombre: string | null
  areaCocinaId: string | null
  areaCocinaNombre: string | null
  cantidad: number
  precioUnitario: number
  descuento: number
  subtotal: number
  notas: string | null
  estado: string
  enviadoEn: string | null
  listoEn: string | null
  creadoEn: string
}

export interface ProductoActualizadoPayload {
  ordenId: string
  numeroOrden: number
  producto: OrdenProductoDto
}

export interface DashboardMesas {
  totalMesas: number
  mesasDisponibles: number
  mesasOcupadas: number
  mesasReservadas: number
  mesasFueraDeServicio: number
}
