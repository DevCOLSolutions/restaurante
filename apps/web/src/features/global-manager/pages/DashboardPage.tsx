import { useEffect, useState, useMemo } from "react"
import { Store, MapPin, Phone, Pencil, Trash2, Settings2, Plus, ChevronDown, ChevronRight, X, AtSign, Mail, Lock, KeyRound } from "lucide-react"
import { useSucursalStore } from "../store/sucursalStore"
import type { SucursalData, SucursalZone, SucursalMesero, SucursalAdmin, TableInfo } from "../types"
import { HeroAdministrador } from "../components/Hero"

const statusColor: Record<string, string> = {
  libre: "bg-emerald-500",
  ocupada: "bg-amber-400",
  reservada: "bg-blue-500",
}

const statusLabel: Record<string, string> = {
  libre: "Libre",
  ocupada: "Ocupada",
  reservada: "Reservada",
}

const nextStatus: Record<string, TableInfo["status"]> = {
  libre: "ocupada",
  ocupada: "reservada",
  reservada: "libre",
}

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

export function GlobalManagerDashboardPage() {
  const sucursales = useSucursalStore((s) => s.sucursales)
  const hydrate = useSucursalStore((s) => s._hydrate)
  const addSucursal = useSucursalStore((s) => s.addSucursal)
  const updateSucursal = useSucursalStore((s) => s.updateSucursal)
  const deleteSucursal = useSucursalStore((s) => s.deleteSucursal)
  const addZone = useSucursalStore((s) => s.addZone)
  const updateZone = useSucursalStore((s) => s.updateZone)
  const removeZone = useSucursalStore((s) => s.removeZone)
  const addTable = useSucursalStore((s) => s.addTable)
  const removeTable = useSucursalStore((s) => s.removeTable)
  const updateTableStatus = useSucursalStore((s) => s.updateTableStatus)
  const addMesero = useSucursalStore((s) => s.addMesero)
  const updateMesero = useSucursalStore((s) => s.updateMesero)
  const removeMesero = useSucursalStore((s) => s.removeMesero)
  const addAdmin = useSucursalStore((s) => s.addAdmin)
  const updateAdmin = useSucursalStore((s) => s.updateAdmin)
  const removeAdmin = useSucursalStore((s) => s.removeAdmin)

  const allKitchenAreas = useMemo(() => {
    const seen = new Set<string>()
    const areas: { name: string; description: string }[] = []
    for (const suc of sucursales) {
      for (const area of suc.kitchenAreas) {
        if (!seen.has(area.name)) { seen.add(area.name); areas.push(area) }
      }
    }
    return areas
  }, [sucursales])

  useEffect(() => { hydrate() }, [hydrate])

  const [expandedId, setExpandedId] = useState<string | null>(null)

  const [editSucModal, setEditSucModal] = useState<SucursalData | null>(null)
  const [editSucForm, setEditSucForm] = useState({ name: "", address: "", phone: "" })

  const [zoneModalSuc, setZoneModalSuc] = useState<SucursalData | null>(null)
  const [zoneNewName, setZoneNewName] = useState("")
  const [zoneNewDesc, setZoneNewDesc] = useState("")
  const [zoneEditing, setZoneEditing] = useState<string | null>(null)
  const [zoneEditName, setZoneEditName] = useState("")
  const [zoneEditDesc, setZoneEditDesc] = useState("")
  const [addTableSeats, setAddTableSeats] = useState(4)

  const [meseroModalSuc, setMeseroModalSuc] = useState<SucursalData | null>(null)
  const [meseroNew, setMeseroNew] = useState({ name: "", username: "", email: "", phone: "", password: "", status: "TURNO" as SucursalMesero["status"] })
  const [meseroEditId, setMeseroEditId] = useState<string | null>(null)
  const [meseroEditName, setMeseroEditName] = useState("")
  const [meseroEditEmail, setMeseroEditEmail] = useState("")
  const [meseroEditPhone, setMeseroEditPhone] = useState("")
  const [meseroChangingPass, setMeseroChangingPass] = useState<string | null>(null)
  const [meseroPassValue, setMeseroPassValue] = useState("")

  const [adminModalSuc, setAdminModalSuc] = useState<SucursalData | null>(null)
  const [adminNew, setAdminNew] = useState({ name: "", username: "", email: "", phone: "", password: "", status: "TURNO" as SucursalAdmin["status"] })
  const [adminEditId, setAdminEditId] = useState<string | null>(null)
  const [adminEditName, setAdminEditName] = useState("")
  const [adminEditEmail, setAdminEditEmail] = useState("")
  const [adminEditPhone, setAdminEditPhone] = useState("")
  const [adminChangingPass, setAdminChangingPass] = useState<string | null>(null)
  const [adminPassValue, setAdminPassValue] = useState("")

  const [addSucModal, setAddSucModal] = useState(false)
  const [addSucForm, setAddSucForm] = useState({ name: "", address: "", phone: "" })

  const toggleExpand = (id: string) => setExpandedId(expandedId === id ? null : id)

  const toggleTableStatus = (sucId: string, table: TableInfo) => {
    updateTableStatus(sucId, table.id, nextStatus[table.status])
  }

  return (
    <div className="space-y-4">
      <HeroAdministrador />

      <div className="px-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-neutral-400">{sucursales.length} sucursales registradas</p>
          <button onClick={() => { setAddSucModal(true); setAddSucForm({ name: "", address: "", phone: "" }) }} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-900 text-white text-[11px] font-medium hover:bg-neutral-800 transition-colors">
            <Plus size={13} /> Agregar sucursal
          </button>
        </div>

        {sucursales.map((suc) => (
          <div key={suc.id} className="rounded-3xl bg-white border border-neutral-200 shadow-sm overflow-hidden">
            {/* Header */}
            <button onClick={() => toggleExpand(suc.id)} className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors text-left">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 text-neutral-600 shrink-0">
                  <Store size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-900">{suc.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-400">
                    <span className="flex items-center gap-1"><MapPin size={10} />{suc.address}</span>
                    <span className="flex items-center gap-1"><Phone size={10} />{suc.phone}</span>
                  </div>
                </div>
              </div>
              {expandedId === suc.id ? <ChevronDown size={18} className="text-neutral-400 shrink-0" /> : <ChevronRight size={18} className="text-neutral-400 shrink-0" />}
            </button>

            <div className="px-4 pb-2 flex gap-2">
              <button onClick={() => { setEditSucModal(suc); setEditSucForm({ name: suc.name, address: suc.address, phone: suc.phone }) }} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-600 text-[11px] font-medium hover:bg-neutral-200 transition-colors">
                <Pencil size={12} /> Editar
              </button>
              <button onClick={() => { if (confirm(`¿Eliminar sucursal "${suc.name}"?`)) deleteSucursal(suc.id) }} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 text-[11px] font-medium hover:bg-rose-100 transition-colors">
                <Trash2 size={12} /> Eliminar
              </button>
            </div>

            {expandedId === suc.id && (
              <div className="px-4 pb-4 space-y-4">
                {/* Areas de Mesas */}
                <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-neutral-700">ÁREAS DE MESAS</h3>
                    <button onClick={() => { setZoneModalSuc(suc); setZoneNewName(""); setZoneNewDesc(""); setZoneEditing(null) }} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-900 text-white text-[11px] font-medium hover:bg-neutral-800 transition-colors">
                      <Settings2 size={12} /> Gestionar
                    </button>
                  </div>
                  {suc.zones.map((zone) => {
                    const zoneTables = suc.tables.filter((t) => t.zone === zone.name)
                    return (
                      <div key={zone.name} className="mb-3 last:mb-0">
                        <p className="text-xs font-medium text-neutral-500 mb-1.5">{zone.name} ({zoneTables.length} mesas)</p>
                        <div className="flex flex-wrap gap-1.5">
                          {zoneTables.map((table) => (
                            <button
                              key={table.id}
                              onClick={() => toggleTableStatus(suc.id, table)}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all hover:scale-105 ${table.status === "libre" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : table.status === "ocupada" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}
                              title={statusLabel[table.status]}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${statusColor[table.status]}`} />
                              #{table.number}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Meseros */}
                <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-neutral-700">MESEROS</h3>
                    <button onClick={() => { setMeseroModalSuc(suc); setMeseroNew({ name: "", username: "", email: "", phone: "", password: "", status: "TURNO" }) }} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-900 text-white text-[11px] font-medium hover:bg-neutral-800 transition-colors">
                      <Settings2 size={12} /> Gestionar
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {suc.meseros.map((m) => (
                      <div key={m.id} className="flex items-center justify-between rounded-xl bg-white border border-neutral-200 px-3 py-2">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-neutral-900 truncate">{m.name}</p>
                          <p className="text-[10px] text-neutral-400">{m.phone}</p>
                        </div>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${m.status === "TURNO" ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"}`}>
                          {m.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Administradores */}
                <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-neutral-700">ADMINISTRADORES</h3>
                    <button onClick={() => { setAdminModalSuc(suc); setAdminNew({ name: "", username: "", email: "", phone: "", password: "", status: "TURNO" }) }} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-900 text-white text-[11px] font-medium hover:bg-neutral-800 transition-colors">
                      <Settings2 size={12} /> Gestionar
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {suc.admins.map((a) => (
                      <div key={a.id} className="flex items-center justify-between rounded-xl bg-white border border-neutral-200 px-3 py-2">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-neutral-900 truncate">{a.name}</p>
                          <p className="text-[10px] text-neutral-400">{a.phone}</p>
                        </div>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${a.status === "TURNO" ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"}`}>
                          {a.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Areas de cocina */}
                <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-neutral-700">ÁREAS DE COCINA</h3>
                  </div>
                  <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
                    {allKitchenAreas.map((area) => (
                      <span key={area.name} title={area.description} className="whitespace-nowrap text-xs bg-white border border-neutral-200 rounded-full px-3 py-1 text-neutral-700">
                        {area.name}
                      </span>
                    ))}
                    {allKitchenAreas.length === 0 && (
                      <span className="text-xs text-neutral-400">Sin áreas de cocina</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MODAL: Editar Sucursal */}
      {editSucModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-neutral-900">Editar sucursal</h3>
              <button onClick={() => setEditSucModal(null)}><X size={18} className="text-neutral-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1 block">Nombre</label>
                <input value={editSucForm.name} onChange={(e) => setEditSucForm({ ...editSucForm, name: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400" />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1 block">Dirección</label>
                <input value={editSucForm.address} onChange={(e) => setEditSucForm({ ...editSucForm, address: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400" />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1 block">Teléfono</label>
                <input value={editSucForm.phone} onChange={(e) => setEditSucForm({ ...editSucForm, phone: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400" />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setEditSucModal(null)} className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50">Cancelar</button>
              <button onClick={() => { updateSucursal(editSucModal.id, editSucForm); setEditSucModal(null) }} className="flex-1 rounded-xl bg-neutral-900 py-2.5 text-sm font-medium text-white hover:bg-neutral-800">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Agregar Sucursal */}
      {addSucModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-neutral-900">Nueva sucursal</h3>
              <button onClick={() => setAddSucModal(false)}><X size={18} className="text-neutral-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1 block">Nombre</label>
                <input value={addSucForm.name} onChange={(e) => setAddSucForm({ ...addSucForm, name: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400" placeholder="Nombre de la sucursal" />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1 block">Dirección</label>
                <input value={addSucForm.address} onChange={(e) => setAddSucForm({ ...addSucForm, address: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400" placeholder="Dirección" />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1 block">Teléfono</label>
                <input value={addSucForm.phone} onChange={(e) => setAddSucForm({ ...addSucForm, phone: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400" placeholder="Teléfono" />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setAddSucModal(false)} className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50">Cancelar</button>
              <button onClick={() => { if (addSucForm.name.trim()) { addSucursal(addSucForm); setAddSucModal(false) } }} className="flex-1 rounded-xl bg-neutral-900 py-2.5 text-sm font-medium text-white hover:bg-neutral-800">Agregar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Gestionar Áreas y Mesas */}
      {zoneModalSuc && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="w-full sm:max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-white p-5 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-neutral-900">Áreas y Mesas — {zoneModalSuc.name}</h3>
              <button onClick={() => setZoneModalSuc(null)}><X size={18} className="text-neutral-400" /></button>
            </div>

            <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4 mb-4">
              <p className="text-xs font-semibold text-neutral-700 mb-3">Agregar nueva área</p>
              <div className="space-y-2">
                <input value={zoneNewName} onChange={(e) => setZoneNewName(e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-neutral-400" placeholder="Nombre del área" />
                <input value={zoneNewDesc} onChange={(e) => setZoneNewDesc(e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-neutral-400" placeholder="Descripción" />
              </div>
              <button onClick={() => {
                if (!zoneNewName.trim()) return
                if (zoneModalSuc.zones.some((z: SucursalZone) => z.name === zoneNewName.trim())) return
                addZone(zoneModalSuc.id, { name: zoneNewName.trim(), description: zoneNewDesc.trim(), type: "salon", icon: "Sofa" })
                setZoneNewName("")
                setZoneNewDesc("")
              }} className="w-full rounded-xl bg-neutral-900 text-white py-2.5 text-xs font-medium hover:bg-neutral-800 transition-colors mt-3">
                <Plus size={14} className="inline mr-1" /> Agregar
              </button>
            </div>

            <div className="space-y-3">
              {sucursales.find((s: SucursalData) => s.id === zoneModalSuc.id)?.zones.map((zone) => {
                const zoneTables = sucursales.find((s: SucursalData) => s.id === zoneModalSuc.id)?.tables.filter((t: TableInfo) => t.zone === zone.name) ?? []
                return (
                  <div key={zone.name} className="rounded-2xl bg-white border border-neutral-200 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      {zoneEditing === zone.name ? (
                        <div className="flex-1 space-y-1.5">
                          <input value={zoneEditName} onChange={(e) => setZoneEditName(e.target.value)} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-2 py-1 text-sm font-semibold outline-none focus:border-neutral-400" placeholder="Nombre" />
                          <input value={zoneEditDesc} onChange={(e) => setZoneEditDesc(e.target.value)} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-2 py-1 text-xs outline-none focus:border-neutral-400" placeholder="Descripción" />
                        </div>
                      ) : (
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-neutral-900">{zone.name}</p>
                          {zone.description && <p className="text-xs text-neutral-500">{zone.description}</p>}
                        </div>
                      )}
                      {zoneEditing === zone.name ? (
                        <button onClick={() => {
                          if (zoneEditName.trim() && zoneEditName.trim() !== zone.name && !zoneModalSuc.zones.some((z: SucursalZone) => z.name === zoneEditName.trim())) {
                            updateZone(zoneModalSuc.id, zone.name, { ...zone, name: zoneEditName.trim(), description: zoneEditDesc.trim() || zone.description })
                          } else {
                            updateZone(zoneModalSuc.id, zone.name, { ...zone, name: zone.name, description: zoneEditDesc.trim() || zone.description })
                          }
                          setZoneEditing(null)
                        }} className="text-xs font-medium text-emerald-600 hover:text-emerald-700 shrink-0">Guardar</button>
                      ) : (
                        <button onClick={() => { setZoneEditing(zone.name); setZoneEditName(zone.name); setZoneEditDesc(zone.description ?? "") }} className="text-xs font-medium text-neutral-400 hover:text-neutral-600 shrink-0">Editar</button>
                      )}
                      <button onClick={() => removeZone(zoneModalSuc.id, zone.name)} className="shrink-0 rounded-lg p-1 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => {
                        if (zoneTables.length === 0) return
                        const last = [...zoneTables].reverse()[0]
                        removeTable(zoneModalSuc.id, last.id)
                      }} className="rounded-lg border border-neutral-200 p-1.5 text-neutral-400 hover:text-rose-500 hover:border-rose-200 transition-colors disabled:opacity-30" disabled={zoneTables.length === 0}>
                        <Trash2 size={14} />
                      </button>
                      <span className="text-sm font-semibold text-neutral-800 tabular-nums">{zoneTables.length} mesas</span>
                      <button onClick={() => addTable(zoneModalSuc.id, zone.name, addTableSeats)} className="rounded-lg border border-neutral-200 p-1.5 text-neutral-400 hover:text-emerald-500 hover:border-emerald-200 transition-colors">
                        <Plus size={14} />
                      </button>
                      <select value={addTableSeats} onChange={(e) => setAddTableSeats(Number(e.target.value))} className="ml-1 rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] outline-none">
                        <option value={2}>2p</option><option value={4}>4p</option><option value={6}>6p</option><option value={8}>8p</option>
                      </select>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {zoneTables.map((t: TableInfo) => (
                        <span key={t.id} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${t.status === "libre" ? "bg-emerald-50 text-emerald-700" : t.status === "ocupada" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}>
                          <span className={`w-1 h-1 rounded-full ${statusColor[t.status]}`} />
                          #{t.number}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Gestionar Meseros */}
      {meseroModalSuc && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="w-full sm:max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-white p-5 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-neutral-900">Meseros — {meseroModalSuc.name}</h3>
              <button onClick={() => setMeseroModalSuc(null)}><X size={18} className="text-neutral-400" /></button>
            </div>

            <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4 mb-4">
              <p className="text-xs font-semibold text-neutral-700 mb-3">Agregar mesero</p>
              <div className="space-y-2 mb-3">
                <input value={meseroNew.name} onChange={(e) => setMeseroNew({ ...meseroNew, name: e.target.value })} placeholder="Nombre completo" className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-neutral-400" />
                <div className="relative">
                  <AtSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input value={meseroNew.username} onChange={(e) => setMeseroNew({ ...meseroNew, username: e.target.value })} placeholder="Nombre de usuario" className="w-full rounded-xl border border-neutral-200 bg-white pl-8 pr-3 py-2 text-xs outline-none focus:border-neutral-400" />
                </div>
                {meseroNew.name && (
                  <div className="flex flex-wrap gap-1">
                    {generateSuggestions(meseroNew.name).map((s) => (
                      <button key={s} type="button" onClick={() => setMeseroNew({ ...meseroNew, username: s })}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all ${meseroNew.username === s ? "bg-neutral-900 text-white border-neutral-900" : "bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input value={meseroNew.email} onChange={(e) => setMeseroNew({ ...meseroNew, email: e.target.value })} placeholder="Correo electrónico" className="w-full rounded-xl border border-neutral-200 bg-white pl-8 pr-3 py-2 text-xs outline-none focus:border-neutral-400" />
                </div>
                <input value={meseroNew.phone} onChange={(e) => setMeseroNew({ ...meseroNew, phone: e.target.value })} placeholder="Teléfono" className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-neutral-400" />
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input type="password" value={meseroNew.password} onChange={(e) => setMeseroNew({ ...meseroNew, password: e.target.value })} placeholder="Contraseña" className="w-full rounded-xl border border-neutral-200 bg-white pl-8 pr-3 py-2 text-xs outline-none focus:border-neutral-400" />
                </div>
                <select value={meseroNew.status} onChange={(e) => setMeseroNew({ ...meseroNew, status: e.target.value as SucursalMesero["status"] })} className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs outline-none">
                  <option value="TURNO">TURNO</option>
                  <option value="DESCANSO">DESCANSO</option>
                </select>
              </div>
              <button onClick={() => {
                if (!meseroNew.name.trim() || !meseroNew.username.trim() || !meseroNew.email.trim()) return
                addMesero(meseroModalSuc.id, {
                  id: `mes-${Date.now()}`,
                  name: meseroNew.name.trim(),
                  username: meseroNew.username.trim(),
                  email: meseroNew.email.trim(),
                  phone: meseroNew.phone.trim(),
                  status: meseroNew.status,
                })
                setMeseroNew({ name: "", username: "", email: "", phone: "", password: "", status: "TURNO" })
              }} className="w-full rounded-xl bg-neutral-900 text-white py-2.5 text-xs font-medium hover:bg-neutral-800 transition-colors">
                <Plus size={14} className="inline mr-1" /> Agregar
              </button>
            </div>

            <div className="space-y-2">
              {sucursales.find((s: SucursalData) => s.id === meseroModalSuc.id)?.meseros.map((mesero: SucursalMesero) => (
                <div key={mesero.id} className="rounded-2xl bg-white border border-neutral-200 p-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0 space-y-1.5">
                    {meseroEditId === mesero.id ? (
                      <>
                        <input value={meseroEditName} onChange={(e) => setMeseroEditName(e.target.value)} className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-sm font-semibold outline-none focus:border-neutral-400" />
                        <input value={meseroEditEmail} onChange={(e) => setMeseroEditEmail(e.target.value)} className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs outline-none focus:border-neutral-400" placeholder="Email" />
                        <input value={meseroEditPhone} onChange={(e) => setMeseroEditPhone(e.target.value)} className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs outline-none focus:border-neutral-400" placeholder="Teléfono" />
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-neutral-900">{mesero.name}</p>
                        <p className="text-xs text-neutral-400">{mesero.email} {mesero.phone && `· ${mesero.phone}`}</p>
                      </>
                    )}
                    <div className="flex gap-1.5">
                      {meseroEditId === mesero.id ? (
                        <button onClick={() => {
                          updateMesero(meseroModalSuc.id, mesero.id, { name: meseroEditName.trim() || mesero.name, email: meseroEditEmail.trim() || mesero.email, phone: meseroEditPhone.trim() || mesero.phone })
                          setMeseroEditId(null)
                        }} className="rounded-lg bg-neutral-900 text-white px-2.5 py-1 text-[10px] font-medium hover:bg-neutral-800">OK</button>
                      ) : (
                        <button onClick={() => { setMeseroEditId(mesero.id); setMeseroEditName(mesero.name); setMeseroEditEmail(mesero.email); setMeseroEditPhone(mesero.phone ?? "") }} className="text-[10px] font-medium text-neutral-400 hover:text-neutral-600">Editar</button>
                      )}
                      {meseroChangingPass === mesero.id ? (
                        <div className="flex gap-1">
                          <input value={meseroPassValue} onChange={(e) => setMeseroPassValue(e.target.value)} className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-[10px] outline-none w-24" placeholder="Nueva contraseña" />
                          <button onClick={() => { setMeseroChangingPass(null); setMeseroPassValue("") }} className="rounded-lg bg-neutral-900 text-white px-2 py-1 text-[10px] font-medium">OK</button>
                        </div>
                      ) : (
                        <button onClick={() => setMeseroChangingPass(mesero.id)} className="flex items-center gap-1 text-[10px] font-medium text-neutral-400 hover:text-neutral-600">
                          <KeyRound size={10} /> Contraseña
                        </button>
                      )}
                      <select value={mesero.status} onChange={(e) => updateMesero(meseroModalSuc.id, mesero.id, { status: e.target.value as SucursalMesero["status"] })} className="rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] outline-none">
                        <option value="TURNO">TURNO</option>
                        <option value="DESCANSO">DESCANSO</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={() => removeMesero(meseroModalSuc.id, mesero.id)} className="shrink-0 rounded-lg p-2 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Gestionar Administradores */}
      {adminModalSuc && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="w-full sm:max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-white p-5 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-neutral-900">Administradores — {adminModalSuc.name}</h3>
              <button onClick={() => setAdminModalSuc(null)}><X size={18} className="text-neutral-400" /></button>
            </div>

            <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4 mb-4">
              <p className="text-xs font-semibold text-neutral-700 mb-3">Agregar administrador</p>
              <div className="space-y-2 mb-3">
                <input value={adminNew.name} onChange={(e) => setAdminNew({ ...adminNew, name: e.target.value })} placeholder="Nombre completo" className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-neutral-400" />
                <div className="relative">
                  <AtSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input value={adminNew.username} onChange={(e) => setAdminNew({ ...adminNew, username: e.target.value })} placeholder="Nombre de usuario" className="w-full rounded-xl border border-neutral-200 bg-white pl-8 pr-3 py-2 text-xs outline-none focus:border-neutral-400" />
                </div>
                {adminNew.name && (
                  <div className="flex flex-wrap gap-1">
                    {generateSuggestions(adminNew.name).map((s) => (
                      <button key={s} type="button" onClick={() => setAdminNew({ ...adminNew, username: s })}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all ${adminNew.username === s ? "bg-neutral-900 text-white border-neutral-900" : "bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input value={adminNew.email} onChange={(e) => setAdminNew({ ...adminNew, email: e.target.value })} placeholder="Correo electrónico" className="w-full rounded-xl border border-neutral-200 bg-white pl-8 pr-3 py-2 text-xs outline-none focus:border-neutral-400" />
                </div>
                <input value={adminNew.phone} onChange={(e) => setAdminNew({ ...adminNew, phone: e.target.value })} placeholder="Teléfono" className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-neutral-400" />
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input type="password" value={adminNew.password} onChange={(e) => setAdminNew({ ...adminNew, password: e.target.value })} placeholder="Contraseña" className="w-full rounded-xl border border-neutral-200 bg-white pl-8 pr-3 py-2 text-xs outline-none focus:border-neutral-400" />
                </div>
                <select value={adminNew.status} onChange={(e) => setAdminNew({ ...adminNew, status: e.target.value as SucursalAdmin["status"] })} className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs outline-none">
                  <option value="TURNO">TURNO</option>
                  <option value="DESCANSO">DESCANSO</option>
                </select>
              </div>
              <button onClick={() => {
                if (!adminNew.name.trim() || !adminNew.username.trim() || !adminNew.email.trim()) return
                addAdmin(adminModalSuc.id, {
                  id: `adm-${Date.now()}`,
                  name: adminNew.name.trim(),
                  username: adminNew.username.trim(),
                  email: adminNew.email.trim(),
                  phone: adminNew.phone.trim(),
                  status: adminNew.status,
                })
                setAdminNew({ name: "", username: "", email: "", phone: "", password: "", status: "TURNO" })
              }} className="w-full rounded-xl bg-neutral-900 text-white py-2.5 text-xs font-medium hover:bg-neutral-800 transition-colors">
                <Plus size={14} className="inline mr-1" /> Agregar
              </button>
            </div>

            <div className="space-y-2">
              {sucursales.find((s: SucursalData) => s.id === adminModalSuc.id)?.admins.map((admin: SucursalAdmin) => (
                <div key={admin.id} className="rounded-2xl bg-white border border-neutral-200 p-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0 space-y-1.5">
                    {adminEditId === admin.id ? (
                      <>
                        <input value={adminEditName} onChange={(e) => setAdminEditName(e.target.value)} className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-sm font-semibold outline-none focus:border-neutral-400" />
                        <input value={adminEditEmail} onChange={(e) => setAdminEditEmail(e.target.value)} className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs outline-none focus:border-neutral-400" placeholder="Email" />
                        <input value={adminEditPhone} onChange={(e) => setAdminEditPhone(e.target.value)} className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs outline-none focus:border-neutral-400" placeholder="Teléfono" />
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-neutral-900">{admin.name}</p>
                        <p className="text-xs text-neutral-400">{admin.email} {admin.phone && `· ${admin.phone}`}</p>
                      </>
                    )}
                    <div className="flex gap-1.5">
                      {adminEditId === admin.id ? (
                        <button onClick={() => {
                          updateAdmin(adminModalSuc.id, admin.id, { name: adminEditName.trim() || admin.name, email: adminEditEmail.trim() || admin.email, phone: adminEditPhone.trim() || admin.phone })
                          setAdminEditId(null)
                        }} className="rounded-lg bg-neutral-900 text-white px-2.5 py-1 text-[10px] font-medium hover:bg-neutral-800">OK</button>
                      ) : (
                        <button onClick={() => { setAdminEditId(admin.id); setAdminEditName(admin.name); setAdminEditEmail(admin.email); setAdminEditPhone(admin.phone ?? "") }} className="text-[10px] font-medium text-neutral-400 hover:text-neutral-600">Editar</button>
                      )}
                      {adminChangingPass === admin.id ? (
                        <div className="flex gap-1">
                          <input value={adminPassValue} onChange={(e) => setAdminPassValue(e.target.value)} className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-[10px] outline-none w-24" placeholder="Nueva contraseña" />
                          <button onClick={() => { setAdminChangingPass(null); setAdminPassValue("") }} className="rounded-lg bg-neutral-900 text-white px-2 py-1 text-[10px] font-medium">OK</button>
                        </div>
                      ) : (
                        <button onClick={() => setAdminChangingPass(admin.id)} className="flex items-center gap-1 text-[10px] font-medium text-neutral-400 hover:text-neutral-600">
                          <KeyRound size={10} /> Contraseña
                        </button>
                      )}
                      <select value={admin.status} onChange={(e) => updateAdmin(adminModalSuc.id, admin.id, { status: e.target.value as SucursalAdmin["status"] })} className="rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] outline-none">
                        <option value="TURNO">TURNO</option>
                        <option value="DESCANSO">DESCANSO</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={() => removeAdmin(adminModalSuc.id, admin.id)} className="shrink-0 rounded-lg p-2 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              {sucursales.find((s: SucursalData) => s.id === adminModalSuc.id)?.admins.length === 0 && (
                <p className="text-center text-xs text-neutral-400 py-6">No hay administradores registrados</p>
              )}
            </div>
          </div>
        </div>
      )}


    </div>
  )
}
