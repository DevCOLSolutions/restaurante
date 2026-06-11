import { useMe } from "@/hooks/useMe"
import {  Building2, Table2 } from "lucide-react"
import { NotificationBell } from "../components/NotificationBell"

const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]

export function HeroMesero() {
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
                        {user?.data?.restauranteNombre} ∙
                        <span className="items-center font-medium underline
                         text-white/60 text-xs">
                            Sucursal {user?.data?.sucursalNombre}
                        </span>
                    </span>
                </div>

                {/* Bell solo */}
                <NotificationBell />
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-2 ">
                {/* Fecha */}
                <div className="flex justify-center flex-col col-span-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
                    <span className="block text-white text-sm font-medium">{fecha}</span>
                    <span className="block text-xs text-white/40 mt-1">Panel de Mesero</span>
                </div>

                {/* Órdenes */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                    <span className="flex items-center gap-1 text-lg font-semibold text-white">
                        <Table2  size={18} className="text-white/70 " />
                        24
                    </span>
                    <span className="block text-xs text-white/40"> Mesas activas</span>
                </div>


            </div>
        </div>
    );
}