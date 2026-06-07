import { useState, useMemo } from "react"
import { createPortal } from "react-dom"
import { useNavigate } from "react-router-dom"
import { Card } from "@/shared/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { X, Clock, User, UtensilsCrossed, Plus, ShoppingCart } from "lucide-react";
import { useZonas } from "@/features/global-manager/hooks/useZonas"
import { useMesas } from "@/features/global-manager/hooks/useMesas"
import type { Mesa } from "@/types/api"

type StatusConfig = {
    label: string
    dot: string
    glow: string
}

const statusConfig: Record<string, StatusConfig> = {
    disponible: {
        dot: "bg-emerald-600",
        glow: "bg-gradient-to-r from-emerald-400/40 to-transparent",
        label: "Disponible",
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
    { value: "disponible", label: "Disponibles" },
    { value: "ocupada", label: "Ocupadas" },
    { value: "reservada", label: "Reservadas" },
]

export function MeseroTablesPage() {
    const navigate = useNavigate()
    const { data: apiZonas, isLoading: isLoadingZonas } = useZonas()
    const { data: mesas, isLoading: isLoadingMesas } = useMesas()
    const zonas = apiZonas?.map((z) => ({ id: z.id, label: z.nombre })) ?? []
    const [statusFilter, setStatusFilter] = useState("disponible")
    const [selectedTable, setSelectedTable] = useState<Mesa | null>(null)

    const mesasPorZona = useMemo(() => {
        if (!mesas) return {}
        const grouped: Record<string, Mesa[]> = {}
        for (const m of mesas) {
            if (!grouped[m.zonaId]) grouped[m.zonaId] = []
            grouped[m.zonaId].push(m)
        }
        return grouped
    }, [mesas])

    const isLoading = isLoadingZonas || isLoadingMesas

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

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
                    </div>
                ) : (
                    <Tabs defaultValue={zonas[0]?.id} className="w-full">
                        <TabsList className="w-full bg-neutral-100 rounded-xl p-1" style={{ gridTemplateColumns: `repeat(${zonas.length}, 1fr)` }}>
                            {zonas.map((zone) => (
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
                                    className={`rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-all ${statusFilter === f.value
                                            ? "bg-neutral-900 text-white"
                                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        {zonas.map((zone) => {
                            const tables = (mesasPorZona[zone.id] ?? []).filter(
                                (t) => statusFilter === "all" || t.estado === statusFilter
                            )

                        return (
                            <TabsContent key={zone.id} value={zone.id} className="mt-0">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-accent p-2 rounded-2xl">
                                    {tables.map((t) => {
                                        const cfg = statusConfig[t.estado] ?? statusConfig.disponible

                                        return (
                                            <Card
                                                key={t.id}
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
                                                            Mesa {String(t.numero).padStart(2, "0")}
                                                            {t.nombre ? ` - ${t.nombre}` : ""}
                                                        </p>
                                                        <p className="text-xs text-neutral-400 mt-0.5">
                                                            {t.capacidad} {t.capacidad === 1 ? "persona" : "personas"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-0.5">
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
                )}
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
                                <p className="text-base font-semibold text-neutral-900">Mesa {String(selectedTable.numero).padStart(2, "0")}</p>
                                <p className="text-sm text-neutral-500">{selectedTable.capacidad} {selectedTable.capacidad === 1 ? "persona" : "personas"}</p>
                            </div>
                            <span className={`ml-auto text-xs font-medium px-3 py-1 rounded-full ${selectedTable.estado === "ocupada" ? "bg-amber-100 text-amber-700" : selectedTable.estado === "disponible" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                                {statusConfig[selectedTable.estado]?.label ?? selectedTable.estado}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {selectedTable.estado === "ocupada" && (
                                <>
                                    <div className="flex items-center gap-3 text-sm text-neutral-600">
                                        <User size={16} className="text-neutral-400" />
                                        <span>Mesero asignado</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedTable(null)
                                            navigate("/app/mesero/order-add", { state: { table: selectedTable.numero, people: selectedTable.capacidad } })
                                        }}
                                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
                                    >
                                        <ShoppingCart size={16} />
                                        Añadir a la orden
                                    </button>
                                </>
                            )}
                            {selectedTable.estado === "reservada" && (
                                <div className="flex items-center gap-3 text-sm text-neutral-600">
                                    <Clock size={16} className="text-neutral-400" />
                                    <span>Mesa reservada</span>
                                </div>
                            )}
                            {selectedTable.estado === "disponible" && (
                                <button
                                    onClick={() => {
                                        setSelectedTable(null)
                                        navigate("/app/mesero/order-create", { state: { table: selectedTable.numero, people: selectedTable.capacidad } })
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
