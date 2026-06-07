import { ClipboardList } from "lucide-react"
import { EmptyState } from "@/shared/ui/EmptyState"

export function ReportsPage() {
  return (
    <div className="p-4">
      <EmptyState icon={<ClipboardList size={48} />} title="Reportes" description="Próximamente" />
    </div>
  )
}
