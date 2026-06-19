import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BadgeCheck, BadgeX, Building2, ChevronRight, MapPin, Phone, Plus, Table2 } from "lucide-react"
import { useSucursalesAll } from "../hooks/useSucursalesAll"
import { HeroSucursales } from "../components/sucursales/HeroSucursales"
import { AddSucursalModal } from "../components/AddSucursalModal"

export function SucursalesPage() {
  const navigate = useNavigate()
  const { data: sucursales, isLoading } = useSucursalesAll()
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="space-y-4">
      <HeroSucursales />

      <div className="px-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-neutral-400">
            {isLoading ? "Cargando..." : `${sucursales?.length ?? 0} sucursales registradas`}
          </p>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-900 text-white text-[11px] font-medium hover:bg-neutral-800 transition-colors">
            <Plus size={13} /> Agregar sucursal
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
          </div>
        ) : (
          sucursales?.map((suc) => (
            <button
              key={suc.id}
              onClick={() => navigate(`/app/global-manager/sucursales/${suc.id}`)}
              className="w-full rounded-3xl bg-white border border-neutral-200 shadow-sm p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 text-neutral-600 shrink-0">
                  <Building2 size={18} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-neutral-900">{suc.nombre}</p>
                    <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-medium ${suc.activa ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"}`}>
                      {suc.activa ? <BadgeCheck size={9} /> : <BadgeX size={9} />}
                      {suc.activa ? "Activa" : "Inactiva"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-400">
                    {suc.direccion && <span className="flex items-center gap-1"><MapPin size={10} />{suc.direccion}</span>}
                    {suc.telefono && <span className="flex items-center gap-1"><Phone size={10} />{suc.telefono}</span>}
                    <span className="flex items-center gap-1"><Table2 size={10} />{suc.cantidadMesas} mesas</span>
                  </div>
                </div>
              </div>
              <ChevronRight size={18} className="text-neutral-400 shrink-0" />
            </button>
          ))
        )}
      </div>

      {showModal && <AddSucursalModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
