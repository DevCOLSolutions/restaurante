import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Bell, Eye, MoreVertical, Table2, ArrowRightLeft, Move } from "lucide-react"
import { useNotificationStore } from "../stores/notificationStore"
import { useZonas } from "@/features/global-manager/hooks/useZonas"
import { zones as staticZones } from "./constants/zones"
import { filters } from "./constants/filters"
import { tablesByZone, getMyTables } from "./mocks/data"
import { useTableSelection } from "./hooks/useTableSelection"
import { StatusFilterBar } from "./components/StatusFilterBar"
import { ZoneTabs } from "./components/ZoneTabs"
import { TableCard } from "./components/TableCard"
import { TableDrawer } from "./components/TableDrawer"
import type { Zone } from "./types"

const currentUser = "Andrés"

export function MeseroTablesPage() {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState("all")
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const { selectedTable, selectTable, clearSelection } = useTableSelection()
  const { data: apiZonas, isLoading: isLoadingZonas } = useZonas()

  const zones: Zone[] = apiZonas && apiZonas.length > 0
    ? apiZonas.map((z) => ({ id: z.id, label: z.nombre }))
    : staticZones

  const myTables = getMyTables(currentUser)

  const getTablesForZone = (zoneId: string) =>
    (tablesByZone[zoneId] ?? []).filter(
      (t) => statusFilter === "all" || t.status === statusFilter
    )

  const handleCreateOrder = (tableNumber: number, people: number) => {
    clearSelection()
    navigate("/app/mesero/order-create", { state: { table: tableNumber, people } })
  }

  const handleAddToOrder = (tableNumber: number, people: number) => {
    clearSelection()
    navigate("/app/mesero/order-add", { state: { table: tableNumber, people } })
  }

  const totalTables = Object.values(tablesByZone).flat().length
  const availableCount = Object.values(tablesByZone).flat().filter((t) => t.status === "libre").length
  const occupiedCount = Object.values(tablesByZone).flat().filter((t) => t.status === "ocupada").length

  return (
    <div className="w-full pb-4">
      {/* Hero */}
      <div className="relative w-full bg-neutral-900 px-5 pt-5 pb-6 rounded-b-4xl overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white">
              <ArrowLeft size={22} />
            </button>
            <div>
              <p className="text-xs text-white/50">Restaurante</p>
              <h1 className="text-xl font-medium text-white tracking-tight">Mesas</h1>
            </div>
          </div>
          <button
            onClick={() => useNotificationStore.getState().toggle()}
            className="relative inline-flex items-center bg-white/10 border border-white/10 text-white/70 rounded-full p-2 hover:bg-white/20 transition-colors"
          >
            <Bell size={16} />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F59E0B]"></span>
            </span>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/10 border border-white/10 rounded-2xl px-3 py-2.5 text-center">
            <span className="block text-lg font-medium text-white leading-none">{totalTables}</span>
            <span className="block text-xs text-white/40 mt-1">Totales</span>
          </div>
          <div className="bg-white/10 border border-white/10 rounded-2xl px-3 py-2.5 text-center">
            <span className="block text-lg font-medium text-white leading-none">{availableCount}</span>
            <span className="block text-xs text-white/40 mt-1">Disponibles</span>
          </div>
          <div className="bg-white/10 border border-white/10 rounded-2xl px-3 py-2.5 text-center">
            <span className="block text-lg font-medium text-white leading-none">{occupiedCount}</span>
            <span className="block text-xs text-white/40 mt-1">Ocupadas</span>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <StatusFilterBar
          filters={filters}
          active={statusFilter}
          onChange={setStatusFilter}
        />

        {isLoadingZonas ? (
          <div className="flex justify-center py-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
          </div>
        ) : (
          <ZoneTabs
            zones={zones}
            getTablesForZone={getTablesForZone}
            renderTable={(table) => (
              <TableCard
                table={table}
                currentUser={currentUser}
                onSelect={selectTable}
              />
            )}
          />
        )}

        {myTables.length > 0 && (
          <section className="mt-6">
            <h2 className="text-sm font-semibold text-neutral-800 mb-3">Mis mesas</h2>
            <div className="space-y-2">
              {myTables.map((t) => (
                <div key={t.number} className="relative flex items-center justify-between px-4 py-3 bg-white border border-neutral-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-100 text-neutral-600">
                      <Table2 size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">Mesa {String(t.number).padStart(2, "0")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => selectTable(t)}
                      className="rounded-lg border p-1.5 text-neutral-400 hover:bg-neutral-100 transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleAddToOrder(t.number, t.people)}
                      className="rounded-lg bg-black px-2.5 py-1.5 text-[11px] font-medium text-white hover:bg-emerald-700 transition-colors"
                    >
                      Añadir
                    </button>
                    <button
                      onClick={() => navigate("/app/mesero/charge", { state: { table: t.number, people: t.people } })}
                      className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[11px] font-medium text-white hover:bg-emerald-700 transition-colors"
                    >
                      Cobrar
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === t.number ? null : t.number)}
                        className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openDropdown === t.number && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                          <div className="absolute right-0 bottom-full mb-1 z-50 w-44 rounded-xl bg-white border border-neutral-200 shadow-lg py-1">
                            <button className="flex items-center gap-2 w-full px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors">
                              <ArrowRightLeft size={14} className="text-neutral-400" />
                              Transferir mesero
                            </button>
                            <button className="flex items-center gap-2 w-full px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors">
                              <Move size={14} className="text-neutral-400" />
                              Cambiar de mesa
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {selectedTable && (
        <TableDrawer
          table={selectedTable}
          currentUser={currentUser}
          onClose={clearSelection}
          onCreateOrder={handleCreateOrder}
          onAddToOrder={handleAddToOrder}
        />
      )}
    </div>
  )
}
