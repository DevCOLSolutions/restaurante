import { Settings } from "lucide-react"
import { EmptyState } from "@/shared/ui/EmptyState"

export function SettingsPage() {
  return (
    <div className="p-4">
      <EmptyState icon={<Settings size={48} />} title="Configuración" description="Próximamente" />
    </div>
  )
}
