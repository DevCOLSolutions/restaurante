import type { Filter } from "../types"

export const filters: Filter[] = [
  { value: "all", label: "Todas" },
  { value: "libre", label: "Disponibles" },
  { value: "ocupada", label: "Ocupadas" },
  { value: "reservada", label: "Reservadas" },
]
