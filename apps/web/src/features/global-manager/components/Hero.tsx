import { useMe } from "@/hooks/useMe"
import { Bell, Building2, ClipboardList, DollarSign, Store } from "lucide-react"

const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]

export function HeroAdministrador() {
    const { data: user } = useMe()

    const now = new Date()
    const h = now.getHours()

    const saludo =
        h < 12 ? "Buenos días," : h < 19 ? "Buenas tardes," : "Buenas noches,"

    const fecha = `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`

    const nombre = user?.data?.fullName
        ?.split(" ")
        .slice(0, 2)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ")

    return (
        <div className="relative w-full bg-neutral-900 px-5 pt-5 pb-5 rounded-b-4xl overflow-hidden">

            {/* Header */}
            <div className="flex items-start justify-between mb-2">
                <div>
                    <p className="text-white/60 text-sm">{saludo}</p>
                    <h1 className="text-3xl font-medium text-white tracking-tight leading-8">
                        {nombre}
                    </h1>
                    {/* Restaurante justo debajo del nombre */}
                    <span className="inline-flex items-center gap-1.5 text-white/50 text-xs mt-1">
                        <Building2 size={11} />
                        {user?.data?.restauranteNombre}
                    </span>
                </div>

                {/* Bell solo */}
                <div className="relative flex items-center justify-center bg-white/10 border border-white/10 rounded-full p-2 mt-1">
                    <Bell size={15} className="text-white/70" />
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                    </span>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-2">
                {/* Fecha */}
                <div className="col-span-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
                    <span className="block text-white text-sm font-medium">{fecha}</span>
                    <span className="block text-xs text-white/40 mt-1">Panel de administración de tu restaurante</span>
                </div>

                {/* Órdenes */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                    <span className="flex items-center gap-1 text-lg font-semibold text-white">
                        <ClipboardList size={18} className="text-white/70 " />
                        24
                    </span>
                    <span className="block text-xs text-white/40">Órdenes hoy</span>
                </div>

                {/* Ventas */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3">

                    <span className="flex items-center gap-1 text-lg font-semibold text-white">
                        <DollarSign size={18} className="text-white/70" />
                        850K
                    </span>
                    <span className="block text-xs text-white/40">Ventas hoy</span>
                </div>
               

                <div className="bg-white/5 border border-white/10 rounded-2xl p-3">

                    <span className="flex items-center gap-1 text-lg font-semibold text-white">
                        <Store size={18} className="text-white/70 " />
                        4 
                    </span>
                    <span className="block text-xs text-white/40">Sucursales</span>
                </div>
                
            </div>
        </div>
    )
}