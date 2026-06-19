import { useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, BadgeCheck, BadgeX, Building2, Hash, MapPin, Pen, Plus, Table2, Trash2, UtensilsCrossed, X } from "lucide-react"
import { useZona } from "../hooks/useZona"
import { useSucursal } from "../hooks/useSucursal"
import { useUpdateZona } from "../hooks/useUpdateZona"
import { useDeleteZona } from "../hooks/useDeleteZona"
import { useMesasEstados } from "../hooks/useMesasEstados"
import { useCreateMesa } from "../hooks/useCreateMesa"
import { useMe } from "@/hooks/useMe"
import { MesaDrawer } from "../components/MesaDrawer"
import type { Mesa } from "@/types/api"

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

export function ZonaDetailPage() {
  const { id, zonaId } = useParams<{ id: string; zonaId: string }>()
  const navigate = useNavigate()
  const { data: zona, isLoading } = useZona(zonaId)
  const { data: sucursal } = useSucursal(zona?.sucursalId)
  const { mutate: updateZona } = useUpdateZona()
  const { mutate: deleteZona } = useDeleteZona()
  const { data: mesasData, isPending: mesasLoading } = useMesasEstados(zona?.sucursalId)
  const { mutate: createMesa, isPending: mesaPending } = useCreateMesa()
  const {data:user} = useMe()

  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ nombre: "", descripcion: "" })
  const [showMesaForm, setShowMesaForm] = useState(false)
  const [mesaForm, setMesaForm] = useState({ nombre: "", capacidad: 4 })
  const [mesaError, setMesaError] = useState("")
  const [selectedMesa, setSelectedMesa] = useState<Mesa | null>(null)

  const mesas = useMemo(() => {
    if (!mesasData?.grupos || !zonaId) return []
    return mesasData.grupos.flatMap((g) => g.mesas.filter((m) => m.zonaId === zonaId))
  }, [mesasData, zonaId])

  const maxNumero = useMemo(() => {
    if (!mesasData?.grupos) return 0
    let max = 0
    for (const g of mesasData.grupos) {
      for (const m of g.mesas) {
        if (m.numero > max) max = m.numero
      }
    }
    return max
  }, [mesasData])

  const handleCreateMesa = () => {
    if (!zona || !mesaForm.nombre.trim() || !zonaId) return
    setMesaError("")
    createMesa(
      { sucursalId: zona.sucursalId, zonaId, numero: maxNumero + 1, nombre: mesaForm.nombre.trim(), capacidad: mesaForm.capacidad },
      { onSuccess: () => { setShowMesaForm(false); setMesaForm({ nombre: "", capacidad: 4 }); setMesaError("") }, onError: (e) => setMesaError(e?.message ?? "Error al crear mesa") },
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
      </div>
    )
  }

  if (!zona) {
    return (
      <div className="p-6">
        <button onClick={() => navigate(`/app/global-manager/sucursales/${id}`)} className="mb-4 flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900">
          <ArrowLeft size={16} /> Regresar
        </button>
        <p className="text-sm text-neutral-500">Zona no encontrada</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-12">
      <div className="bg-neutral-900 px-5 pt-5 pb-8 rounded-b-4xl">
        <button onClick={() => navigate(`/app/global-manager/sucursales/${id}`)} className="flex items-center gap-2 text-white/70 hover:text-white mb-3">
          <ArrowLeft size={20} /> Regresar
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UtensilsCrossed size={24} className="text-white/50" />
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-medium text-white tracking-tight">Zona: {zona.nombre}</h1> 
               <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium mt-1 ${zona.activa ? "bg-emerald-500/20 text-emerald-400" : "bg-neutral-5 00/20 text-neutral-400"}`}>
                {zona.activa ? <BadgeCheck size={10} /> : <BadgeX size={10} />}
                {zona.activa ? "Activa" : "Inactiva"}
              </span>
              </div>
              <span className="text-sm text-white/70">
                {user?.data.restauranteNombre} ·  {sucursal?.nombre}
              </span>
             
            </div>
          </div>
          <div className="flex gap-2 flex-col">
            <button onClick={() => { setEditing(!editing); setEditForm({ nombre: zona.nombre, descripcion: zona.descripcion ?? "" }) }} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 text-white text-[11px] font-medium hover:bg-white/20 transition-colors">
              <Pen size={12} />
            </button>
            <button onClick={() => { if (confirm("¿Eliminar esta zona?")) { deleteZona(zona.id); navigate(`/app/global-manager/sucursales/${id}`) } }} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-500/20 text-rose-400 text-[11px] font-medium hover:bg-rose-500/30 transition-colors">
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 -mt-4 relative z-10 space-y-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-4">
          {editing ? (
            <div className="space-y-2">
              <input value={editForm.nombre} onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400" placeholder="Nombre" />
              <input value={editForm.descripcion} onChange={(e) => setEditForm({ ...editForm, descripcion: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400" placeholder="Descripción" />
              <div className="flex gap-2">
                <button onClick={() => { updateZona({ id: zona.id, nombre: editForm.nombre.trim() || null, descripcion: editForm.descripcion.trim() || null }); setEditing(false) }} className="rounded-xl bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800">Guardar</button>
                <button onClick={() => setEditing(false)} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50">Cancelar</button>
              </div>
            </div>
          ) : (
            <>
              {zona.descripcion && <InfoItem icon={<MapPin size={16} />} label="Descripción" value={zona.descripcion} />}
              <InfoItem icon={<Table2 size={16} />} label="Mesas en esta zona" value={mesas.length} />
              <InfoItem icon={<Building2 size={16} />} label="Sucursal" value={sucursal?.nombre ?? <span className="text-xs font-mono text-neutral-500">{zona.sucursalId}</span>} />
              <InfoItem icon={<Hash size={16} />} label="ID" value={<span className="text-xs font-mono text-neutral-500">{zona.id}</span>} />
              <InfoItem icon={<Hash size={16} />} label="Restaurante ID" value={<span className="text-xs font-mono text-neutral-500">{zona.restauranteId}</span>} />
            </>
          )}
        </div>

        {/* MESAS DE ESTA ZONA */}
        <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-neutral-700">MESAS</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-neutral-400">{mesas.length} mesas</span>
              <button onClick={() => setShowMesaForm(!showMesaForm)} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-900 text-white text-[10px] font-medium hover:bg-neutral-800 transition-colors">
                <Plus size={11} /> Añadir mesa
              </button>
            </div>
          </div>

          {showMesaForm && (
            <div className="rounded-xl bg-white border border-neutral-200 p-3 mb-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-neutral-700">Nueva mesa</p>
                <button onClick={() => setShowMesaForm(false)}><X size={14} className="text-neutral-400" /></button>
              </div>
              {mesaError && <p className="text-[11px] text-rose-500">{mesaError}</p>}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-neutral-500 bg-neutral-100 px-2 py-1.5 rounded-lg shrink-0">{mesasLoading ? "..." : `#${maxNumero + 1}`}</span>
                <input value={mesaForm.nombre} onChange={(e) => setMesaForm({ ...mesaForm, nombre: e.target.value })} placeholder="Nombre (ej. Mesa 5)" className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs outline-none focus:border-neutral-400" />
              </div>
              <div className="flex gap-2">
                <select value={mesaForm.capacidad} onChange={(e) => setMesaForm({ ...mesaForm, capacidad: Number(e.target.value) })} className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs outline-none focus:border-neutral-400">
                  {[2, 3, 4, 6, 8].map((n) => <option key={n} value={n}>{n} personas</option>)}
                </select>
                <button onClick={handleCreateMesa} disabled={mesasLoading || mesaPending || !mesaForm.nombre.trim()} className="rounded-lg bg-neutral-900 text-white px-3 py-1.5 text-xs font-medium hover:bg-neutral-800 disabled:opacity-40">
                  {mesaPending ? "..." : "OK"}
                </button>
              </div>
            </div>
          )}

          {mesas.length === 0 ? (
            <p className="text-xs text-neutral-400 text-center py-4">Sin mesas en esta zona</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {mesas.map((mesa) => (
                <button key={mesa.id} onClick={() => setSelectedMesa(mesa)} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border cursor-pointer hover:opacity-80 transition-opacity ${statusBg[mesa.estado] ?? "bg-neutral-100 text-neutral-600"}`} title={`${mesa.nombre} · ${mesa.estado}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusColor[mesa.estado] ?? "bg-neutral-400"}`} />
                  #{mesa.numero} {mesa.nombre}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <MesaDrawer mesa={selectedMesa} onClose={() => setSelectedMesa(null)} />
    </div>
  )
}
