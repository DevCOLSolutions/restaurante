import { useState, useCallback } from "react"
import type { Table } from "../types"

export function useTableSelection() {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)

  const selectTable = useCallback((table: Table) => {
    setSelectedTable(table)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedTable(null)
  }, [])

  return { selectedTable, selectTable, clearSelection } as const
}
