import { cn } from "@/shared/lib/utils"
import type { TableInfo } from "../types"

const statusColors: Record<string, string> = {
  libre: "bg-emerald-100 text-emerald-700 border-emerald-300",
  ocupada: "bg-amber-100 text-amber-700 border-amber-300",
  reservada: "bg-blue-100 text-blue-700 border-blue-300",
  limpieza: "bg-neutral-100 text-neutral-500 border-neutral-300",
}

const statusLabels: Record<string, string> = {
  libre: "Libre",
  ocupada: "Ocupada",
  reservada: "Reservada",
  limpieza: "Limpieza",
}

interface TableItemProps {
  table: TableInfo
  onClick: (table: TableInfo) => void
  compact?: boolean
}

export function TableItem({ table, onClick, compact }: TableItemProps) {
  return (
    <button
      onClick={() => onClick(table)}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border-2 p-2 transition-all duration-200 hover:shadow-md hover:scale-105",
        statusColors[table.status],
        compact ? "w-16 h-16" : "w-20 h-20",
      )}
    >
      <span className={cn("font-bold", compact ? "text-xs" : "text-sm")}>{table.number}</span>
      {!compact && table.time && (
        <span className="mt-0.5 text-[10px] font-medium opacity-75">{table.time}</span>
      )}
      {!compact && (
        <span className="text-[9px] uppercase tracking-wider">{statusLabels[table.status]}</span>
      )}
    </button>
  )
}
