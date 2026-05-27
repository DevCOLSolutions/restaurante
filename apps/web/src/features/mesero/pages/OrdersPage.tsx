import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Bell, ClipboardList, ChefHat, Clock, User, Table2, MessageCircle, ChevronDown, ChevronUp, Receipt, CreditCard, Banknote, Check, ChevronLeft, ChevronRight, HelpCircle, X } from "lucide-react"
import { formatCurrency } from "@/core/utils"
import { useNotificationStore } from "../stores/notificationStore"

type ItemStatus = "pendiente" | "en_preparacion" | "listo" | "entregado" | "cancelado"

interface OrderItem {
  id: string
  product: string
  quantity: number
  unitPrice: number
  notes?: string
  status: ItemStatus
}

interface PaymentInfo {
  subtotal: number
  discount: number
  tax: number
  total: number
  tip: number
  method: "cash" | "card" | "transfer"
  invoiced: boolean
  invoiceRef?: string
}

type OrderStatus = "pendiente" | "enviado" | "en_preparacion" | "listo" | "entregado" | "cerrada" | "cancelado"

interface Order {
  id: string
  tableNumber: number
  waiter: string
  guests: number
  status: OrderStatus
  openTime: string
  closeTime?: string
  notes?: string
  items: OrderItem[]
  payment?: PaymentInfo
}

const statusBadge: Record<string, string> = {
  pendiente: "bg-neutral-200 text-neutral-700",
  enviado: "bg-blue-100 text-blue-700",
  en_preparacion: "bg-purple-100 text-purple-700",
  listo: "bg-emerald-100 text-emerald-700",
  entregado: "bg-amber-100 text-amber-700",
  cerrada: "bg-neutral-100 text-neutral-500",
  cancelado: "bg-red-100 text-red-700",
}

const statusLabel: Record<string, string> = {
  pendiente: "\u23F3 Esperando cocina",
  enviado: "\u{1F4E8} Enviado",
  en_preparacion: "\u{1F525} Preparando",
  listo: "\u2705 Listo para entregar",
  entregado: "\u{1F37D}\uFE0F Entregado",
  cerrada: "Cerrada",
  cancelado: "\u274C Cancelado",
}

const itemStatusDot: Record<string, string> = {
  pendiente: "bg-neutral-300",
  en_preparacion: "bg-purple-400",
  listo: "bg-emerald-400",
  entregado: "bg-blue-400",
  cancelado: "bg-red-400",
}

const statusDesc: Record<string, string> = {
  pendiente: "Sistema",
  enviado: "Al enviar la orden a cocina",
  en_preparacion: "Cocina empezó a preparar",
  listo: "Cocina terminó — notifica al mesero",
  entregado: "Mesero lo llevó a la mesa",
  cerrada: "Cliente pagó y se fue",
  cancelado: "Antes de entregar",
}

const statusDetail: Record<string, string> = {
  pendiente: "La orden está creada pero aún no se envía a cocina.",
  enviado: "La orden ya fue enviada y está en espera en cocina.",
  en_preparacion: "La cocina ya comenzó a preparar los platillos.",
  listo: "La cocina terminó. El mesero recibe una notificación.",
  entregado: "El mesero llevó la orden a la mesa del cliente.",
  cerrada: "La cuenta fue pagada. El cliente ya no está en el restaurante.",
  cancelado: "La orden fue cancelada antes de ser entregada.",
}

const allStatuses: OrderStatus[] = ["pendiente", "enviado", "en_preparacion", "listo", "entregado", "cerrada", "cancelado"]
const openStatuses: OrderStatus[] = ["pendiente", "enviado", "en_preparacion", "listo", "entregado"]
const closedStatuses: OrderStatus[] = ["cerrada", "cancelado"]

const mockOrders: Order[] = [
  {
    id: "ORD-001", tableNumber: 5, waiter: "Andrés", guests: 4, status: "pendiente",
    openTime: "12:30", notes: "Cliente celíaco",
    items: [
      { id: "i1", product: "Tacos al Pastor", quantity: 2, unitPrice: 45, status: "pendiente" },
      { id: "i2", product: "Guacamole", quantity: 1, unitPrice: 65, notes: "sin cebolla", status: "pendiente" },
      { id: "i3", product: "Agua de Jamaica", quantity: 2, unitPrice: 25, status: "pendiente" },
    ],
  },
  {
    id: "ORD-002", tableNumber: 3, waiter: "Carlos", guests: 2, status: "enviado",
    openTime: "12:45",
    items: [
      { id: "i4", product: "Ensalada César", quantity: 1, unitPrice: 95, status: "enviado" },
      { id: "i5", product: "Café", quantity: 2, unitPrice: 35, status: "enviado" },
    ],
  },
  {
    id: "ORD-003", tableNumber: 8, waiter: "Andrés", guests: 6, status: "en_preparacion",
    openTime: "13:00",
    items: [
      { id: "i6", product: "Hamburguesa Clásica", quantity: 3, unitPrice: 120, status: "en_preparacion" },
      { id: "i7", product: "Papas Fritas", quantity: 2, unitPrice: 55, status: "en_preparacion" },
      { id: "i8", product: "Malteada de Vainilla", quantity: 2, unitPrice: 45, status: "pendiente" },
    ],
  },
  {
    id: "ORD-004", tableNumber: 2, waiter: "Carlos", guests: 2, status: "listo",
    openTime: "11:15",
    items: [
      { id: "i9", product: "Enchiladas Verdes", quantity: 2, unitPrice: 85, status: "listo" },
      { id: "i10", product: "Coca-Cola", quantity: 2, unitPrice: 20, status: "listo" },
    ],
  },
  {
    id: "ORD-005", tableNumber: 10, waiter: "Andrés", guests: 1, status: "entregado",
    openTime: "12:00",
    items: [
      { id: "i11", product: "Flan Napolitano", quantity: 1, unitPrice: 50, status: "entregado" },
    ],
  },
  {
    id: "ORD-006", tableNumber: 1, waiter: "María", guests: 4, status: "cerrada",
    openTime: "10:00", closeTime: "11:45",
    items: [
      { id: "i12", product: "Tacos al Pastor", quantity: 4, unitPrice: 45, status: "entregado" },
      { id: "i13", product: "Agua de Jamaica", quantity: 3, unitPrice: 25, status: "entregado" },
      { id: "i14", product: "Flan Napolitano", quantity: 2, unitPrice: 50, status: "entregado" },
    ],
    payment: { subtotal: 355, discount: 0, tax: 71, total: 426, tip: 50, method: "card", invoiced: true, invoiceRef: "FAC-001" },
  },
  {
    id: "ORD-007", tableNumber: 7, waiter: "Andrés", guests: 3, status: "cancelado",
    openTime: "09:30",
    items: [
      { id: "i15", product: "Hamburguesa Clásica", quantity: 2, unitPrice: 120, status: "cancelado" },
    ],
  },
]

function formatDate(d: Date): string {
  const today = new Date()
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1)

  if (d.toDateString() === today.toDateString()) return "Hoy"
  if (d.toDateString() === yesterday.toDateString()) return "Ayer"
  if (d.toDateString() === tomorrow.toDateString()) return "Mañana"
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })
}

export function MeseroOrdersPage() {
  const navigate = useNavigate()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tab, setTab] = useState<"abiertas" | "cerradas">("abiertas")
  const [filter, setFilter] = useState<string>("all")
  const [showHelp, setShowHelp] = useState(false)

  const ordersForDate = mockOrders

  const filtered = ordersForDate.filter((o) => {
    const inTab = tab === "abiertas" ? openStatuses.includes(o.status) : closedStatuses.includes(o.status)
    if (!inTab) return false
    if (filter === "all") return true
    return o.status === filter
  })

  const openCount = ordersForDate.filter((o) => openStatuses.includes(o.status)).length
  const closedCount = ordersForDate.filter((o) => closedStatuses.includes(o.status)).length

  const toggleExpand = (id: string) => setExpandedId(expandedId === id ? null : id)

  const prevDay = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() - 1)
    setCurrentDate(d)
  }
  const nextDay = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + 1)
    setCurrentDate(d)
  }

  const filterOptions = tab === "abiertas"
    ? ["all", "pendiente", "enviado", "en_preparacion", "listo", "entregado"]
    : ["all", "cerrada", "cancelado"]

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
              <p className="text-xs text-white/50">Restaurante</p>
              <h1 className="text-xl font-medium text-white tracking-tight">Órdenes</h1>
            </div>
          </div>
          <button onClick={() => useNotificationStore.getState().toggle()} className="relative inline-flex items-center bg-white/10 border border-white/10 text-white/70 rounded-full p-2 hover:bg-white/20 transition-colors">
            <Bell size={16} />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F59E0B]"></span>
            </span>
          </button>
        </div>

        {/* Date navigation */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <button onClick={prevDay} className="text-white/50 hover:text-white transition-colors">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium text-white">{formatDate(currentDate)}</span>
          <button onClick={nextDay} className="text-white/50 hover:text-white transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setTab("abiertas")}
            className={`rounded-2xl px-3 py-2.5 text-center transition-all ${
              tab === "abiertas" ? "bg-white text-neutral-900" : "bg-white/10 border border-white/10 text-white"
            }`}
          >
            <span className="block text-lg font-medium leading-none">{openCount}</span>
            <span className={`block text-xs mt-1 ${tab === "abiertas" ? "text-neutral-500" : "text-white/40"}`}>Abiertas</span>
          </button>
          <button
            onClick={() => setTab("cerradas")}
            className={`rounded-2xl px-3 py-2.5 text-center transition-all ${
              tab === "cerradas" ? "bg-white text-neutral-900" : "bg-white/10 border border-white/10 text-white"
            }`}
          >
            <span className="block text-lg font-medium leading-none">{closedCount}</span>
            <span className={`block text-xs mt-1 ${tab === "cerradas" ? "text-neutral-500" : "text-white/40"}`}>Cerradas</span>
          </button>
        </div>
      </div>

      <div className="px-4 mt-4">
        {/* Filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3">
          <button
            onClick={() => setShowHelp(true)}
            className="shrink-0 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
          >
            <HelpCircle size={16} />
          </button>
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                filter === f
                  ? "bg-gradient-to-r from-neutral-800 to-neutral-700 text-white shadow-sm"
                  : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
              }`}
            >
              {f === "all" ? "Todas" : statusLabel[f]}
            </button>
          ))}
        </div>

        {/* Orders list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 text-neutral-300"><ClipboardList size={48} /></div>
              <h3 className="text-base font-semibold text-neutral-600">Sin órdenes</h3>
              <p className="mt-1 text-sm text-neutral-400">
                {tab === "abiertas" ? "No hay órdenes abiertas en este momento" : "No hay órdenes cerradas en este día"}
              </p>
            </div>
          ) : (
            filtered.map((order) => {
              const expanded = expandedId === order.id
              const itemSubtotal = order.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0)
              return (
                <div key={order.id} className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
                  {/* Header */}
                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-100 text-neutral-600">
                        <Table2 size={16} />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-neutral-900">Mesa {String(order.tableNumber).padStart(2, "0")}</p>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusBadge[order.status]}`}>
                            {statusLabel[order.status]}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400">{order.id} · {order.openTime}h · {order.waiter}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-neutral-900">{formatCurrency(itemSubtotal)}</span>
                      {expanded ? <ChevronUp size={16} className="text-neutral-400" /> : <ChevronDown size={16} className="text-neutral-400" />}
                    </div>
                  </button>

                  {/* Expanded body */}
                  {expanded && (
                    <div className="border-t border-neutral-100 px-4 py-3 space-y-3" style={{ animation: "fadeSlideUp 0.2s ease-out" }}>
                      {/* Meta info */}
                      <div className="flex items-center gap-4 text-xs text-neutral-500">
                        <span className="flex items-center gap-1"><User size={12} /> {order.guests} {order.guests === 1 ? "comensal" : "comensales"}</span>
                        <span className="flex items-center gap-1"><ChefHat size={12} /> {order.waiter}</span>
                      </div>

                      {/* Status description */}
                      {openStatuses.includes(order.status) && (
                        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                          <Clock size={12} />
                          <span>{statusDesc[order.status]}</span>
                        </div>
                      )}

                      {/* Notes */}
                      {order.notes && (
                        <div className="flex items-start gap-1.5 text-xs text-amber-600 bg-amber-50 rounded-lg px-2.5 py-1.5">
                          <MessageCircle size={12} className="mt-0.5 shrink-0" />
                          <span>{order.notes}</span>
                        </div>
                      )}

                      {/* Items */}
                      <div>
                        <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">Artículos</p>
                        <div className="space-y-1">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${itemStatusDot[item.status] ?? "bg-neutral-300"}`} />
                                <span className="text-neutral-700 truncate">{item.quantity}x {item.product}</span>
                                {item.notes && <span className="text-[10px] text-neutral-400 truncate max-w-[100px]">· {item.notes}</span>}
                              </div>
                              <span className="text-neutral-500 text-xs shrink-0 ml-3">{formatCurrency(item.unitPrice * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment info for closed orders */}
                      {order.payment && (
                        <div className="border-t border-neutral-100 pt-2 space-y-1">
                          <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wide mb-1">Cobro</p>
                          <div className="space-y-0.5 text-xs text-neutral-600">
                            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(order.payment.subtotal)}</span></div>
                            {order.payment.discount > 0 && <div className="flex justify-between"><span>Descuento</span><span className="text-red-500">-{formatCurrency(order.payment.discount)}</span></div>}
                            <div className="flex justify-between"><span>IVA (20%)</span><span>{formatCurrency(order.payment.tax)}</span></div>
                            <div className="flex justify-between font-semibold text-neutral-800 pt-0.5 border-t border-neutral-100 mt-0.5">
                              <span>Total</span><span>{formatCurrency(order.payment.total)}</span>
                            </div>
                            {order.payment.tip > 0 && <div className="flex justify-between"><span>Propina</span><span>{formatCurrency(order.payment.tip)}</span></div>}
                            <div className="flex items-center gap-2 pt-1">
                              <span className="flex items-center gap-1 text-neutral-400">
                                {order.payment.method === "cash" ? <Banknote size={12} /> : order.payment.method === "card" ? <CreditCard size={12} /> : <Receipt size={12} />}
                                {order.payment.method === "cash" ? "Efectivo" : order.payment.method === "card" ? "Tarjeta" : "Transferencia"}
                              </span>
                              {order.payment.invoiced && (
                                <span className="flex items-center gap-1 text-emerald-600">
                                  <Check size={12} /> Facturada
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Help drawer */}
      {showHelp && (
        <>
          <div className="fixed inset-0 z-[100] bg-black/30" onClick={() => setShowHelp(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-[101] w-full rounded-t-2xl bg-white px-5 pb-10 pt-5 shadow-2xl">
            <button onClick={() => setShowHelp(false)} className="absolute right-4 top-4 rounded-full p-1 text-neutral-400 hover:bg-neutral-100">
              <X size={18} />
            </button>
            <h3 className="text-base font-semibold text-neutral-900 mb-1">Estados de orden</h3>
            <p className="text-xs text-neutral-400 mb-4">Técnico → Lo que ves</p>
            <div className="space-y-3">
              {(allStatuses).map((s) => (
                <div key={s} className="flex items-start gap-3">
                  <span className={`shrink-0 mt-0.5 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${statusBadge[s]}`}>
                    {statusLabel[s]}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-neutral-700">
                      <span className="font-mono text-neutral-400">{s}</span>
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{statusDetail[s]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}