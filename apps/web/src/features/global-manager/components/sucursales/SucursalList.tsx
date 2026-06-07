import { SucursalCard } from "./SucursalCard"
import type { Sucursal } from "@/types/api"

interface SucursalListProps {
  sucursales: Sucursal[]
  onView: (id: string) => void
  onEdit: (sucursal: Sucursal) => void
}

export function SucursalList({ sucursales, onView, onEdit }: SucursalListProps) {
  return (
    <div className="space-y-2">
      {sucursales.map((s) => (
        <SucursalCard key={s.id} sucursal={s} onView={onView} onEdit={onEdit} />
      ))}
    </div>
  )
}
