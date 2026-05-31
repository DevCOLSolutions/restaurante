import { Sun, Store, Bell } from "lucide-react"

const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]

interface HeroMeseroProps {
    nombre?: string
    initials?: string
    turno?: string
    zona?: string
    mesasActivas?: number
}

export function HeroMesero({
    nombre = "Andrés Felipe",
    initials = "AF",
    turno = "Turno diario",
    zona = "Restaurante",
    mesasActivas = 0,
}: HeroMeseroProps) {
    const now = new Date()
    const h = now.getHours()
    const saludo = h < 12 ? "Buenos días," : h < 19 ? "Buenas tardes," : "Buenas noches,"
    const fecha = `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`

    return (
        <div className="relative w-full bg-neutral-900 px-5 pt-5 pb-5 rounded-b-4xl overflow-hidden">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-xs text-white/50">{saludo}</p>
                    <h1 className="text-2xl font-medium text-white tracking-tight leading-tight">{nombre}</h1>
                </div>
                <div className="h-10 w-10 rounded-full bg-white text-neutral-900 flex items-center justify-center text-sm font-medium shrink-0">
                    {initials}
                </div>
            </div>

            <div className="flex gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 bg-white text-neutral-900 rounded-full px-3 py-1 text-xs font-medium">
                    <Sun size={12} />
                    {turno}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 text-white/70 rounded-full px-3 py-1 text-xs">
                    <Store size={12} />
                    {zona}
                </span>
                <span className="relative inline-flex items-center bg-white/10 border border-white/10 text-white/70 rounded-full px-3 py-1 text-xs">
                    <Bell size={12} />
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F59E0B]"></span>
                    </span>
                </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/7 col-span-2 border border-white/10 rounded-2xl px-3 py-2.5 text-center">
                    <span className="block text-lg font-medium text-white leading-none">Hoy es</span>
                    <span className="block text-xs text-white/40 mt-1 tracking-wide">{fecha}</span>
                </div>
                <div className="bg-white/7 col-span-1 border border-white/10 rounded-2xl px-3 py-2.5 text-center">
                    <span className="block text-lg font-medium text-white leading-none">{mesasActivas}</span>
                    <span className="block text-xs text-white/40 mt-1 tracking-wide">Mesas activas</span>
                </div>
            </div>
        </div>
    )
}
