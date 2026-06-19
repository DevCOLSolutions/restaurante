import { useState } from "react"
import { X, Trash2, Plus } from "lucide-react"
import { useSucursalStore } from "../store/sucursalStore"
import type { SucursalData, SucursalZone, TableInfo } from "../types"

interface Props {
  sucursal: SucursalData | null
  onClose: () => void
}

const statusColor: Record<string, string> = {
  libre: "bg-emerald-500",
  ocupada: "bg-amber-400",
  reservada: "bg-blue-500",
}

export function ZoneModal({ sucursal, onClose }: Props) {
  const sucursales = useSucursalStore((s) => s.sucursales)
  const addZone = useSucursalStore((s) => s.addZone)
  const updateZone = useSucursalStore((s) => s.updateZone)
  const removeZone = useSucursalStore((s) => s.removeZone)
  const addTable = useSucursalStore((s) => s.addTable)
  const removeTable = useSucursalStore((s) => s.removeTable)

  const [zoneNewName, setZoneNewName] = useState("")
  const [zoneNewDesc, setZoneNewDesc] = useState("")
  const [zoneEditing, setZoneEditing] = useState<string | null>(null)
  const [zoneEditName, setZoneEditName] = useState("")
  const [zoneEditDesc, setZoneEditDesc] = useState("")
  const [addTableSeats, setAddTableSeats] = useState(4)

  if (!sucursal) return null

  const current = sucursales.find((s: SucursalData) => s.id === sucursal.id)
  if (!current) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="w-full sm:max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-white p-5 overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-neutral-900">Áreas y Mesas — {current.name}</h3>
          <button onClick={onClose}><X size={18} className="text-neutral-400" /></button>
        </div>

        <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4 mb-4">
          <p className="text-xs font-semibold text-neutral-700 mb-3">Agregar nueva área</p>
          <div className="space-y-2">
            <input value={zoneNewName} onChange={(e) => setZoneNewName(e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-neutral-400" placeholder="Nombre del área" />
            <input value={zoneNewDesc} onChange={(e) => setZoneNewDesc(e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-neutral-400" placeholder="Descripción" />
          </div>
          <button onClick={() => {
            if (!zoneNewName.trim()) return
            if (current.zones.some((z: SucursalZone) => z.name === zoneNewName.trim())) return
            addZone(current.id, { name: zoneNewName.trim(), description: zoneNewDesc.trim(), type: "salon", icon: "Sofa" })
            setZoneNewName("")
            setZoneNewDesc("")
          }} className="w-full rounded-xl bg-neutral-900 text-white py-2.5 text-xs font-medium hover:bg-neutral-800 transition-colors mt-3">
            <Plus size={14} className="inline mr-1" /> Agregar
          </button>
        </div>

        <div className="space-y-3">
          {current.zones.map((zone: SucursalZone) => {
            const zoneTables = current.tables.filter((t: TableInfo) => t.zone === zone.name)
            return (
              <div key={zone.name} className="rounded-2xl bg-white border border-neutral-200 p-3">
                <div className="flex items-center gap-2 mb-2">
                  {zoneEditing === zone.name ? (
                    <div className="flex-1 space-y-1.5">
                      <input value={zoneEditName} onChange={(e) => setZoneEditName(e.target.value)} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-2 py-1 text-sm font-semibold outline-none focus:border-neutral-400" placeholder="Nombre" />
                      <input value={zoneEditDesc} onChange={(e) => setZoneEditDesc(e.target.value)} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-2 py-1 text-xs outline-none focus:border-neutral-400" placeholder="Descripción" />
                    </div>
                  ) : (
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-neutral-900">{zone.name}</p>
                      {zone.description && <p className="text-xs text-neutral-500">{zone.description}</p>}
                    </div>
                  )}
                  {zoneEditing === zone.name ? (
                    <button onClick={() => {
                      if (zoneEditName.trim() && zoneEditName.trim() !== zone.name && !current.zones.some((z: SucursalZone) => z.name === zoneEditName.trim())) {
                        updateZone(current.id, zone.name, { ...zone, name: zoneEditName.trim(), description: zoneEditDesc.trim() || zone.description })
                      } else {
                        updateZone(current.id, zone.name, { ...zone, name: zone.name, description: zoneEditDesc.trim() || zone.description })
                      }
                      setZoneEditing(null)
                    }} className="text-xs font-medium text-emerald-600 hover:text-emerald-700 shrink-0">Guardar</button>
                  ) : (
                    <button onClick={() => { setZoneEditing(zone.name); setZoneEditName(zone.name); setZoneEditDesc(zone.description ?? "") }} className="text-xs font-medium text-neutral-400 hover:text-neutral-600 shrink-0">Editar</button>
                  )}
                  <button onClick={() => removeZone(current.id, zone.name)} className="shrink-0 rounded-lg p-1 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => {
                    if (zoneTables.length === 0) return
                    const last = [...zoneTables].reverse()[0]
                    removeTable(current.id, last.id)
                  }} className="rounded-lg border border-neutral-200 p-1.5 text-neutral-400 hover:text-rose-500 hover:border-rose-200 transition-colors disabled:opacity-30" disabled={zoneTables.length === 0}>
                    <Trash2 size={14} />
                  </button>
                  <span className="text-sm font-semibold text-neutral-800 tabular-nums">{zoneTables.length} mesas</span>
                  <button onClick={() => addTable(current.id, zone.name, addTableSeats)} className="rounded-lg border border-neutral-200 p-1.5 text-neutral-400 hover:text-emerald-500 hover:border-emerald-200 transition-colors">
                    <Plus size={14} />
                  </button>
                  <select value={addTableSeats} onChange={(e) => setAddTableSeats(Number(e.target.value))} className="ml-1 rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] outline-none">
                    <option value={2}>2p</option><option value={4}>4p</option><option value={6}>6p</option><option value={8}>8p</option>
                  </select>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {zoneTables.map((t: TableInfo) => (
                    <span key={t.id} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${t.status === "libre" ? "bg-emerald-50 text-emerald-700" : t.status === "ocupada" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}>
                      <span className={`w-1 h-1 rounded-full ${statusColor[t.status]}`} />
                      #{t.number}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
