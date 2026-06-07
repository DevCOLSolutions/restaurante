export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REFRESH: "/auth/refresh",
  },
  ORDENES: {
    LIST: "/ordenes",
    GET: (id: string) => `/ordenes/${id}`,
    CREATE: "/ordenes",
    UPDATE: (id: string) => `/ordenes/${id}`,
    DELETE: (id: string) => `/ordenes/${id}`,
  },
  MESAS: {
    LIST: "/mesas",
    GET: (id: string) => `/mesas/${id}`,
    CREATE: "/mesas",
    UPDATE: (id: string) => `/mesas/${id}`,
    DELETE: (id: string) => `/mesas/${id}`,
  },
  PRODUCTOS: {
    LIST: "/productos",
    GET: (id: string) => `/productos/${id}`,
    CREATE: "/productos",
    UPDATE: (id: string) => `/productos/${id}`,
    DELETE: (id: string) => `/productos/${id}`,
  },
  MESEROS: {
    LIST: "/meseros",
    GET: (id: string) => `/meseros/${id}`,
    CREATE: "/meseros",
    UPDATE: (id: string) => `/meseros/${id}`,
    DELETE: (id: string) => `/meseros/${id}`,
  },
  SUCURSALES: {
    POR_RESTAURANTE: (restauranteId: string) => `/Sucursal/por-restaurante/${restauranteId}`,
    GET: (id: string) => `/Sucursal/${id}`,
    CREATE: "/Sucursal",
    UPDATE: (id: string) => `/Sucursal/${id}`,
    DELETE: (id: string) => `/Sucursal/${id}`,
    MESAS: (sucursalId: string) => `/sucursales/${sucursalId}/mesas`,
  },
  ZONAS: {
    POR_SUCURSAL: (sucursalId: string) => `/zonas/por-sucursal/${sucursalId}`,
  },
  COCINA: {
    LIST: "/cocina",
    GET: (id: string) => `/cocina/${id}`,
    UPDATE: (id: string) => `/cocina/${id}`,
  },
  REPORTES: {
    LIST: "/reportes",
    GET: (id: string) => `/reportes/${id}`,
  },
  USUARIOS: {
    LIST: "/usuarios",
    GET: (id: string) => `/usuarios/${id}`,
    CREATE: "/usuarios",
    UPDATE: (id: string) => `/usuarios/${id}`,
    DELETE: (id: string) => `/usuarios/${id}`,
  },
} as const
