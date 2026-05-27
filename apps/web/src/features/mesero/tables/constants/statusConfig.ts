import type { StatusConfig, TableStatus } from "../types"

export const statusConfig: Record<TableStatus, StatusConfig> = {
  libre:    { dot: "bg-emerald-600",  badge: "bg-emerald-100 text-emerald-700", label: "Disponible" },
  ocupada:  { dot: "bg-[#F59E0B]",   badge: "bg-amber-100 text-amber-700",     label: "Ocupada" },
  reservada:{ dot: "bg-blue-500",    badge: "bg-blue-100 text-blue-700",       label: "Reservada" },
  limpieza: { dot: "bg-neutral-400", badge: "bg-neutral-100 text-neutral-600", label: "Limpieza" },
}

export const statusLabels: Record<string, string> = {
  all: "Todas",
  libre: "Disponibles",
  ocupada: "Ocupadas",
  reservada: "Reservadas",
}
