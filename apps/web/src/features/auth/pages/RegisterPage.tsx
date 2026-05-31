import { useState, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/core/auth/store"
import { UserRole } from "@/core/auth/types"
import { UtensilsCrossed, Mail, Lock, User, AtSign, Eye, EyeOff } from "lucide-react"

function generateSuggestions(fullName: string): string[] {
  const parts = fullName.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return []
  const first = parts[0]
  const last = parts.length > 1 ? parts[parts.length - 1] : ""
  const initial = last ? last[0] : ""
  const rand = () => String(Math.floor(Math.random() * 90) + 10)

  const suggestions: string[] = []
  suggestions.push(first)
  if (last) suggestions.push(`${first}.${last}`)
  if (last) suggestions.push(`${first}_${last}`)
  if (initial) suggestions.push(`${first}${initial}`)
  if (last) suggestions.push(`${first}${last}`)
  suggestions.push(`${first}${rand()}`)
  if (last) suggestions.push(`${first}.${last}${rand()}`)

  return [...new Set(suggestions)]
}

export function RegisterPage() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const suggestions = useMemo(() => generateSuggestions(name), [name])

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !username || !email || !password) {
      setError("Completa todos los campos")
      return
    }
    login({
      id: `user-${Date.now()}`,
      name,
      email,
      role: UserRole.GlobalManager,
      restaurantId: "rest-001",
    })
    navigate("/app/global-manager")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-900 shadow-lg">
            <UtensilsCrossed size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Crear cuenta</h1>
          <p className="mt-1 text-sm text-neutral-500">Regístrate Como Dueño</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Nombre completo</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError("") }}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-neutral-400 transition-colors"
                placeholder="Tu nombre"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Nombre de usuario</label>
            <div className="relative">
              <AtSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError("") }}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-neutral-400 transition-colors"
                placeholder="usuario"
              />
            </div>
            {suggestions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setUsername(s)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                      username === s
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Correo electrónico</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError("") }}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-neutral-400 transition-colors"
                placeholder="correo@ejemplo.com"
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

          {error && <p className="text-xs text-rose-500">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-neutral-900 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
          >
            Crear cuenta
          </button>

          <p className="text-center text-xs text-neutral-500">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="font-medium text-neutral-900 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
