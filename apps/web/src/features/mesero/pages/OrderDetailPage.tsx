import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, User, Clock, Send, Check, XCircle } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import { useMe } from "@/hooks/useMe"
import { useAuthStore } from "@/core/auth/store"
import { useCerrarOrden } from "@/features/mesero/hooks/useCerrarOrden"
import { useCambiarEstadoProducto } from "@/features/mesero/hooks/useCambiarEstadoProducto"
import { formatCurrency } from "@/core/utils"
import type { ApiResponse, Orden } from "@/types/api"

const productStatusConfig: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  pendiente:       { dot: "bg-neutral-400", bg: "bg-neutral-100", text: "text-neutral-600", label: "Pendiente" },
  en_preparacion:  { dot: "bg-[#F59E0B]",  bg: "bg-amber-100",   text: "text-amber-700",   label: "En preparación" },
  listo:           { dot: "bg-emerald-600", bg: "bg-emerald-100", text: "text-emerald-700", label: "Listo" },
  entregado:       { dot: "bg-blue-500",    bg: "bg-blue-100",    text: "text-blue-700",   label: "Entregado" },
}

function productStatus(p: { estado: string; enviadoEn: string | null }) {
  if (p.enviadoEn && p.estado === "pendiente") return "en_preparacion"
  return p.estado
}

export function OrderDetailPage() {
  const { ordenId } = useParams<{ ordenId: string }>()
  const navigate = useNavigate()
  const { data: user } = useMe()
  const currentUserId = useAuthStore((s) => s.user?.id)
  const cerrar = useCerrarOrden()
  const cambiarEstado = useCambiarEstadoProducto()
  const [showCerrarModal, setShowCerrarModal] = useState(false)

  const { data: orden, isLoading } = useQuery({
    queryKey: ["orden", ordenId],
    queryFn: async () => {
      if (!ordenId) return null
      const res = await apiFetch<ApiResponse<Orden>>(ENDPOINTS.ORDENES.GET(ordenId))
      return res.data ?? null
    },
    enabled: !!ordenId,
  })

  if (!ordenId) return null

  const soyYo = orden && currentUserId === orden.meseroId
  const esCerrada = orden?.estado === "cerrada"
  const todosEntregados = orden ? orden.productos.every((p) => productStatus(p) === "entregado") : false
  const mesaInfo = orden ? { id: orden.mesaId, numero: orden.mesaNumero, nombre: orden.mesaNombre } : null

  return (
    <div className="w-full pb-8">
      {/* Header */}
      <div className="relative w-full bg-neutral-900 px-5 pt-5 pb-6 rounded-b-4xl overflow-hidden">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white">
            <ArrowLeft size={22} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/50 truncate">
              {user?.data.restauranteNombre} ∙{" "}
              <span className="text-white/70">{user?.data.sucursalNombre}</span>
            </p>
            <h1 className="text-xl font-medium text-white tracking-tight">
              {orden ? `Mesa ${String(orden.mesaNumero).padStart(2, "0")} — ${orden.mesaNombre}` : "Orden"}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/10 border border-white/10 rounded-2xl px-3 py-2.5 text-center">
            <span className="block text-lg font-medium text-white leading-none">#{orden?.numeroOrden ?? "—"}</span>
            <span className="block text-xs text-white/40 mt-1">Orden</span>
          </div>
          <div className="bg-white/10 border border-white/10 rounded-2xl px-3 py-2.5 text-center">
            <span className="block text-xs text-white/40">Estado</span>
            <span className={`block text-sm font-medium leading-none mt-0.5 capitalize ${esCerrada ? "text-white/50" : "text-[#F59E0B]"}`}>
              {orden?.estado === "cerrada" ? "Cerrada" : orden?.estado === "listo" ? "Listo" : orden?.estado === "entregado" ? "Entregado" : orden?.estado === "en_preparacion" ? "En preparación" : orden?.estado === "pendiente" ? "Pendiente" : orden?.estado ?? "—"}
            </span>
          </div>
          <div className="bg-white/10 border border-white/10 rounded-2xl px-3 py-2.5 text-center">
            <span className="block text-xs text-white/40">Total</span>
            <span className="block text-sm font-medium text-white leading-none mt-0.5">{orden ? formatCurrency(orden.total) : "—"}</span>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
          </div>
        ) : !orden ? (
          <div className="text-center py-12 text-sm text-neutral-500">Orden no encontrada</div>
        ) : (
          <>
            {/* Mesero info */}
            <div className="flex items-center gap-3 rounded-xl bg-white border border-neutral-200 px-3.5 py-3">
              <div className="rounded-full bg-amber-50 p-2 text-amber-600">
                <User size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-neutral-400">Mesero</p>
                <p className="text-sm font-medium text-neutral-900">
                  {orden.meseroNombre}{soyYo ? " (Tú)" : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-400">Orden #{orden.numeroOrden}</p>
                <p className="text-[11px] text-neutral-500">
                  <Clock size={11} className="inline mr-0.5" />
                  {new Date(orden.creadoEn).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>

            {/* Productos */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
                  Productos ({orden.productos.reduce((s, p) => s + p.cantidad, 0)})
                </h2>
                {soyYo && !esCerrada && !orden.productos.some((p) => p.enviadoEn) && (
                  <button className="flex items-center gap-1 rounded-lg bg-amber-100 px-3 py-1.5 text-[11px] font-medium text-amber-700 hover:bg-amber-200 transition-colors">
                    <Send size={12} />
                    Enviar a cocina
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {orden.productos.map((p) => {
                  const st = productStatusConfig[productStatus(p)] ?? productStatusConfig.pendiente
                  const esListo = productStatus(p) === "listo"
                  return (
                    <div key={p.id} className="flex items-center gap-3 rounded-xl bg-white border border-neutral-200 px-3.5 py-3">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${st.dot}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-neutral-900">{p.itemMenuNombre}</span>
                          <span className="text-[11px] text-neutral-400">x{p.cantidad}</span>
                        </div>
                        {p.notas && <p className="text-[11px] text-neutral-400 mt-0.5 italic">{p.notas}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        {esListo && soyYo && !esCerrada ? (
                          <button
                            onClick={() => cambiarEstado.mutate({ productoId: p.id, estado: "entregado" })}
                            className="flex items-center gap-1 rounded-lg bg-blue-100 px-2.5 py-1 text-[10px] font-medium text-blue-700 hover:bg-blue-200 transition-colors whitespace-nowrap"
                          >
                            <Check size={11} />
                            Marcar entregado
                          </button>
                        ) : (
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}>
                            {st.label}
                          </span>
                        )}
                        <span className="text-sm font-medium text-neutral-900 tabular-nums">{formatCurrency(p.subtotal)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Resumen */}
            <section className="rounded-xl bg-white border border-neutral-200 px-3.5 py-3 space-y-1.5">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-neutral-500">Subtotal</span>
                <span className="text-neutral-900 tabular-nums">{formatCurrency(orden.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-neutral-500">Impuesto</span>
                <span className="text-neutral-900 tabular-nums">{formatCurrency(orden.impuesto)}</span>
              </div>
              {orden.descuento > 0 && (
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-neutral-500">Descuento</span>
                  <span className="text-emerald-600 tabular-nums">-{formatCurrency(orden.descuento)}</span>
                </div>
              )}
              {orden.propina > 0 && (
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-neutral-500">Propina</span>
                  <span className="text-neutral-900 tabular-nums">{formatCurrency(orden.propina)}</span>
                </div>
              )}
              <div className="border-t border-neutral-200 pt-1.5 mt-1.5 flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-900">Total</span>
                <span className="text-lg font-bold text-neutral-900 tabular-nums">{formatCurrency(orden.total)}</span>
              </div>
            </section>

            {/* Acciones */}
            {soyYo && !esCerrada && (
              <>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/app/mesero/order-add", { state: { mesa: mesaInfo } })}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
                  >
                    <Plus size={16} />
                    Agregar
                  </button>
                  {todosEntregados ? (
                    <button
                      onClick={() => setShowCerrarModal(true)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-3 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                    >
                      <XCircle size={16} />
                      Cerrar
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/app/mesero/charge", { state: { mesa: mesaInfo } })}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-3 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                    >
                      <XCircle size={16} />
                      Cerrar
                    </button>
                  )}
                </div>

                {showCerrarModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-1">Cerrar orden</h3>
                      <p className="text-sm text-neutral-500 mb-4">Orden #{orden.numeroOrden} — Mesa {String(orden.mesaNumero).padStart(2, "0")}</p>
                      <div className="space-y-1.5 text-sm border-t border-neutral-100 pt-3 mb-4">
                        <div className="flex justify-between text-neutral-600">
                          <span>Subtotal</span>
                          <span className="tabular-nums">{formatCurrency(orden.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-neutral-600">
                          <span>Impuesto</span>
                          <span className="tabular-nums">{formatCurrency(orden.impuesto)}</span>
                        </div>
                        {orden.descuento > 0 && (
                          <div className="flex justify-between text-neutral-600">
                            <span>Descuento</span>
                            <span className="text-emerald-600 tabular-nums">-{formatCurrency(orden.descuento)}</span>
                          </div>
                        )}
                        {orden.propina > 0 && (
                          <div className="flex justify-between text-neutral-600">
                            <span>Propina</span>
                            <span className="tabular-nums">{formatCurrency(orden.propina)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold text-neutral-900 pt-1.5 border-t border-neutral-100">
                          <span>Total</span>
                          <span className="tabular-nums">{formatCurrency(orden.total)}</span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowCerrarModal(false)}
                          className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => cerrar.mutate({ ordenId: orden.id, mesaId: orden.mesaId }, { onSuccess: () => { setShowCerrarModal(false); navigate("/app/mesero/tables") } })}
                          disabled={cerrar.isPending}
                          className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                        >
                          {cerrar.isPending ? "Cerrando..." : "Cerrar orden"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
