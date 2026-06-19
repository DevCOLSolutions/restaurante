import { useState } from "react"
import { X, AtSign, Mail, Lock, KeyRound, Trash2, Plus } from "lucide-react"
import { useSucursalStore } from "../store/sucursalStore"
import type { SucursalData, SucursalMesero, SucursalAdmin } from "../types"
import { generateSuggestions } from "../utils/usernameSuggestions"

interface Props {
  sucursal: SucursalData | null
  role: "mesero" | "admin"
  onClose: () => void
}

type StaffItem = SucursalMesero | SucursalAdmin
type NewStaff = { name: string; username: string; email: string; phone: string; password: string; status: "TURNO" | "DESCANSO" }

export function StaffModal({ sucursal, role, onClose }: Props) {
  const sucursales = useSucursalStore((s) => s.sucursales)
  const addMesero = useSucursalStore((s) => s.addMesero)
  const updateMesero = useSucursalStore((s) => s.updateMesero)
  const removeMesero = useSucursalStore((s) => s.removeMesero)
  const addAdmin = useSucursalStore((s) => s.addAdmin)
  const updateAdmin = useSucursalStore((s) => s.updateAdmin)
  const removeAdmin = useSucursalStore((s) => s.removeAdmin)

  const [newItem, setNewItem] = useState<NewStaff>({ name: "", username: "", email: "", phone: "", password: "", status: "TURNO" })
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [changingPass, setChangingPass] = useState<string | null>(null)
  const [passValue, setPassValue] = useState("")

  if (!sucursal) return null

  const isAdmin = role === "admin"
  const title = isAdmin ? "Administradores" : "Meseros"
  const items: StaffItem[] = isAdmin
    ? (sucursales.find((s) => s.id === sucursal.id)?.admins ?? [])
    : (sucursales.find((s) => s.id === sucursal.id)?.meseros ?? [])

  const add = (data: StaffItem) => isAdmin ? addAdmin(sucursal.id, data as SucursalAdmin) : addMesero(sucursal.id, data as SucursalMesero)
  const update = (id: string, data: Partial<StaffItem>) => isAdmin ? updateAdmin(sucursal.id, id, data) : updateMesero(sucursal.id, id, data)
  const remove = (id: string) => isAdmin ? removeAdmin(sucursal.id, id) : removeMesero(sucursal.id, id)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="w-full sm:max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-white p-5 overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-neutral-900">{title} — {sucursal.name}</h3>
          <button onClick={onClose}><X size={18} className="text-neutral-400" /></button>
        </div>

        <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4 mb-4">
          <p className="text-xs font-semibold text-neutral-700 mb-3">Agregar {isAdmin ? "administrador" : "mesero"}</p>
          <div className="space-y-2 mb-3">
            <input value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="Nombre completo" className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-neutral-400" />
            <div className="relative">
              <AtSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input value={newItem.username} onChange={(e) => setNewItem({ ...newItem, username: e.target.value })} placeholder="Nombre de usuario" className="w-full rounded-xl border border-neutral-200 bg-white pl-8 pr-3 py-2 text-xs outline-none focus:border-neutral-400" />
            </div>
            {newItem.name && (
              <div className="flex flex-wrap gap-1">
                {generateSuggestions(newItem.name).map((s) => (
                  <button key={s} type="button" onClick={() => setNewItem({ ...newItem, username: s })}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all ${newItem.username === s ? "bg-neutral-900 text-white border-neutral-900" : "bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200"}`}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input value={newItem.email} onChange={(e) => setNewItem({ ...newItem, email: e.target.value })} placeholder="Correo electrónico" className="w-full rounded-xl border border-neutral-200 bg-white pl-8 pr-3 py-2 text-xs outline-none focus:border-neutral-400" />
            </div>
            <input value={newItem.phone} onChange={(e) => setNewItem({ ...newItem, phone: e.target.value })} placeholder="Teléfono" className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-neutral-400" />
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input type="password" value={newItem.password} onChange={(e) => setNewItem({ ...newItem, password: e.target.value })} placeholder="Contraseña" className="w-full rounded-xl border border-neutral-200 bg-white pl-8 pr-3 py-2 text-xs outline-none focus:border-neutral-400" />
            </div>
            <select value={newItem.status} onChange={(e) => setNewItem({ ...newItem, status: e.target.value as "TURNO" | "DESCANSO" })} className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs outline-none">
              <option value="TURNO">TURNO</option>
              <option value="DESCANSO">DESCANSO</option>
            </select>
          </div>
          <button onClick={() => {
            if (!newItem.name.trim() || !newItem.username.trim() || !newItem.email.trim()) return
            add({
              id: isAdmin ? `adm-${Date.now()}` : `mes-${Date.now()}`,
              name: newItem.name.trim(),
              username: newItem.username.trim(),
              email: newItem.email.trim(),
              phone: newItem.phone.trim(),
              status: newItem.status,
            })
            setNewItem({ name: "", username: "", email: "", phone: "", password: "", status: "TURNO" })
          }} className="w-full rounded-xl bg-neutral-900 text-white py-2.5 text-xs font-medium hover:bg-neutral-800 transition-colors">
            <Plus size={14} className="inline mr-1" /> Agregar
          </button>
        </div>

        <div className="space-y-2">
          {items.length === 0 && (
            <p className="text-center text-xs text-neutral-400 py-6">No hay {isAdmin ? "administradores" : "meseros"} registrados</p>
          )}
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl bg-white border border-neutral-200 p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0 space-y-1.5">
                {editId === item.id ? (
                  <>
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-sm font-semibold outline-none focus:border-neutral-400" />
                    <input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs outline-none focus:border-neutral-400" placeholder="Email" />
                    <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs outline-none focus:border-neutral-400" placeholder="Teléfono" />
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-neutral-900">{item.name}</p>
                    <p className="text-xs text-neutral-400">{item.email} {item.phone && `· ${item.phone}`}</p>
                  </>
                )}
                <div className="flex gap-1.5">
                  {editId === item.id ? (
                    <button onClick={() => {
                      update(item.id, { name: editName.trim() || item.name, email: editEmail.trim() || item.email, phone: editPhone.trim() || item.phone })
                      setEditId(null)
                    }} className="rounded-lg bg-neutral-900 text-white px-2.5 py-1 text-[10px] font-medium hover:bg-neutral-800">OK</button>
                  ) : (
                    <button onClick={() => { setEditId(item.id); setEditName(item.name); setEditEmail(item.email); setEditPhone(item.phone ?? "") }} className="text-[10px] font-medium text-neutral-400 hover:text-neutral-600">Editar</button>
                  )}
                  {changingPass === item.id ? (
                    <div className="flex gap-1">
                      <input value={passValue} onChange={(e) => setPassValue(e.target.value)} className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-[10px] outline-none w-24" placeholder="Nueva contraseña" />
                      <button onClick={() => { setChangingPass(null); setPassValue("") }} className="rounded-lg bg-neutral-900 text-white px-2 py-1 text-[10px] font-medium">OK</button>
                    </div>
                  ) : (
                    <button onClick={() => setChangingPass(item.id)} className="flex items-center gap-1 text-[10px] font-medium text-neutral-400 hover:text-neutral-600">
                      <KeyRound size={10} /> Contraseña
                    </button>
                  )}
                  <select value={item.status} onChange={(e) => update(item.id, { status: e.target.value as "TURNO" | "DESCANSO" })} className="rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] outline-none">
                    <option value="TURNO">TURNO</option>
                    <option value="DESCANSO">DESCANSO</option>
                  </select>
                </div>
              </div>
              <button onClick={() => remove(item.id)} className="shrink-0 rounded-lg p-2 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
