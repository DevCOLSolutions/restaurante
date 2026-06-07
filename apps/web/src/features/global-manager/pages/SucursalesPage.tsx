import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BadgeInfo, Plus } from "lucide-react"
import { useSucursales } from "../hooks/useSucursales"
import { SucursalList } from "../components/sucursales/SucursalList"
import { EmptySucursales } from "../components/sucursales/EmptySucursales"
import { SucursalModal } from "../components/sucursales/SucursalModal"
import type { Sucursal } from "@/types/api"
import { HeroSucursales } from "../components/sucursales/HeroSucursales"

export function SucursalesPage() {
  const navigate = useNavigate()
  const { data: sucursales, isLoading } = useSucursales()
  const [editingSucursal, setEditingSucursal] = useState<Partial<Sucursal> | null>(null)

  return (
    <div className="space-y-4">
      <HeroSucursales />

      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-neutral-400 flex items-center gap-1">
            <span className="font-bold ">
              {isLoading ? "Cargando..." : `${sucursales?.length ?? 0} `}
            </span>
             de 
             <span className="font-bold ">8</span> sucursales <BadgeInfo size={16} />
          </p>
          <button
            onClick={() => setEditingSucursal({})}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors"
          >
            <Plus size={14} />
            Agregar sucursal
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
          </div>
        ) : sucursales && sucursales.length > 0 ? (
          <SucursalList
            sucursales={sucursales}
            onView={(id) => navigate(`/app/global-manager/sucursales/${id}`)}
            onEdit={(s) => setEditingSucursal(s)}
          />
        ) : (
          <EmptySucursales onCreate={() => setEditingSucursal({})} />
        )}
      </div>

      {editingSucursal !== null && (
        <SucursalModal sucursal={editingSucursal} onClose={() => setEditingSucursal(null)} />
      )}
    </div>
  )
}
