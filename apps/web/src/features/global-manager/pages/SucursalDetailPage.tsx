import { useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { ArrowLeft, BadgeCheck, BadgeX, Building2, Calendar, ChevronDown, ChevronRight, Hash, Info, MapPin, Pen, Phone, Plus, Table2, Trash2, UserIcon, X } from "lucide-react"
import { useSucursal } from "../hooks/useSucursal"
import { useMesasEstados } from "../hooks/useMesasEstados"
import { useZonasPorSucursal } from "../hooks/useZonasPorSucursal"
import { useCreateZona } from "../hooks/useCreateZona"
import { useUpdateSucursal } from "../hooks/useUpdateSucursal"
import { useDeleteSucursal } from "../hooks/useDeleteSucursal"
import { AsignarAdminModal } from "../components/AsignarAdminModal"
import { ConfirmDialog } from "../components/ConfirmDialog"
import { useUsuariosPorSucursal } from "../hooks/useUsuariosPorSucursal"
import type { Mesa } from "@/types/api"
import { useMe } from "@/hooks/useMe"

const statusColor: Record<string, string> = {
  disponible: "bg-emerald-500",
  ocupada: "bg-amber-400",
  reservada: "bg-blue-500",
}

const statusBg: Record<string, string> = {
  disponible: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ocupada: "bg-amber-50 text-amber-700 border-amber-200",
  reservada: "bg-blue-50 text-blue-700 border-blue-200",
}

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

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleString("es-CO", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  })
}

export function SucursalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: sucursal, isLoading } = useSucursal(id)
  const { data: mesasData } = useMesasEstados(id)
  const { data: zonas = [], isLoading: zonasLoading } = useZonasPorSucursal(id)
  const { mutate: createZona, isPending: zonaPending } = useCreateZona()
  const {data: user} = useMe()
  const { data: usuarios = [], isLoading: usuariosLoading } = useUsuariosPorSucursal(id)
  const adminUser = useMemo(() => {
    const found = usuarios.find((u) => u.id === sucursal?.adminId)
    if (found) return found
    if (sucursal?.adminId && user?.data?.userId === sucursal.adminId) {
      return { id: user.data.userId, email: user.data.email, name: user.data.fullName, roles: user.data.roles, activo: true }
    }
    return undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarios, sucursal?.adminId, user?.data?.userId])

  const [showZonaForm, setShowZonaForm] = useState(false)
  const [zonaForm, setZonaForm] = useState({ nombre: "", descripcion: "" })

  const zonasMesas = useMemo(() => {
    if (!mesasData?.grupos) return []
    const allMesas = mesasData.grupos.flatMap((g) => g.mesas)
    const map = new Map<string, Mesa[]>()
    for (const mesa of allMesas) {
      const zn = mesa.zonaNombre ?? "Otra"
      if (!map.has(zn)) map.set(zn, [])
      map.get(zn)!.push(mesa)
    }
    return Array.from(map.entries())
  }, [mesasData])

  const [expandedZona, setExpandedZona] = useState<string | null>(null)
  const [expandedInfo, setExpandedInfo] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ nombre: "", direccion: "", telefono: "", cantidadMesas: 0 })
  const { mutate: updateSucursal } = useUpdateSucursal()
  const { mutate: deleteSucursal, isPending: isDeleting } = useDeleteSucursal()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleCreateZona = () => {
    if (!id || !zonaForm.nombre.trim()) return
    createZona(
      { sucursalId: id, nombre: zonaForm.nombre.trim(), descripcion: zonaForm.descripcion.trim() || null },
      { onSuccess: () => { setShowZonaForm(false); setZonaForm({ nombre: "", descripcion: "" }) } },
    )
  }

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
        <button onClick={() => navigate("/app/global-manager/sucursales")} className="mb-4 flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900">
          <ArrowLeft size={16} /> Regresar
        </button>
        <p className="text-sm text-neutral-500">Sucursal no encontrada</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-12">
      <div className="bg-neutral-900 px-5 pt-5 pb-8 rounded-b-4xl">
        <button onClick={() => navigate("/app/global-manager/sucursales")} className="flex items-center gap-2 text-white/70 hover:text-white mb-3">
          <ArrowLeft size={20} /> Regresar
        </button>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Building2 size={24} className="text-white/50 shrink-0" />
            <div className="leading-none min-w-0">
              <h1 className="text-2xl font-medium text-white tracking-tight truncate">Sucursal {sucursal.nombre}</h1>
              <span className="text-sm text-white/70 mr-2 leading-none">{user?.data?.restauranteNombre}</span>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium mt-1 ${sucursal.activa ? "bg-emerald-500/20 text-emerald-400" : "bg-neutral-500/20 text-neutral-400"}`}>
                {sucursal.activa ? <BadgeCheck size={10} /> : <BadgeX size={10} />}
                {sucursal.activa ? "Activa" : "Inactiva"}
              </span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-500/20 text-rose-400 text-[11px] font-medium hover:bg-rose-500/30 transition-colors">
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 -mt-4 relative z-10 space-y-4">
        {sucursal.adminId && adminUser ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                <Building2 size={16} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-neutral-400">Administrador de sucursal</p>
                <p className="text-sm font-medium text-neutral-900">{adminUser.name}</p>
                <p className="text-[11px] text-neutral-500">{adminUser.email}</p>
              </div>
              <button onClick={() => setShowAdminModal(true)} className="rounded-xl bg-neutral-900 text-white px-3 py-1.5 text-[11px] font-medium hover:bg-neutral-800 transition-colors shrink-0">
                Cambiar
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-neutral-200 bg-white p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-300">
                <Building2 size={16} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-neutral-400">Administrador de sucursal</p>
                <p className="text-sm text-neutral-500">Sin administrador asignado</p>
                
              </div>
              <button onClick={() => setShowAdminModal(true)} className="rounded-xl bg-neutral-900 text-white px-4 py-2 text-xs font-medium hover:bg-neutral-800 transition-colors">
                Asignar
              </button>
            </div>
          </div>
        )}
        <div className="rounded-2xl border border-neutral-200 bg-white">
          <div
            onClick={() => setExpandedInfo(!expandedInfo)}
            className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
              <Info size={16} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-neutral-900">Información general</p>
              <p className="text-[11px] text-neutral-400">{expandedInfo ? "Ocultar detalles" : "Ver detalles"}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setEditing(!editing); setEditForm({ nombre: sucursal.nombre, direccion: sucursal.direccion ?? "", telefono: sucursal.telefono ?? "", cantidadMesas: sucursal.cantidadMesas }) }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-600 text-[11px] font-medium hover:bg-neutral-200 transition-colors"
            >
              <Pen size={12} /> Editar
            </button>
            <ChevronDown size={16} className={`text-neutral-400 transition-transform ${expandedInfo ? "rotate-180" : ""}`} />
          </div>
          {expandedInfo && (
            <div className="px-5 pb-5 space-y-4 border-t border-neutral-100 pt-4">
              {editing ? (
                <div className="space-y-2">
                  <input value={editForm.nombre} onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400" placeholder="Nombre" />
                  <input value={editForm.direccion} onChange={(e) => setEditForm({ ...editForm, direccion: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400" placeholder="Dirección" />
                  <input value={editForm.telefono} onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400" placeholder="Teléfono" />
                  <input value={editForm.cantidadMesas} onChange={(e) => setEditForm({ ...editForm, cantidadMesas: Number(e.target.value) })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400" placeholder="Cantidad de mesas" type="number" />
                  <div className="flex gap-2">
                    <button onClick={() => { updateSucursal({ id: sucursal.id, nombre: editForm.nombre.trim() || null, direccion: editForm.direccion.trim() || null, telefono: editForm.telefono.trim() || null, cantidadMesas: editForm.cantidadMesas }); setEditing(false) }} className="rounded-xl bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800">Guardar</button>
                    <button onClick={() => setEditing(false)} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50">Cancelar</button>
                  </div>
                </div>
              ) : (
              <>
              {sucursal.direccion && <InfoItem icon={<MapPin size={16} />} label="Dirección" value={sucursal.direccion} />}
              {sucursal.telefono && <InfoItem icon={<Phone size={16} />} label="Teléfono" value={sucursal.telefono} />}
              </>
              )}
              <div>
                <button
                  onClick={() => setExpandedZona(expandedZona === "__mesas__" ? null : "__mesas__")}
                  className="w-full flex items-center gap-3 text-left"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                    <Table2 size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] text-neutral-400">Mesas</p>
                    <p className="text-sm font-medium text-neutral-900">{mesasData?.total ?? sucursal.cantidadMesas}</p>
                  </div>
                  <ChevronDown size={16} className={`text-neutral-400 transition-transform ${expandedZona === "__mesas__" ? "rotate-180" : ""}`} />
                </button>
                {expandedZona === "__mesas__" && (
                  <div className="mt-3 pl-12 space-y-3">
                    {zonasMesas.length === 0 ? (
                      <p className="text-xs text-neutral-400">Sin mesas registradas</p>
                    ) : (
                      zonasMesas.map(([zonaNombre, ms]) => (
                        <div key={zonaNombre}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-medium text-neutral-700">{zonaNombre}</span>
                            <span className="text-[10px] text-neutral-400">{ms.length} {ms.length === 1 ? "mesa" : "mesas"}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {ms.map((mesa) => (
                              <span key={mesa.id} className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusBg[mesa.estado] ?? "bg-neutral-100 text-neutral-600"}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${statusColor[mesa.estado] ?? "bg-neutral-400"}`} />
                                #{mesa.numero} {mesa.nombre}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              <InfoItem icon={<Calendar size={16} />} label="Creado" value={formatDate(sucursal.creadoEn)} />
              <InfoItem icon={<Calendar size={16} />} label="Actualizado" value={formatDate(sucursal.actualizadoEn)} />
              <InfoItem icon={<Hash size={16} />} label="ID" value={<span className="text-xs font-mono text-neutral-500">{sucursal.id}</span>} />
              <InfoItem icon={<Hash size={16} />} label="Restaurante ID" value={<span className="text-xs font-mono text-neutral-500">{sucursal.restauranteId}</span>} />
            </div>
          )}
        </div>

        {/* ZONAS */}
        <div className="rounded-2xl bg- border border-neutral-200 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-neutral-700">
              Zonas
            </h3>
            <button onClick={() => setShowZonaForm(!showZonaForm)} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-900 text-white text-[10px] font-medium hover:bg-neutral-800 transition-colors">
              <Plus size={11} /> Añadir zona nueva
            </button>
          </div>

          {showZonaForm && (
            <div className="rounded-xl bg-white border border-neutral-200 p-3 mb-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-neutral-700">Nueva zona</p>
                <button onClick={() => setShowZonaForm(false)}><X size={14} className="text-neutral-400" /></button>
              </div>
              <input value={zonaForm.nombre} onChange={(e) => setZonaForm({ ...zonaForm, nombre: e.target.value })} placeholder="Nombre de la zona" className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs outline-none focus:border-neutral-400" />
              <input value={zonaForm.descripcion} onChange={(e) => setZonaForm({ ...zonaForm, descripcion: e.target.value })} placeholder="Descripción (opcional)" className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs outline-none focus:border-neutral-400" />
              <button onClick={handleCreateZona} disabled={zonaPending || !zonaForm.nombre.trim()} className="w-full rounded-lg bg-neutral-900 text-white py-1.5 text-xs font-medium hover:bg-neutral-800 disabled:opacity-40">
                {zonaPending ? "..." : "Crear zona"}
              </button>
            </div>
          )}

          {zonasLoading ? (
            <div className="flex justify-center py-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
            </div>
          ) : zonas.length === 0 ? (
            <p className="text-xs text-neutral-400 text-center py-4">Sin zonas registradas</p>
          ) : (
            <div className="space-y-2">
              {zonas.map((zona) => (
                <button key={zona.id} onClick={() => navigate(`/app/global-manager/sucursales/${id}/zonas/${zona.id}`)} className="w-full rounded-xl bg-white border border-neutral-200 p-3 flex items-center gap-3 hover:bg-neutral-50 transition-colors text-left">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-neutral-900">{zona.nombre}</p>
                    {zona.descripcion && <p className="text-xs text-neutral-400">{zona.descripcion}</p>}
                  </div>
                  <ChevronRight size={16} className="text-neutral-400 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* USUARIOS */}
        <div className="rounded-2xl bg- border border-neutral-200 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-neutral-700">
              Usuarios de la sucursal
            </h3>
            <button onClick={() => navigate(`/app/global-manager/sucursales/${id}/crear-usuario`)} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-900 text-white text-[10px] font-medium hover:bg-neutral-800 transition-colors">
              <Plus size={11} /> Nuevo usuario
            </button>
          </div>

          {usuariosLoading ? (
            <div className="flex justify-center py-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
            </div>
          ) : usuarios.length === 0 ? (
            <p className="text-xs text-neutral-400 text-center py-4">Sin usuarios registrados</p>
          ) : (
            <div className="space-y-2">
              {[...usuarios].sort((a, b) => {
                if (a.activo && !b.activo) return -1
                if (!a.activo && b.activo) return 1
                return 0
              }).map((u) => (
                <button key={u.id} onClick={() => navigate(`/app/global-manager/sucursales/${id}/user/${u.id}`)} className={`w-full rounded-xl bg-white border p-3 flex items-center gap-3 hover:bg-neutral-50 transition-colors text-left ${u.activo === false ? "border-neutral-100 opacity-50" : "border-neutral-200"}`}>
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${u.activo === false ? "bg-neutral-100 text-neutral-300" : "bg-neutral-100 text-neutral-500"}`}>
                    <UserIcon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{u.name ?? u.email}</p>
                    <p className="text-[11px] text-neutral-400 truncate">{u.email}</p>
                  </div>
                  <ChevronRight size={16} className="text-neutral-400 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
        
      </div>

      <AsignarAdminModal sucursalId={sucursal.id} tieneAdmin={!!sucursal.adminId} adminUsuarioId={sucursal.adminId ?? undefined} open={showAdminModal} onClose={() => setShowAdminModal(false)} />
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          deleteSucursal(sucursal.id, {
            onSuccess: (data) => {
              const msg = data?.eliminacion === "permanente"
                ? "Sucursal eliminada permanentemente"
                : "Sucursal ocultada (tiene órdenes asociadas)"
              toast.success(msg)
              navigate("/app/global-manager/sucursales")
            },
            onError: (e) => {
              setConfirmDelete(false)
              toast.error(e?.message ?? "Error al eliminar sucursal")
            },
          })
        }}
        title="Eliminar sucursal"
        message={`¿Estás seguro de que deseas eliminar "${sucursal.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar sucursal"
        isLoading={isDeleting}
      />
    </div>
  )
}
