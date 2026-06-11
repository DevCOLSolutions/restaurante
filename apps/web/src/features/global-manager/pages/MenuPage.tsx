import { useState, useEffect, useMemo } from "react"
import { Plus, Pencil, Trash2, PlusCircle, Settings2, X } from "lucide-react"
import { HeroAdministrador } from "../components/Hero"
import { formatCurrency } from "@/core/utils"
import { useSucursalStore } from "../store/sucursalStore"

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

const DEFAULT_AREA = "Cocina caliente"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  area: string
}

const initialItems: MenuItem[] = [
  { id: "m1", name: "Tacos al Pastor", description: "Tacos de cerdo marinado con piña", price: 45, category: "P.FUERTE", area: "Cocina caliente" },
  { id: "m2", name: "Guacamole", description: "Aguacate fresco con limón y cilantro", price: 65, category: "ENTRADAS", area: "Cocina fría" },
  { id: "m3", name: "Enchiladas Verdes", description: "Tortillas rellenas con salsa verde", price: 85, category: "P.FUERTE", area: "Cocina caliente" },
  { id: "m4", name: "Hamburguesa Clásica", description: "Carne angus con queso y papas", price: 120, category: "MENU", area: "Cocina general" },
  { id: "m5", name: "Ensalada César", description: "Lechuga, crutones y aderezo césar", price: 95, category: "ENSALADAS", area: "Cocina fría" },
  { id: "m6", name: "Agua de Jamaica", description: "Agua fresca de flor de jamaica", price: 25, category: "BEBIDAS", area: "Bar" },
  { id: "m7", name: "Coca-Cola", description: "Refresco de cola 355ml", price: 20, category: "BAR", area: "Bar" },
  { id: "m8", name: "Malteada de Vainilla", description: "Malteada cremosa de vainilla", price: 45, category: "BAR", area: "Cocktails" },
]

export function MenuPage() {
  const sucursales = useSucursalStore((s) => s.sucursales)
  const hydrate = useSucursalStore((s) => s._hydrate)

  useEffect(() => { if (sucursales.length === 0) hydrate() }, [sucursales.length, hydrate])

  const allAreas = useMemo(() => {
    const seen = new Set<string>()
    const areas: { name: string; description: string }[] = []
    for (const suc of sucursales) {
      for (const area of suc.kitchenAreas) {
        if (!seen.has(area.name)) { seen.add(area.name); areas.push(area) }
      }
    }
    return areas
  }, [sucursales])

  const addKitchenArea = useSucursalStore((s) => s.addKitchenArea)
  const updateKitchenArea = useSucursalStore((s) => s.updateKitchenArea)
  const removeKitchenArea = useSucursalStore((s) => s.removeKitchenArea)

  const [activeCategory, setActiveCategory] = useState("MENU")
  const [activeArea, setActiveArea] = useState<string | null>(null)
  const [items, setItems] = useState<MenuItem[]>(initialItems)
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [showModal, setShowModal] = useState(false)
  const [showCatModal, setShowCatModal] = useState(false)
  const [editItem, setEditItem] = useState<MenuItem | null>(null)
  const [catForm, setCatForm] = useState({ name: "", description: "" })
  const [catEditing, setCatEditing] = useState<string | null>(null)
  const [catEditName, setCatEditName] = useState("")
  const [catEditDesc, setCatEditDesc] = useState("")
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "MENU", area: DEFAULT_AREA })
  const [showKAModal, setShowKAModal] = useState(false)
  const [kaNewName, setKaNewName] = useState("")
  const [kaNewDesc, setKaNewDesc] = useState("")
  const [kaEditing, setKaEditing] = useState<string | null>(null)
  const [kaEditName, setKaEditName] = useState("")
  const [kaEditDesc, setKaEditDesc] = useState("")


  const catNames = categories.map((c) => c.name)
  const filtered = items.filter((i) => {
    if (activeCategory !== "MENU" && i.category !== activeCategory) return false
    if (activeArea !== null && i.area !== activeArea) return false
    return true
  })

  const openAdd = () => {
    setEditItem(null)
    setForm({ name: "", description: "", price: "", category: activeCategory, area: allAreas.length > 0 ? allAreas[0].name : DEFAULT_AREA })
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
        <div className="overflow-x-auto scrolling-touch scrollbar-thin pb-0.5">
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

        <div className="mt-3 overflow-x-auto scrolling-touch scrollbar-thin pb-0.5">
          <div className="flex gap-2 min-w-max pb-1">
            <button
              onClick={() => setShowKAModal(true)}
              className="px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 border border-dashed border-neutral-300 transition-all"
            >
              <Settings2 size={14} className="inline mr-1" />
              Gestionar
            </button>
            <button
              onClick={() => setActiveArea(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeArea === null
                  ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/20"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-800"
              }`}
            >
              Todas
            </button>
            {allAreas.map((a) => (
              <button
                key={a.name}
                onClick={() => setActiveArea(a.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeArea === a.name
                    ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/20"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-800"
                }`}
                title={a.description}
              >
                {a.name}
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
                <span className="inline-block mt-1.5 text-[10px] font-medium bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">
                  {item.area}
                </span>
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
              No hay platillos con estos filtros
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
                  {allAreas.length === 0 && <option value={DEFAULT_AREA}>{DEFAULT_AREA}</option>}
                  {allAreas.map((a) => (
                    <option key={a.name} value={a.name} title={a.description}>{a.name}</option>
                  ))}
                </select>
                {form.area && allAreas.find((a) => a.name === form.area)?.description && (
                  <p className="text-[10px] text-neutral-400 mt-1">{allAreas.find((a) => a.name === form.area)?.description}</p>
                )}
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

      {/* Kitchen Area management modal */}
      {showKAModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="w-full sm:max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-white p-5 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-neutral-900">Gestionar áreas de cocina</h3>
              <button onClick={() => setShowKAModal(false)}><X size={18} className="text-neutral-400" /></button>
            </div>

            <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4 mb-4">
              <p className="text-xs font-semibold text-neutral-700 mb-3">Agregar nueva área</p>
              <div className="space-y-2">
                <input value={kaNewName} onChange={(e) => setKaNewName(e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-neutral-400" placeholder="Nombre del área" />
                <input value={kaNewDesc} onChange={(e) => setKaNewDesc(e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-neutral-400" placeholder="Descripción" />
              </div>
              <button onClick={() => {
                if (!kaNewName.trim()) return
                if (allAreas.some((a) => a.name === kaNewName.trim())) return
                sucursales.forEach((s) => addKitchenArea(s.id, { name: kaNewName.trim(), description: kaNewDesc.trim() }))
                setKaNewName("")
                setKaNewDesc("")
              }} className="w-full rounded-xl bg-neutral-900 text-white py-2.5 text-xs font-medium hover:bg-neutral-800 transition-colors mt-3">
                <Plus size={14} className="inline mr-1" /> Agregar
              </button>
            </div>

            <div className="space-y-2">
              {allAreas.map((area) => (
                <div key={area.name} className="rounded-2xl bg-white border border-neutral-200 p-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    {kaEditing === area.name ? (
                      <div className="space-y-1.5">
                        <input value={kaEditName} onChange={(e) => setKaEditName(e.target.value)} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-2 py-1 text-sm font-semibold outline-none focus:border-neutral-400" placeholder="Nombre" />
                        <input value={kaEditDesc} onChange={(e) => setKaEditDesc(e.target.value)} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-2 py-1 text-xs outline-none focus:border-neutral-400" placeholder="Descripción" />
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-neutral-900">{area.name}</p>
                        <p className="text-xs text-neutral-500">{area.description}</p>
                      </>
                    )}
                  </div>
                  {kaEditing === area.name ? (
                    <button onClick={() => {
                      if (kaEditName.trim() && kaEditName.trim() !== area.name && !allAreas.some((a) => a.name === kaEditName.trim())) {
                        const oldName = area.name
                        sucursales.forEach((s) => updateKitchenArea(s.id, oldName, { name: kaEditName.trim(), description: kaEditDesc.trim() || area.description }))
                        setItems((prev) => prev.map((i) => i.area === oldName ? { ...i, area: kaEditName.trim() } : i))
                      } else {
                        sucursales.forEach((s) => updateKitchenArea(s.id, area.name, { name: area.name, description: kaEditDesc.trim() || area.description }))
                      }
                      setKaEditing(null)
                    }} className="text-xs font-medium text-emerald-600 hover:text-emerald-700 shrink-0">Guardar</button>
                  ) : (
                    <button onClick={() => { setKaEditing(area.name); setKaEditName(area.name); setKaEditDesc(area.description) }} className="text-xs font-medium text-neutral-400 hover:text-neutral-600 shrink-0">Editar</button>
                  )}
                  <button onClick={() => {
                    sucursales.forEach((s) => removeKitchenArea(s.id, area.name))
                    setItems((prev) => prev.map((i) => i.area === area.name ? { ...i, area: DEFAULT_AREA } : i))
                  }} className="shrink-0 rounded-lg p-1.5 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {allAreas.length === 0 && (
                <p className="text-center text-xs text-neutral-400 py-6">No hay áreas de cocina registradas</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Category management modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="w-full sm:max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-white p-5 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-neutral-900">Gestionar categorías</h3>
              <button onClick={() => { setShowCatModal(false); setCatEditing(null); setCatForm({ name: "", description: "" }) }}><X size={18} className="text-neutral-400" /></button>
            </div>

            <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4 mb-4">
              <p className="text-xs font-semibold text-neutral-700 mb-3">Agregar nueva categoría</p>
              <div className="space-y-2">
                <input value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value.toUpperCase() })} className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-neutral-400" placeholder="Nombre de la categoría" />
                <input value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-neutral-400" placeholder="Descripción" />
              </div>
              <button onClick={() => {
                if (!catForm.name.trim()) return
                if (catNames.includes(catForm.name.trim())) return
                setCategories((prev) => [...prev, { name: catForm.name.trim(), description: catForm.description.trim() }])
                setCatForm({ name: "", description: "" })
              }} className="w-full rounded-xl bg-neutral-900 text-white py-2.5 text-xs font-medium hover:bg-neutral-800 transition-colors mt-3">
                <Plus size={14} className="inline mr-1" /> Agregar
              </button>
            </div>

            <div className="space-y-2">
              {categories.map((cat) => {
                const count = items.filter((i) => i.category === cat.name).length
                return (
                  <div key={cat.name} className="rounded-2xl bg-white border border-neutral-200 p-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      {catEditing === cat.name ? (
                        <div className="space-y-1.5">
                          <input value={catEditName} onChange={(e) => setCatEditName(e.target.value.toUpperCase())} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-2 py-1 text-sm font-semibold outline-none focus:border-neutral-400" placeholder="Nombre" />
                          <input value={catEditDesc} onChange={(e) => setCatEditDesc(e.target.value)} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-2 py-1 text-xs outline-none focus:border-neutral-400" placeholder="Descripción" />
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-neutral-900">{cat.name}</p>
                          <p className="text-xs text-neutral-500">{cat.description} · {count} platillos</p>
                        </>
                      )}
                    </div>
                    {catEditing === cat.name ? (
                      <button onClick={() => {
                        setCategories((prev) =>
                          prev.map((c) =>
                            c.name === cat.name
                              ? { name: catEditName.trim() || cat.name, description: catEditDesc.trim() || cat.description }
                              : c
                          )
                        )
                        if (catEditName.trim() && catEditName.trim() !== cat.name) {
                          setItems((prev) =>
                            prev.map((i) => (i.category === cat.name ? { ...i, category: catEditName.trim() } : i))
                          )
                        }
                        setCatEditing(null)
                      }} className="text-xs font-medium text-emerald-600 hover:text-emerald-700 shrink-0">Guardar</button>
                    ) : (
                      <button onClick={() => { setCatEditing(cat.name); setCatEditName(cat.name); setCatEditDesc(cat.description) }} className="text-xs font-medium text-neutral-400 hover:text-neutral-600 shrink-0">Editar</button>
                    )}
                    <button onClick={() => {
                      if (count > 0 && !confirm(`¿Eliminar categoría "${cat.name}"? ${count} platillo(s) perderán esta categoría.`)) return
                      setCategories((prev) => prev.filter((c) => c.name !== cat.name))
                      setItems((prev) => prev.map((i) => i.category === cat.name ? { ...i, category: catNames[0] } : i))
                      if (activeCategory === cat.name) setActiveCategory(catNames[0])
                    }} className="shrink-0 rounded-lg p-1.5 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
