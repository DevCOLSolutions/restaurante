import { useState } from "react"
import { X } from "lucide-react"
import { useSucursalStore } from "../store/sucursalStore"
import type { SucursalData } from "../types"

interface Props {
  sucursal: SucursalData | null
  onClose: () => void
}

export function EditSucursalModal({ sucursal, onClose }: Props) {
  const updateSucursal = useSucursalStore((s) => s.updateSucursal)
  const [form, setForm] = useState({ name: sucursal?.name ?? "", address: sucursal?.address ?? "", phone: sucursal?.phone ?? "" })

  if (!sucursal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-neutral-900">Editar sucursal</h3>
          <button onClick={onClose}><X size={18} className="text-neutral-400" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Nombre</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Dirección</label>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Teléfono</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400" />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50">Cancelar</button>
          <button onClick={() => { updateSucursal(sucursal.id, form); onClose() }} className="flex-1 rounded-xl bg-neutral-900 py-2.5 text-sm font-medium text-white hover:bg-neutral-800">Guardar</button>
        </div>
      </div>
    </div>
  )
}
