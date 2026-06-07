import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  MapPin,
  UtensilsCrossed,
  Users,
  TableProperties,
  CheckCircle2,
  UserCog,
  Store,
  BadgeCheck,
  BadgeX,
  CalendarDays,
} from "lucide-react"
import { useSucursal } from "../hooks/useSucursal"
import { HeroSucursalesDetails } from "../components/sucursales/HeroSucursalesDetails"

const ROLE_LABEL: Record<string, string> = {
  administrador: "Administrador",
  cajero: "Cajero",
  mesero: "Mesero",
  cocina: "Cocina",
}

const ORDENES_MOCK = [
  { id: "1", mesa: 3, estado: "en_cocina", items: [{}, {}] },
  { id: "2", mesa: 7, estado: "pendiente", items: [{}] },
  { id: "3", mesa: 1, estado: "lista", items: [{}, {}, {}] },
]

const USUARIOS_MOCK = [
  { id: "1", fullName: "Carlos Martínez", email: "carlos@rest.co", rol: "mesero" },
  { id: "2", fullName: "Laura Gómez", email: "laura@rest.co", rol: "cajero" },
  { id: "3", fullName: "Andrés Torres", email: "andres@rest.co", rol: "cocina" },
]

const ESTADO_ORDEN: Record<string, { label: string; dot: string }> = {
  pendiente: { label: "Pendiente", dot: "bg-amber-500" },
  en_cocina: { label: "En cocina", dot: "bg-blue-500" },
  lista: { label: "Lista", dot: "bg-emerald-500" },
}

const today = new Date().toLocaleDateString("es-CO", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
})

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-neutral-400">{label}</p>
        <p className="text-sm font-medium text-neutral-900">{value}</p>
      </div>
    </div>
  )
}

export function SucursalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: sucursal, isLoading } = useSucursal(id)
  const ordenes = ORDENES_MOCK
  const usuarios = USUARIOS_MOCK
  const ordenesActivas = ordenes.filter((o) => !["entregada", "cancelada"].includes(o.estado))

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
      </div>
    )
  }

  if (!sucursal) {
    return (
      <div className="p-6">
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900">
          <ArrowLeft size={16} />
          Regresar
        </button>
        <p className="text-sm text-neutral-500">Sucursal no encontrada</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-12">
      <HeroSucursalesDetails sucursal={sucursal} />

      <div className="mx-auto max-w-5xl px-4 -mt-5 relative z-10 space-y-4">

        {/* Resumen sucursal */}
        <section className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
            <div className="flex items-center gap-2">
              <Store size={15} className="text-neutral-500" />
              <h2 className="text-sm font-semibold text-neutral-800">{sucursal.nombre}</h2>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                sucursal.activa
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-neutral-100 text-neutral-500"
              }`}>
                {sucursal.activa ? <BadgeCheck size={10} /> : <BadgeX size={10} />}
                {sucursal.activa ? "Activa" : "Inactiva"}
              </span>
            </div>
            <span className="text-[11px] text-neutral-400">{today}</span>
          </div>
          <div className="flex flex-wrap gap-6 px-5 py-4">
            {sucursal.direccion && (
              <InfoItem icon={<MapPin size={16} />} label="Dirección" value={sucursal.direccion} />
            )}
            <InfoItem icon={<TableProperties size={16} />} label="Mesas" value={sucursal.cantidadMesas} />
            <InfoItem icon={<UtensilsCrossed size={16} />} label="Órdenes del día" value={ordenesActivas.length} />
            <InfoItem icon={<Users size={16} />} label="Usuarios" value={usuarios.length} />
          </div>
        </section>

        {/* Admin */}
        <section className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-neutral-100">
            <UserCog size={15} className="text-neutral-500" />
            <h2 className="text-sm font-semibold text-neutral-800">Administrador de la sucursal</h2>
          </div>
          <div className="flex flex-col items-center py-10">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-100 text-neutral-300 mb-3">
              <UserCog size={24} />
            </div>
            <p className="text-sm font-medium text-neutral-600 mb-1">Sin administrador asignado</p>
            <p className="text-xs text-neutral-400">Asigna un administrador para gestionar esta sucursal</p>
          </div>
        </section>

        {/* Órdenes activas */}
        <section className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <UtensilsCrossed size={16} className="text-neutral-500" />
              <h2 className="text-sm font-semibold text-neutral-800">Órdenes activas</h2>
            </div>
            <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600">
              {ordenesActivas.length}
            </span>
          </div>
          {ordenesActivas.length === 0 ? (
            <div className="flex flex-col items-center py-12">
              <CheckCircle2 size={28} className="text-neutral-300" />
              <p className="mt-2 text-sm text-neutral-400">No hay órdenes activas</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {ordenesActivas.map((orden) => {
                const cfg = ESTADO_ORDEN[orden.estado] ?? { label: orden.estado, dot: "bg-neutral-400" }
                return (
                  <div key={orden.id} className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                        <UtensilsCrossed size={15} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">Mesa {orden.mesa}</p>
                        <p className="text-xs text-neutral-400">{orden.items.length} producto(s)</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium ${
                      orden.estado === "pendiente" ? "bg-amber-50 text-amber-700" :
                      orden.estado === "en_cocina" ? "bg-blue-50 text-blue-700" :
                      "bg-emerald-50 text-emerald-700"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
