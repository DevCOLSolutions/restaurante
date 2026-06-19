import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { ArrowLeft, BadgeCheck, BadgeX, Building2, Calendar, Hash, Loader2, Mail, MapPin, Pen, Shield, UserIcon, X } from "lucide-react"
import { useUsuario } from "../hooks/useUsuario"
import { useUpdateUsuario } from "../hooks/useUpdateUsuario"
import { useUpdateUsuarioEstado } from "../hooks/useUpdateUsuarioEstado"
import { useTransferirUsuario } from "../hooks/useTransferirUsuario"
import { useAreasCocina } from "../hooks/useAreasCocina"
import { useSucursal } from "../hooks/useSucursal"
import { useSucursalesAll } from "../hooks/useSucursalesAll"

const ROL_LABELS: Record<string, string> = {
  AdminSucursal: "Administrador de sucursal",
  GlobalManager: "Administrador global",
  Mesero: "Mesero",
  Cocinero: "Cocinero",
  ConsumidorFinal: "Consumidor final",
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleString("es-CO", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  })
}

export function UsuarioDetailPage() {
  const { id: sucursalId, userId } = useParams<{ id: string; userId: string }>()
  const navigate = useNavigate()
  const { data: usuario, isLoading } = useUsuario(userId)
  const { data: sucursal } = useSucursal(sucursalId)
  const { mutate: updateUsuario, isPending: updatePending } = useUpdateUsuario()
  const { mutate: updateEstado, isPending: estadoPending } = useUpdateUsuarioEstado()
  const { mutate: transferirUsuario, isPending: isTransferPending } = useTransferirUsuario()
  const { data: areasCocina } = useAreasCocina()
  const { data: sucursales } = useSucursalesAll()
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ nombre: "", correo: "", password: "", areaCocinaId: "" })
  const [showTransfer, setShowTransfer] = useState(false)

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
      </div>
    )
  }

  if (!usuario) {
    return (
      <div className="p-6">
        <button onClick={() => navigate(`/app/global-manager/sucursales/${sucursalId}`)} className="mb-4 flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900">
          <ArrowLeft size={16} /> Regresar
        </button>
        <p className="text-sm text-neutral-500">Usuario no encontrado</p>
      </div>
    )
  }

  const handleToggleActivo = () => {
    updateEstado(
      { usuarioId: usuario.userId, activo: !usuario.activo },
      { onSuccess: () => setEditing(false) },
    )
  }

  const handleTransferir = (nuevaSucursalId: string) => {
    transferirUsuario(
      { id: usuario.userId, sucursalId: nuevaSucursalId },
      {
        onSuccess: () => {
          toast.success("Usuario transferido correctamente")
          setTimeout(() => navigate(`/app/global-manager/sucursales/${sucursalId}`), 1200)
        },
        onError: (e) => toast.error(e?.message ?? "Error al transferir usuario"),
      },
    )
  }

  const sucursalesDisponibles = (sucursales ?? []).filter((s) => s.id !== usuario.sucursalId)

  return (
    <div className="min-h-screen bg-neutral-50 pb-12">
      <div className="bg-neutral-900 px-5 pt-5 pb-8 rounded-b-4xl">
        <button onClick={() => navigate(`/app/global-manager/sucursales/${sucursalId}`)} className="flex items-center gap-2 text-white/70 hover:text-white mb-3">
          <ArrowLeft size={20} /> Regresar
        </button>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <UserIcon size={24} className="text-white/50 shrink-0" />
            <div className="min-w-0">
              <h1 className="text-xl font-medium text-white tracking-tight truncate">{usuario.nombre}</h1>
              <span className="text-sm text-white/70">{sucursal?.nombre ?? sucursalId}</span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => { setEditing(!editing); setEditForm({ nombre: usuario.nombre, correo: usuario.correo, password: "", areaCocinaId: usuario.areaCocinaId ?? "" }) }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 text-white text-[11px] font-medium hover:bg-white/20 transition-colors"
            >
              <Pen size={12} /> Editar
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 -mt-4 relative z-10 space-y-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-4">
          {editing ? (
            <div className="space-y-3">
              <div>
                <p className="text-[11px] text-neutral-400 mb-1">Nombre</p>
                <input value={editForm.nombre} onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400" />
              </div>
              <div>
                <p className="text-[11px] text-neutral-400 mb-1">Correo</p>
                <input value={editForm.correo} onChange={(e) => setEditForm({ ...editForm, correo: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400" type="email" />
              </div>
              <div>
                <p className="text-[11px] text-neutral-400 mb-1">Contraseña <span className="text-neutral-300">(dejar vacío para no cambiar)</span></p>
                <input value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400" placeholder="••••••••" type="password" />
              </div>
              {(usuario.rol === "Cocinero") && (
              <div>
                <p className="text-[11px] text-neutral-400 mb-1">Área de cocina</p>
                <select value={editForm.areaCocinaId} onChange={(e) => setEditForm({ ...editForm, areaCocinaId: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400">
                  <option value="">Sin área</option>
                  {(areasCocina ?? []).map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                </select>
              </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    updateUsuario(
                      {
                        id: usuario.userId,
                        usuarioId: usuario.userId,
                        nombre: editForm.nombre.trim(),
                        correo: editForm.correo.trim(),
                        password: editForm.password.trim() || null,
                        sucursalId: null,
                        areaCocinaId: editForm.areaCocinaId || null,
                      },
                      { onSuccess: () => setEditing(false) },
                    )
                  }}
                  disabled={updatePending || !editForm.nombre.trim() || !editForm.correo.trim()}
                  className="rounded-xl bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 disabled:opacity-40 flex items-center gap-2"
                >
                  {updatePending ? <Loader2 size={14} className="animate-spin" /> : null}
                  Guardar
                </button>
                <button onClick={() => setEditing(false)} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50">Cancelar</button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[11px] text-neutral-400">Correo</p>
                  <p className="text-sm font-medium text-neutral-900">{usuario.correo}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                  <Shield size={16} />
                </div>
                <div>
                  <p className="text-[11px] text-neutral-400">Rol</p>
                  <p className="text-sm font-medium text-neutral-900">{ROL_LABELS[usuario.rol] ?? usuario.rol}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                  <BadgeCheck size={16} />
                </div>
                <div>
                  <p className="text-[11px] text-neutral-400">Estado</p>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium mt-0.5 ${usuario.activo ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                    {usuario.activo ? <BadgeCheck size={11} /> : <BadgeX size={11} />}
                    {usuario.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                  <Building2 size={16} />
                </div>
                <div>
                  <p className="text-[11px] text-neutral-400">Sucursal</p>
                  <p className="text-sm font-medium text-neutral-900">{usuario.sucursalNombre ?? usuario.sucursalId}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-[11px] text-neutral-400">Creado</p>
                  <p className="text-sm font-medium text-neutral-900">{formatDate(usuario.creadoEn)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                  <Hash size={16} />
                </div>
                <div>
                  <p className="text-[11px] text-neutral-400">ID</p>
                  <p className="text-xs font-mono text-neutral-500">{usuario.userId}</p>
                </div>
              </div>
              {usuario.rol === "Cocinero" && usuario.areaCocinaId && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] text-neutral-400">Área de cocina ID</p>
                    <p className="text-xs font-mono text-neutral-500">{usuario.areaCocinaId}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {showTransfer ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 space-y-3 relative">
            {isTransferPending && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70">
                <Loader2 size={20} className="animate-spin text-neutral-500" />
              </div>
            )}
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-neutral-700">Seleccionar nueva sucursal</p>
              <button onClick={() => setShowTransfer(false)} disabled={isTransferPending}><X size={14} className="text-neutral-400" /></button>
            </div>
            {sucursalesDisponibles.length === 0 ? (
              <p className="text-xs text-neutral-400">No hay otras sucursales disponibles</p>
            ) : (
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {sucursalesDisponibles.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleTransferir(s.id)}
                    disabled={isTransferPending}
                    className="w-full rounded-xl border border-neutral-200 p-3 flex items-center gap-3 hover:bg-neutral-50 transition-colors text-left disabled:opacity-40"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                      <Building2 size={14} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900">{s.nombre}</p>
                      {s.direccion && <p className="text-[11px] text-neutral-400">{s.direccion}</p>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowTransfer(true)}
            disabled={updatePending}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-40"
          >
            <Building2 size={14} />
            Transferir sucursal
          </button>
        )}

        <button
          onClick={handleToggleActivo}
          disabled={estadoPending}
          className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-40 ${
            usuario.activo
              ? "bg-rose-500 text-white hover:bg-rose-600"
              : "bg-emerald-500 text-white hover:bg-emerald-600"
          }`}
        >
          {estadoPending ? <Loader2 size={14} className="animate-spin" /> : null}
          {usuario.activo ? "Desactivar usuario" : "Activar usuario"}
        </button>
      </div>
    </div>
  )
}
