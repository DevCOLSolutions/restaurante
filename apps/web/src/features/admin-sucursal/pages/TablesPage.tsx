import { useState } from "react"
import { TableItem } from "@/features/global-manager/components/TableItem"
import { TableModal } from "@/features/global-manager/components/TableModal"
import { HeroAdministrador } from "@/features/global-manager/components/Hero"
import type { TableInfo } from "../types"
import { getRestaurantTables } from "../services"

export function TablesPage() {
  const [tables] = useState<TableInfo[]>(getRestaurantTables())
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null)

  return (
    <div className="space-y-4">
      <HeroAdministrador />
      <div className="px-4">
        <h2 className="text-sm font-semibold text-neutral-800 mb-3">Todas las mesas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {tables.map((table) => (
            <TableItem key={table.id} table={table} onClick={() => setSelectedTable(table)} />
          ))}
        </div>
      </div>
      {selectedTable && (
        <TableModal table={selectedTable} open={true} onClose={() => setSelectedTable(null)} />
      )}
    </div>
  )
}
