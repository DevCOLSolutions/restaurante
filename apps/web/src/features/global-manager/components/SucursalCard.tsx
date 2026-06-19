import { Store, MapPin, Phone, Pencil, Trash2, Settings2, ChevronDown, ChevronRight } from "lucide-react"
import { useSucursalStore } from "../store/sucursalStore"
import type { SucursalData, TableInfo } from "../types"

const statusColor: Record<string, string> = {
  libre: "bg-emerald-500",
  ocupada: "bg-amber-400",
  reservada: "bg-blue-500",
}

const statusLabel: Record<string, string> = {
  libre: "Libre",
  ocupada: "Ocupada",
  reservada: "Reservada",
}

const nextStatus: Record<string, TableInfo["status"]> = {
  libre: "ocupada",
  ocupada: "reservada",
  reservada: "libre",
}

interface Props {
  suc: SucursalData
  isExpanded: boolean
  onToggle: () => void
  onEdit: (suc: SucursalData) => void
  onDelete: (id: string) => void
  onManageZones: (suc: SucursalData) => void
  onManageMeseros: (suc: SucursalData) => void
  onManageAdmins: (suc: SucursalData) => void
  allKitchenAreas: { name: string; description: string }[]
}

export function SucursalCard({ suc, isExpanded, onToggle, onEdit, onDelete, onManageZones, onManageMeseros, onManageAdmins, allKitchenAreas }: Props) {
  const updateTableStatus = useSucursalStore((s) => s.updateTableStatus)

  const toggleTableStatus = (table: TableInfo) => {
    updateTableStatus(suc.id, table.id, nextStatus[table.status])
  }

  return (
    <div className="rounded-3xl bg-white border border-neutral-200 shadow-sm overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors text-left">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 text-neutral-600 shrink-0">
            <Store size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-neutral-900">{suc.name}</p>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-400">
              <span className="flex items-center gap-1"><MapPin size={10} />{suc.address}</span>
              <span className="flex items-center gap-1"><Phone size={10} />{suc.phone}</span>
            </div>
          </div>
        </div>
        {isExpanded ? <ChevronDown size={18} className="text-neutral-400 shrink-0" /> : <ChevronRight size={18} className="text-neutral-400 shrink-0" />}
      </button>

      <div className="px-4 pb-2 flex gap-2">
        <button onClick={() => onEdit(suc)} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-600 text-[11px] font-medium hover:bg-neutral-200 transition-colors">
          <Pencil size={12} /> Editar
        </button>
        <button onClick={() => { if (confirm(`¿Eliminar sucursal "${suc.name}"?`)) onDelete(suc.id) }} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 text-[11px] font-medium hover:bg-rose-100 transition-colors">
          <Trash2 size={12} /> Eliminar
        </button>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-neutral-700">ÁREAS DE MESAS</h3>
              <button onClick={() => onManageZones(suc)} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-900 text-white text-[11px] font-medium hover:bg-neutral-800 transition-colors">
                <Settings2 size={12} /> Gestionar
              </button>
            </div>
            {suc.zones.map((zone) => {
              const zoneTables = suc.tables.filter((t) => t.zone === zone.name)
              return (
                <div key={zone.name} className="mb-3 last:mb-0">
                  <p className="text-xs font-medium text-neutral-500 mb-1.5">{zone.name} ({zoneTables.length} mesas)</p>
                  <div className="flex flex-wrap gap-1.5">
                    {zoneTables.map((table) => (
                      <button
                        key={table.id}
                        onClick={() => toggleTableStatus(table)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all hover:scale-105 ${table.status === "libre" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : table.status === "ocupada" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}
                        title={statusLabel[table.status]}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusColor[table.status]}`} />
                        #{table.number}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-neutral-700">MESEROS</h3>
              <button onClick={() => onManageMeseros(suc)} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-900 text-white text-[11px] font-medium hover:bg-neutral-800 transition-colors">
                <Settings2 size={12} /> Gestionar
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suc.meseros.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-xl bg-white border border-neutral-200 px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-neutral-900 truncate">{m.name}</p>
                    <p className="text-[10px] text-neutral-400">{m.phone}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${m.status === "TURNO" ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"}`}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-neutral-700">ADMINISTRADORES</h3>
              <button onClick={() => onManageAdmins(suc)} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-900 text-white text-[11px] font-medium hover:bg-neutral-800 transition-colors">
                <Settings2 size={12} /> Gestionar
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suc.admins.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-xl bg-white border border-neutral-200 px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-neutral-900 truncate">{a.name}</p>
                    <p className="text-[10px] text-neutral-400">{a.phone}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${a.status === "TURNO" ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"}`}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-neutral-700">ÁREAS DE COCINA</h3>
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
              {allKitchenAreas.map((area) => (
                <span key={area.name} title={area.description} className="whitespace-nowrap text-xs bg-white border border-neutral-200 rounded-full px-3 py-1 text-neutral-700">
                  {area.name}
                </span>
              ))}
              {allKitchenAreas.length === 0 && (
                <span className="text-xs text-neutral-400">Sin áreas de cocina</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
