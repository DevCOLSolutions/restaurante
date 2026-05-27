import type { Table } from "../types"
import { statusConfig } from "../constants/statusConfig"
import { waiterByTable } from "../mocks/data"
import { Table2, User } from "lucide-react"

interface TableCardProps {
  table: Table
  currentUser: string
  onSelect: (table: Table) => void
}

export function TableCard({ table, currentUser, onSelect }: TableCardProps) {
  const cfg = statusConfig[table.status]
  const showTime = table.status === "ocupada" || table.status === "reservada"
  const isMine = waiterByTable[table.number] === currentUser

  return (
    <div
      className="flex flex-col gap-2 px-4 py-3 bg-white border border-neutral-200 rounded-xl shadow-none cursor-pointer hover:border-neutral-300 transition-colors"
      onClick={() => onSelect(table)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-neutral-400"><Table2 size={16} /></span>
          <span className="text-sm font-semibold text-neutral-900">
            Mesa {String(table.number).padStart(2, "0")}
          </span>
        </div>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cfg.badge}`}>
          {cfg.label}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span>{table.people} {table.people === 1 ? "persona" : "personas"}</span>
        {showTime && <span className="font-mono">{table.time}</span>}
      </div>
      {table.status === "ocupada" && (
        <div className="flex items-center gap-1 text-[10px] text-neutral-400">
          <User size={10} />
          <span className={isMine ? "text-emerald-600 font-medium" : ""}>
            {isMine ? "Mi mesa" : waiterByTable[table.number]}
          </span>
        </div>
      )}
    </div>
  )
}
