import bgMesero from "../../../assets/bg_mesero.jpg"
import { useGreeting } from "../hooks/useGreeting"
import { Search, UtensilsCrossed, ClipboardList, Bell, DollarSign, Clock, CheckCircle2, UserPlus } from "lucide-react"
import { formatCurrency } from "@/core/utils"

const metrics = [
  { label: "Mesas Activas", value: "12", icon: <UtensilsCrossed size={22} />, color: "bg-blue-50 text-blue-600", trend: "+2 hoy" },
  { label: "Órdenes Pendientes", value: "8", icon: <ClipboardList size={22} />, color: "bg-amber-50 text-amber-600", trend: "3 urgentes" },
  { label: "Pedidos Listos", value: "4", icon: <Bell size={22} />, color: "bg-emerald-50 text-emerald-600", trend: "Entregar" },
  { label: "Ventas del Día", value: formatCurrency(1250000), icon: <DollarSign size={22} />, color: "bg-violet-50 text-violet-600", trend: "+18% vs ayer" },
]

const assignedTables = [
  { number: 5, people: 4, status: "Orden pendiente", time: "12 min", color: "bg-amber-400" },
  { number: 12, people: 2, status: "Esperando cuenta", time: "35 min", color: "bg-blue-400" },
  { number: 8, people: 6, status: "Comiendo", time: "22 min", color: "bg-emerald-400" },
  { number: 3, people: 3, status: "Orden pendiente", time: "8 min", color: "bg-amber-400" },
]

const activity = [
  { text: "Orden enviada a cocina — Mesa 05", time: "Hace 2 min", icon: <CheckCircle2 size={16} />, color: "text-emerald-500" },
  { text: "Pedido entregado — Mesa 08", time: "Hace 8 min", icon: <CheckCircle2 size={16} />, color: "text-emerald-500" },
  { text: "Cuenta solicitada — Mesa 12", time: "Hace 15 min", icon: <Clock size={16} />, color: "text-amber-500" },
  { text: "Cliente agregado — Mesa 03", time: "Hace 22 min", icon: <UserPlus size={16} />, color: "text-blue-500" },
]

export function MeseroDashboardPage() {
  const { saludo } = useGreeting()

  return (
    <div className="w-full pb-4">
      {/* Hero */}
      <div
        className="relative min-h-[220px] w-full bg-cover bg-center px-5 pt-6 pb-8"
        style={{ backgroundImage: `url(${bgMesero})` }}
      >
        <div className="absolute inset-0 bg-black/50 rounded-b-[32px]" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-white/70">{saludo}</p>
              <h1 className="text-2xl font-bold text-white leading-tight">Andrés Felipe</h1>
              <p className="mt-1 text-sm text-white/80 max-w-[220px] leading-snug">
                Gestiona tus mesas de forma rápida y eficiente
              </p>
            </div>
            <div className="h-11 w-11 rounded-full border-2 border-white/60 bg-neutral-300 flex items-center justify-center text-sm font-semibold text-white overflow-hidden shrink-0">
              AF
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white/20 backdrop-blur-md px-4 py-2.5 border border-white/10">
            <Search size={18} className="text-white/60" />
            <input
              type="text"
              placeholder="Buscar mesa, cliente u orden..."
              className="w-full bg-transparent text-sm text-white placeholder:text-white/50 outline-none"
            />
          </div>
        </div>

        <style>{`
          .rounded-b-\\[32px\\] { border-bottom-left-radius: 32px; border-bottom-right-radius: 32px; }
        `}</style>
      </div>

      <div className="px-4 -mt-4 relative z-20 space-y-5">
        {/* Mi Turno */}
        <section>
          <h2 className="text-base font-bold text-neutral-800 mb-3">Mi Turno</h2>
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-neutral-500">{m.label}</span>
                  <span className={`rounded-xl p-2 ${m.color}`}>{m.icon}</span>
                </div>
                <p className="text-lg font-bold text-neutral-900">{m.value}</p>
                <p className="text-[11px] font-medium text-neutral-400 mt-0.5">{m.trend}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mis Mesas */}
        <section>
          <h2 className="text-base font-bold text-neutral-800 mb-3">Mis Mesas</h2>
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
            {assignedTables.map((t) => (
              <div
                key={t.number}
                className="snap-start shrink-0 w-52 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-neutral-900">Mesa {String(t.number).padStart(2, "0")}</span>
                  <span className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <span className="h-5 w-5 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-medium text-neutral-600">
                      {t.people}
                    </span>
                    personas
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`h-2 w-2 rounded-full ${t.color}`} />
                  <span className="text-sm font-medium text-neutral-700">{t.status}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-neutral-400">
                  <Clock size={12} />
                  <span>{t.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Actividad Reciente */}
        <section>
          <h2 className="text-base font-bold text-neutral-800 mb-3">Actividad Reciente</h2>
          <div className="space-y-2">
            {activity.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-neutral-100 bg-white p-3.5 shadow-sm"
              >
                <span className={`mt-0.5 ${a.color}`}>{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-800">{a.text}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
