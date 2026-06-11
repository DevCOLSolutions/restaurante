import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, XCircle, Table2, User, Clock } from "lucide-react"
import { useMesas } from "@/features/global-manager/hooks/useMesas"
import { useOrdenesPorMesa } from "@/features/mesero/hooks/useOrdenesPorMesa"
import { useCerrarOrden } from "@/features/mesero/hooks/useCerrarOrden"
import { formatCurrency } from "@/core/utils"
import type { Mesa } from "@/types/api"

const productStatusLabels: Record<string, { dot: string; label: string }> = {
  pendiente:      { dot: "bg-neutral-400", label: "Pendiente" },
  en_preparacion: { dot: "bg-[#F59E0B]",  label: "En preparación" },
  listo:          { dot: "bg-emerald-600", label: "Listo" },
  entregado:      { dot: "bg-blue-500",   label: "Entregado" },
}

function productStatus(p: { estado: string; enviadoEn: string | null }) {
  if (p.enviadoEn && p.estado === "pendiente") return "en_preparacion"
  return p.estado
}

export function ChargePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const mesa = (location.state as { mesa?: Mesa })?.mesa
  const { data: mesas } = useMesas()
  const m = mesa ?? mesas?.find((m) => m.id === (location.state as { mesaId?: string })?.mesaId)
  const { data: ordenes, isLoading } = useOrdenesPorMesa(m?.id)
  const cerrar = useCerrarOrden()

  const abierta = ordenes?.find((o) => o.estado !== "cerrada")
  const entregados = abierta?.productos.filter((p) => productStatus(p) === "entregado") ?? []
  const otros = abierta?.productos.filter((p) => productStatus(p) !== "entregado") ?? []

  if (!m) {
    return (
      <div className="w-full pb-4">
        <div className="relative w-full bg-neutral-900 px-5 pt-5 pb-6 rounded-b-4xl overflow-hidden">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white">
              <ArrowLeft size={22} />
            </button>
            <h1 className="text-xl font-medium text-white tracking-tight">Cerrar orden</h1>
          </div>
        </div>
        <div className="px-4 mt-8 text-center text-sm text-neutral-500">No se encontró la mesa</div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full pb-4">
        <div className="relative w-full bg-neutral-900 px-5 pt-5 pb-6 rounded-b-4xl overflow-hidden">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white">
              <ArrowLeft size={22} />
            </button>
            <h1 className="text-xl font-medium text-white tracking-tight">Cerrar orden</h1>
          </div>
        </div>
        <div className="px-4 mt-8 flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
        </div>
      </div>
    )
  }

  if (!abierta) {
    return (
      <div className="w-full pb-4">
        <div className="relative w-full bg-neutral-900 px-5 pt-5 pb-6 rounded-b-4xl overflow-hidden">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white">
              <ArrowLeft size={22} />
            </button>
            <h1 className="text-xl font-medium text-white tracking-tight">Cerrar orden</h1>
          </div>
        </div>
        <div className="px-4 mt-8 text-center text-sm text-neutral-500">No hay orden activa para esta mesa</div>
      </div>
    )
  }

  return (
    <div className="w-full pb-4">
      {/* Hero */}
      <div className="relative w-full bg-neutral-900 px-5 pt-5 pb-6 rounded-b-4xl overflow-hidden">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white">
            <ArrowLeft size={22} />
          </button>
          <div>
            <p className="text-xs text-white/50">Cerrar orden</p>
            <h1 className="text-xl font-medium text-white tracking-tight">
              Mesa {String(m.numero).padStart(2, "0")} — {m.nombre}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-white/60">
          <span className="flex items-center gap-1"><User size={12} /> {abierta.meseroNombre}</span>
          <span className="flex items-center gap-1"><Table2 size={12} /> #{abierta.numeroOrden}</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {new Date(abierta.creadoEn).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Productos entregados */}
        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
          <div className="px-4 py-2.5 bg-emerald-50 border-b border-emerald-100">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
              Consumido ({entregados.reduce((s, p) => s + p.cantidad, 0)})
            </p>
          </div>
          <div className="px-4 py-3 space-y-2">
            {entregados.length === 0 ? (
              <p className="text-sm text-neutral-400">Sin productos entregados</p>
            ) : (
              entregados.map((p) => {
                const st = productStatusLabels[productStatus(p)] ?? productStatusLabels.pendiente
                return (
                  <div key={p.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${st.dot}`} />
                      <span className="text-neutral-700 truncate">{p.cantidad}x {p.itemMenuNombre}</span>
                    </div>
                    <span className="text-neutral-500 text-xs shrink-0 ml-3">{formatCurrency(p.subtotal)}</span>
                  </div>
                )
              })
            )}
          </div>
          {otros.length > 0 && (
            <>
              <div className="px-4 py-2.5 bg-neutral-50 border-t border-neutral-100">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Pendientes ({otros.reduce((s, p) => s + p.cantidad, 0)})
                </p>
              </div>
              <div className="px-4 py-3 space-y-2">
                {otros.map((p) => {
                  const st = productStatusLabels[productStatus(p)] ?? productStatusLabels.pendiente
                  return (
                    <div key={p.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${st.dot}`} />
                        <span className="text-neutral-700 truncate">{p.cantidad}x {p.itemMenuNombre}</span>
                      </div>
                      <span className="text-neutral-500 text-xs shrink-0 ml-3">{formatCurrency(p.subtotal)}</span>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Resumen */}
        <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3 space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Subtotal</span>
            <span className="tabular-nums">{formatCurrency(abierta.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Impuesto</span>
            <span className="tabular-nums">{formatCurrency(abierta.impuesto)}</span>
          </div>
          {abierta.descuento > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Descuento</span>
              <span className="text-emerald-600 tabular-nums">-{formatCurrency(abierta.descuento)}</span>
            </div>
          )}
          {abierta.propina > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Propina</span>
              <span className="tabular-nums">{formatCurrency(abierta.propina)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-neutral-900 pt-1.5 border-t border-neutral-100">
            <span>Total</span>
            <span className="tabular-nums">{formatCurrency(abierta.total)}</span>
          </div>
        </div>

        {/* Cerrar */}
        <button
          onClick={() => cerrar.mutate({ ordenId: abierta.id, mesaId: m.id }, { onSuccess: () => navigate("/app/mesero/tables", { replace: true }) })}
          disabled={cerrar.isPending}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
        >
          {cerrar.isPending ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <XCircle size={16} />
          )}
          {cerrar.isPending ? "Cerrando..." : "Cerrar orden"}
        </button>
      </div>
    </div>
  )
}
