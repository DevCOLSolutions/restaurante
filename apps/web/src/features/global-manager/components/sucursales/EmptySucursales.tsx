import { Store, Plus } from "lucide-react"

interface EmptySucursalesProps {
  onCreate: () => void
}

export function EmptySucursales({ onCreate }: EmptySucursalesProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 text-neutral-300 mb-4">
        <Store size={28} />
      </div>
      <p className="text-sm font-semibold text-neutral-700 mb-1">No hay sucursales</p>
      <p className="text-xs text-neutral-400 mb-6 max-w-[220px]">
        Crea tu primera sucursal para empezar a gestionar tu restaurante.
      </p>
      <button
        onClick={onCreate}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
      >
        <Plus size={16} />
        Crear sucursal
      </button>
    </div>
  )
}
