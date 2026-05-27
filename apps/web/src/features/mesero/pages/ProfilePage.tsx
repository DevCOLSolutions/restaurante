import { useNavigate } from "react-router-dom"
import { ArrowLeft, Bell, User, Building2, BadgeCheck, Calendar, Clock, Shield, LogOut, Copy } from "lucide-react"
import { useAuthStore } from "@/core/auth/store"
import { useNotificationStore } from "../stores/notificationStore"

export function MeseroProfilePage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

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
              <h1 className="text-xl font-medium text-white tracking-tight">Perfil</h1>
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
      </div>

      <div className="px-4 mt-15">
        {/* User avatar & info */}
        <div className="flex flex-col items-center -mt-12 mb-5">
          <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-neutral-400 mb-3">
            <User size={36} />
          </div>
          <h2 className="text-lg font-semibold text-neutral-900">{user?.name ?? "Mesero"}</h2>
          <p className="text-sm text-neutral-500">{user?.email ?? "—"}</p>
          <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
            <Shield size={12} />
            {user?.role === "Mesero" ? "Mesero" : user?.role ?? "Sin rol"}
          </span>
        </div>

        {/* Organization */}
        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-neutral-100">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide flex items-center gap-1.5">
              <Building2 size={13} /> Organización
            </p>
          </div>
          <div className="divide-y divide-neutral-100">
            <div className="flex items-center justify-between px-4 py-2.5 text-sm">
              <span className="text-neutral-500">Restaurante</span>
              <span className="font-medium text-neutral-800">Restaurante Principal</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5 text-sm">
              <span className="text-neutral-500">ID Organización</span>
              <span className="flex items-center gap-1.5 font-mono text-xs text-neutral-800 bg-neutral-100 rounded-md px-2 py-0.5">
                {user?.restaurantId ?? "—"}
                <button className="text-neutral-400 hover:text-neutral-600">
                  <Copy size={12} />
                </button>
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5 text-sm">
              <span className="text-neutral-500">Empleado ID</span>
              <span className="font-mono text-xs text-neutral-800 bg-neutral-100 rounded-md px-2 py-0.5">
                {user?.id ?? "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="rounded-xl border border-neutral-200 bg-white px-3 py-3 text-center">
            <Calendar size={16} className="mx-auto mb-1 text-neutral-400" />
            <span className="block text-sm font-semibold text-neutral-900">32</span>
            <span className="block text-[10px] text-neutral-500">Órdenes hoy</span>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white px-3 py-3 text-center">
            <Clock size={16} className="mx-auto mb-1 text-neutral-400" />
            <span className="block text-sm font-semibold text-neutral-900">08:00</span>
            <span className="block text-[10px] text-neutral-500">Inicio turno</span>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white px-3 py-3 text-center">
            <BadgeCheck size={16} className="mx-auto mb-1 text-emerald-500" />
            <span className="block text-sm font-semibold text-neutral-900">98%</span>
            <span className="block text-[10px] text-neutral-500">Eficiencia</span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-200 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut size={16} />
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}