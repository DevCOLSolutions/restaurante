import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, Pencil, Trash2, PlusCircle, X, Eye, EyeOff, Flame, Package, Settings2 } from "lucide-react"
import { formatCurrency } from "@/core/utils"
import { useSucursalStore } from "../store/sucursalStore"
import { useAreasCocina, type AreaCocinaItem } from "../hooks/useAreasCocina"
import { useCreateAreaCocina } from "../hooks/useCreateAreaCocina"
import { useUpdateAreaCocina } from "../hooks/useUpdateAreaCocina"
import { useDeleteAreaCocina } from "../hooks/useDeleteAreaCocina"
import { useDesactivarAreaCocina } from "../hooks/useDesactivarAreaCocina"
import { useMenuCategorias } from "../hooks/useMenuCategorias"
import { useCreateMenuCategoria } from "../hooks/useCreateMenuCategoria"
import { useUpdateMenuCategoria } from "../hooks/useUpdateMenuCategoria"
import { useDeleteMenuCategoria } from "../hooks/useDeleteMenuCategoria"
import { useMenuItems } from "../hooks/useMenuItems"
import { useCreateMenuItem } from "../hooks/useCreateMenuItem"
import { useUpdateMenuItem } from "../hooks/useUpdateMenuItem"
import { useToggleItemEstado } from "../hooks/useToggleItemEstado"
import { useMe } from "@/hooks/useMe"
import { NotificationBell } from "@/features/mesero/components/NotificationBell"
import type { MenuCategoria, MenuProducto } from "@/types/api"

interface ItemForm {
  categoriaId: string
  areaRecepcionId: string
  nombre: string
  descripcion: string
  precio: string
  costo: string
  impuestoPct: string
  disponible: boolean
  esModificable: boolean
  tiempoPrepMin: string
  calorias: string
  etiquetas: string
  orden: string
}

interface CatForm {
  nombre: string
  descripcion: string
  orden: string
}

const emptyItemForm = (categoriaId: string, areaId: string): ItemForm => ({
  categoriaId,
  areaRecepcionId: areaId,
  nombre: "",
  descripcion: "",
  precio: "",
  costo: "",
  impuestoPct: "0",
  disponible: true,
  esModificable: true,
  tiempoPrepMin: "0",
  calorias: "0",
  etiquetas: "",
  orden: "0",
})

export function MenuPage() {
  const navigate = useNavigate()
  const { data: user } = useMe()
  const sucursales = useSucursalStore((s) => s.sucursales)
  const hydrate = useSucursalStore((s) => s._hydrate)
  useEffect(() => { if (sucursales.length === 0) hydrate() }, [sucursales.length, hydrate])

  const { data: apiAreas = [], isLoading: isAreasLoading } = useAreasCocina()
  const { data: categorias = [], isLoading: isCatLoading } = useMenuCategorias()
  const [selectedCatId, setSelectedCatId] = useState("")
  const [activeArea, setActiveArea] = useState<string | null>(null)

  const { data: items = [], isLoading: isItemsLoading } = useMenuItems({
    categoriaId: selectedCatId || undefined,
    activo: undefined,
    disponible: undefined,
  })

  const createCat = useCreateMenuCategoria()
  const updateCat = useUpdateMenuCategoria()
  const deleteCat = useDeleteMenuCategoria()
  const createItem = useCreateMenuItem()
  const updateItem = useUpdateMenuItem()
  const toggleEstado = useToggleItemEstado()
  const createArea = useCreateAreaCocina()
  const updateArea = useUpdateAreaCocina()
  const deleteArea = useDeleteAreaCocina()
  const desactivarArea = useDesactivarAreaCocina()

  const selectedCategoria = categorias.find((c) => c.id === selectedCatId)
  const selectedCatNombre = selectedCategoria?.nombre ?? ""

  useEffect(() => {
    if (categorias.length > 0 && !selectedCatId) {
      setSelectedCatId(categorias[0].id) // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [categorias, selectedCatId])

  const filteredItems = activeArea
    ? items.filter((i) => i.areaRecepcionNombre === activeArea)
    : items

  const [showItemModal, setShowItemModal] = useState(false)
  const [editItemId, setEditItemId] = useState<string | null>(null)
  const [itemForm, setItemForm] = useState<ItemForm>(emptyItemForm("", ""))

  const [showCatModal, setShowCatModal] = useState(false)
  const [catForm, setCatForm] = useState<CatForm>({ nombre: "", descripcion: "", orden: "0" })
  const [editingCatId, setEditingCatId] = useState<string | null>(null)
  const [editCatForm, setEditCatForm] = useState<CatForm>({ nombre: "", descripcion: "", orden: "0" })

  const [showAreaModal, setShowAreaModal] = useState(false)
  const [areaForm, setAreaForm] = useState({ nombre: "", descripcion: "" })
  const [editingAreaId, setEditingAreaId] = useState<string | null>(null)
  const [editAreaForm, setEditAreaForm] = useState({ nombre: "", descripcion: "" })

  const [submitting, setSubmitting] = useState(false)

  const firstAreaId = apiAreas.length > 0 ? apiAreas[0].id : ""

  const openAddItem = () => {
    setEditItemId(null)
    setItemForm(emptyItemForm(selectedCatId, firstAreaId))
    setShowItemModal(true)
  }

  const openEditItem = (item: MenuProducto) => {
    setEditItemId(item.id)
    setItemForm({
      categoriaId: item.categoriaId,
      areaRecepcionId: item.areaRecepcionId ?? "",
      nombre: item.nombre,
      descripcion: item.descripcion ?? "",
      precio: String(item.precio),
      costo: String(item.costo),
      impuestoPct: String(item.impuestoPct),
      disponible: item.disponible,
      esModificable: item.esModificable,
      tiempoPrepMin: String(item.tiempoPrepMin),
      calorias: String(item.calorias),
      etiquetas: item.etiquetas.join(", "),
      orden: String(item.orden),
    })
    setShowItemModal(true)
  }

  const handleSaveItem = async () => {
    if (!itemForm.nombre || !itemForm.precio) return
    setSubmitting(true)
    try {
      const payload = {
        categoriaId: itemForm.categoriaId,
        areaRecepcionId: itemForm.areaRecepcionId,
        nombre: itemForm.nombre,
        descripcion: itemForm.descripcion || null,
        precio: Number(itemForm.precio),
        costo: Number(itemForm.costo) || 0,
        impuestoPct: Number(itemForm.impuestoPct) || 0,
        disponible: itemForm.disponible,
        esModificable: itemForm.esModificable,
        tiempoPrepMin: Number(itemForm.tiempoPrepMin) || 0,
        calorias: Number(itemForm.calorias) || 0,
        etiquetas: itemForm.etiquetas.split(",").map((e) => e.trim()).filter(Boolean),
        orden: Number(itemForm.orden) || 0,
      }
      if (editItemId) {
        await updateItem.mutateAsync({ id: editItemId, ...payload })
      } else {
        await createItem.mutateAsync(payload)
      }
      setShowItemModal(false)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm("¿Eliminar este platillo?")) return
    try {
      await toggleEstado.mutateAsync({ id, activo: false })
    } catch {
      // silent
    }
  }

  const handleToggleDisponible = async (item: MenuProducto) => {
    try {
      await updateItem.mutateAsync({
        id: item.id,
        categoriaId: item.categoriaId,
        areaRecepcionId: item.areaRecepcionId,
        nombre: item.nombre,
        descripcion: item.descripcion,
        precio: item.precio,
        costo: item.costo,
        impuestoPct: item.impuestoPct,
        disponible: !item.disponible,
        esModificable: item.esModificable,
        tiempoPrepMin: item.tiempoPrepMin,
        calorias: item.calorias,
        etiquetas: item.etiquetas,
        orden: item.orden,
      })
    } catch {
      // silent
    }
  }

  const handleAddCat = async () => {
    if (!catForm.nombre.trim()) return
    setSubmitting(true)
    try {
      await createCat.mutateAsync({
        nombre: catForm.nombre.trim(),
        descripcion: catForm.descripcion.trim() || null,
        orden: Number(catForm.orden) || 0,
      })
      setCatForm({ nombre: "", descripcion: "", orden: "0" })
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateCat = async (cat: MenuCategoria) => {
    if (!editCatForm.nombre.trim()) return
    setSubmitting(true)
    try {
      await updateCat.mutateAsync({
        id: cat.id,
        nombre: editCatForm.nombre.trim() || null,
        descripcion: editCatForm.descripcion.trim() || null,
        orden: Number(editCatForm.orden) || 0,
        activa: null,
      })
      setEditingCatId(null)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteCat = async (cat: MenuCategoria) => {
    const count = items.filter((i) => i.categoriaId === cat.id).length
    if (count > 0 && !confirm(`¿Eliminar "${cat.nombre}"? ${count} platillo(s) perderán la categoría.`)) return
    if (!confirm(`¿Eliminar categoría "${cat.nombre}"?`)) return
    try {
      await deleteCat.mutateAsync(cat.id)
      if (selectedCatId === cat.id) {
        const remaining = categorias.filter((c) => c.id !== cat.id)
        setSelectedCatId(remaining[0]?.id ?? "")
      }
    } catch {
      // silent
    }
  }

  const handleAddArea = async () => {
    if (!areaForm.nombre.trim()) return
    setSubmitting(true)
    try {
      await createArea.mutateAsync({
        nombre: areaForm.nombre.trim(),
        descripcion: areaForm.descripcion.trim() || null,
      })
      setAreaForm({ nombre: "", descripcion: "" })
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateArea = async (area: AreaCocinaItem) => {
    if (!editAreaForm.nombre.trim()) return
    setSubmitting(true)
    try {
      await updateArea.mutateAsync({
        id: area.id,
        nombre: editAreaForm.nombre.trim() || null,
        descripcion: editAreaForm.descripcion.trim() || null,
        activa: null,
      })
      setEditingAreaId(null)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteArea = async (area: AreaCocinaItem) => {
    if (!confirm(`¿Eliminar área de cocina "${area.nombre}"?`)) return
    try {
      await deleteArea.mutateAsync(area.id)
    } catch {
      // silent
    }
  }

  const handleDesactivarArea = async (area: AreaCocinaItem) => {
    try {
      await desactivarArea.mutateAsync(area.id)
    } catch {
      // silent
    }
  }

  const isLoading = isCatLoading || (categorias.length > 0 && isItemsLoading) || isAreasLoading
  const isEmpty = !isLoading && categorias.length === 0

  return (
    <div className="min-h-screen bg-neutral-50 pb-12">
      <div className="bg-neutral-900 px-5 pt-5 pb-8 rounded-b-4xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => navigate("/app/global-manager")} className="text-white/70 hover:text-white shrink-0">
              <ArrowLeft size={24} />
            </button>
            <div className="leading-none min-w-0">
              <h1 className="text-2xl font-medium text-white tracking-tight truncate">Menú</h1>
              <span className="text-sm text-white/70 mr-2 leading-none">{user?.data?.restauranteNombre}</span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <NotificationBell />
          </div>
        </div>
      </div>

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
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  selectedCatId === cat.id
                    ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/20"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-800"
                }`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 overflow-x-auto scrolling-touch scrollbar-thin pb-0.5">
          <div className="flex gap-2 min-w-max pb-1">
            <button
              onClick={() => setShowAreaModal(true)}
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
            {apiAreas.filter((a) => a.activa).map((a) => (
              <button
                key={a.id}
                onClick={() => setActiveArea(a.nombre)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeArea === a.nombre
                    ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/20"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-800"
                }`}
              >
                {a.nombre}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-neutral-400">
            {filteredItems.length} platillo{filteredItems.length !== 1 ? "s" : ""}
            {selectedCatNombre && <> en <span className="font-medium">{selectedCatNombre}</span></>}
          </p>
          <button
            onClick={openAddItem}
            disabled={!selectedCatId}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            Agregar
          </button>
        </div>

        <div className="mt-3 space-y-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="size-8 rounded-full border-2 border-neutral-200 border-t-neutral-900 animate-spin" />
              <p className="text-sm text-neutral-400">Cargando menú...</p>
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center py-16 gap-1">
              <p className="text-sm font-medium text-neutral-500">No hay categorías de menú</p>
              <p className="text-xs text-neutral-400">Agrega una categoría para empezar</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-1">
              <p className="text-sm font-medium text-neutral-500">No hay platillos</p>
              <p className="text-xs text-neutral-400">Agrega platillos a esta categoría</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border p-4 shadow-sm transition-all ${
                  item.activo ? "bg-white border-neutral-200" : "bg-neutral-100 border-neutral-200/60 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-neutral-900">{item.nombre}</h4>
                      {!item.activo && (
                        <span className="text-[10px] font-medium text-neutral-400 bg-neutral-200 px-1.5 py-0.5 rounded">
                          INACTIVO
                        </span>
                      )}
                    </div>
                    {item.descripcion && (
                      <p className="text-xs text-neutral-400 truncate mt-0.5">{item.descripcion}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-neutral-800">{formatCurrency(item.precio)}</p>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item.areaRecepcionNombre && (
                    <span className="text-[10px] font-medium bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                      <Package size={10} className="inline mr-0.5" />
                      {item.areaRecepcionNombre}
                    </span>
                  )}
                  {item.calorias > 0 && (
                    <span className="text-[10px] font-medium bg-red-50 text-red-500 px-2 py-0.5 rounded-full">
                      <Flame size={10} className="inline mr-0.5" />
                      {item.calorias} cal
                    </span>
                  )}
                  {item.costo > 0 && (
                    <span className="text-[10px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                      Costo: {formatCurrency(item.costo)}
                    </span>
                  )}
                  {item.impuestoPct > 0 && (
                    <span className="text-[10px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                      Imp: {item.impuestoPct}%
                    </span>
                  )}
                  {item.tiempoPrepMin > 0 && (
                    <span className="text-[10px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                      {item.tiempoPrepMin} min
                    </span>
                  )}
                  {item.etiquetas.length > 0 && item.etiquetas.map((et) => (
                    <span key={et} className="text-[10px] font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                      #{et}
                    </span>
                  ))}
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                    {item.esModificable && <span>Modificable</span>}
                    <span className={`font-medium ${item.disponible ? "text-emerald-600" : "text-amber-600"}`}>
                      {item.disponible ? "Disponible" : "No disponible"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleDisponible(item)}
                      className="rounded-lg p-1.5 text-neutral-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
                      title={item.disponible ? "Marcar no disponible" : "Marcar disponible"}
                    >
                      {item.disponible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                      onClick={() => openEditItem(item)}
                      className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="rounded-lg p-1.5 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Item modal */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="w-full sm:max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-white p-5 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-neutral-900">
                {editItemId ? "Editar platillo" : "Nuevo platillo"}
              </h3>
              <button onClick={() => setShowItemModal(false)}><X size={18} className="text-neutral-400" /></button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-500 mb-1 block">Categoría</label>
                  <select
                    value={itemForm.categoriaId}
                    onChange={(e) => setItemForm({ ...itemForm, categoriaId: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                  >
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-500 mb-1 block">Área de cocina</label>
                  <select
                    value={itemForm.areaRecepcionId}
                    onChange={(e) => setItemForm({ ...itemForm, areaRecepcionId: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                  >
                    <option value="">Sin área</option>
                    {apiAreas.map((a) => (
                      <option key={a.id} value={a.id}>{a.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1 block">Nombre</label>
                <input
                  value={itemForm.nombre}
                  onChange={(e) => setItemForm({ ...itemForm, nombre: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                  placeholder="Nombre del platillo"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1 block">Descripción</label>
                <input
                  value={itemForm.descripcion}
                  onChange={(e) => setItemForm({ ...itemForm, descripcion: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                  placeholder="Descripción breve"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-500 mb-1 block">Precio</label>
                  <input
                    type="number"
                    step="0.01"
                    value={itemForm.precio}
                    onChange={(e) => setItemForm({ ...itemForm, precio: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-500 mb-1 block">Costo</label>
                  <input
                    type="number"
                    step="0.01"
                    value={itemForm.costo}
                    onChange={(e) => setItemForm({ ...itemForm, costo: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-500 mb-1 block">Impuesto %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={itemForm.impuestoPct}
                    onChange={(e) => setItemForm({ ...itemForm, impuestoPct: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-500 mb-1 block">Tiempo prep (min)</label>
                  <input
                    type="number"
                    value={itemForm.tiempoPrepMin}
                    onChange={(e) => setItemForm({ ...itemForm, tiempoPrepMin: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-500 mb-1 block">Calorías</label>
                  <input
                    type="number"
                    value={itemForm.calorias}
                    onChange={(e) => setItemForm({ ...itemForm, calorias: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1 block">Etiquetas (separadas por coma)</label>
                <input
                  value={itemForm.etiquetas}
                  onChange={(e) => setItemForm({ ...itemForm, etiquetas: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                  placeholder="ej: vegano, sin gluten"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    checked={itemForm.disponible}
                    onChange={(e) => setItemForm({ ...itemForm, disponible: e.target.checked })}
                    className="rounded border-neutral-300"
                  />
                  Disponible
                </label>
                <label className="flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    checked={itemForm.esModificable}
                    onChange={(e) => setItemForm({ ...itemForm, esModificable: e.target.checked })}
                    className="rounded border-neutral-300"
                  />
                  Modificable
                </label>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowItemModal(false)}
                className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveItem}
                disabled={submitting || !itemForm.nombre || !itemForm.precio}
                className="flex-1 rounded-xl bg-neutral-900 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors disabled:opacity-40"
              >
                {submitting ? "Guardando..." : editItemId ? "Guardar" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kitchen area management modal */}
      {showAreaModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="w-full sm:max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-white p-5 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-neutral-900">Gestionar áreas de cocina</h3>
              <button onClick={() => { setShowAreaModal(false); setEditingAreaId(null) }}><X size={18} className="text-neutral-400" /></button>
            </div>

            <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4 mb-4">
              <p className="text-xs font-semibold text-neutral-700 mb-3">Agregar nueva área</p>
              <div className="space-y-2">
                <input
                  value={areaForm.nombre}
                  onChange={(e) => setAreaForm({ ...areaForm, nombre: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-neutral-400"
                  placeholder="Nombre del área"
                />
                <input
                  value={areaForm.descripcion}
                  onChange={(e) => setAreaForm({ ...areaForm, descripcion: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-neutral-400"
                  placeholder="Descripción"
                />
              </div>
              <button
                onClick={handleAddArea}
                disabled={submitting || !areaForm.nombre.trim()}
                className="w-full rounded-xl bg-neutral-900 text-white py-2.5 text-xs font-medium hover:bg-neutral-800 transition-colors mt-3 disabled:opacity-40"
              >
                <Plus size={14} className="inline mr-1" /> Agregar
              </button>
            </div>

            <div className="space-y-2">
              {apiAreas.map((area) => (
                <div key={area.id} className="rounded-2xl bg-white border border-neutral-200 p-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    {editingAreaId === area.id ? (
                      <div className="space-y-1.5">
                        <input
                          value={editAreaForm.nombre}
                          onChange={(e) => setEditAreaForm({ ...editAreaForm, nombre: e.target.value })}
                          className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-2 py-1 text-sm font-semibold outline-none focus:border-neutral-400"
                          placeholder="Nombre"
                        />
                        <input
                          value={editAreaForm.descripcion}
                          onChange={(e) => setEditAreaForm({ ...editAreaForm, descripcion: e.target.value })}
                          className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-2 py-1 text-xs outline-none focus:border-neutral-400"
                          placeholder="Descripción"
                        />
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-neutral-900">
                          {area.nombre}
                          {!area.activa && <span className="text-[10px] text-neutral-400 ml-2">INACTIVA</span>}
                        </p>
                        <p className="text-xs text-neutral-500">{area.descripcion ?? "Sin descripción"}</p>
                      </>
                    )}
                  </div>
                  {editingAreaId === area.id ? (
                    <button
                      onClick={() => handleUpdateArea(area)}
                      disabled={submitting}
                      className="text-xs font-medium text-emerald-600 hover:text-emerald-700 shrink-0"
                    >
                      Guardar
                    </button>
                  ) : (
                    <button
                      onClick={() => { setEditingAreaId(area.id); setEditAreaForm({ nombre: area.nombre, descripcion: area.descripcion ?? "" }) }}
                      className="text-xs font-medium text-neutral-400 hover:text-neutral-600 shrink-0"
                    >
                      Editar
                    </button>
                  )}
                  {area.activa ? (
                    <button
                      onClick={() => handleDesactivarArea(area)}
                      className="shrink-0 rounded-lg p-1.5 text-amber-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                      title="Desactivar"
                    >
                      <EyeOff size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDeleteArea(area)}
                      className="shrink-0 rounded-lg p-1.5 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              {apiAreas.length === 0 && (
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
              <button onClick={() => { setShowCatModal(false); setEditingCatId(null) }}><X size={18} className="text-neutral-400" /></button>
            </div>

            <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4 mb-4">
              <p className="text-xs font-semibold text-neutral-700 mb-3">Agregar nueva categoría</p>
              <div className="space-y-2">
                <input
                  value={catForm.nombre}
                  onChange={(e) => setCatForm({ ...catForm, nombre: e.target.value.toUpperCase() })}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-neutral-400"
                  placeholder="Nombre de la categoría"
                />
                <input
                  value={catForm.descripcion}
                  onChange={(e) => setCatForm({ ...catForm, descripcion: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-neutral-400"
                  placeholder="Descripción"
                />
              </div>
              <button
                onClick={handleAddCat}
                disabled={submitting || !catForm.nombre.trim()}
                className="w-full rounded-xl bg-neutral-900 text-white py-2.5 text-xs font-medium hover:bg-neutral-800 transition-colors mt-3 disabled:opacity-40"
              >
                <Plus size={14} className="inline mr-1" /> Agregar
              </button>
            </div>

            <div className="space-y-2">
              {categorias.map((cat) => {
                const count = items.filter((i) => i.categoriaId === cat.id).length
                return (
                  <div key={cat.id} className="rounded-2xl bg-white border border-neutral-200 p-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      {editingCatId === cat.id ? (
                        <div className="space-y-1.5">
                          <input
                            value={editCatForm.nombre}
                            onChange={(e) => setEditCatForm({ ...editCatForm, nombre: e.target.value.toUpperCase() })}
                            className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-2 py-1 text-sm font-semibold outline-none focus:border-neutral-400"
                            placeholder="Nombre"
                          />
                          <input
                            value={editCatForm.descripcion}
                            onChange={(e) => setEditCatForm({ ...editCatForm, descripcion: e.target.value })}
                            className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-2 py-1 text-xs outline-none focus:border-neutral-400"
                            placeholder="Descripción"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-neutral-900">
                            {cat.nombre}
                            {!cat.activa && <span className="text-[10px] text-neutral-400 ml-2">INACTIVA</span>}
                          </p>
                          <p className="text-xs text-neutral-500">{cat.descripcion} · {count} platillos</p>
                        </>
                      )}
                    </div>
                    {editingCatId === cat.id ? (
                      <button
                        onClick={() => handleUpdateCat(cat)}
                        disabled={submitting}
                        className="text-xs font-medium text-emerald-600 hover:text-emerald-700 shrink-0"
                      >
                        Guardar
                      </button>
                    ) : (
                      <button
                        onClick={() => { setEditingCatId(cat.id); setEditCatForm({ nombre: cat.nombre, descripcion: cat.descripcion ?? "", orden: String(cat.orden) }) }}
                        className="text-xs font-medium text-neutral-400 hover:text-neutral-600 shrink-0"
                      >
                        Editar
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteCat(cat)}
                      className="shrink-0 rounded-lg p-1.5 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )
              })}
              {categorias.length === 0 && (
                <p className="text-center text-xs text-neutral-400 py-6">No hay categorías registradas</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
