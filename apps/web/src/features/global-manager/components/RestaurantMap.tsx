import { TableItem } from "./TableItem"
import type { TableInfo } from "../types"
import { getRestaurantTables } from "../services"

interface RestaurantMapProps {
  onTableClick: (table: TableInfo) => void
}

export function RestaurantMap({ onTableClick }: RestaurantMapProps) {
  const tables = getRestaurantTables()

  return (
    <div className="relative mx-auto w-full max-w-sm rounded-2xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm">
      <div className="relative h-72 w-full rounded-xl bg-white">
        {/* Restaurant walls */}
        <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-dashed border-neutral-200" />

        {/* Kitchen area */}
        <div className="pointer-events-none absolute right-2 top-2 rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-500">
          🍳 Cocina
        </div>

        {/* Bar area */}
        <div className="pointer-events-none absolute left-2 top-2 rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-500">
          🍸 Barra
        </div>

        {/* Entrance */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2">
          <div className="h-6 w-16 rounded-t-lg bg-neutral-200" />
          <p className="text-center text-[10px] text-neutral-400">Entrada</p>
        </div>

        {/* Tables positioned in the map */}
        {tables.map((table) => (
          <div
            key={table.id}
            className="absolute"
            style={{ left: `${table.x}%`, top: `${table.y}%`, transform: "translate(-50%, -50%)" }}
          >
            <TableItem table={table} onClick={onTableClick} compact />
          </div>
        ))}
      </div>
    </div>
  )
}
