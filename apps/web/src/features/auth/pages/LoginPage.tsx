import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/core/auth/store"
import { UserRole } from "@/core/auth/types"
import { getDashboardPathForRole } from "@/core/auth/utils"
import { appConfig } from "@/core/config"
import { useLogin } from "@/features/auth/hooks/useLogin"
import { ApiRequestError } from "@/lib/apiClient"
import { UtensilsCrossed, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/shared/ui/Card"

const roleLabels: Record<string, string> = {
  GlobalManager: "Global Manager",
  AdminSucursal: "Admin Sucursal",
  Mesero: "Mesero",
  AreaCocina: "Área Cocina",
  ConsumidorFinal: "Consumidor Final",
}

const roleIcons: Record<string, string> = {
  GlobalManager: "👔",
  AdminSucursal: "🏢",
  Mesero: "🍽️",
  AreaCocina: "👨‍🍳",
  ConsumidorFinal: "👤",
}

export function LoginPage() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const loginMutation = useLogin()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      setError("Completa todos los campos")
      return
    }
    setError("")
    loginMutation.mutate({ username, password })
  }

  const handleDevLogin = (role: UserRole) => {
    login({ id: `dev-${role}`, name: `Developer (${role})`, email: `dev@${role.toLowerCase()}.rest`, role, restaurantId: "rest-001" })
    navigate(getDashboardPathForRole(role))
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-900 shadow-lg">
            <UtensilsCrossed size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Rest2025</h1>
          <p className="mt-1 text-sm text-neutral-500">Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Usuario</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError("") }}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-neutral-400 transition-colors"
                placeholder="usuario"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Contraseña</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError("") }}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-10 text-sm outline-none focus:border-neutral-400 transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {(error || loginMutation.error) && (
            <p className="text-xs text-rose-500">
              {error ||
                (loginMutation.error instanceof ApiRequestError
                  ? (loginMutation.error.body as { message?: string })?.message || loginMutation.error.message
                  : "Error al iniciar sesión")}
            </p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-xl bg-neutral-900 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loginMutation.isPending && <Loader2 size={16} className="animate-spin" />}
            {loginMutation.isPending ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>

          <p className="text-center text-xs text-neutral-500">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="font-medium text-neutral-900 hover:underline">
              Regístrate
            </Link>
          </p>
        </form>

        {appConfig.roleSelector && (
          <Card className="border-dashed border-neutral-300">
            <CardContent>
              <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">
                🧪 Modo Desarrollo
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

