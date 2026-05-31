import { useState } from "react"
import type { TableInfo } from "../types"

const filters = ["Todas", "Disponibles", "Ocupadas", "Reservadas"]

const statusConfig: Record<string, { dot: string; label: string }> = {
  libre: { dot: "bg-emerald-500", label: "Libre" },
  ocupada: { dot: "bg-amber-400", label: "Ocupada" },
  reservada: { dot: "bg-blue-500", label: "Reservada" },
  limpieza: { dot: "bg-neutral-500", label: "Limpieza" },
}

interface MesasEstadoProps {
  tables: TableInfo[]
  onToggleStatus: (id: string) => void
  activeZone: string
  onZoneChange: (zone: string) => void
  zones: { name: string; description: string }[]
}

export function MesasEstado({ tables, onToggleStatus, activeZone, onZoneChange, zones }: MesasEstadoProps) {
  const [activeFilter, setActiveFilter] = useState("Todas")

  const zoneTables = activeZone === "Todas" ? tables : tables.filter((t) => t.zone === activeZone)

  const filtered =
    activeFilter === "Todas"
      ? zoneTables
      : activeFilter === "Disponibles"
        ? zoneTables.filter((t) => t.status === "libre")
        : activeFilter === "Ocupadas"
          ? zoneTables.filter((t) => t.status === "ocupada")
          : zoneTables.filter((t) => t.status === "reservada")

  return (
    <div className="rounded-3xl bg-white border border-neutral-200 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-neutral-900">Mesas</h3>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5 text-neutral-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Libre
          </span>
          <span className="flex items-center gap-1.5 text-neutral-500">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Ocupada
          </span>
          <span className="flex items-center gap-1.5 text-neutral-500">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Reservada
          </span>
        </div>
      </div>

      {/* Zone tabs */}
      <div className="flex gap-1.5 mb-4">
        {zones.map((zone) => (
          <button
            key={zone.name}
            onClick={() => onZoneChange(zone.name)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              activeZone === zone.name
                ? "bg-neutral-900 text-white shadow-sm"
                : "bg-neutral-100 text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {zone.name}
          </button>
        ))}
      </div>

      {/* Filter pills */}
      <div className="flex gap-1.5 mb-5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium transition-all duration-300 ${
              activeFilter === f
                ? "bg-neutral-200 text-neutral-800"
                : "bg-neutral-100 text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {filtered.map((table) => {
          const cfg = statusConfig[table.status] ?? { dot: "bg-neutral-500", label: table.status }
          const isOcupada = table.status === "ocupada"
          const isReservada = table.status === "reservada"

          return (
            <button
              key={table.id}
              onClick={() => onToggleStatus(table.id)}
              className="flex items-center justify-between rounded-2xl bg-neutral-50 border border-neutral-200 p-4 transition-all duration-200 hover:scale-[1.02] hover:border-neutral-300 hover:shadow-sm text-left"
            >
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`} />
                <div>
                  <p className="text-sm font-semibold text-neutral-900">Mesa #{table.number}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{table.seats} personas</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-neutral-900">
                  {isOcupada && table.time ? table.time : isReservada && table.time ? table.time : ""}
                </p>
                <p className={`text-[11px] font-medium mt-0.5 ${cfg.dot.replace("bg-", "text-")}`}>
                  {cfg.label}
                </p>
              </div>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-8 text-sm text-neutral-400">
            No hay mesas en este filtro
          </div>
        )}
      </div>
    </div>
  )
}
