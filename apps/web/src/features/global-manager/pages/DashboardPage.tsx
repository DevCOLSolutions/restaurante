import { Plus, Grid3x3, TrendingUp, DollarSign, ClipboardList, Settings2, Trash2 } from "lucide-react"
import { HeroMesero } from "../components/Hero"
import { MesasEstado } from "../components/MesasEstado"
import { useState } from "react"
import type { TableInfo } from "../types"
import { getRestaurantTables, mockOrders } from "../services"
import { formatCurrency } from "@/core/utils"
import { useAuthStore } from "@/core/auth/store"

export function GlobalManagerDashboardPage() {
  const user = useAuthStore((s) => s.user)
  const [tables, setTables] = useState<TableInfo[]>(getRestaurantTables())
  const [zones, setZones] = useState([{ name: "Salón Principal", description: "Área principal del restaurante" }, { name: "Terraza", description: "Área al aire libre" }, { name: "Barra", description: "Área de barra y cocina" }])
  const [activeZone, setActiveZone] = useState("Salón Principal")
  const [showManage, setShowManage] = useState(false)
  const [showZoneModal, setShowZoneModal] = useState(false)
  const [newZoneName, setNewZoneName] = useState("")
  const [newZoneDesc, setNewZoneDesc] = useState("")
  const [newTableZone, setNewTableZone] = useState("Salón Principal")
  const [newTableSeats, setNewTableSeats] = useState(4)
  const [newTableStatus, setNewTableStatus] = useState<TableInfo["status"]>("libre")
  const orders = mockOrders()

  const name = user?.name ?? "Administrador"
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

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
        const next: Record<string, TableInfo["status"]> = {
          libre: "ocupada",
          ocupada: "reservada",
          reservada: "libre",
          limpieza: "libre",
        }
        return { ...t, status: next[t.status] }
      }),
    )
  }

  return (
    <div className="space-y-4">
      <HeroMesero nombre={name} initials={initials} mesasActivas={mesasActivas} />

      {/* Top stats */}
      <div className="px-4 flex flex-col gap-3">
        <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-medium tracking-widest text-neutral-400 uppercase">Ventas de hoy</span>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{formatCurrency(totalSales)}</p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-medium tracking-widest text-neutral-400 uppercase">Órdenes activas</span>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{activeOrders}</p>
          </div>
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <ClipboardList size={20} />
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {/* Card 1 — Mesas libres */}
        <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-medium tracking-widest text-neutral-400 uppercase">Mesas libres</span>
            <Grid3x3 size={16} className="text-emerald-600" />
          </div>
          <div>
            <span className="text-3xl font-bold text-emerald-600 tracking-tight">{freeTables.length}/{tables.length}</span>
          </div>
        </div>

        {/* Card 2 — Ocupación */}
        <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-medium tracking-widest text-neutral-400 uppercase">Ocupación</span>
            <TrendingUp size={16} className="text-amber-600" />
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-amber-600 tracking-tight">{ocupacion}%</span>
          </div>
        </div>
      </div>

      {/* Mesas */}
      <div className="px-4 space-y-3">
        <div className="flex justify-end">
          <button
            onClick={() => setShowManage(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors"
          >
            <Settings2 size={14} />
            Administrar mesas
          </button>
        </div>
        <MesasEstado tables={tables} onToggleStatus={toggleStatus} activeZone={activeZone} onZoneChange={setActiveZone} zones={zones} />
      </div>

      {/* Modal administrar mesas */}
      {showManage && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="w-full sm:max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-white p-5 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-neutral-900">Administrar mesas</h3>
              <button onClick={() => setShowManage(false)} className="text-neutral-400 hover:text-neutral-600 text-sm">Cerrar</button>
            </div>

            <p className="text-xs text-neutral-400 mb-4">{tables.length} mesas en total</p>

            {/* Add new table */}
            <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4 mb-4">
              <p className="text-xs font-semibold text-neutral-700 mb-3">Agregar nueva mesa</p>
              <div className="space-y-2 mb-3">
                <select
                  value={newTableZone}
                  onChange={(e) => setNewTableZone(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-neutral-400"
                >
                  {zones.map((z) => <option key={z.name} value={z.name}>{z.name}</option>)}
                </select>
                <div className="flex gap-2">
                  <select
                    value={newTableSeats}
                    onChange={(e) => setNewTableSeats(Number(e.target.value))}
                    className="flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-neutral-400"
                  >
                    <option value={2}>2 pers</option>
                    <option value={4}>4 pers</option>
                    <option value={6}>6 pers</option>
                    <option value={8}>8 pers</option>
                  </select>
                  <select
                    value={newTableStatus}
                  onChange={(e) => setNewTableStatus(e.target.value as TableInfo["status"])}
                  className="flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-neutral-400"
                >
                  <option value="libre">Libre</option>
                  <option value="ocupada">Ocupada</option>
                  <option value="reservada">Reservada</option>
                </select>
                </div>
              </div>
              <button
                onClick={() => {
                  const maxNumber = tables.reduce((max, t) => Math.max(max, t.number), 0)
                  const newTable: TableInfo = {
                    id: `t${Date.now()}`,
                    number: maxNumber + 1,
                    status: newTableStatus,
                    seats: newTableSeats,
                    zone: newTableZone,
                    x: 10,
                    y: 10,
                  }
                  setTables((prev) => [...prev, newTable])
                }}
                className="w-full rounded-xl bg-neutral-900 text-white py-2.5 text-xs font-medium hover:bg-neutral-800 transition-colors"
              >
                <Plus size={14} className="inline mr-1" />
                Agregar
              </button>
            </div>

            <button
              onClick={() => setShowZoneModal(true)}
              className="w-full rounded-xl border border-dashed border-neutral-300 bg-neutral-50 py-2.5 text-xs font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors mb-4"
            >
              <Plus size={14} className="inline mr-1" />
              Nueva área
            </button>

            {/* Table list */}
            <div className="space-y-2">
              {tables.map((table) => (
                <div key={table.id} className="rounded-2xl bg-white border border-neutral-200 p-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${
                        table.status === "libre" ? "bg-emerald-500" : table.status === "ocupada" ? "bg-amber-400" : "bg-blue-500"
                      }`} />
                      <span className="text-sm font-semibold text-neutral-900">Mesa #{table.number}</span>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={table.status}
                        onChange={(e) =>
                          setTables((prev) => prev.map((t) => t.id === table.id ? { ...t, status: e.target.value as TableInfo["status"] } : t))
                        }
                        className="rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] outline-none"
                      >
                        <option value="libre">Libre</option>
                        <option value="ocupada">Ocupada</option>
                        <option value="reservada">Reservada</option>
                      </select>
                      <select
                        value={table.zone ?? zones[0]?.name}
                        onChange={(e) =>
                          setTables((prev) => prev.map((t) => t.id === table.id ? { ...t, zone: e.target.value } : t))
                        }
                        className="rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] outline-none"
                      >
                        {zones.map((z) => <option key={z.name} value={z.name}>{z.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => setTables((prev) => prev.filter((t) => t.id !== table.id))}
                    className="shrink-0 rounded-lg p-2 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Zone modal */}
      {showZoneModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-semibold text-neutral-900 mb-4">Nueva área</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1 block">Nombre</label>
                <input
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400 transition-colors"
                  placeholder="Ej: VIP"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1 block">Descripción</label>
                <input
                  value={newZoneDesc}
                  onChange={(e) => setNewZoneDesc(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400 transition-colors"
                  placeholder="Descripción del área"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => { setShowZoneModal(false); setNewZoneName(""); setNewZoneDesc("") }}
                className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!newZoneName.trim()) return
                  if (zones.some((z) => z.name === newZoneName.trim())) return
                  setZones((prev) => [...prev, { name: newZoneName.trim(), description: newZoneDesc.trim() }])
                  setNewZoneName("")
                  setNewZoneDesc("")
                  setShowZoneModal(false)
                }}
                className="flex-1 rounded-xl bg-neutral-900 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
