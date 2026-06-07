import { useMe } from "@/hooks/useMe"
import { ArrowLeft, Bell } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface HeroSucursalesDetailsProps {
  sucursal: { id: string; nombre: string }
}

export function HeroSucursalesDetails({ sucursal }: HeroSucursalesDetailsProps) {
  const { data: user } = useMe()
  const navigate = useNavigate()

  return (
    <div className="relative w-full bg-neutral-900 px-5 py-5 rounded-b-4xl overflow-hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-3">
          <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white">
            <ArrowLeft size={22} />
          </button>
          <div>
            <p className="text-xs text-white/50">{user?.data?.restauranteNombre}</p>
            <h1 className="text-xl font-medium text-white tracking-tight leading-none">Sucursal {sucursal.nombre}</h1>
          </div>
        </div>
        <div className="relative flex items-center justify-center bg-white/10 border border-white/10 rounded-full p-2 mt-1">
          <Bell size={15} className="text-white/70" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
          </span>
        </div>
      </div>
    </div>
  )
}
