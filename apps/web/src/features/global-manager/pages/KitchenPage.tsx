import { useState } from "react"
import { Card, CardContent } from "@/shared/ui/Card"
import { Badge } from "@/shared/ui/Badge"
import { MetricCard } from "@/features/global-manager/components/MetricCard"
import { ChefHat, Clock, PlusCircle } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { HeroMesero } from "../components/Hero"
import { useAuthStore } from "@/core/auth/store"

interface KitchenArea {
  name: string
  description: string
}

const defaultKitchenAreas: KitchenArea[] = [
  { name: "Zona de cocción", description: "Área de cocción y preparación caliente" },
  { name: "Platos fríos", description: "Área de ensaladas y platos fríos" },
  { name: "Bebidas", description: "Área de bebidas y bar" },
]

interface KitchenItem { name: string; qty: number; category: string; area: string }

const kitchenOrders: { id: string; table: number; items: KitchenItem[]; status: string; time: string; priority: string }[] = [
  {
    id: "k1", table: 1,
    items: [{ name: "Tacos al Pastor", qty: 3, category: "P.FUERTE", area: "Zona de cocción" }, { name: "Guacamole", qty: 1, category: "ENTRADAS", area: "Platos fríos" }],
    status: "preparing", time: "10 min", priority: "urgent",
  },
  {
    id: "k2", table: 6,
    items: [{ name: "Hamburguesa Clásica", qty: 2, category: "P.FUERTE", area: "Zona de cocción" }, { name: "Papas Fritas", qty: 2, category: "ENTRADAS", area: "Zona de cocción" }],
    status: "pending", time: "15 min", priority: "normal",
  },
  {
    id: "k3", table: 2,
    items: [{ name: "Enchiladas Verdes", qty: 2, category: "P.FUERTE", area: "Zona de cocción" }],
    status: "pending", time: "20 min", priority: "normal",
  },
  {
    id: "k4", table: 3,
    items: [{ name: "Agua de Jamaica", qty: 2, category: "BEBIDAS", area: "Bebidas" }],
    status: "ready", time: "0 min", priority: "normal",
  },
]

export function KitchenPage() {
  const user = useAuthStore((s) => s.user)
  const [activeArea, setActiveArea] = useState("Zona de cocción")
  const [kitchenAreas, setKitchenAreas] = useState<KitchenArea[]>(defaultKitchenAreas)
  const [showAreaModal, setShowAreaModal] = useState(false)
  const [areaForm, setAreaForm] = useState({ name: "", description: "" })
  const areaNames = kitchenAreas.map((a) => a.name)

  const name = user?.name ?? "Administrador"
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const filteredOrders = kitchenOrders.filter((o) => o.items.some((i) => i.area === activeArea))
  const pending = filteredOrders.filter((o) => o.status === "pending")
  const preparing = filteredOrders.filter((o) => o.status === "preparing")
  const ready = filteredOrders.filter((o) => o.status === "ready")

  return (
    <div className="space-y-4">
      <HeroMesero nombre={name} initials={initials} />

      <div className="px-4 space-y-4">
        <div className="overflow-x-auto scrollbar-none">
          <div className="flex gap-2 min-w-max pb-1">
            <button
              onClick={() => setShowAreaModal(true)}
              className="px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 border border-dashed border-neutral-300"
            >
              <PlusCircle size={16} className="inline mr-1" />
              Área
            </button>
            {kitchenAreas.map((area) => (
              <button
                key={area.name}
                onClick={() => setActiveArea(area.name)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  activeArea === area.name
                    ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/20"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-800"
                }`}
              >
                {area.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
        <MetricCard title="Pendientes" value={pending.length} icon={<Clock size={20} />} />
        <MetricCard title="Preparando" value={preparing.length} icon={<ChefHat size={20} />} />
        <MetricCard title="Listos" value={ready.length} icon={<ChefHat size={20} />} />
      </div>

      {ready.length > 0 && (
        <div>
          <h2 className="mb-3 text-base font-semibold text-emerald-600">{activeArea} — Listos para Servir</h2>
          <div className="space-y-2">
            {ready.map((order) => (
              <Card key={order.id} className="border-emerald-200 bg-emerald-50/50">
                <CardContent className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-neutral-900">Mesa {order.table}</span>
                    <p className="text-xs text-neutral-500">{order.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}</p>
                  </div>
                  <Badge variant="success">Listo</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {preparing.length > 0 && (
        <div>
          <h2 className="mb-3 text-base font-semibold text-amber-600">{activeArea} — En Preparación</h2>
          <div className="space-y-2">
            {preparing.map((order) => (
              <Card key={order.id} className="border-amber-200 bg-amber-50/50">
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-neutral-900">Mesa {order.table}</span>
                    <span className="text-xs text-amber-600 font-medium">{order.time}</span>
                  </div>
                  <p className="text-sm text-neutral-700 mb-2">{order.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}</p>
                  <Button className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white">Marcar como Listo</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-3 text-base font-semibold text-neutral-800">{activeArea} — Pendientes ({pending.length})</h2>
        <div className="space-y-2">
          {pending.map((order) => (
            <Card key={order.id}>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-neutral-900">Mesa {order.table}</span>
                  <span className="text-xs text-neutral-500">{order.time}</span>
                </div>
                <p className="text-sm text-neutral-700 mb-2">{order.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}</p>
                <Button className="w-full rounded-xl">Iniciar Preparación</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      </div>

      {/* Area modal */}
      {showAreaModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-semibold text-neutral-900 mb-4">Nueva área de cocina</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1 block">Nombre</label>
                <input
                  value={areaForm.name}
                  onChange={(e) => setAreaForm({ ...areaForm, name: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400 transition-colors"
                  placeholder="Ej: Postres"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1 block">Descripción</label>
                <input
                  value={areaForm.description}
                  onChange={(e) => setAreaForm({ ...areaForm, description: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400 transition-colors"
                  placeholder="Descripción del área"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => { setShowAreaModal(false); setAreaForm({ name: "", description: "" }) }}
                className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!areaForm.name.trim()) return
                  if (areaNames.includes(areaForm.name.trim())) return
                  setKitchenAreas((prev) => [...prev, { name: areaForm.name.trim(), description: areaForm.description.trim() }])
                  setAreaForm({ name: "", description: "" })
                  setShowAreaModal(false)
                }}
                className="flex-1 rounded-xl bg-neutral-900 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
