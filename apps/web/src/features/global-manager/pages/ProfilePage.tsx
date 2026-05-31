import { Card, CardContent } from "@/shared/ui/Card"
import { User } from "lucide-react"
import { useAuthStore } from "@/core/auth/store"
import { Button } from "@workspace/ui/components/button"

export function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <div className="space-y-4 p-4">
      <div className="rounded-2xl bg-neutral-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Pedidos pendientes</p>
            <p className="text-lg font-bold">0</p>
          </div>
          <div className="w-px h-8 bg-neutral-700" />
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">En preparación</p>
            <p className="text-lg font-bold">0</p>
          </div>
          <div className="w-px h-8 bg-neutral-700" />
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Mesas activas</p>
            <p className="text-lg font-bold">0</p>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Perfil</h1>
        <p className="text-sm text-neutral-500">Tu información de usuario</p>
      </div>

      <div className="flex flex-col items-center py-8">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
          <User size={36} className="text-neutral-400" />
        </div>
        <h2 className="text-lg font-bold text-neutral-900">{user?.name ?? "Usuario"}</h2>
        <p className="text-sm text-neutral-500">{user?.email ?? "Sin correo"}</p>
        <span className="mt-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
          {user?.role ?? "Sin rol"}
        </span>
      </div>

      <Card>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Restaurante</span>
            <span className="font-medium text-neutral-800">Restaurante Principal</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">ID Restaurante</span>
            <span className="font-medium text-neutral-800">{user?.restaurantId ?? "—"}</span>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={logout}
        variant="outline"
        className="w-full rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50"
      >
        Cerrar Sesión
      </Button>
    </div>
  )
}
