import { useState, useMemo } from "react"
import { Settings2, Trash2, Plus, Mail, Lock, AtSign, KeyRound } from "lucide-react"
import { HeroMesero } from "@/features/global-manager/components/Hero"
import { useAuthStore } from "@/core/auth/store"

function generateSuggestions(fullName: string): string[] {
  const parts = fullName.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return []
  const first = parts[0]
  const last = parts.length > 1 ? parts[parts.length - 1] : ""
  const initial = last ? last[0] : ""
  const rand = () => String(Math.floor(Math.random() * 90) + 10)
  const s: string[] = []
  s.push(first)
  if (last) s.push(`${first}.${last}`)
  if (last) s.push(`${first}_${last}`)
  if (initial) s.push(`${first}${initial}`)
  if (last) s.push(`${first}${last}`)
  s.push(`${first}${rand()}`)
  if (last) s.push(`${first}.${last}${rand()}`)
  return [...new Set(s)]
}

interface Mesero { id: string; name: string; username: string; email: string; password: string; status: string; phone?: string }
const initialMeseros: Mesero[] = [
  { id: "e1", name: "Carlos López", username: "carlos.lopez", email: "carlos@rest.com", password: "123456", status: "TURNO", phone: "555-0101" },
  { id: "e2", name: "María García", username: "maria.garcia", email: "maria@rest.com", password: "123456", status: "TURNO", phone: "555-0102" },
  { id: "e3", name: "Juan Pérez", username: "juan.perez", email: "juan@rest.com", password: "123456", status: "TURNO", phone: "555-0103" },
  { id: "e4", name: "Ana Martínez", username: "ana.martinez", email: "ana@rest.com", password: "123456", status: "DESCANSO", phone: "555-0104" },
]
const categories = ["MESEROS", "TURNO", "DESCANSO"]

export function MeserosPage() {
  const user = useAuthStore((s) => s.user)
  const [activeCategory, setActiveCategory] = useState("MESEROS")
  const [meseros, setMeseros] = useState<Mesero[]>(initialMeseros)
  const [showManage, setShowManage] = useState(false)
  const [newName, setNewName] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const usernameSuggestions = useMemo(() => generateSuggestions(newName), [newName])
  const [newEmail, setNewEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newStatus, setNewStatus] = useState("TURNO")
  const [changingPass, setChangingPass] = useState<string | null>(null)
  const [changingPassValue, setChangingPassValue] = useState("")

  const name = user?.name ?? "Administrador"
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
  const filtered = activeCategory === "MESEROS" ? meseros : meseros.filter((m) => m.status === activeCategory)

  return (
    <div className="space-y-4">
      <HeroMesero nombre={name} initials={initials} />

      <div className="px-4">
        <div className="overflow-x-auto scrollbar-none">
          <div className="flex gap-2 min-w-max pb-1">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${activeCategory === cat ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/20" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-800"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-neutral-400">{filtered.length} meseros</p>
          <button onClick={() => setShowManage(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors">
            <Settings2 size={14} /> Administrar meseros
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {filtered.map((mesero) => (
            <div key={mesero.id} className="rounded-2xl bg-white border border-neutral-200 p-4 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-sm font-semibold text-neutral-900">{mesero.name}</p>
                <p className="text-xs text-neutral-400">{mesero.phone}</p>
              </div>
              <select value={mesero.status} onChange={(e) => setMeseros((prev) => prev.map((m) => m.id === mesero.id ? { ...m, status: e.target.value } : m))} className={`text-[11px] font-medium px-3 py-1.5 rounded-full border outline-none cursor-pointer transition-all ${mesero.status === "TURNO" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-neutral-100 text-neutral-600 border-neutral-200"}`}>
                <option value="TURNO">TURNO</option>
                <option value="DESCANSO">DESCANSO</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {showManage && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="w-full sm:max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-white p-5 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-neutral-900">Administrar meseros</h3>
              <button onClick={() => setShowManage(false)} className="text-neutral-400 hover:text-neutral-600 text-sm">Cerrar</button>
            </div>
            <p className="text-xs text-neutral-400 mb-4">{meseros.length} meseros en total</p>

            <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4 mb-4">
              <p className="text-xs font-semibold text-neutral-700 mb-3">Agregar mesero</p>
              <div className="space-y-2 mb-3">
                <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nombre completo" className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-neutral-400" />
                <div className="relative">
                  <AtSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="Nombre de usuario" className="w-full rounded-xl border border-neutral-200 bg-white pl-8 pr-3 py-2 text-xs outline-none focus:border-neutral-400" />
                </div>
                {usernameSuggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {usernameSuggestions.map((s) => (
                      <button key={s} type="button" onClick={() => setNewUsername(s)} className={`px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all ${newUsername === s ? "bg-neutral-900 text-white border-neutral-900" : "bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200"}`}>{s}</button>
                    ))}
                  </div>
                )}
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Correo electrónico" className="w-full rounded-xl border border-neutral-200 bg-white pl-8 pr-3 py-2 text-xs outline-none focus:border-neutral-400" />
                </div>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Contraseña" className="w-full rounded-xl border border-neutral-200 bg-white pl-8 pr-3 py-2 text-xs outline-none focus:border-neutral-400" />
                </div>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-neutral-400">
                  <option value="TURNO">TURNO</option>
                  <option value="DESCANSO">DESCANSO</option>
                </select>
              </div>
              <button onClick={() => { if (!newName.trim() || !newUsername.trim() || !newEmail.trim() || !newPassword.trim()) return; setMeseros((prev) => [...prev, { id: `e${Date.now()}`, name: newName.trim(), username: newUsername.trim(), email: newEmail.trim(), password: newPassword, status: newStatus }]); setNewName(""); setNewUsername(""); setNewEmail(""); setNewPassword("") }} className="w-full rounded-xl bg-neutral-900 text-white py-2.5 text-xs font-medium hover:bg-neutral-800 transition-colors">
                <Plus size={14} className="inline mr-1" /> Agregar
              </button>
            </div>

            <div className="space-y-2">
              {meseros.map((mesero) => (
                <div key={mesero.id} className="rounded-2xl bg-white border border-neutral-200 p-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 mb-1">{mesero.name}</p>
                    <div className="flex gap-1.5">
                      <input value={mesero.username} onChange={(e) => setMeseros((prev) => prev.map((m) => m.id === mesero.id ? { ...m, username: e.target.value } : m))} className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs text-neutral-600 outline-none focus:border-neutral-400" placeholder="Usuario" />
                      <input value={mesero.email} onChange={(e) => setMeseros((prev) => prev.map((m) => m.id === mesero.id ? { ...m, email: e.target.value } : m))} className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs text-neutral-600 outline-none focus:border-neutral-400" placeholder="Email" />
                    </div>
                    <div className="flex gap-1.5 mt-1.5">
                      {changingPass === mesero.id ? (
                        <div className="flex-1 flex gap-1">
                          <input value={changingPassValue} onChange={(e) => setChangingPassValue(e.target.value)} className="flex-1 rounded-lg border border-neutral-200 bg-white px-2 py-1 text-xs outline-none focus:border-neutral-400" placeholder="Nueva contraseña" />
                          <button onClick={() => { if (changingPassValue.trim()) { setMeseros((prev) => prev.map((m) => m.id === mesero.id ? { ...m, password: changingPassValue.trim() } : m)) } setChangingPass(null); setChangingPassValue("") }} className="rounded-lg bg-neutral-900 text-white px-2.5 py-1 text-[10px] font-medium hover:bg-neutral-800 transition-colors">OK</button>
                        </div>
                      ) : (
                        <button onClick={() => { setChangingPass(mesero.id); setChangingPassValue("") }} className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-[10px] text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors">
                          <KeyRound size={12} /> Cambiar contraseña
                        </button>
                      )}
                      <select value={mesero.status} onChange={(e) => setMeseros((prev) => prev.map((m) => m.id === mesero.id ? { ...m, status: e.target.value } : m))} className="rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] outline-none">
                        <option value="TURNO">TURNO</option>
                        <option value="DESCANSO">DESCANSO</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={() => setMeseros((prev) => prev.filter((m) => m.id !== mesero.id))} className="shrink-0 rounded-lg p-2 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
