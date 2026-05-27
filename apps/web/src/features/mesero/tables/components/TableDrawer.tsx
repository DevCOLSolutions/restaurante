import { createPortal } from "react-dom"
import { X, Clock, User, UtensilsCrossed, Plus, ShoppingCart } from "lucide-react"
import type { Table } from "../types"
import { statusConfig } from "../constants/statusConfig"
import { waiterByTable, ordersByTable } from "../mocks/data"
import { TableOrderSummary } from "./TableOrderSummary"

interface TableDrawerProps {
  table: Table
  currentUser: string
  onClose: () => void
  onCreateOrder: (tableNumber: number, people: number) => void
  onAddToOrder: (tableNumber: number, people: number) => void
}

export function TableDrawer({ table, currentUser, onClose, onCreateOrder, onAddToOrder }: TableDrawerProps) {
  return createPortal(
    <>
      <div className="fixed inset-0 z-[100] bg-black/30" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-[101] w-full rounded-t-2xl bg-white px-5 pb-10 pt-5 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1 text-neutral-400 hover:bg-neutral-100">
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 text-neutral-700">
            <UtensilsCrossed size={20} />
          </div>
          <div>
            <p className="text-base font-semibold text-neutral-900">Mesa {String(table.number).padStart(2, "0")}</p>
            <p className="text-sm text-neutral-500">{table.people} {table.people === 1 ? "persona" : "personas"}</p>
          </div>
          <span className={`ml-auto text-xs font-medium px-3 py-1 rounded-full ${statusConfig[table.status]?.badge}`}>
            {statusConfig[table.status]?.label}
          </span>
        </div>

        <div className="space-y-3">
          {table.status === "ocupada" && (
            <>
              <div className="flex items-center gap-3 text-sm text-neutral-600">
                <User size={16} className="text-neutral-400" />
                <span>
                  {waiterByTable[table.number] === currentUser
                    ? <><strong className="text-emerald-600">Mi mesa</strong> · {currentUser}</>
                    : <>Mesero: <strong>{waiterByTable[table.number] ?? "—"}</strong></>
                  }
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-600">
                <Clock size={16} className="text-neutral-400" />
                <span>Tiempo: <strong>{table.time}</strong></span>
              </div>
              <div className="border-t border-neutral-100 pt-3">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <ShoppingCart size={13} /> Orden actual
                </p>
                <TableOrderSummary items={ordersByTable[table.number] ?? []} />
              </div>
              {waiterByTable[table.number] === currentUser && (
                <button
                  onClick={() => onAddToOrder(table.number, table.people)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
                >
                  <ShoppingCart size={16} />
                  Añadir a la orden
                </button>
              )}
            </>
          )}
          {table.status === "reservada" && (
            <div className="flex items-center gap-3 text-sm text-neutral-600">
              <Clock size={16} className="text-neutral-400" />
              <span>Reservada para las <strong>{table.time}</strong></span>
            </div>
          )}
          {table.status === "libre" && (
            <button
              onClick={() => onCreateOrder(table.number, table.people)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
            >
              <Plus size={18} />
              Crear orden
            </button>
          )}
          {table.status === "limpieza" && (
            <div className="flex items-center gap-3 text-sm text-neutral-600">
              <span className="text-neutral-400">Mesa en limpieza · {table.time}</span>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  )
}
