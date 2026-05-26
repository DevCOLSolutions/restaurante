import { EmptyState } from "@/shared/ui/EmptyState"
import { Settings } from "lucide-react"

export function SettingsPage() {
  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Configuración</h1>
        <p className="text-sm text-neutral-500">Ajustes del sistema</p>
      </div>

      <EmptyState
        icon={<Settings size={48} />}
        title="Configuración próximamente"
        description="La configuración del sistema estará disponible en la siguiente versión"
      />
    </div>
  )
}
