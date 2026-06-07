import { Store, MapPin, Eye,Table2 } from "lucide-react"
import type { Sucursal } from "@/types/api"

interface SucursalCardProps {
  sucursal: Sucursal
  onView: (id: string) => void
  onEdit: (sucursal: Sucursal) => void
}

export function SucursalCard({ sucursal, onView }: SucursalCardProps) {
  return (
    <div className="rounded-2xl bg-white border border-neutral-200 p-4 flex items-center justify-between shadow-sm">
      
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 text-neutral-600 shrink-0">
          <Store size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-neutral-900 truncate">{sucursal.nombre}</p>
          <div className="flex items-center gap-1 mt-1">
            {sucursal.direccion && (
              <p className="text-xs text-neutral-400 truncate flex items-center gap-1">
                <MapPin size={10} />
                {sucursal.direccion} ∙
              </p> 
            )}
            <p className="text-xs text-neutral-400 flex items-center gap-1">
              <Table2 size={10} />
              {sucursal.cantidadMesas} mesas
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 ml-3 shrink-0">
        <button
          onClick={() => onView(sucursal.id)}
          className="rounded-lg border border-neutral-200 p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
          title="Ver sucursal"
        >
          <Eye size={15} />
        </button>
        
      </div>
    </div>
  )
}
