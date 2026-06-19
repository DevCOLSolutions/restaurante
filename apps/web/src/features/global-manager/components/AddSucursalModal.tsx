import { useState } from "react"
import { X } from "lucide-react"
import { useCreateSucursal } from "../hooks/useCreateSucursal"

interface Props {
  onClose: () => void
}

export function AddSucursalModal({ onClose }: Props) {
  const { mutate, isPending } = useCreateSucursal()
  const [form, setForm] = useState({ nombre: "", direccion: "", telefono: "", cantidadMesas: 0 })

  const handleSubmit = () => {
    if (!form.nombre.trim()) return
    mutate(
      {
        nombre: form.nombre.trim(),
        direccion: form.direccion.trim() || null,
        telefono: form.telefono.trim() || null,
        cantidadMesas: form.cantidadMesas,
      },
      { onSuccess: () => onClose() },
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-neutral-900">Nueva sucursal</h3>
          <button onClick={onClose}><X size={18} className="text-neutral-400" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Nombre</label>
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400" placeholder="Nombre de la sucursal" />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Dirección</label>
            <input value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400" placeholder="Dirección" />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Teléfono</label>
            <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400" placeholder="Teléfono" />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Cantidad de mesas</label>
            <input type="number" min={0} value={form.cantidadMesas} onChange={(e) => setForm({ ...form, cantidadMesas: Number(e.target.value) })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400" placeholder="0" />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50">Cancelar</button>
          <button onClick={handleSubmit} disabled={isPending || !form.nombre.trim()} className="flex-1 rounded-xl bg-neutral-900 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-40">
            {isPending ? "Guardando..." : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  )
}
