import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/core/auth/store"
import { UserRole } from "@/core/auth/types"
import { appConfig } from "@/core/config"
import { Card, CardContent } from "@/shared/ui/Card"
import { UtensilsCrossed } from "lucide-react"

const roleLabels = {
  GlobalManager: "Global Manager",
  Mesero: "Mesero",
  AreaCocina: "Área Cocina",
  ConsumidorFinal: "Consumidor Final",
} as const

const roleIcons = {
  GlobalManager: "👔",
  Mesero: "🍽️",
  AreaCocina: "👨‍🍳",
  ConsumidorFinal: "👤",
} as const

export function LoginPage() {
 
  const setRole = useAuthStore((s) => s.setRole)
  const navigate = useNavigate()

  const handleDevLogin = (role: UserRole) => {
    setRole(role)
    navigate(`/app/${getRouteForRole(role)}`)
  }

  

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-900 shadow-lg">
            <UtensilsCrossed size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Rest2025</h1>
          <p className="mt-1 text-sm text-neutral-500">Sistema de gestión para restaurantes</p>
        </div>

        {appConfig.roleSelector && (
          <Card className="border-dashed border-neutral-300">
            <CardContent>
              <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">
                🧪 Modo Desarrollo - Selecciona un rol
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(UserRole).map((role) => (
                  <button
                    key={role}
                    onClick={() => handleDevLogin(role)}
                    className="flex flex-col items-center gap-1 rounded-xl border border-neutral-200 bg-white p-3 text-sm font-medium text-neutral-700 transition-all hover:border-neutral-400 hover:shadow-sm active:scale-95"
                  >
                    <span className="text-lg">{roleIcons[role]}</span>
                    <span>{roleLabels[role]}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        
      </div>
    </div>
  )
}

function getRouteForRole(role: UserRole): string {
  switch (role) {
    case UserRole.GlobalManager:
      return "global-manager"
    case UserRole.Mesero:
      return "mesero"
    case UserRole.AreaCocina:
      return "cocina"
    case UserRole.ConsumidorFinal:
      return "consumidor"
    default:
      return "global-manager"
  }
}
