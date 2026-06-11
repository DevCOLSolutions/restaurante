import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, User, Clock, Send, XCircle, Check } from "lucide-react"
import { useMe } from "@/hooks/useMe"
import { useAuthStore } from "@/core/auth/store"
import { useMesas } from "@/features/global-manager/hooks/useMesas"
import { useOrdenesPorMesa } from "@/features/mesero/hooks/useOrdenesPorMesa"
import { useCerrarOrden } from "@/features/mesero/hooks/useCerrarOrden"
import { useCambiarEstadoProducto } from "@/features/mesero/hooks/useCambiarEstadoProducto"
import { formatCurrency } from "@/core/utils"
import { NotificationBell } from "../components/NotificationBell"

const statusConfig: Record<string, { dot: string; label: string }> = {
  disponible: { dot: "bg-emerald-600", label: "Disponible" },
  ocupada: { dot: "bg-[#F59E0B]", label: "Ocupada" },
  reservada: { dot: "bg-blue-500", label: "Reservada" },
}

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

export function MesaDetailPage() {
  const { mesaId } = useParams<{ mesaId: string }>()
  const navigate = useNavigate()
  const { data: user } = useMe()
  const { data: mesas } = useMesas()
  const { data: ordenes, isLoading, isError } = useOrdenesPorMesa(mesaId)

  const currentUserId = useAuthStore((s) => s.user?.id)
  const cerrar = useCerrarOrden()
  const cambiarEstado = useCambiarEstadoProducto()
  const mesa = mesas?.find((m) => m.id === mesaId)
  const cfg = mesa ? statusConfig[mesa.estado] ?? statusConfig.disponible : null
  const ordenActual = ordenes?.find((o) => o.estado !== "cerrada")
  const soyYo = ordenActual && currentUserId === ordenActual.meseroId
  const todosEntregados = ordenActual ? ordenActual.productos.every((p) => productStatus(p) === "entregado") : false
  const [showCerrarModal, setShowCerrarModal] = useState(false)

  if (!mesa) return null

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
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-medium text-white tracking-tight">Mesa {String(mesa.numero).padStart(2, "0")}</h1>
              <span className="text-sm text-white/50">— {mesa.nombre}</span>
            </div>
          </div>

          <NotificationBell />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/10 border border-white/10 rounded-2xl px-3 py-2.5 text-center">
            {cfg && <div className={`w-2 h-2 rounded-full ${cfg.dot} mx-auto mb-1`} />}
            <span className="block text-xs text-white/70 font-medium">{cfg?.label ?? mesa.estado}</span>
          </div>
          <div className="bg-white/10 border border-white/10 rounded-2xl px-3 py-2.5 text-center">
            <span className="block text-lg font-medium text-white leading-none">{mesa.capacidad}</span>
            <span className="block text-xs text-white/40 mt-1">{mesa.capacidad === 1 ? "Persona" : "Personas"}</span>
          </div>
          <div className="bg-white/10 border border-white/10 rounded-2xl px-3 py-2.5 text-center">
            <span className="block text-xs text-white/40">Zona</span>
            <span className="block text-sm font-medium text-white leading-none mt-0.5">{mesa.zonaNombre}</span>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-sm text-rose-500">Error al cargar la orden</div>
        ) : ordenActual ? (
          <>
            {/* Mesero */}
            <div className="flex items-center gap-3 rounded-xl bg-white border border-neutral-200 px-3.5 py-3">
              <div className="rounded-full bg-amber-50 p-2 text-amber-600">
                <User size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-neutral-400">Mesero</p>
                <p className="text-sm font-medium text-neutral-900">
                  {ordenActual.meseroNombre}{soyYo ? " (Tú)" : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-400">Orden #{ordenActual.numeroOrden}</p>
                <p className="text-[11px] text-neutral-500">
                  <Clock size={11} className="inline mr-0.5" />
                  {new Date(ordenActual.creadoEn).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>

            {/* Productos */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">Productos</h2>
                {soyYo && !ordenActual.productos.some((p) => p.enviadoEn) && (
                  <button className="flex items-center gap-1 rounded-lg bg-amber-100 px-3 py-1.5 text-[11px] font-medium text-amber-700 hover:bg-amber-200 transition-colors">
                    <Send size={12} />
                    Enviar a cocina
                  </button>
                )}
              </div>
              <div className="space-y-2">
                  {ordenActual.productos.map((p) => {
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
                        {p.notas && (
                          <p className="text-[11px] text-neutral-400 mt-0.5 italic">{p.notas}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {esListo && soyYo ? (
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
                <span className="text-neutral-900 tabular-nums">{formatCurrency(ordenActual.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-neutral-500">Impuesto</span>
                <span className="text-neutral-900 tabular-nums">{formatCurrency(ordenActual.impuesto)}</span>
              </div>
              {ordenActual.descuento > 0 && (
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-neutral-500">Descuento</span>
                  <span className="text-emerald-600 tabular-nums">-{formatCurrency(ordenActual.descuento)}</span>
                </div>
              )}
              {ordenActual.propina > 0 && (
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-neutral-500">Propina</span>
                  <span className="text-neutral-900 tabular-nums">{formatCurrency(ordenActual.propina)}</span>
                </div>
              )}
              <div className="border-t border-neutral-200 pt-1.5 mt-1.5 flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-900">Total</span>
                <span className="text-lg font-bold text-neutral-900 tabular-nums">{formatCurrency(ordenActual.total)}</span>
              </div>
            </section>

            {soyYo && (
              <>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/app/mesero/order-add", { state: { mesa } })}
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
                      onClick={() => navigate("/app/mesero/charge", { state: { mesa } })}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-3 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                    >
                      <XCircle size={16} />
                      Cerrar
                    </button>
                  )}
                </div>

                {/* Modal cerrar */}
                {showCerrarModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-1">Cerrar orden</h3>
                      <p className="text-sm text-neutral-500 mb-4">Orden #{ordenActual.numeroOrden} — Mesa {String(mesa.numero).padStart(2, "0")}</p>

                      <div className="space-y-1.5 text-sm border-t border-neutral-100 pt-3 mb-4">
                        <div className="flex justify-between text-neutral-600">
                          <span>Subtotal</span>
                          <span className="tabular-nums">{formatCurrency(ordenActual.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-neutral-600">
                          <span>Impuesto</span>
                          <span className="tabular-nums">{formatCurrency(ordenActual.impuesto)}</span>
                        </div>
                        {ordenActual.descuento > 0 && (
                          <div className="flex justify-between text-neutral-600">
                            <span>Descuento</span>
                            <span className="text-emerald-600 tabular-nums">-{formatCurrency(ordenActual.descuento)}</span>
                          </div>
                        )}
                        {ordenActual.propina > 0 && (
                          <div className="flex justify-between text-neutral-600">
                            <span>Propina</span>
                            <span className="tabular-nums">{formatCurrency(ordenActual.propina)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold text-neutral-900 pt-1.5 border-t border-neutral-100">
                          <span>Total</span>
                          <span className="tabular-nums">{formatCurrency(ordenActual.total)}</span>
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
                          onClick={() => cerrar.mutate({ ordenId: ordenActual.id, mesaId: mesa.id }, { onSuccess: () => { setShowCerrarModal(false); navigate(-1) } })}
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
        ) : (
          /* Mesa libre — sin orden */
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className={`w-3 h-3 rounded-full ${cfg?.dot}`} />
            <p className="text-sm text-neutral-500">Mesa disponible</p>
            <button
              onClick={() => navigate("/app/mesero/order-create", { state: { mesa } })}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
            >
              <Plus size={16} />
              Tomar pedido
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
