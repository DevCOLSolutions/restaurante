import { useState } from "react"
import { createPortal } from "react-dom"
import { useNavigate } from "react-router-dom"
import { Card } from "@/shared/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { formatCurrency } from "@/core/utils"
import { Sandwich, Search, X, Clock, User, UtensilsCrossed, Plus, ShoppingCart } from "lucide-react";

const zones = [
    { id: "salon", label: "Salón Principal" },
    { id: "terraza", label: "Terraza" },
    { id: "barra", label: "Barra" },
]

type Table = { number: number; people: number; status: string; time: string }

const tablesByZone: Record<string, Table[]> = {
    salon: [
        { number: 1, people: 2, status: "libre", time: "-" },
        { number: 3, people: 4, status: "ocupada", time: "45 min" },
        { number: 5, people: 6, status: "ocupada", time: "30 min" },
        { number: 7, people: 2, status: "libre", time: "-" },
        { number: 9, people: 4, status: "reservada", time: "20:00" },
    ],
    terraza: [
        { number: 2, people: 4, status: "ocupada", time: "60 min" },
        { number: 4, people: 2, status: "libre", time: "-" },
        { number: 6, people: 6, status: "ocupada", time: "25 min" },
        { number: 8, people: 4, status: "limpieza", time: "5 min" },
    ],
    barra: [
        { number: 10, people: 1, status: "ocupada", time: "15 min" },
        { number: 11, people: 2, status: "libre", time: "-" },
        { number: 12, people: 1, status: "ocupada", time: "40 min" },
    ],
}

type StatusConfig = {
    label: string
    dot: string
    glow: string
}

const statusConfig: Record<string, StatusConfig> = {
    libre: {
        dot: "bg-emerald-600",
        glow: "bg-gradient-to-r from-emerald-400/40 to-transparent",
        label: "Libre",
    },
    ocupada: {
        dot: "bg-[#F59E0B]",
        glow: "bg-gradient-to-r from-amber-400/40 to-transparent",
        label: "Ocupada",
    },
    reservada: {
        dot: "bg-blue-500",
        glow: "bg-gradient-to-r from-blue-400/40 to-transparent",
        label: "Reservada",
    },
}

const filters = [
    { value: "all", label: "Todas" },
    { value: "libre", label: "Disponibles" },
    { value: "ocupada", label: "Ocupadas" },
    { value: "reservada", label: "Reservadas" },
]

const waiterByTable: Record<number, string> = {
    3: "Carlos",
    5: "Andrés",
    2: "Carlos",
    6: "Andrés",
    10: "María",
    12: "Andrés",
}

type OrderItem = { name: string; quantity: number; price: number }

const ordersByTable: Record<number, OrderItem[]> = {
    5: [
        { name: "Tacos al Pastor", quantity: 2, price: 45 },
        { name: "Guacamole", quantity: 1, price: 65 },
    ],
    6: [
        { name: "Hamburguesa Clásica", quantity: 1, price: 120 },
        { name: "Papas Fritas", quantity: 2, price: 55 },
        { name: "Agua de Jamaica", quantity: 2, price: 25 },
    ],
    12: [
        { name: "Enchiladas Verdes", quantity: 1, price: 85 },
        { name: "Malteada de Vainilla", quantity: 1, price: 45 },
    ],
    3: [
        { name: "Ensalada César", quantity: 1, price: 95 },
    ],
    2: [
        { name: "Tacos al Pastor", quantity: 3, price: 45 },
        { name: "Café", quantity: 2, price: 35 },
    ],
    10: [
        { name: "Flan Napolitano", quantity: 1, price: 50 },
    ],
}

export function MeseroTablesPage() {
    const currentUser = "Andrés"
    const navigate = useNavigate()
    const [statusFilter, setStatusFilter] = useState("libre")
    const [selectedTable, setSelectedTable] = useState<Table | null>(null)

    return (
        <div className="w-full">
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold tracking-wide">Mesas</h2>
                    <div className="flex items-center gap-4 px-0.5">
                        {Object.entries(statusConfig).map(([key, cfg]) => (
                            <div key={key} className="flex items-center gap-1.5">
                                <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                                <span className="text-xs text-neutral-500">{cfg.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <Tabs defaultValue="salon" className="w-full">
                    <TabsList className="grid grid-cols-3 w-full bg-neutral-100 rounded-xl p-1">
                        {zones.map((zone) => (
                            <TabsTrigger
                                key={zone.id}
                                value={zone.id}
                                className="rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                            >
                                {zone.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="mx-auto flex items-center gap-1 mt-1 mb-1">
                        {filters.map((f) => (
                            <button
                                key={f.value}
                                onClick={() => setStatusFilter(f.value)}
                                className={`rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-all ${
                                    statusFilter === f.value
                                        ? "bg-neutral-900 text-white"
                                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {zones.map((zone) => {
                        const tables = (tablesByZone[zone.id] ?? []).filter(
                            (t) => statusFilter === "all" || t.status === statusFilter
                        )

                        return (
                            <TabsContent key={zone.id} value={zone.id} className="mt-0">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-accent p-2 rounded-2xl">
                                    {tables.map((t) => {
                                        const cfg = statusConfig[t.status] ?? statusConfig.libre
                                        const showTime = t.status === "ocupada" || t.status === "reservada"

                                        return (
                                            <Card
                                                key={t.number}
                                                className="flex items-center justify-between px-4 py-3 bg-white border border-neutral-200 rounded-xl shadow-none cursor-pointer"
                                                hover
                                                onClick={() => setSelectedTable(t)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
                                                        <div className={`absolute inset-0 rounded-full ${cfg.glow}`} />
                                                        <div className={`relative h-2 w-2 rounded-full ${cfg.dot}`} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-neutral-900 leading-tight">
                                                            Mesa {String(t.number).padStart(2, "0")}
                                                        </p>
                                                        <p className="text-xs text-neutral-400 mt-0.5">
                                                            {t.people} {t.people === 1 ? "persona" : "personas"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-0.5">
                                                    {showTime && (
                                                        <span className="text-[11px] font-mono text-neutral-400">{t.time}</span>
                                                    )}
                                                    <span className="text-xs font-medium text-neutral-600">{cfg.label}</span>
                                                </div>
                                            </Card>
                                        )
                                    })}
                                </div>
                            </TabsContent>
                        )
                    })}
                </Tabs>
            </section>

            {/* Drawer */}
            {selectedTable && createPortal(
                <>
                    <div className="fixed inset-0 z-[100] bg-black/30" onClick={() => setSelectedTable(null)} />
                    <div className="fixed bottom-0 left-0 right-0 z-[101] w-full rounded-t-2xl bg-white px-5 pb-10 pt-5 shadow-2xl">
                        <button onClick={() => setSelectedTable(null)} className="absolute right-4 top-4 rounded-full p-1 text-neutral-400 hover:bg-neutral-100">
                            <X size={18} />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 text-neutral-700">
                                <UtensilsCrossed size={20} />
                            </div>
                            <div>
                                <p className="text-base font-semibold text-neutral-900">Mesa {String(selectedTable.number).padStart(2, "0")}</p>
                                <p className="text-sm text-neutral-500">{selectedTable.people} {selectedTable.people === 1 ? "persona" : "personas"}</p>
                            </div>
                            <span className={`ml-auto text-xs font-medium px-3 py-1 rounded-full ${selectedTable.status === "ocupada" ? "bg-amber-100 text-amber-700" : selectedTable.status === "libre" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                                {statusConfig[selectedTable.status]?.label ?? selectedTable.status}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {selectedTable.status === "ocupada" && (
                                <>
                                    <div className="flex items-center gap-3 text-sm text-neutral-600">
                                        <User size={16} className="text-neutral-400" />
                                        <span>
                                            {waiterByTable[selectedTable.number] === currentUser
                                                ? <><strong className="text-emerald-600">Mi mesa</strong> · {currentUser}</>
                                                : <>Mesero: <strong>{waiterByTable[selectedTable.number] ?? "—"}</strong></>
                                            }
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-neutral-600">
                                        <Clock size={16} className="text-neutral-400" />
                                        <span>Tiempo: <strong>{selectedTable.time}</strong></span>
                                    </div>
                                    {waiterByTable[selectedTable.number] === currentUser && (
                                        <>
                                            <div className="border-t border-neutral-100 pt-3">
                                                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Orden actual</p>
                                                <div className="space-y-1.5">
                                                    {(ordersByTable[selectedTable.number] ?? []).map((item, i) => (
                                                        <div key={i} className="flex items-center justify-between text-sm">
                                                            <span className="text-neutral-700">{item.quantity}x {item.name}</span>
                                                            <span className="text-neutral-500 text-xs">{formatCurrency(item.price * item.quantity)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedTable(null)
                                                    navigate("/app/mesero/order-add", { state: { table: selectedTable.number, people: selectedTable.people } })
                                                }}
                                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
                                            >
                                                <ShoppingCart size={16} />
                                                Añadir a la orden
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
                            {selectedTable.status === "reservada" && (
                                <div className="flex items-center gap-3 text-sm text-neutral-600">
                                    <Clock size={16} className="text-neutral-400" />
                                    <span>Reservada para las <strong>{selectedTable.time}</strong></span>
                                </div>
                            )}
                            {selectedTable.status === "libre" && (
                                <button
                                    onClick={() => {
                                        setSelectedTable(null)
                                        navigate("/app/mesero/order-create", { state: { table: selectedTable.number, people: selectedTable.people } })
                                    }}
                                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
                                >
                                    <Plus size={18} />
                                    Crear orden
                                </button>
                            )}
                        </div>
                    </div>
                </>,
                document.body
            )}
        </div>
    )
}
