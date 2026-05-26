import { EmptyState } from "@/shared/ui/EmptyState"
import { BarChart3 } from "lucide-react"

export function ReportsPage() {
  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Reportes</h1>
        <p className="text-sm text-neutral-500">Estadísticas y análisis del restaurante</p>
      </div>

      <EmptyState
        icon={<BarChart3 size={48} />}
        title="Reportes próximamente"
        description="Los reportes detallados estarán disponibles en la siguiente versión"
      />
    </div>
  )
}
