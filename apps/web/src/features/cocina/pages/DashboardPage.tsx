import { Card, CardContent } from "@/shared/ui/Card"
import { Button } from "@workspace/ui/components/button"
import { Loading } from "@/shared/ui/Loading"
import { Badge } from "@/shared/ui/Badge"
import { useProductosMiArea } from "../hooks/useProductosMiArea"
import { useCambiarEstadoOrden } from "../hooks/useCambiarEstadoOrden"
import { useCocinaSignalr } from "../hooks/useCocinaSignalr"
import type { ProductoAreaCocina } from "@/types/api"

function ProductoCard({
  p,
  onCambiarEstado,
  isChanging,
}: {
  p: ProductoAreaCocina
  onCambiarEstado: (id: string, estado: string) => void
  isChanging: boolean
}) {

  const isPending = p.estadoProducto === "pendiente"
  const isPreparing = p.estadoProducto === "preparando" || p.estadoProducto === "en_preparacion"

  return (
    <Card key={p.id} className={isPreparing ? "border-amber-200 bg-amber-50/50" : ""}>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-neutral-900">Mesa {p.mesaNumero}</span>
          <Badge variant={isPending ? "outline" : "warning"}>
            {isPending ? "Pendiente" : "Preparando"}
          </Badge>
        </div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-neutral-800 font-medium">{p.cantidad}x {p.itemMenuNombre}</span>
        </div>
        {p.notasProducto && (
          <p className="text-xs text-neutral-500 mb-3">{p.notasProducto}</p>
        )}
        {isPending && (
          <Button
            className="w-full rounded-xl"
            onClick={() => onCambiarEstado(p.id, "en_preparacion")}
            disabled={isChanging}
          >
            {isChanging ? "Actualizando..." : "Iniciar Preparación"}
          </Button>
        )}
        {isPreparing && (
          <Button
            className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white"
            onClick={() => onCambiarEstado(p.id, "listo")}
            disabled={isChanging}
          >
            {isChanging ? "Actualizando..." : "Marcar como Listo"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export function CocinaDashboardPage() {
  useCocinaSignalr()
  const { data: productos, isLoading } = useProductosMiArea()
  const { mutate: cambiarEstado, isPending: isChanging } = useCambiarEstadoOrden()

  const items = productos ?? []
  const pending = items.filter((p) => p.estadoProducto === "pendiente")
  const preparing = items.filter((p) => p.estadoProducto === "preparando" || p.estadoProducto === "en_preparacion")
  const activeTables = new Set(items.map((p) => p.mesaNumero)).size

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Dashboard</h2>
          <p className="text-sm text-neutral-500">Órdenes de cocina en tiempo real</p>
        </div>
        <Loading />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-neutral-900">Dashboard</h2>
        <p className="text-sm text-neutral-500">Órdenes de cocina en tiempo real</p>
      </div>

      <div className="rounded-2xl bg-neutral-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Pendientes</p>
            <p className="text-lg font-bold">{pending.length}</p>
          </div>
          <div className="w-px h-8 bg-neutral-700" />
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Preparando</p>
            <p className="text-lg font-bold">{preparing.length}</p>
          </div>
          <div className="w-px h-8 bg-neutral-700" />
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Mesas activas</p>
            <p className="text-lg font-bold">{activeTables}</p>
          </div>
        </div>
      </div>

      {preparing.length > 0 && (
        <div>
          <h2 className="mb-3 text-base font-semibold text-amber-600">En Preparación</h2>
          <div className="space-y-3">
            {preparing.map((p) => (
              <ProductoCard
                key={p.id}
                p={p}
                onCambiarEstado={(id, estado) => cambiarEstado({ id, estado })}
                isChanging={isChanging}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-3 text-base font-semibold text-neutral-800">Pendientes</h2>
        {pending.length === 0 ? (
          <p className="text-sm text-neutral-500">No hay productos pendientes</p>
        ) : (
          <div className="space-y-3">
            {pending.map((p) => (
              <ProductoCard
                key={p.id}
                p={p}
                onCambiarEstado={(id, estado) => cambiarEstado({ id, estado })}
                isChanging={isChanging}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
