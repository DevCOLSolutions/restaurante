import { useEffect, useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { useSucursalStore } from "../store/sucursalStore"
import { useModalState } from "../hooks/useModalState"
import { HeroAdministrador } from "../components/Hero"
import { SucursalCard } from "../components/SucursalCard"
import { EditSucursalModal } from "../components/EditSucursalModal"
import { AddSucursalModal } from "../components/AddSucursalModal"
import { ZoneModal } from "../components/ZoneModal"
import { StaffModal } from "../components/StaffModal"

export function GlobalManagerDashboardPage() {
  const sucursales = useSucursalStore((s) => s.sucursales)
  const hydrate = useSucursalStore((s) => s._hydrate)
  const deleteSucursal = useSucursalStore((s) => s.deleteSucursal)
  const { activeModal, selectedSucursal, open, close } = useModalState()
  const [expandedId, setExpandedId] = useState<string | null>(null)

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

  return (
    <div className="space-y-4">
      <HeroAdministrador />
      <div className="px-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-neutral-400">{sucursales.length} sucursales registradas</p>
          <button onClick={() => open("addSuc")} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-900 text-white text-[11px] font-medium hover:bg-neutral-800 transition-colors">
            <Plus size={13} /> Agregar sucursal
          </button>
        </div>
        {sucursales.map((suc) => (
          <SucursalCard
            key={suc.id}
            suc={suc}
            isExpanded={expandedId === suc.id}
            onToggle={() => setExpandedId(expandedId === suc.id ? null : suc.id)}
            onEdit={(s) => open("editSuc", s)}
            onDelete={(id) => deleteSucursal(id)}
            onManageZones={(s) => open("zone", s)}
            onManageMeseros={(s) => open("mesero", s)}
            onManageAdmins={(s) => open("admin", s)}
            allKitchenAreas={allKitchenAreas}
          />
        ))}
      </div>

      <EditSucursalModal sucursal={selectedSucursal} onClose={close} />
      {activeModal === "addSuc" && <AddSucursalModal onClose={close} />}
      <ZoneModal sucursal={selectedSucursal} onClose={close} />
      {activeModal === "mesero" && <StaffModal sucursal={selectedSucursal} role="mesero" onClose={close} />}
      {activeModal === "admin" && <StaffModal sucursal={selectedSucursal} role="admin" onClose={close} />}
    </div>
  )
}
