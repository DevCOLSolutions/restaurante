import { useEffect, useRef, type ReactNode } from "react"
import { Link } from "react-router-dom"
import {
  UtensilsCrossed,
  ArrowRight,
  Check,
  Star,
  MapPin,
  StickyNote,
  TimerOff,
  LayoutGrid,
  Building2,
  ClipboardList,
  ChefHat,
  Users,
  Package,
  Receipt,
  FileText,
} from "lucide-react"

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1"
          el.style.transform = "translateY(0)"
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

function FadeIn({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useFadeIn()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out opacity-0 translate-y-6 ${className}`}
    >
      {children}
    </div>
  )
}

const problems = [
  {
    num: "01",
    icon: StickyNote,
    title: "Pedidos que se pierden o llegan mal",
    desc: "El mesero anota en papel, cocina no entiende la letra, el cliente espera. Con A La Orden el pedido llega digital en segundos.",
  },
  {
    num: "02",
    icon: TimerOff,
    title: "Tiempos de espera que alejan clientes",
    desc: "Cuando cocina no sabe qué sigue, improvisa. Los estados en tiempo real priorizan sin necesidad de correr.",
  },
  {
    num: "03",
    icon: LayoutGrid,
    title: "Sin visibilidad de mesas en tiempo real",
    desc: "¿Cuántas mesas están abiertas? ¿Cuál lleva más de 40 minutos? Lo ves de un vistazo.",
  },
  {
    num: "04",
    icon: Building2,
    title: "Múltiples sucursales, múltiples dolores de cabeza",
    desc: "Administrar cada sede por separado consume tiempo. Con A La Orden todo está centralizado.",
  },
]

const features = [
  { icon: LayoutGrid,    title: "Mesas en tiempo real", desc: "Apertura, cierre y estado de cada mesa visible para todos." },
  { icon: ClipboardList, title: "Gestión de pedidos",   desc: "Creación, modificación y seguimiento desde cualquier dispositivo." },
  { icon: ChefHat,       title: "Pantalla de cocina",   desc: "Pedidos ordenados por prioridad, con estados actualizables al toque." },
  { icon: Users,         title: "Roles y permisos",     desc: "Cada persona ve lo que necesita. Nada más, nada menos." },
  { icon: Building2,     title: "Multi-sucursal",       desc: "Control centralizado con configuración independiente por sede." },
  { icon: Package,       title: "Menú centralizado",    desc: "Actualiza productos y precios una vez. Se refleja en todas las sedes." },
]

const roles = [
  { role: "Administrador",   desc: "Control total: reportes, usuarios, configuración y métricas de todas las sedes." },
  { role: "Mesero",          desc: "Toma el pedido desde el celular y lo envía a cocina con un toque. Sin papeles." },
  { role: "Cocina",          desc: "Ve los pedidos en orden de llegada y cambia estados sin salir de la pantalla." },
  { role: "Admin. sucursal", desc: "Maneja su sede de forma autónoma, con acceso solo a su operación." },
]

const plans = [
  {
    name: "Gratis",
    desc: "Para conocer la plataforma",
    price: "$0",
    period: "por mes",
    features: ["1 sucursal", "5 mesas", "3 usuarios", "Historial 7 días"],
    cta: "Empezar",
    featured: false,
  },
  {
    name: "Básico",
    desc: "Un solo local",
    price: "$49.900",
    period: "por mes",
    features: ["1 sucursal", "Mesas ilimitadas", "Usuarios ilimitados", "Soporte WhatsApp"],
    cta: "Lo quiero",
    featured: false,
  },
  {
    name: "Profesional",
    desc: "Para restaurantes en crecimiento",
    price: "$89.900",
    period: "por mes",
    features: ["Hasta 3 sucursales", "Dashboard operativo", "Reportes y métricas", "Soporte prioritario"],
    cta: "Lo quiero",
    featured: true,
  },
  {
    name: "Multi-Sucursal",
    desc: "Cadenas y franquicias",
    price: "$149.900",
    period: "por mes",
    features: ["Sucursales ilimitadas", "Reportes consolidados", "Soporte prioritario", "API de integración"],
    cta: "Lo quiero",
    featured: false,
  },
]

const addons = [
  { icon: Receipt,  name: "Módulo de caja",          price: "+$20.000/mes", desc: "Punto de venta integrado con facturación básica." },
  { icon: Package,  name: "Módulo de inventario",    price: "+$30.000/mes", desc: "Control de stock, compras y mermas en tiempo real." },
  { icon: FileText, name: "Facturación electrónica", price: "+$40.000/mes", desc: "Integración DIAN con resolución y envío automático." },
]

const testimonials = [
  {
    name: "Carlos Mendoza",
    initials: "CM",
    role: "La Brasa Roja",
    text: "Los errores en pedidos se redujeron casi a cero. Mis meseros ya no corren a cocina a gritar órdenes.",
  },
  {
    name: "María Fernández",
    initials: "MF",
    role: "Sabor Costeño",
    text: "Tres sucursales en una sola plataforma. Ya no necesitamos llamadas ni reportes en Excel.",
  },
  {
    name: "Andrés Rincón",
    initials: "AR",
    role: "El Fogón",
    text: "Recibir los pedidos en la pantalla de cocina cambió todo. Sé qué sigue sin que nadie me lo diga.",
  },
]

const heroStats = [
  { val: "−62%",       label: "errores en pedidos" },
  { val: "menos 30s",  label: "de mesa a cocina" },
  { val: "Multi-sede", label: "desde un solo dashboard" },
]

const footerLinks = ["Inicio", "Planes", "Contacto", "Términos", "Privacidad"]

const LABEL = "text-xs font-medium uppercase tracking-widest text-neutral-400 mb-2"
const TITLE = "text-2xl sm:text-3xl font-semibold tracking-tight mb-3"
const SUB   = "text-neutral-500 max-w-md mb-10 text-sm leading-relaxed"

export function LandingPage() {
  return (
    <div className="bg-white font-sans text-neutral-900">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600">
              <UtensilsCrossed size={16} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-neutral-900">A La Orden</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:block text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
            >
              Empieza gratis <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 sm:pt-36 sm:pb-20 border-b border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 border border-neutral-200 px-3 py-1 text-xs text-neutral-500 mb-6">
              <MapPin size={11} />
              Para restaurantes en Colombia
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-tight leading-[1.15] max-w-2xl">
              Tu restaurante,{" "}
              <span className="text-orange-600">sincronizado.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-neutral-500 leading-relaxed max-w-lg">
              Meseros, cocina y administración en una sola plataforma. Sin papel, sin llamadas, sin pedidos perdidos.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
              >
                Prueba gratis 7 días <ArrowRight size={14} />
              </Link>
              <a
                href="#planes"
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:border-neutral-300 transition-colors"
              >
                Ver planes
              </a>
            </div>
            <p className="mt-3 text-xs text-neutral-400">Sin tarjeta de crédito. Cancela cuando quieras.</p>
            <div className="mt-12 flex flex-wrap gap-8 pt-8 border-t border-neutral-100">
              {heroStats.map((s, i) => (
                <div key={i}>
                  <div className="text-xl font-semibold text-neutral-900">{s.val}</div>
                  <div className="mt-0.5 text-sm text-neutral-500">{s.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Problems */}
      <section className="py-16 sm:py-20 border-b border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className={LABEL}>El problema</p>
            <h2 className={TITLE}>Lo que pasa sin A La Orden</h2>
            <p className={SUB}>
              Cada restaurante tiene sus dolores. Estos son los más frecuentes, y para todos hay solución.
            </p>
          </FadeIn>
          <div className="divide-y divide-neutral-100">
            {problems.map((p, i) => (
              <FadeIn key={i}>
                <div className="flex items-start gap-4 py-5">
                  <span className="text-xs text-neutral-400 font-medium w-5 pt-0.5 shrink-0">{p.num}</span>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-50 border border-neutral-100">
                    <p.icon size={17} className="text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-neutral-900 mb-1">{p.title}</h3>
                    <p className="text-sm text-neutral-500 leading-relaxed">{p.desc}</p>
                  </div>
                  <span className="shrink-0 self-center rounded-full bg-amber-50 text-amber-700 text-[11px] font-medium px-2.5 py-1">
                    Resuelto
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 border-b border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className={LABEL}>Funcionalidades</p>
            <h2 className={TITLE}>Todo en una sola plataforma</h2>
            <p className={SUB}>
              No más apps desconectadas. No más hojas de cálculo. Solo una herramienta que funciona.
            </p>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y divide-neutral-100 border border-neutral-100 rounded-xl overflow-hidden">
            {features.map((f, i) => (
              <FadeIn key={i}>
                <div className="p-5 bg-white">
                  <f.icon size={20} className="text-orange-600 mb-3" />
                  <h3 className="text-sm font-medium text-neutral-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-16 sm:py-20 border-b border-neutral-100 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className={LABEL}>Para cada rol</p>
            <h2 className={TITLE}>Cada quien ve lo que necesita</h2>
            <p className={SUB}>
              Una plataforma adaptada a cómo trabaja cada persona en tu negocio.
            </p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map((r, i) => (
              <FadeIn key={i}>
                <div className="rounded-xl bg-white border border-neutral-100 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-600 mb-2">{r.role}</p>
                  <p className="text-sm text-neutral-500 leading-relaxed">{r.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="planes" className="py-16 sm:py-20 border-b border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className={LABEL}>Precios</p>
            <h2 className={TITLE}>Planes claros, sin letra pequeña</h2>
            <p className={SUB}>Paga por lo que usas. Escala cuando crezcas.</p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan, i) => (
              <FadeIn key={i}>
                <div
                  className={[
                    "relative rounded-xl border p-5 flex flex-col h-full",
                    plan.featured
                      ? "border-orange-300 bg-white ring-1 ring-orange-200"
                      : "border-neutral-100 bg-white",
                  ].join(" ")}
                >
                  {plan.featured && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-orange-600 px-3 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wide whitespace-nowrap">
                      Recomendado
                    </span>
                  )}
                  <h3 className="text-sm font-semibold text-neutral-900">{plan.name}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5 mb-4">{plan.desc}</p>
                  <span className="text-2xl font-semibold text-neutral-900">{plan.price}</span>
                  <p className="text-xs text-neutral-400 mb-4">{plan.period}</p>
                  <hr className="border-neutral-100 mb-4" />
                  <ul className="flex-1 space-y-2.5 mb-5">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-neutral-600">
                        <Check size={13} className="text-orange-600 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/register"
                    className={[
                      "block text-center rounded-lg py-2 text-sm font-medium transition-colors",
                      plan.featured
                        ? "bg-orange-600 text-white hover:bg-orange-700"
                        : "border border-neutral-200 text-neutral-700 hover:border-neutral-300",
                    ].join(" ")}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-16 sm:py-20 border-b border-neutral-100 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className={LABEL}>Módulos adicionales</p>
            <h2 className={TITLE}>Potencia tu plan</h2>
            <p className={SUB}>Agrega solo lo que necesitas, cuando lo necesitas.</p>
          </FadeIn>
          <div className="divide-y divide-neutral-100 border border-neutral-100 rounded-xl overflow-hidden">
            {addons.map((a, i) => (
              <FadeIn key={i}>
                <div className="flex items-center gap-4 bg-white px-5 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-50 border border-neutral-100">
                    <a.icon size={17} className="text-neutral-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900">{a.name}</p>
                    <p className="text-xs text-neutral-500">{a.desc}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1">
                    {a.price}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 border-b border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className={LABEL}>Clientes</p>
            <h2 className={TITLE}>Lo que dicen quienes ya lo usan</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-3 gap-4 mt-10">
            {testimonials.map((t, i) => (
              <FadeIn key={i}>
                <div className="rounded-xl bg-neutral-50 border border-neutral-100 p-5">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={13} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-4">"{t.text}"</p>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{t.name}</p>
                      <p className="text-xs text-neutral-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="rounded-2xl bg-neutral-50 border border-neutral-100 px-8 py-12 sm:px-16 sm:py-16">
              <p className={LABEL}>Empieza hoy</p>
              <h2 className={TITLE}>Sin riesgo. Sin compromiso.</h2>
              <p className="text-neutral-500 text-sm leading-relaxed max-w-sm mb-7">
                7 días gratis para probar con tu equipo real. Si no es para ti, cancelas y listo.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
                >
                  Crear cuenta gratis <ArrowRight size={14} />
                </Link>
                <a
                  href="#contacto"
                  className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:border-neutral-300 transition-colors"
                >
                  Hablar con ventas
                </a>
              </div>
              <p className="mt-4 text-xs text-neutral-400">Soporte por WhatsApp incluido en todos los planes.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-600">
              <UtensilsCrossed size={13} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-neutral-900">A La Orden</span>
          </div>
          <div className="flex items-center gap-5">
            {footerLinks.map((label, i) => (
              <a key={i} href="#" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
                {label}
              </a>
            ))}
          </div>
          <p className="text-xs text-neutral-400">© 2025 A La Orden</p>
        </div>
      </footer>

    </div>
  )
}