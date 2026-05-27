import { Card } from "@/shared/ui/Card"
import { HeroMesero } from "./Hero"
import { MeseroTablesPage } from "./TablesGeneral"
import { CookingPot, ClipboardCheck, PlusCircle } from "lucide-react"



export function MeseroDashboardPage() {

  return (
    <div className="w-full pb-4">
      {/* Hero */}
      <HeroMesero/>

      <div className="px-4 mt-4 relative z-20 space-y-6">

        {/* Mesas por Zona */}
        <MeseroTablesPage/>

        {/* Acciones Recientes */}
        <section>
         <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium tracking-wide ">
            Acciones recientes
          </h2>
          </div>
          <div className="space-y-2">
            {[
              { icon: <CookingPot size={16} />, text: "Orden enviada a cocina", mesa: "Mesa 05", time: "Hace 1 min" },
              { icon: <ClipboardCheck size={16} />, text: "Orden entregada", mesa: "Mesa 08", time: "Hace 7 min" },
              { icon: <PlusCircle size={16} />, text: "Adición a la orden", mesa: "Mesa 03", time: "Hace 5 min" },
            ].map((a, i) => (
              <Card key={i} className="flex items-center gap-3 p-3" hover>
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 shrink-0">
                  {a.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-800 truncate">{a.text}</p>
                  <p className="text-xs text-neutral-400">{a.mesa}</p>
                </div>
                <span className="text-xs text-neutral-400 shrink-0">{a.time}</span>
              </Card>
            ))}
          </div>
        </section>

        {/* Actividad Reciente */}
       
      </div>
    </div>
  )
}
