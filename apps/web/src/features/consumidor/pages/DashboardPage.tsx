import { Card, CardContent } from "@/shared/ui/Card"
import { formatCurrency } from "@/core/utils"
import { ShoppingBag, Clock } from "lucide-react"

const mockMenuItems = [
  { id: "m1", name: "Tacos al Pastor", description: "Tacos de cerdo con piña", price: 45, category: "Platillos" },
  { id: "m2", name: "Guacamole", description: "Aguacate fresco con especias", price: 65, category: "Entradas" },
  { id: "m3", name: "Enchiladas Verdes", description: "Tortillas rellenas con salsa verde", price: 85, category: "Platillos" },
  { id: "m4", name: "Hamburguesa Clásica", description: "Carne angus con queso y vegetales", price: 120, category: "Platillos" },
  { id: "m5", name: "Agua de Jamaica", description: "Agua fresca de flor de Jamaica", price: 25, category: "Bebidas" },
  { id: "m6", name: "Malteada de Vainilla", description: "Malteada cremosa de vainilla", price: 45, category: "Bebidas" },
]

export function ConsumidorDashboardPage() {
  const categories = [...new Set(mockMenuItems.map((i) => i.category))]

  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Bienvenido</h1>
        <p className="text-sm text-neutral-500">Mesa 4 · Cliente</p>
      </div>

      <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white border-0">
        <CardContent className="py-4">
          <p className="text-xs text-neutral-400">Tiempo estimado</p>
          <div className="flex items-center gap-2 mt-1">
            <Clock size={18} className="text-amber-400" />
            <span className="text-lg font-bold">25-35 min</span>
          </div>
          <p className="text-xs text-neutral-400 mt-2">Tu orden #104 está en preparación</p>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-base font-semibold text-neutral-800">Menú Destacado</h2>
        {categories.map((cat) => (
          <div key={cat} className="mb-4">
            <h3 className="text-sm font-medium text-neutral-500 mb-2">{cat}</h3>
            <div className="space-y-2">
              {mockMenuItems
                .filter((i) => i.category === cat)
                .map((item) => (
                  <Card key={item.id} hover>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-neutral-800">{item.name}</p>
                        <p className="text-xs text-neutral-500">{item.description}</p>
                        <p className="text-sm font-bold text-neutral-900 mt-1">{formatCurrency(item.price)}</p>
                      </div>
                      <button className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">
                        <ShoppingBag size={16} />
                      </button>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
