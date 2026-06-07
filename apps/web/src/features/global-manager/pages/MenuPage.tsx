import { useState } from "react"
import { Plus, Pencil, Trash2, PlusCircle } from "lucide-react"
import { HeroAdministrador } from "../components/Hero"
import { formatCurrency } from "@/core/utils"

interface Category {
  name: string
  description: string
}

const defaultCategories: Category[] = [
  { name: "MENU", description: "Platillos principales del menú" },
  { name: "ENTRADAS", description: "Aperitivos y entradas" },
  { name: "P.FUERTE", description: "Platos fuertes" },
  { name: "ENSALADAS", description: "Ensaladas frescas" },
  { name: "BAR", description: "Bebidas del bar" },
  { name: "BEBIDAS", description: "Bebidas sin alcohol" },
]

const kitchenAreas = ["Zona de cocción", "Platos fríos", "Bebidas"]

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  area: string
}

const initialItems: MenuItem[] = [
  { id: "m1", name: "Tacos al Pastor", description: "Tacos de cerdo marinado con piña", price: 45, category: "P.FUERTE", area: "Zona de cocción" },
  { id: "m2", name: "Guacamole", description: "Aguacate fresco con limón y cilantro", price: 65, category: "ENTRADAS", area: "Platos fríos" },
  { id: "m3", name: "Enchiladas Verdes", description: "Tortillas rellenas con salsa verde", price: 85, category: "P.FUERTE", area: "Zona de cocción" },
  { id: "m4", name: "Hamburguesa Clásica", description: "Carne angus con queso y papas", price: 120, category: "MENU", area: "Zona de cocción" },
  { id: "m5", name: "Ensalada César", description: "Lechuga, crutones y aderezo césar", price: 95, category: "ENSALADAS", area: "Platos fríos" },
  { id: "m6", name: "Agua de Jamaica", description: "Agua fresca de flor de jamaica", price: 25, category: "BEBIDAS", area: "Bebidas" },
  { id: "m7", name: "Coca-Cola", description: "Refresco de cola 355ml", price: 20, category: "BAR", area: "Bebidas" },
  { id: "m8", name: "Malteada de Vainilla", description: "Malteada cremosa de vainilla", price: 45, category: "BAR", area: "Bebidas" },
]

export function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("MENU")
  const [items, setItems] = useState<MenuItem[]>(initialItems)
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [showModal, setShowModal] = useState(false)
  const [showCatModal, setShowCatModal] = useState(false)
  const [editItem, setEditItem] = useState<MenuItem | null>(null)
  const [catForm, setCatForm] = useState({ name: "", description: "" })
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "MENU", area: "Zona de cocción" })


  const catNames = categories.map((c) => c.name)
  const filtered = activeCategory === "MENU" ? items : items.filter((i) => i.category === activeCategory)

  const openAdd = () => {
    setEditItem(null)
    setForm({ name: "", description: "", price: "", category: activeCategory, area: "Zona de cocción" })
    setShowModal(true)
  }

  const openEdit = (item: MenuItem) => {
    setEditItem(item)
    setForm({ name: item.name, description: item.description, price: String(item.price), category: item.category, area: item.area })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.name || !form.price) return
    const price = Number(form.price)
    if (editItem) {
      setItems((prev) =>
        prev.map((i) => (i.id === editItem.id ? { ...i, name: form.name, description: form.description, price, category: form.category, area: form.area } : i)),
      )
    } else {
      const newItem: MenuItem = {
        id: `m${Date.now()}`,
        name: form.name,
        description: form.description,
        price,
        category: form.category,
        area: form.area,
      }
      setItems((prev) => [...prev, newItem])
    }
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  return (
    <div className="space-y-4">
      <HeroAdministrador />

      <div className="px-4">
        <div className="overflow-x-auto scrollbar-none">
          <div className="flex gap-2 min-w-max pb-1">
            <button
              onClick={() => setShowCatModal(true)}
              className="px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 border border-dashed border-neutral-300"
            >
              <PlusCircle size={16} className="inline mr-1" />
              Categoría
            </button>
            {catNames.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/20"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-neutral-400">{filtered.length} platillos</p>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            <Plus size={16} />
            Agregar
          </button>
        </div>

        <div className="mt-3 space-y-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white border border-neutral-200 p-4 flex items-center justify-between shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-neutral-900">{item.name}</h4>
                <p className="text-xs text-neutral-400 truncate mt-0.5">{item.description}</p>
              </div>
              <div className="flex items-center gap-3 ml-3 shrink-0">
                <span className="text-sm font-bold text-neutral-800">{formatCurrency(item.price)}</span>
                <button onClick={() => openEdit(item)} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(item.id)} className="text-neutral-400 hover:text-rose-500 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-sm text-neutral-400">
              No hay platillos en esta categoría
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-semibold text-neutral-900 mb-4">
              {editItem ? "Editar platillo" : "Nuevo platillo"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1 block">Área de cocina</label>
                <select
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400 transition-colors"
                >
                  {kitchenAreas.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1 block">Categoría</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400 transition-colors"
                >
                  {catNames.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1 block">Nombre</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400 transition-colors"
                  placeholder="Nombre del platillo"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1 block">Descripción</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400 transition-colors"
                  placeholder="Descripción breve"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1 block">Precio</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400 transition-colors"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 rounded-xl bg-neutral-900 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
              >
                {editItem ? "Guardar" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-semibold text-neutral-900 mb-4">Nueva categoría</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1 block">Nombre</label>
                <input
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value.toUpperCase() })}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400 transition-colors"
                  placeholder="Ej: POSTRES"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1 block">Descripción</label>
                <input
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400 transition-colors"
                  placeholder="Descripción de la categoría"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => { setShowCatModal(false); setCatForm({ name: "", description: "" }) }}
                className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!catForm.name.trim()) return
                  if (catNames.includes(catForm.name.trim())) return
                  setCategories((prev) => [...prev, { name: catForm.name.trim(), description: catForm.description.trim() }])
                  setCatForm({ name: "", description: "" })
                  setShowCatModal(false)
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
