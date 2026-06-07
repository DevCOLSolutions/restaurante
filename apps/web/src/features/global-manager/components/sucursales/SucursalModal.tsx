import { useState, useEffect } from "react"
import { useCreateSucursal } from "../../hooks/useCreateSucursal"
import type { Sucursal } from "@/types/api"

interface SucursalModalProps {
  sucursal: Partial<Sucursal> | null
  onClose: () => void
}

export function SucursalModal({ sucursal, onClose }: SucursalModalProps) {
  const createMutation = useCreateSucursal()
  const isEditing = !!sucursal?.id

  const [nombre, setNombre] = useState(sucursal?.nombre ?? "")
  const [direccion, setDireccion] = useState(sucursal?.direccion ?? "")
  const [telefono, setTelefono] = useState(sucursal?.telefono ?? "")
  const [cantidadMesas, setCantidadMesas] = useState(sucursal?.cantidadMesas ?? 0)

  useEffect(() => {
    setNombre(sucursal?.nombre ?? "")
    setDireccion(sucursal?.direccion ?? "")
    setTelefono(sucursal?.telefono ?? "")
    setCantidadMesas(sucursal?.cantidadMesas ?? 0)
  }, [sucursal])

  const handleSubmit = async () => {
    if (isEditing) return
    await createMutation.mutateAsync({
      nombre,
      direccion: direccion || null,
      telefono: telefono || null,
      cantidadMesas,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="w-full sm:max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-white p-5 overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-neutral-900">
            {isEditing ? "Editar sucursal" : "Nueva sucursal"}
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 text-sm">
            Cerrar
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Nombre</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre de la sucursal"
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Dirección</label>
            <input
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Calle y número"
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Teléfono</label>
            <input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="555-0000"
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Cantidad de mesas</label>
            <input
              type="number"
              min={0}
              value={cantidadMesas}
              onChange={(e) => setCantidadMesas(Number(e.target.value))}
              placeholder="0"
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={createMutation.isPending || !nombre.trim()}
            className="flex-[2] rounded-xl bg-neutral-900 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-40 transition-colors"
          >
            {createMutation.isPending ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear sucursal"}
          </button>
        </div>
      </div>
    </div>
  )
}
