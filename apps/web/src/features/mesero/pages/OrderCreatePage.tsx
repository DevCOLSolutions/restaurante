import { useState, useCallback, useEffect, useMemo, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Card } from "@/shared/ui/Card"
import { Input } from "@/shared/ui/Input"
import { Button } from "@workspace/ui/components/button"
import { ArrowLeft, ArrowUp, Plus, Minus, UtensilsCrossed, Search, MessageCircle, Check, Send, Bell } from "lucide-react"
import { formatCurrency } from "@/core/utils"
import { useCategorias } from "@/features/mesero/hooks/useCategorias"
import { useMenuItems } from "@/features/mesero/hooks/useMenuItems"
import { useCreateOrden } from "@/features/mesero/hooks/useCreateOrden"
import type { Mesa, MenuProducto } from "@/types/api"

type OrderItem = MenuProducto & { quantity: number; comment: string }

export function OrderCreatePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const st = location.state as { table?: number; people?: number; mesa?: Mesa } | null
  const mesa = st?.mesa
  const tableNumber = mesa?.numero ?? st?.table ?? 0
  const peopleCount = mesa?.capacidad ?? st?.people ?? 0
  const { data: categorias } = useCategorias()
  const { data: items } = useMenuItems()
  const createOrden = useCreateOrden()

  const [step, setStep] = useState<"pedido" | "ajustar" | "confirmar">("pedido")
  const [pedido, setPedido] = useState<OrderItem[]>([])
  const categoriasActivas = useMemo(() => (categorias ?? []).filter((c) => c.activa).sort((a, b) => a.orden - b.orden), [categorias])
  const itemsActivos = useMemo(() => (items ?? []).filter((i) => i.activo && i.disponible).sort((a, b) => a.orden - b.orden), [items])

  const [categoryTab, setCategoryTab] = useState("")
  const tabSetRef = useRef(false)
  useEffect(() => {
    if (!categoryTab && !tabSetRef.current && categoriasActivas.length > 0) {
      tabSetRef.current = true
      setCategoryTab(categoriasActivas[0].id)
    }
  }, [categoriasActivas, categoryTab])

  const [search, setSearch] = useState("")
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)
  const [notes, setNotes] = useState("")
  const [confirmSent, setConfirmSent] = useState(false)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [commentDraft, setCommentDraft] = useState("")

  const hasItems = pedido.length > 0

  const requestExit = useCallback((action: () => void) => {
    if (hasItems) {
      setShowExitDialog(true)
      setPendingAction(() => action)
    } else {
      action()
    }
  }, [hasItems])

  const handleBack = useCallback(() => {
    if (step === "ajustar") { setStep("pedido"); return }
    if (step === "confirmar") { setStep("ajustar"); return }
    requestExit(() => navigate(-1))
  }, [step, requestExit, navigate])

  useEffect(() => {
    if (confirmSent) {
      const timer = setTimeout(() => navigate("/app/mesero"), 2000)
      return () => clearTimeout(timer)
    }
  }, [confirmSent, navigate])

  const filtered = useMemo(() => {
    if (!categoryTab) return []
    return search
      ? itemsActivos.filter((i) => i.nombre.toLowerCase().includes(search.toLowerCase()))
      : itemsActivos.filter((i) => i.categoriaId === categoryTab)
  }, [itemsActivos, categoryTab, search])

  const addItem = (item: MenuProducto) => {
    setPedido((prev) => {
      const existing = prev.find((c) => c.id === item.id)
      if (existing) return prev.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c))
      return [...prev, { ...item, quantity: 1, comment: "" }]
    })
  }

  const removeItem = (id: string) => {
    setPedido((prev) => {
      const existing = prev.find((c) => c.id === id)
      if (existing && existing.quantity > 1) return prev.map((c) => (c.id === id ? { ...c, quantity: c.quantity - 1 } : c))
      return prev.filter((c) => c.id !== id)
    })
  }

  const setItemComment = (id: string, comment: string) => {
    setPedido((prev) => prev.map((c) => (c.id === id ? { ...c, comment } : c)))
  }

  const total = pedido.reduce((sum, item) => sum + item.precio * item.quantity, 0)

  if (confirmSent) {
    return (
      <div className="w-full pb-4">
        <div className="relative w-full bg-neutral-900 px-5 pt-5 pb-5 rounded-b-4xl overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400">
                <Check size={20} />
              </div>
              <div>
                <h1 className="text-xl font-medium text-white tracking-tight">Orden enviada</h1>
                <p className="text-xs text-white/50">Mesa {String(tableNumber).padStart(2, "0")}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 mt-12 text-center space-y-4" style={{ animation: "fadeSlideUp 0.5s ease-out" }}>
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500" style={{ animation: "bounceIn 0.6s ease-out 0.2s both" }}>
              <Check size={32} />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-neutral-900">¡En hora buena!</h2>
          <p className="text-neutral-500">La orden se ha enviado a cocina correctamente.</p>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-600 font-medium">
            <Bell size={14} />
            Notificación enviada a cocina
          </div>
        </div>
        <style>{`
          @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.3); } 50% { transform: scale(1.1); } 70% { transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
        `}</style>
      </div>
    )
  }

  return (
    <div className="w-full pb-4">
      {/* Hero */}
      <div className="relative w-full bg-neutral-900 px-5 pt-5 pb-5 rounded-b-4xl overflow-hidden">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={handleBack} className="text-white/70 hover:text-white">
            <ArrowLeft size={22} />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white">
              <UtensilsCrossed size={20} />
            </div>
            <div>
              <p className="text-xs text-white/50">{step === "pedido" ? "Nueva orden" : step === "ajustar" ? "Ajustar pedido" : "Confirmar"}</p>
              <h1 className="text-xl font-medium text-white tracking-tight leading-tight">
                Mesa {String(tableNumber).padStart(2, "0")}
              </h1>
            </div>
          </div>
          <span className="ml-auto text-xs text-white/40">{peopleCount} {peopleCount === 1 ? "persona" : "personas"}</span>
        </div>

        {/* Step indicator */}
        <div className="flex gap-2">
          {["pedido", "ajustar", "confirmar"].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-1.5 rounded-full transition-all ${step === s ? "w-6 bg-white" : s === "pedido" || s === "ajustar" ? "w-1.5 bg-white/30" : "w-1.5 bg-white/30"}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Step 1: Pedido */}
        {step === "pedido" && (
          <>
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-8 pr-3 text-sm rounded-xl border border-neutral-200 bg-neutral-50 outline-none focus:border-neutral-400 focus:bg-white"
              />
            </div>

            {!search && categoriasActivas.length > 0 && (
              <div className="flex gap-4 overflow-x-auto border-b border-neutral-200 pb-0">
                {categoriasActivas.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryTab(cat.id)}
                    className={`relative shrink-0 pb-2 text-sm font-medium whitespace-nowrap transition-colors ${
                      categoryTab === cat.id ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600"
                    }`}
                  >
                    {cat.nombre}
                    {categoryTab === cat.id && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-neutral-900" />
                    )}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-2">
              {filtered.map((item) => {
                const inPedido = pedido.find((c) => c.id === item.id)
                return (
                  <Card key={item.id} className="flex items-center justify-between px-4 py-3" hover>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{item.nombre}</p>
                      <p className="text-xs text-neutral-400">{item.categoriaNombre} · {formatCurrency(item.precio)}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {inPedido && (
                        <>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex items-center justify-center w-7 h-7 rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-bold text-neutral-900 w-6 text-center tabular-nums">{inPedido.quantity}</span>
                        </>
                      )}
                      <button
                        onClick={() => addItem(item)}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </Card>
                )
              })}
            </div>

            {pedido.length > 0 && (
              <Button className="w-full rounded-xl" onClick={() => setStep("ajustar")}>
                Continuar <ArrowLeft size={16} className="ml-2 rotate-180" />
              </Button>
            )}
          </>
        )}

        {/* Step 2: Ajustar */}
        {step === "ajustar" && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-neutral-800">Pedido · {pedido.length} {pedido.length === 1 ? "producto" : "productos"}</p>
              <span className="text-sm font-bold text-neutral-900">{formatCurrency(total)}</span>
            </div>

            <div className="space-y-2">
              {pedido.map((item) => (
                <Card key={item.id} className="px-4 py-3" hover>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-neutral-900">{item.nombre}</p>
                    <span className="text-xs text-neutral-500">{formatCurrency(item.precio * item.quantity)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeItem(item.id)} className="text-neutral-400 hover:text-neutral-600">
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-bold text-neutral-900 w-5 text-center tabular-nums">{item.quantity}</span>
                      <button onClick={() => addItem(item)} className="text-neutral-400 hover:text-neutral-600">
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      {item.comment && (
                        <span className="text-[10px] text-neutral-400 max-w-[120px] truncate">{item.comment}</span>
                      )}
                      <button
                        onClick={() => {
                          if (editingComment === item.id) {
                            setEditingComment(null)
                            setCommentDraft("")
                          } else {
                            setEditingComment(item.id)
                            setCommentDraft(item.comment)
                          }
                        }}
                        className={`p-1 rounded-full transition-colors ${item.comment ? "text-amber-500" : "text-neutral-300 hover:text-neutral-500"}`}
                      >
                        <MessageCircle size={16} />
                      </button>
                    </div>
                  </div>
                  {editingComment === item.id && (
                    <div className="mt-2 relative">
                      <textarea
                        value={commentDraft}
                        onChange={(e) => setCommentDraft(e.target.value)}
                        placeholder="Ej: sin cebolla, término medio..."
                        rows={2}
                        className="w-full rounded-lg border border-neutral-200 bg-neutral-50 p-2 pr-8 text-xs outline-none focus:border-neutral-400 focus:bg-white resize-none"
                      />
                      <button
                        onClick={() => {
                          setItemComment(item.id, commentDraft)
                          setEditingComment(null)
                          setCommentDraft("")
                        }}
                        className="absolute top-1.5 right-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-neutral-900 text-white hover:bg-neutral-700 transition-colors"
                      >
                        <ArrowUp size={11} />
                      </button>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            <Input placeholder="Nota general" value={notes} onChange={(e) => setNotes(e.target.value)} />

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep("pedido")}>
                Volver
              </Button>
              <Button className="flex-1 rounded-xl" onClick={() => setStep("confirmar")}>
                Continuar
              </Button>
            </div>
          </>
        )}

        {/* Step 3: Confirmar */}
        {step === "confirmar" && (
          <>
            <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-2">
              <p className="text-sm font-semibold text-neutral-800">Resumen del pedido</p>
              <div className="space-y-2">
                {pedido.map((item) => (
                  <div key={item.id}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-700">{item.quantity}x {item.nombre}</span>
                      <span className="text-neutral-600">{formatCurrency(item.precio * item.quantity)}</span>
                    </div>
                    {item.comment && (
                      <p className="text-xs text-amber-600 flex items-center gap-1 mt-0.5 ml-1">
                        <MessageCircle size={10} /> {item.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              {notes && (
                <p className="text-xs text-neutral-500 pt-1 border-t border-neutral-100">Nota: {notes}</p>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-200 font-semibold text-sm">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep("ajustar")}>
                Ajustar
              </Button>
              <Button
                className="flex-1 rounded-xl"
                disabled={createOrden.isPending}
                onClick={() => {
                  if (!mesa) return
                  createOrden.mutate(
                    {
                      mesaId: mesa.id,
                      notas: notes || null,
                      dedicatoria: null,
                      productos: pedido.map((p) => ({
                        itemMenuId: p.id,
                        cantidad: p.quantity,
                        notas: p.comment || null,
                      })),
                    },
                    { onSuccess: () => setConfirmSent(true) },
                  )
                }}
              >
                <Send size={16} className="mr-2" />
                {createOrden.isPending ? "Enviando..." : "Enviar a cocina"}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Exit confirmation dialog */}
      {showExitDialog && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setShowExitDialog(false)} />
          <div className="relative z-10 mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-neutral-900 mb-2">¿Salir sin guardar?</h3>
            <p className="text-sm text-neutral-500 mb-5">Tienes productos en el pedido. Si sales se perderán los cambios.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowExitDialog(false)}
                className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowExitDialog(false)
                  pendingAction?.()
                }}
                className="flex-1 rounded-xl bg-neutral-900 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
