import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Card } from "@/shared/ui/Card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@/shared/ui/Input"
import { ArrowLeft, ArrowUp, Plus, Minus, UtensilsCrossed, Search, MessageCircle, Send, Bell, Check } from "lucide-react"
import { formatCurrency } from "@/core/utils"

type MenuItem = { id: string; name: string; price: number; category: string }

const categories = ["entradas", "platillos", "bebidas", "postres"]

const menuItems: MenuItem[] = [
    { id: "m1", name: "Guacamole", price: 65, category: "entradas" },
    { id: "m2", name: "Papas Fritas", price: 55, category: "entradas" },
    { id: "m7", name: "Ensalada César", price: 95, category: "entradas" },
    { id: "m3", name: "Tacos al Pastor", price: 45, category: "platillos" },
    { id: "m4", name: "Enchiladas Verdes", price: 85, category: "platillos" },
    { id: "m8", name: "Hamburguesa Clásica", price: 120, category: "platillos" },
    { id: "m5", name: "Agua de Jamaica", price: 25, category: "bebidas" },
    { id: "m6", name: "Malteada de Vainilla", price: 45, category: "bebidas" },
    { id: "m9", name: "Café", price: 35, category: "bebidas" },
    { id: "m10", name: "Flan Napolitano", price: 50, category: "postres" },
    { id: "m11", name: "Pastel de Chocolate", price: 60, category: "postres" },
]

const existingOrders: Record<number, { name: string; quantity: number; price: number }[]> = {
    5: [{ name: "Tacos al Pastor", quantity: 2, price: 45 }, { name: "Guacamole", quantity: 1, price: 65 }],
    6: [{ name: "Hamburguesa Clásica", quantity: 1, price: 120 }, { name: "Papas Fritas", quantity: 2, price: 55 }, { name: "Agua de Jamaica", quantity: 2, price: 25 }],
    12: [{ name: "Enchiladas Verdes", quantity: 1, price: 85 }, { name: "Malteada de Vainilla", quantity: 1, price: 45 }],
}

interface CartItem extends MenuItem { quantity: number; comment: string }

export function OrderAddPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const tableNumber = (location.state as { table?: number; people?: number })?.table ?? 0
    const peopleCount = (location.state as { table?: number; people?: number })?.people ?? 0

    const [step, setStep] = useState<"add" | "adjust" | "confirm">("add")
    const [cart, setCart] = useState<CartItem[]>([])
    const [categoryTab, setCategoryTab] = useState("entradas")
    const [search, setSearch] = useState("")
    const [notes, setNotes] = useState("")
    const [confirmSent, setConfirmSent] = useState(false)
    const [editingComment, setEditingComment] = useState<string | null>(null)
    const [commentDraft, setCommentDraft] = useState("")

    const existingTotal = (existingOrders[tableNumber] ?? []).reduce((s, i) => s + i.price * i.quantity, 0)
    const newTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)

    const filtered = search
        ? menuItems.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
        : menuItems.filter((m) => m.category === categoryTab)

    const addItem = (item: MenuItem) => {
        setCart((prev) => {
            const existing = prev.find((c) => c.id === item.id)
            if (existing) return prev.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c))
            return [...prev, { ...item, quantity: 1, comment: "" }]
        })
    }

    const removeItem = (id: string) => {
        setCart((prev) => {
            const existing = prev.find((c) => c.id === id)
            if (existing && existing.quantity > 1) return prev.map((c) => (c.id === id ? { ...c, quantity: c.quantity - 1 } : c))
            return prev.filter((c) => c.id !== id)
        })
    }

    const setItemComment = (id: string, comment: string) => {
        setCart((prev) => prev.map((c) => (c.id === id ? { ...c, comment } : c)))
    }

    useEffect(() => {
        if (confirmSent) {
            const t = setTimeout(() => navigate("/app/mesero/tables"), 2500)
            return () => clearTimeout(t)
        }
    }, [confirmSent, navigate])

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
                                <h1 className="text-xl font-medium text-white tracking-tight">Productos agregados</h1>
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
                    <p className="text-neutral-500">Los productos se agregaron a la orden correctamente.</p>
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
                    <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white">
                        <ArrowLeft size={22} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white">
                            <UtensilsCrossed size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-white/50">{step === "add" ? "Agregar productos" : step === "adjust" ? "Ajustar" : "Confirmar"}</p>
                            <h1 className="text-xl font-medium text-white tracking-tight leading-tight">
                                Mesa {String(tableNumber).padStart(2, "0")}
                            </h1>
                        </div>
                    </div>
                    <span className="ml-auto text-xs text-white/40">{peopleCount} {peopleCount === 1 ? "persona" : "personas"}</span>
                </div>
                <div className="flex gap-2">
                    {["add", "adjust", "confirm"].map((s) => (
                        <div key={s} className={`h-1.5 rounded-full transition-all ${step === s ? "w-6 bg-white" : "w-1.5 bg-white/30"}`} />
                    ))}
                </div>
            </div>

            <div className="px-4 mt-4 space-y-4">
                {/* Existing order */}
                {(existingOrders[tableNumber] ?? []).length > 0 && (
                    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                        <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">Orden actual</p>
                        <div className="space-y-1">
                            {(existingOrders[tableNumber] ?? []).map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <span className="text-neutral-700">{item.quantity}x {item.name}</span>
                                    <span className="text-xs text-neutral-500">{formatCurrency(item.price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-between pt-1.5 mt-1.5 border-t border-neutral-200 text-sm font-semibold text-neutral-800">
                            <span>Subtotal</span>
                            <span>{formatCurrency(existingTotal)}</span>
                        </div>
                    </div>
                )}

                {step === "add" && (
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

                        {!search && (
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategoryTab(cat)}
                                        className={`rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                                            categoryTab === cat ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                                        }`}
                                    >
                                        {cat === "entradas" ? "Entradas" : cat === "platillos" ? "Platillos" : cat === "bebidas" ? "Bebidas" : "Postres"}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="space-y-2">
                            {filtered.map((item) => {
                                const inCart = cart.find((c) => c.id === item.id)
                                return (
                                    <Card key={item.id} className="flex items-center justify-between px-4 py-3" hover>
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900">{item.name}</p>
                                            <p className="text-xs text-neutral-400">{formatCurrency(item.price)}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            {inCart && (
                                                <>
                                                    <button onClick={() => removeItem(item.id)} className="flex items-center justify-center w-7 h-7 rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors">
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="text-sm font-bold text-neutral-900 w-6 text-center tabular-nums">{inCart.quantity}</span>
                                                </>
                                            )}
                                            <button onClick={() => addItem(item)} className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>

                        {cart.length > 0 && (
                            <Button className="w-full rounded-xl" onClick={() => setStep("adjust")}>
                                Continuar <ArrowLeft size={16} className="ml-2 rotate-180" />
                            </Button>
                        )}
                    </>
                )}

                {step === "adjust" && (
                    <>
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-neutral-800">Nuevos productos · {cart.length}</p>
                            <span className="text-sm font-bold text-neutral-900">{formatCurrency(newTotal)}</span>
                        </div>

                        <div className="space-y-2">
                            {cart.map((item) => (
                                <Card key={item.id} className="px-4 py-3" hover>
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-medium text-neutral-900">{item.name}</p>
                                        <span className="text-xs text-neutral-500">{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => removeItem(item.id)} className="text-neutral-400 hover:text-neutral-600"><Minus size={14} /></button>
                                            <span className="text-sm font-bold text-neutral-900 w-5 text-center tabular-nums">{item.quantity}</span>
                                            <button onClick={() => addItem(item)} className="text-neutral-400 hover:text-neutral-600"><Plus size={14} /></button>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {item.comment && <span className="text-[10px] text-neutral-400 max-w-[100px] truncate">{item.comment}</span>}
                                            <button
                                                onClick={() => {
                                                    if (editingComment === item.id) { setEditingComment(null); setCommentDraft("") }
                                                    else { setEditingComment(item.id); setCommentDraft(item.comment) }
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
                                                placeholder="Comentario..."
                                                rows={2}
                                                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 p-2 pr-8 text-xs outline-none focus:border-neutral-400 focus:bg-white resize-none"
                                            />
                                            <button
                                                onClick={() => { setItemComment(item.id, commentDraft); setEditingComment(null); setCommentDraft("") }}
                                                className="absolute top-1.5 right-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-neutral-900 text-white hover:bg-neutral-700"
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
                            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep("add")}>Volver</Button>
                            <Button className="flex-1 rounded-xl" onClick={() => setStep("confirm")}>Continuar</Button>
                        </div>
                    </>
                )}

                {step === "confirm" && (
                    <>
                        <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-2">
                            <p className="text-sm font-semibold text-neutral-800">Resumen</p>
                            <div className="space-y-2">
                                <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">Nuevos productos</p>
                                {cart.map((item) => (
                                    <div key={item.id}>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-neutral-700">{item.quantity}x {item.name}</span>
                                            <span className="text-neutral-600">{formatCurrency(item.price * item.quantity)}</span>
                                        </div>
                                        {item.comment && <p className="text-xs text-amber-600 flex items-center gap-1 mt-0.5 ml-1"><MessageCircle size={10} /> {item.comment}</p>}
                                    </div>
                                ))}
                            </div>
                            {notes && <p className="text-xs text-neutral-500 pt-1 border-t border-neutral-100">Nota: {notes}</p>}
                            <div className="flex items-center justify-between pt-2 border-t border-neutral-200 font-semibold text-sm">
                                <span>Total nuevo</span>
                                <span>{formatCurrency(existingTotal + newTotal)}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep("adjust")}>Ajustar</Button>
                            <Button className="flex-1 rounded-xl" onClick={() => setConfirmSent(true)}>
                                <Send size={16} className="mr-2" />
                                Agregar a la orden
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
