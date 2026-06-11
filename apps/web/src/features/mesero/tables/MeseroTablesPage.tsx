import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { NotificationBell } from "../components/NotificationBell"
import { useDashboardResumen } from "@/features/global-manager/hooks/useDashboardResumen"
import { useMe } from "@/hooks/useMe"
import { MeseroTablesGrid } from "./MeseroTablesGrid"

export function MeseroTablesPage() {
  const { data: mesas, isLoading: isLoadingMesas } = useDashboardResumen()
  const { data: user } = useMe()
  const navigate = useNavigate()

  return (
    <div className="w-full pb-4">
      <div className="relative w-full bg-neutral-900 px-5 pt-5 pb-6 rounded-b-4xl overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white">
              <ArrowLeft size={22} />
            </button>
            <div>
              <p className="text-xs text-white/50">{user?.data.restauranteNombre} ∙
              <span className="text-white/70 font-medium"> {user?.data.sucursalNombre}</span></p>
              <h1 className="text-xl font-medium text-white tracking-tight">Mesas</h1>
            </div>
          </div>
          <NotificationBell />
        </div>
        {!isLoadingMesas && (
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/10 border border-white/10 rounded-2xl px-3 py-2.5 text-center">
              <span className="block text-lg font-medium text-white leading-none">{mesas?.totalMesas}</span>
              <span className="block text-xs text-white/40 mt-1">Totales</span>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-2xl px-3 py-2.5 text-center">
              <span className="block text-lg font-medium text-white leading-none">{mesas?.mesasDisponibles}</span>
              <span className="block text-xs text-white/40 mt-1">Disponibles</span>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-2xl px-3 py-2.5 text-center">
              <span className="block text-lg font-medium text-white leading-none">{mesas?.mesasOcupadas}</span>
              <span className="block text-xs text-white/40 mt-1">Ocupadas</span>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 mt-4">
        <MeseroTablesGrid />
      </div>
    </div>
  )
}
