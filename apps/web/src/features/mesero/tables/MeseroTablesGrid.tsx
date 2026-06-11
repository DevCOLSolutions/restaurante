import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Table2, Users, Plus, Eye, ArrowRight, ClipboardList } from "lucide-react"
import { useMesas } from "@/features/global-manager/hooks/useMesas"
import { useOrdenesPorMesero } from "@/features/mesero/hooks/useOrdenesPorMesero"
import type { Mesa, Orden } from "@/types/api"

const statusConfig: Record<string, { dot: string; label: string }> = {
  disponible: { dot: "bg-emerald-600", label: "Disponible" },
  ocupada: { dot: "bg-[#F59E0B]", label: "Ocupada" },
  reservada: { dot: "bg-blue-500", label: "Reservada" },
}

const filters = [
  { value: "mis-mesas", label: "Mis mesas" },
  { value: "todas", label: "Todas" },
  { value: "disponible", label: "Disponibles" },
  { value: "ocupada", label: "Ocupadas" },
  { value: "reservada", label: "Reservadas" },
]

export function MeseroTablesGrid() {
  const { data: mesas, isLoading } = useMesas()
  const { data: ordenes } = useOrdenesPorMesero()
  const [activeFilter, setActiveFilter] = useState("mis-mesas")

  const ordenesMap = useMemo(() => {
    if (!ordenes) return new Map<string, Orden[]>()
    const map = new Map<string, Orden[]>()
    for (const o of ordenes) {
      if (o.estado === "cerrada") continue
      const arr = map.get(o.mesaId) ?? []
      arr.push(o)
      map.set(o.mesaId, arr)
    }
    return map
  }, [ordenes])

  const misMesasIds = useMemo(() => new Set(ordenesMap.keys()), [ordenesMap])

  const filtered = useMemo(() => {
    if (!mesas) return []
    if (activeFilter === "mis-mesas") return mesas.filter((m) => misMesasIds.has(m.id))
    if (activeFilter === "todas") return mesas
    return mesas.filter((m) => m.estado === activeFilter)
  }, [mesas, activeFilter, misMesasIds])

  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              activeFilter === f.value
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-sm text-neutral-400 py-12">No hay mesas</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filtered.map((mesa) => (
            <MesaCard key={mesa.id} mesa={mesa} ordenes={ordenesMap.get(mesa.id)} esMia={misMesasIds.has(mesa.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

function MesaCard({ mesa, ordenes, esMia }: { mesa: Mesa; ordenes?: Orden[]; esMia?: boolean }) {
  const navigate = useNavigate()
  const cfg = statusConfig[mesa.estado] ?? statusConfig.disponible
  const isFree = mesa.estado === "disponible"
  const tieneActiva = !!ordenes?.length

  return (
    <div onClick={() => navigate(`/app/mesero/mesa/${mesa.id}`)}
      className="flex items-center gap-3 rounded-xl bg-white border border-neutral-200 px-3.5 py-2.5 cursor-pointer hover:border-neutral-300 transition-colors"
    >
      <div className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-neutral-900 truncate">Mesa {String(mesa.numero).padStart(2, "0")}</span>
          <span className="text-xs text-neutral-400 truncate"> {mesa.nombre}</span>
        </div>
        <div className="flex items-center gap-2.5 text-[11px] text-neutral-500 mt-0.5">
          <span className="flex items-center gap-1">
            <Users size={11} />
            {mesa.capacidad} 
          </span>
          <span className="flex items-center gap-1">
            <Table2 size={11} />
            Zona: {mesa.zonaNombre}
          </span>
          {esMia && tieneActiva && (
            <span className="flex items-center gap-1 text-amber-600 font-medium">
              <ClipboardList size={11} />
              {ordenes![0].productos.reduce((s, i) => s + i.cantidad, 0)} prod.
            </span>
          )}
        </div>
      </div>

      <div
        className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
          isFree && !tieneActiva
            ? "bg-neutral-900 text-white hover:bg-neutral-800"
            : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
        }`}
      >
        {isFree && !tieneActiva ? (
          <>
            <Plus size={12} />
            Tomar pedido
          </>
        ) : (
          <>
            <Eye size={12} />
            Ver
            <ArrowRight size={12} className="-mr-0.5" />
          </>
        )}
      </div>
    </div>
  )
}
