import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, ClipboardList, Clock, User, Table2, ChefHat, MessageCircle, ChevronDown, ChevronUp } from "lucide-react"
import { formatCurrency } from "@/core/utils"
import { NotificationBell } from "../components/NotificationBell"
import { useOrdenesPorMesero } from "@/features/mesero/hooks/useOrdenesPorMesero"
import { useMe } from "@/hooks/useMe"

const productStatusCfg: Record<string, { dot: string; label: string }> = {
  pendiente:      { dot: "bg-neutral-400", label: "Pendiente" },
  en_preparacion: { dot: "bg-[#F59E0B]",  label: "En preparación" },
  listo:          { dot: "bg-emerald-600", label: "Listo" },
  entregado:      { dot: "bg-blue-500",   label: "Entregado" },
}

function productStatus(p: { estado: string; enviadoEn: string | null }) {
  if (p.enviadoEn && p.estado === "pendiente") return "en_preparacion"
  return p.estado
}

export function MeseroOrdersPage() {
  const navigate = useNavigate()
  const { data: ordenes, isLoading } = useOrdenesPorMesero()
  const { data: user } = useMe()
  const [tab, setTab] = useState<"activas" | "cerradas">("activas")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const activas = useMemo(() => (ordenes ?? []).filter((o) => o.estado !== "cerrada"), [ordenes])
  const cerradas = useMemo(() => (ordenes ?? []).filter((o) => o.estado === "cerrada"), [ordenes])
  const list = tab === "activas" ? activas : cerradas

  return (
    <div className="w-full pb-4">
      {/* Hero */}
      <div className="relative w-full bg-neutral-900 px-5 pt-5 pb-6 rounded-b-4xl overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white">
              <ArrowLeft size={22} />
            </button>
            <div>
              <p className="text-xs text-white/50">
                {user?.data.restauranteNombre} ∙{" "}
                <span className="text-white/70">{user?.data.sucursalNombre}</span>
              </p>
              <h1 className="text-xl font-medium text-white tracking-tight">Órdenes</h1>
            </div>
          </div>
          <NotificationBell />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setTab("activas")}
            className={`rounded-2xl px-3 py-2.5 text-center transition-all ${
              tab === "activas" ? "bg-white text-neutral-900" : "bg-white/10 border border-white/10 text-white"
            }`}
          >
            <span className="block text-lg font-medium leading-none">{activas.length}</span>
            <span className={`block text-xs mt-1 ${tab === "activas" ? "text-neutral-500" : "text-white/40"}`}>Activas</span>
          </button>
          <button
            onClick={() => setTab("cerradas")}
            className={`rounded-2xl px-3 py-2.5 text-center transition-all ${
              tab === "cerradas" ? "bg-white text-neutral-900" : "bg-white/10 border border-white/10 text-white"
            }`}
          >
            <span className="block text-lg font-medium leading-none">{cerradas.length}</span>
            <span className={`block text-xs mt-1 ${tab === "cerradas" ? "text-neutral-500" : "text-white/40"}`}>Cerradas</span>
          </button>
        </div>
      </div>

      <div className="px-4 mt-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
          </div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 text-neutral-300"><ClipboardList size={48} /></div>
            <h3 className="text-base font-semibold text-neutral-600">Sin órdenes</h3>
            <p className="mt-1 text-sm text-neutral-400">
              {tab === "activas" ? "No tienes órdenes activas" : "No tienes órdenes cerradas"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((orden) => {
              const expanded = expandedId === orden.id
              const prods = orden.productos
              const totalItems = prods.reduce((s, p) => s + p.cantidad, 0)
              return (
                <div key={orden.id} className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
                  {/* Header — clickeable va a la mesa */}
                  <button
                    onClick={() => navigate(`/app/mesero/orden/${orden.id}`)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-100 text-neutral-600">
                        <Table2 size={16} />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-neutral-900">
                            Mesa {String(orden.mesaNumero).padStart(2, "0")}
                          </p>
                          {orden.estado === "listo" ? (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                              Listo
                            </span>
                          ) : orden.estado === "cerrada" ? (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-600">
                              Cerrada
                            </span>
                          ) : orden.estado === "en_preparacion" ? (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                              En preparación
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                              {orden.estado === "pendiente" ? "Pendiente" : orden.estado === "entregado" ? "Entregado" : "Abierta"}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400">
                          #{orden.numeroOrden} · {new Date(orden.creadoEn).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })} · {orden.meseroNombre}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-neutral-900">{formatCurrency(orden.total)}</span>
                  </button>

                  {/* Expand toggle */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setExpandedId(expanded ? null : orden.id) }}
                    className="w-full flex items-center justify-center gap-1 py-1.5 text-xs text-neutral-400 hover:text-neutral-600 border-t border-neutral-100"
                  >
                    {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {expanded ? "Ver menos" : `Ver ${totalItems} producto${totalItems !== 1 ? "s" : ""}`}
                  </button>

                  {/* Expandible para ver productos */}
                  {expanded && (
                    <div className="border-t border-neutral-100 px-4 py-3 space-y-3">
                      <div className="flex items-center gap-4 text-xs text-neutral-500">
                        <span className="flex items-center gap-1"><ChefHat size={12} /> {orden.meseroNombre}</span>
                        <span className="flex items-center gap-1"><Table2 size={12} /> {orden.mesaNombre}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(orden.creadoEn).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">
                          Productos ({totalItems})
                        </p>
                        <div className="space-y-1">
                          {prods.map((p) => {
                            const st = productStatusCfg[productStatus(p)] ?? productStatusCfg.pendiente
                            return (
                              <div key={p.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${st.dot}`} />
                                  <span className="text-neutral-700 truncate">{p.cantidad}x {p.itemMenuNombre}</span>
                                  {p.notas && <span className="text-[10px] text-neutral-400 truncate max-w-[100px]">· {p.notas}</span>}
                                </div>
                                <span className="text-xs text-neutral-500 shrink-0 ml-3">{formatCurrency(p.subtotal)}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="border-t border-neutral-100 pt-2 space-y-1 text-xs text-neutral-600">
                        <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(orden.subtotal)}</span></div>
                        <div className="flex justify-between"><span>Impuesto</span><span>{formatCurrency(orden.impuesto)}</span></div>
                        {orden.descuento > 0 && <div className="flex justify-between"><span>Descuento</span><span className="text-emerald-600">-{formatCurrency(orden.descuento)}</span></div>}
                        {orden.propina > 0 && <div className="flex justify-between"><span>Propina</span><span>{formatCurrency(orden.propina)}</span></div>}
                        <div className="flex justify-between font-semibold text-neutral-800 pt-1 border-t border-neutral-100">
                          <span>Total</span><span>{formatCurrency(orden.total)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
