import { useState } from "react"
import { TableItem } from "../components/TableItem"
import { TableModal } from "../components/TableModal"
import type { TableInfo } from "../types"
import { getRestaurantTables } from "../services"
import { EmptyState } from "@/shared/ui/EmptyState"
import { Search } from "lucide-react"

export function TablesPage() {
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [filter, setFilter] = useState<string>("all")
  const tables = getRestaurantTables()

  const filteredTables = filter === "all" ? tables : tables.filter((t) => t.status === filter)

  const handleTableClick = (table: TableInfo) => {
    setSelectedTable(table)
    setModalOpen(true)
  }

  const filters = [
    { value: "all", label: "Todas" },
    { value: "libre", label: "Libres" },
    { value: "ocupada", label: "Ocupadas" },
    { value: "reservada", label: "Reservadas" },
    { value: "limpieza", label: "Limpieza" },
  ]

  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Mesas</h1>
        <p className="text-sm text-neutral-500">Gestiona las mesas del restaurante</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
              filter === f.value
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {filteredTables.map((table) => (
          <TableItem key={table.id} table={table} onClick={handleTableClick} />
        ))}
      </div>

      {filteredTables.length === 0 && (
        <EmptyState icon={<Search size={48} />} title="Sin mesas" description={`No hay mesas con estado "${filter}"`} />
      )}

      <TableModal table={selectedTable} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
