import { Users, Clock } from "lucide-react"
import { Modal } from "@/shared/ui/Modal"
import { useOrdenesPorMesa } from "@/features/mesero/hooks/useOrdenesPorMesa"
import type { Mesa } from "@/types/api"

interface MesaDrawerProps {
  mesa: Mesa | null
  onClose: () => void
}

export function MesaDrawer({ mesa, onClose }: MesaDrawerProps) {
  const { data: ordenes, isLoading: ordenesLoading } = useOrdenesPorMesa(mesa?.id)

  if (!mesa) return null

  const ordenActiva = ordenes?.find((o) => o.estado !== "cerrada")

  return (
    <Modal open={!!mesa} onClose={onClose} title={`Mesa #${mesa.numero} — ${mesa.nombre}`}>
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-sm text-neutral-600">
          <Users size={16} />
          <span>{mesa.capacidad} personas</span>
          <span className={`ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
            mesa.estado === "disponible"
              ? "bg-emerald-100 text-emerald-700"
              : mesa.estado === "ocupada"
                ? "bg-amber-100 text-amber-700"
                : "bg-blue-100 text-blue-700"
          }`}>
            {mesa.estado === "disponible" ? "Disponible" : mesa.estado === "ocupada" ? "Ocupada" : "Reservada"}
          </span>
        </div>

        {mesa.estado === "disponible" ? (
          <p className="text-center text-sm text-neutral-400 py-6">Mesa disponible</p>
        ) : ordenesLoading ? (
          <div className="flex justify-center py-6">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
          </div>
        ) : !ordenActiva ? (
          <p className="text-center text-sm text-neutral-400 py-6">Sin orden activa</p>
        ) : (
          <div className="space-y-3">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">Orden #{ordenActiva.numeroOrden}</span>
                <span className="font-medium text-neutral-700">{ordenActiva.estado}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <Clock size={12} />
                <span>{new Date(ordenActiva.creadoEn).toLocaleString("es-CO")}</span>
              </div>
              {ordenActiva.meseroNombre && (
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <Users size={12} />
                  <span>Mesero: {ordenActiva.meseroNombre}</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">Productos</p>
              {ordenActiva.productos.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-neutral-100 bg-white px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-neutral-900">{p.itemMenuNombre}</p>
                      <span className="text-xs text-neutral-400">×{p.cantidad}</span>
                    </div>
                    {p.notas && <p className="text-[11px] text-neutral-400 truncate">{p.notas}</p>}
                  </div>
                  <span className="text-xs font-medium text-neutral-700">${(p.cantidad * p.precioUnitario).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 pt-3 space-y-1">
              {ordenActiva.subtotal > 0 && (
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Subtotal</span>
                  <span>${ordenActiva.subtotal.toLocaleString()}</span>
                </div>
              )}
              {ordenActiva.descuento > 0 && (
                <div className="flex justify-between text-xs text-rose-500">
                  <span>Descuento</span>
                  <span>-${ordenActiva.descuento.toLocaleString()}</span>
                </div>
              )}
              {ordenActiva.impuesto > 0 && (
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Impuesto</span>
                  <span>${ordenActiva.impuesto.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-semibold text-neutral-900 pt-1 border-t border-neutral-200">
                <span>Total</span>
                <span>${ordenActiva.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
