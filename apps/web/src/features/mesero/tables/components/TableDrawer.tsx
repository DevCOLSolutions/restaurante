import { createPortal } from "react-dom"
import { useNavigate } from "react-router-dom"
import { X, Plus, Users } from "lucide-react"
import { useMesas } from "@/features/global-manager/hooks/useMesas"

interface TableDrawerProps {
  onClose: () => void
}

export function TableDrawer({ onClose }: TableDrawerProps) {
  const navigate = useNavigate()
  const { data: mesas } = useMesas()
  const disponibles = mesas?.filter((m) => m.estado === "disponible") ?? []

  return createPortal(
    <>
      <div className="fixed inset-0 z-[100] bg-black/30" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-[101] w-full rounded-t-2xl bg-white px-5 pb-10 pt-5 shadow-2xl max-h-[70vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-base font-semibold text-neutral-900">Nueva orden</p>
            <p className="text-sm text-neutral-500">{disponibles.length} mesas disponibles</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2">
          {disponibles.map((mesa) => (
            <div
              key={mesa.id}
              className="flex items-center gap-3 rounded-xl border border-emerald-200/60 bg-emerald-50/40 px-4 py-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-neutral-900">Mesa {String(mesa.numero).padStart(2, "0")}</span>
                  <span className="text-xs text-neutral-400">— {mesa.nombre}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1 text-[11px] text-neutral-500">
                    <Users size={11} />
                    {mesa.capacidad} {mesa.capacidad === 1 ? "persona" : "personas"}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    Disponible
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose()
                  navigate("/app/mesero/order-create", { state: { mesa } })
                }}
                className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-emerald-700 transition-colors"
              >
                <Plus size={13} />
                Tomar pedido
              </button>
            </div>
          ))}

          {disponibles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm font-medium text-neutral-500">No hay mesas disponibles</p>
              <p className="text-xs text-neutral-400 mt-1">Todas las mesas están ocupadas o reservadas</p>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  )
}
