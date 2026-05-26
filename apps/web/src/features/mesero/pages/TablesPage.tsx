import { EmptyState } from "@/shared/ui/EmptyState"
import { TableItem } from "@/features/global-manager/components/TableItem"
import { TableModal } from "@/features/global-manager/components/TableModal"
import { getRestaurantTables } from "@/features/global-manager/services"
import type { TableInfo } from "@/features/global-manager/types"
import { useState } from "react"
import { UtensilsCrossed } from "lucide-react"

export function MeseroTablesPage() {
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const tables = getRestaurantTables().filter((t) => t.status !== "limpieza")

  const handleClick = (table: TableInfo) => {
    setSelectedTable(table)
    setModalOpen(true)
  }

  if (tables.length === 0) {
    return (
      <div className="p-4">
        <EmptyState icon={<UtensilsCrossed size={48} />} title="Sin mesas disponibles" description="No hay mesas en este momento" />
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Mesas</h1>
        <p className="text-sm text-neutral-500">Selecciona una mesa para gestionar</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {tables.map((table) => (
          <TableItem key={table.id} table={table} onClick={handleClick} />
        ))}
      </div>

      <TableModal table={selectedTable} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
