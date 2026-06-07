import { DollarSign, ClipboardList, Grid3x3, TrendingUp, Settings2, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { HeroAdministrador } from "@/features/global-manager/components/Hero"
import { MesasEstado } from "@/features/global-manager/components/MesasEstado"
import { useAuthStore } from "@/core/auth/store"
import { formatCurrency } from "@/core/utils"
import { getRestaurantTables, mockOrders } from "../services"
import type { TableInfo } from "@/features/global-manager/types"

export function AdminSucursalDashboardPage() {
  const user = useAuthStore((s) => s.user)
  const [tables, setTables] = useState<TableInfo[]>(getRestaurantTables())
  const [zones, setZones] = useState([{ name: "Salón Principal", description: "Área principal" }, { name: "Terraza", description: "Área al aire libre" }])
  const [activeZone, setActiveZone] = useState("Salón Principal")
  const [showManage, setShowManage] = useState(false)
  const [showMesas, setShowMesas] = useState(false)
  const [newZoneName, setNewZoneName] = useState("")
  const [newZoneDesc, setNewZoneDesc] = useState("")
  const [editingZone, setEditingZone] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editDesc, setEditDesc] = useState("")
  const [newTableZone, setNewTableZone] = useState("Salón Principal")
  const [newTableSeats, setNewTableSeats] = useState(4)
  const [newTableStatus, setNewTableStatus] = useState<TableInfo["status"]>("libre")
  const orders = mockOrders()

  const name = user?.name ?? "Administrador"
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()

  const zoneTables = tables.filter((t) => t.zone === activeZone)
  const totalSales = orders.filter((o) => o.status === "paid" || o.status === "served").reduce((sum, o) => sum + o.total, 0)
  const activeOrders = orders.filter((o) => o.status !== "paid").length
  const freeTables = zoneTables.filter((t) => t.status === "libre")
  const mesasActivas = zoneTables.filter((t) => t.status === "ocupada" || t.status === "reservada").length
  const ocupacion = zoneTables.length > 0 ? Math.round((mesasActivas / zoneTables.length) * 100) : 0

  const toggleStatus = (id: string) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        const next: Record<string, TableInfo["status"]> = { libre: "ocupada", ocupada: "reservada", reservada: "libre", limpieza: "libre" }
        return { ...t, status: next[t.status] }
      }),
    )
  }

  return (
    <div className="space-y-4">
      <HeroAdministrador />

      <div className="px-4 flex flex-col gap-3">
        <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-medium tracking-widest text-neutral-400 uppercase">Ventas de hoy</span>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{formatCurrency(totalSales)}</p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600"><DollarSign size={20} /></div>
        </div>
        <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-medium tracking-widest text-neutral-400 uppercase">Órdenes activas</span>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{activeOrders}</p>
          </div>
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600"><ClipboardList size={20} /></div>
        </div>
      </div>

      <div className="px-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-medium tracking-widest text-neutral-400 uppercase">Mesas libres</span>
            <Grid3x3 size={16} className="text-emerald-600" />
          </div>
          <span className="text-3xl font-bold text-emerald-600 tracking-tight">{freeTables.length}/{tables.length}</span>
        </div>
        <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-medium tracking-widest text-neutral-400 uppercase">Ocupación</span>
            <TrendingUp size={16} className="text-amber-600" />
          </div>
          <span className="text-3xl font-bold text-amber-600 tracking-tight">{ocupacion}%</span>
        </div>
      </div>

      <div className="px-4 space-y-3">
        <div className="flex justify-end gap-2">
          <button onClick={() => setShowMesas(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors">
            <Settings2 size={14} /> Administrar mesas
          </button>
          <button onClick={() => setShowManage(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-neutral-300 bg-white text-neutral-600 text-xs font-medium hover:bg-neutral-100 transition-colors">
            <Settings2 size={14} /> Administrar áreas
          </button>
        </div>
        <MesasEstado tables={tables} onToggleStatus={toggleStatus} activeZone={activeZone} onZoneChange={setActiveZone} zones={zones} />
      </div>

      {showMesas && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="w-full sm:max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-white p-5 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-neutral-900">Administrar mesas</h3>
              <button onClick={() => setShowMesas(false)} className="text-neutral-400 hover:text-neutral-600 text-sm">Cerrar</button>
            </div>
            <p className="text-xs text-neutral-400 mb-4">{tables.length} mesas en total</p>

            <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4 mb-4">
              <p className="text-xs font-semibold text-neutral-700 mb-3">Agregar nueva mesa</p>
              <div className="space-y-2 mb-3">
                <select value={newTableZone} onChange={(e) => setNewTableZone(e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-neutral-400">
                  {zones.map((z) => <option key={z.name} value={z.name}>{z.name}</option>)}
                </select>
                <div className="flex gap-2">
                  <select value={newTableSeats} onChange={(e) => setNewTableSeats(Number(e.target.value))} className="flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-neutral-400">
                    <option value={2}>2 pers</option><option value={4}>4 pers</option><option value={6}>6 pers</option><option value={8}>8 pers</option>
                  </select>
                  <select value={newTableStatus} onChange={(e) => setNewTableStatus(e.target.value as TableInfo["status"])} className="flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-neutral-400">
                    <option value="libre">Libre</option><option value="ocupada">Ocupada</option><option value="reservada">Reservada</option>
                  </select>
                </div>
              </div>
              <button onClick={() => {
                const maxNumber = tables.reduce((max, t) => Math.max(max, t.number), 0)
                setTables((prev) => [...prev, { id: `t${Date.now()}`, number: maxNumber + 1, status: newTableStatus, seats: newTableSeats, zone: newTableZone, x: 10, y: 10 }])
              }} className="w-full rounded-xl bg-neutral-900 text-white py-2.5 text-xs font-medium hover:bg-neutral-800 transition-colors">
                <Plus size={14} className="inline mr-1" /> Agregar
              </button>
            </div>

            <div className="space-y-2">
              {tables.map((table) => (
                <div key={table.id} className="rounded-2xl bg-white border border-neutral-200 p-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${table.status === "libre" ? "bg-emerald-500" : table.status === "ocupada" ? "bg-amber-400" : "bg-blue-500"}`} />
                      <span className="text-sm font-semibold text-neutral-900">Mesa #{table.number}</span>
                    </div>
                    <div className="flex gap-2">
                      <select value={table.status} onChange={(e) => setTables((prev) => prev.map((t) => t.id === table.id ? { ...t, status: e.target.value as TableInfo["status"] } : t))} className="rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] outline-none">
                        <option value="libre">Libre</option><option value="ocupada">Ocupada</option><option value="reservada">Reservada</option>
                      </select>
                      <select value={table.zone ?? zones[0]?.name} onChange={(e) => setTables((prev) => prev.map((t) => t.id === table.id ? { ...t, zone: e.target.value } : t))} className="rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] outline-none">
                        {zones.map((z) => <option key={z.name} value={z.name}>{z.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <button onClick={() => setTables((prev) => prev.filter((t) => t.id !== table.id))} className="shrink-0 rounded-lg p-2 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showManage && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="w-full sm:max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-white p-5 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-neutral-900">Administrar áreas</h3>
              <button onClick={() => setShowManage(false)} className="text-neutral-400 hover:text-neutral-600 text-sm">Cerrar</button>
            </div>

            <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4 mb-4">
              <p className="text-xs font-semibold text-neutral-700 mb-3">Agregar nueva área</p>
              <div className="space-y-2">
                <input value={newZoneName} onChange={(e) => setNewZoneName(e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-neutral-400" placeholder="Nombre del área" />
                <input value={newZoneDesc} onChange={(e) => setNewZoneDesc(e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-neutral-400" placeholder="Descripción" />
              </div>
              <button onClick={() => {
                if (!newZoneName.trim()) return
                if (zones.some((z) => z.name === newZoneName.trim())) return
                setZones((prev) => [...prev, { name: newZoneName.trim(), description: newZoneDesc.trim() }])
                setNewZoneName("")
                setNewZoneDesc("")
              }} className="w-full rounded-xl bg-neutral-900 text-white py-2.5 text-xs font-medium hover:bg-neutral-800 transition-colors mt-3">
                <Plus size={14} className="inline mr-1" /> Agregar
              </button>
            </div>

            <div className="space-y-3">
              {zones.map((zone) => {
                const zoneTables = tables.filter((t) => t.zone === zone.name)
                return (
                <div key={zone.name} className="rounded-2xl bg-white border border-neutral-200 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    {editingZone === zone.name ? (
                      <div className="flex-1 space-y-1.5">
                        <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-2 py-1 text-sm font-semibold outline-none focus:border-neutral-400" placeholder="Nombre" />
                        <input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-2 py-1 text-xs text-neutral-600 outline-none focus:border-neutral-400" placeholder="Descripción" />
                      </div>
                    ) : (
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-neutral-900">{zone.name}</p>
                        <p className="text-xs text-neutral-500">{zone.description}</p>
                      </div>
                    )}
                    {editingZone === zone.name ? (
                      <button
                        onClick={() => {
                          if (editName.trim() && editName.trim() !== zone.name && !zones.some((z) => z.name === editName.trim())) {
                            setTables((prev) => prev.map((t) => t.zone === zone.name ? { ...t, zone: editName.trim() } : t))
                          }
                          setZones((prev) => prev.map((z) => z.name === zone.name ? { name: editName.trim() || z.name, description: editDesc.trim() || z.description } : z))
                          setEditingZone(null)
                        }}
                        className="text-xs font-medium text-emerald-600 hover:text-emerald-700 shrink-0"
                      >
                        Guardar
                      </button>
                    ) : (
                      <button
                        onClick={() => { setEditingZone(zone.name); setEditName(zone.name); setEditDesc(zone.description) }}
                        className="text-xs font-medium text-neutral-400 hover:text-neutral-600 shrink-0"
                      >
                        Editar
                      </button>
                    )}
                    <button onClick={() => setZones((prev) => prev.filter((z) => z.name !== zone.name))} className="shrink-0 rounded-lg p-1 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  {editingZone !== zone.name && (
                    <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => {
                        if (zoneTables.length === 0) return
                        setTables((prev) => {
                          const last = [...prev].reverse().find((t) => t.zone === zone.name)
                          return last ? prev.filter((t) => t.id !== last.id) : prev
                        })
                      }}
                      className="rounded-lg border border-neutral-200 p-1.5 text-neutral-400 hover:text-rose-500 hover:border-rose-200 transition-colors disabled:opacity-30"
                      disabled={zoneTables.length === 0}
                    >
                      <Trash2 size={14} />
                    </button>
                    <span className="text-sm font-semibold text-neutral-800 tabular-nums">{zoneTables.length} mesas</span>
                    <button
                      onClick={() => {
                        const maxNumber = tables.reduce((max, t) => Math.max(max, t.number), 0)
                        setTables((prev) => [...prev, { id: `t${Date.now()}`, number: maxNumber + 1, status: "libre", seats: 4, zone: zone.name, x: 10, y: 10 }])
                      }}
                      className="rounded-lg border border-neutral-200 p-1.5 text-neutral-400 hover:text-emerald-500 hover:border-emerald-200 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                    </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
