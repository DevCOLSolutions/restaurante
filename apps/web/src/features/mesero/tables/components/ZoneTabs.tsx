import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import type { Zone, Table } from "../types"

interface ZoneTabsProps {
  zones: Zone[]
  getTablesForZone: (zoneId: string) => Table[]
  renderTable: (table: Table) => React.ReactNode
}

export function ZoneTabs({ zones, getTablesForZone, renderTable }: ZoneTabsProps) {
  return (
    <Tabs defaultValue={zones[0]?.id} className="w-full">
      <TabsList className="grid grid-cols-3 w-full bg-neutral-100 rounded-xl p-1 mb-3">
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

      {zones.map((zone) => {
        const tables = getTablesForZone(zone.id)
        return (
          <TabsContent key={zone.id} value={zone.id} className="mt-0">
            <div className="grid grid-cols-2 gap-2">
              {tables.map((table) => (
                <div key={table.number}>{renderTable(table)}</div>
              ))}
            </div>
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
