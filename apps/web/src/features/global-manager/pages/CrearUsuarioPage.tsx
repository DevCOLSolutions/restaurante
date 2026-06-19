import { useState, useMemo, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Building2, Loader2, CheckCircle, XCircle, AlertCircle, Clock, Sparkles } from "lucide-react"
import { useCreateUsuario } from "../hooks/useCreateUsuario"
import { useAreasCocina } from "../hooks/useAreasCocina"
import { useSucursal } from "../hooks/useSucursal"
import { useUsernameAvailability } from "../hooks/useUsernameAvailability"

function generateUsernameSuggestions(nombre: string): string[] {
  const normalized = nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z\s]/g, "")
    .trim()

  const parts = normalized.split(/\s+/).filter(Boolean)
  if (parts.length < 2) return []

  const [first, ...rest] = parts
  const last = rest[rest.length - 1]
  const set = new Set<string>()

  set.add(`${first}.${last}`)
  set.add(`${first}${last}`)
  set.add(`${first}_${last}`)
  set.add(`${first[0]}.${last}`)
  set.add(`${first}.${last[0]}`)
  set.add(`${first}${last[0]}`)
  set.add(`${first}`)

  return Array.from(set).slice(0, 6)
}

interface PasswordRule {
  key: string
  label: string
  passed: boolean
}

const COMMON_PASSWORDS = new Set([
  "123456", "password", "qwerty", "admin", "12345678",
  "123456789", "12345", "1234", "1234567890", "123123",
  "abc123", "letmein", "welcome", "monkey", "dragon",
  "master", "summer", "passw0rd", "shadow", "sunshine",
])

const SEQUENCE_PATTERNS = [
  /^abcdef/i, /^qwerty/i, /^123456/, /^12345/, /^qwertz/i,
  /^asdfgh/i, /^zxcvbn/i,
]

function validatePassword(password: string, username: string, email: string): PasswordRule[] {
  return [
    { key: "minLength", label: "Mínimo 8 caracteres", passed: password.length >= 8 },
    { key: "uppercase", label: "Contiene una letra mayúscula", passed: /[A-Z]/.test(password) },
    { key: "lowercase", label: "Contiene una letra minúscula", passed: /[a-z]/.test(password) },
    { key: "number", label: "Contiene un número", passed: /\d/.test(password) },
    { key: "symbol", label: "Contiene un símbolo especial", passed: /[!@#$%^&*()_\-+=[\]{};:,.<>?]/.test(password) },
    { key: "noSpaces", label: "Sin espacios al inicio o final", passed: password === password.trim() },
    { key: "notCommon", label: "No es una contraseña común", passed: !COMMON_PASSWORDS.has(password.toLowerCase()) },
    { key: "noSequence", label: "No contiene secuencias simples", passed: !SEQUENCE_PATTERNS.some((p) => p.test(password)) },
    { key: "noUserPart", label: "No contiene el usuario o correo", passed: !username || !email || (
      !password.toLowerCase().includes(username.toLowerCase()) &&
      !password.toLowerCase().includes(email.split("@")[0].toLowerCase())
    )},
    { key: "noRepeat", label: "Sin caracteres repetidos excesivos", passed: !/(.)\1{3,}/.test(password) },
  ]
}

const ROLES_TODOS = [
  { value: "AdminSucursal", label: "Administrador de sucursal" },
  { value: "Mesero", label: "Mesero" },
  { value: "Cocinero", label: "Cocinero" },
  { value: "ConsumidorFinal", label: "Consumidor final" },
]

export function CrearUsuarioPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { mutate: createUsuario, isPending } = useCreateUsuario()
  const { data: sucursal } = useSucursal(id)
  const { data: areasCocina } = useAreasCocina()
  const rolesDisponibles = useMemo(
    () => (sucursal?.adminId ? ROLES_TODOS.filter((r) => r.value !== "AdminSucursal") : ROLES_TODOS),
    [sucursal?.adminId],
  )

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    username: "",
    password: "",
    rol: "Mesero",
    areaCocinaId: "",
  })
  const [error, setError] = useState("")

  const { status: usernameStatus, isChecking: isUsernameChecking, isAvailable } = useUsernameAvailability(form.username)

  const usernameSuggestions = useMemo(() => generateUsernameSuggestions(form.nombre), [form.nombre])
  const [showSuggestions, setShowSuggestions] = useState(true)

  const passwordRules = useMemo(
    () => validatePassword(form.password, form.username, form.correo),
    [form.password, form.username, form.correo],
  )
  const allPassed = passwordRules.every((r) => r.passed)

  useEffect(() => { setShowSuggestions(true) }, [form.nombre]); // eslint-disable-line react-hooks/set-state-in-effect
  void showSuggestions

  const handleSelectSuggestion = (suggestion: string) => {
    setForm({ ...form, username: suggestion })
    setShowSuggestions(false)
  }

  const handleSubmit = () => {
    if (!id || !form.nombre.trim() || !form.correo.trim() || !form.username.trim() || !form.password.trim()) {
      setError("Completa todos los campos obligatorios")
      return
    }
    if (form.username.trim().length >= 3 && isAvailable === false) {
      setError("El nombre de usuario no está disponible")
      return
    }
    if (form.rol === "Cocinero" && !form.areaCocinaId) {
      setError("Selecciona un área de cocina para el rol Cocinero")
      return
    }
    if (form.password.trim() && !allPassed) {
      setError("La contraseña no cumple todos los requisitos de seguridad")
      return
    }
    setError("")
    createUsuario(
      {
        nombre: form.nombre.trim(),
        correo: form.correo.trim(),
        username: form.username.trim(),
        password: form.password,
        sucursalId: id,
        rol: form.rol,
        areaCocinaId: form.rol === "Cocinero" ? form.areaCocinaId : null,
      },
      {
        onSuccess: () => navigate(`/app/global-manager/sucursales/${id}`),
        onError: (e) => setError(e?.message ?? "Error al crear usuario"),
      },
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-12">
      <div className="bg-neutral-900 px-5 pt-5 pb-8 rounded-b-4xl">
        <button onClick={() => navigate(`/app/global-manager/sucursales/${id}`)} className="flex items-center gap-2 text-white/70 hover:text-white mb-3">
          <ArrowLeft size={20} /> Regresar
        </button>
        <div className="flex items-center gap-3">
          <Building2 size={24} className="text-white/50" />
          <div>
            <h1 className="text-xl font-medium text-white tracking-tight">Crear usuario</h1>
            <p className="text-sm text-white/70">Nuevo usuario en la sucursal</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 -mt-4 relative z-10">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-4">
          {error && <p className="text-[11px] text-rose-500 bg-rose-50 rounded-lg px-3 py-2">{error}</p>}

          <div>
            <p className="text-[11px] text-neutral-400 mb-1">Nombre *</p>
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400" placeholder="Nombre completo" />
          </div>

          <div>
            <p className="text-[11px] text-neutral-400 mb-1">Correo *</p>
            <input value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400" placeholder="correo@ejemplo.com" type="email" />
          </div>

          <div>
            <p className="text-[11px] text-neutral-400 mb-1">Nombre de usuario *</p>
            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400" placeholder="usuario" />
            {form.username.trim().length >= 3 && usernameStatus !== "idle" && (
              <div className="flex items-center gap-1 mt-1">
                {usernameStatus === "checking" && <Clock size={12} className="text-amber-500" />}
                {usernameStatus === "available" && <CheckCircle size={12} className="text-emerald-500" />}
                {usernameStatus === "unavailable" && <XCircle size={12} className="text-rose-500" />}
                {usernameStatus === "error" && <AlertCircle size={12} className="text-rose-500" />}
                <span className="text-[11px]">
                  {usernameStatus === "checking" && <span className="text-amber-600">Verificando disponibilidad...</span>}
                  {usernameStatus === "available" && <span className="text-emerald-600">Nombre disponible</span>}
                  {usernameStatus === "unavailable" && <span className="text-rose-600">Nombre no disponible</span>}
                  {usernameStatus === "error" && <span className="text-rose-600">Error al verificar disponibilidad</span>}
                </span>
              </div>
            )}
            {showSuggestions && usernameSuggestions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="text-[10px] text-neutral-400 mr-0.5 flex items-center gap-1">
                  <Sparkles size={10} /> Sugerencias:
                </span>
                {usernameSuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSelectSuggestion(s)}
                    className="text-[11px] px-2 py-0.5 rounded-full border border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-400 hover:bg-neutral-100 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-[11px] text-neutral-400 mb-1">Contraseña *</p>
            <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400" placeholder="••••••••" type="password" />
            {form.password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-0.5 h-1 mb-1.5">
                  {passwordRules.map((r) => (
                    <div
                      key={r.key}
                      className={`flex-1 rounded-full transition-colors ${r.passed ? "bg-emerald-400" : "bg-neutral-200"}`}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                  {passwordRules.filter((r) => !r.passed).length > 0 ? (
                    passwordRules.filter((r) => !r.passed).slice(0, 3).map((r) => (
                      <span key={r.key} className="text-[10px] text-rose-500">{r.label}</span>
                    ))
                  ) : (
                    <span className="text-[10px] text-emerald-600">Contraseña segura</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <p className="text-[11px] text-neutral-400 mb-1">Rol *</p>
            <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value, areaCocinaId: "" })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400">
              {rolesDisponibles.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>

          {form.rol === "Cocinero" && (
            <div>
              <p className="text-[11px] text-neutral-400 mb-1">Área de cocina *</p>
              <select value={form.areaCocinaId} onChange={(e) => setForm({ ...form, areaCocinaId: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400">
                <option value="">Seleccionar área...</option>
                {(areasCocina ?? []).map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
              </select>
            </div>
          )}

          <button onClick={handleSubmit} disabled={isPending || isUsernameChecking} className="w-full rounded-xl bg-neutral-900 text-white py-2.5 text-sm font-medium hover:bg-neutral-800 disabled:opacity-40 transition-colors flex items-center justify-center gap-2">
            {isPending ? <Loader2 size={14} className="animate-spin" /> : null}
            {isPending ? "Creando..." : "Crear usuario"}
          </button>
        </div>
      </div>
    </div>
  )
}
