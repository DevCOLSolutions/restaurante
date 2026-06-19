import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, UserPlus, Building2, Trash2, ShieldCheck, Loader2 } from "lucide-react"
import { Modal } from "@/shared/ui/Modal"
import { useAuthStore } from "@/core/auth/store"
import { useUsuariosPorSucursal } from "../hooks/useUsuariosPorSucursal"
import { useAsignarAdmin } from "../hooks/useAsignarAdmin"
import { useRemoverAdmin } from "../hooks/useRemoverAdmin"
import type { UsuarioItem } from "@/types/api"

interface AsignarAdminModalProps {
  sucursalId: string
  tieneAdmin: boolean
  adminUsuarioId?: string
  open: boolean
  onClose: () => void
}

export function AsignarAdminModal({ sucursalId, tieneAdmin, adminUsuarioId, open, onClose }: AsignarAdminModalProps) {
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.user)
  const { data: usuarios, isLoading } = useUsuariosPorSucursal(sucursalId)
  const { mutate: asignarAdmin, isPending: asignando } = useAsignarAdmin()
  const { mutate: removerAdmin, isPending: removiendo } = useRemoverAdmin()
  const cargando = asignando || removiendo
  const [search, setSearch] = useState("")

  const usuarioNombre = (u: UsuarioItem) => u.name ?? u.username ?? ""

  const filtered = (usuarios ?? []).filter(
    (u) =>
      usuarioNombre(u).toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  )

  const handleSelect = (usuario: UsuarioItem) => {
    asignarAdmin(
      { sucursalId, usuarioId: usuario.id },
      { onSuccess: () => onClose() },
    )
  }

  const handleQuitarAdmin = () => {
    if (!adminUsuarioId) return
    removerAdmin(
      { sucursalId, usuarioId: adminUsuarioId },
      { onSuccess: () => onClose() },
    )
  }

  const handleCrearUsuario = () => {
    onClose()
    navigate(`/app/global-manager/sucursales/${sucursalId}/crear-usuario`)
  }

  return (
    <Modal open={open} onClose={cargando ? () => {} : onClose} title="Administrador de sucursal">
      <div className="space-y-4">
        {tieneAdmin ? (
          <div onClick={cargando ? undefined : handleQuitarAdmin} className={`space-y-3 rounded-xl border border-rose-200 p-2 transition-colors ${cargando ? "bg-rose-50/50 cursor-not-allowed" : "bg-rose-50 cursor-pointer hover:bg-rose-100"}`}>
            <p className="flex gap-2 justify-center text-xs font-medium text-rose-700">
              {removiendo ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              {removiendo ? "Quitando administrador..." : "Quitar administrador actual"}
            </p>
          </div>
        ) : (
          <>
            {currentUser && (
              <button
                disabled={cargando}
                onClick={() =>
                  asignarAdmin(
                    { sucursalId, usuarioId: currentUser.id },
                    { onSuccess: () => onClose() },
                  )
                }
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-2.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {asignando ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                {asignando ? "Asignando..." : "Asignarme como administrador de esta sucursal"}
              </button>
            )}

            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar usuarios de esta sucursal..."
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-3 py-2 text-sm outline-none focus:border-neutral-400"
              />
            </div>

            {isLoading ? (
              <div className="flex justify-center py-6">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <UserPlus size={32} className="text-neutral-300" />
                <p className="text-sm text-neutral-500">
                  {search ? "No se encontraron usuarios" : "No hay usuarios en esta sucursal"}
                </p>
                <button
                  onClick={handleCrearUsuario}
                  disabled={cargando}
                  className="flex items-center gap-1.5 rounded-xl bg-neutral-900 text-white px-4 py-2 text-xs font-medium hover:bg-neutral-800 disabled:opacity-40 transition-colors"
                >
                  <Building2 size={14} />
                  Crear nuevo usuario
                </button>
              </div>
            ) : (
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {filtered.map((usuario) => (
                  <button
                    key={usuario.id}
                    disabled={cargando}
                    onClick={() => handleSelect(usuario)}
                    className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-left"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-xs font-medium text-neutral-600">
                      {(usuarioNombre(usuario) || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {usuarioNombre(usuario) || "Sin nombre"}
                      </p>
                      <p className="text-[11px] text-neutral-500 truncate">{usuario.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={handleCrearUsuario}
              disabled={cargando}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-neutral-200 py-2.5 text-xs font-medium text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 transition-colors"
            >
              <UserPlus size={14} />
              Crear nuevo usuario
            </button>
          </>
        )}
      </div>
    </Modal>
  )
}
