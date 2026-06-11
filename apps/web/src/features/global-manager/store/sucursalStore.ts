import { create } from "zustand"
import type { SucursalData, TableInfo, SucursalMesero, SucursalAdmin, SucursalZone, SucursalKitchenArea, TableStatus } from "../types"
import { getSucursales } from "../services/mockData"

interface SucursalStore {
  sucursales: SucursalData[]

  _hydrate: () => void

  addSucursal: (data: { name: string; address: string; phone: string }) => void
  updateSucursal: (id: string, data: Partial<Pick<SucursalData, 'name' | 'address' | 'phone'>>) => void
  deleteSucursal: (id: string) => void

  addZone: (sucursalId: string, zone: SucursalZone) => void
  updateZone: (sucursalId: string, oldName: string, zone: SucursalZone) => void
  removeZone: (sucursalId: string, zoneName: string) => void

  addTable: (sucursalId: string, zone: string, seats: number) => void
  removeTable: (sucursalId: string, tableId: string) => void
  updateTableStatus: (sucursalId: string, tableId: string, status: TableStatus) => void

  addMesero: (sucursalId: string, mesero: SucursalMesero) => void
  updateMesero: (sucursalId: string, meseroId: string, data: Partial<SucursalMesero>) => void
  removeMesero: (sucursalId: string, meseroId: string) => void

  addAdmin: (sucursalId: string, admin: SucursalAdmin) => void
  updateAdmin: (sucursalId: string, adminId: string, data: Partial<SucursalAdmin>) => void
  removeAdmin: (sucursalId: string, adminId: string) => void

  addKitchenArea: (sucursalId: string, area: SucursalKitchenArea) => void
  updateKitchenArea: (sucursalId: string, oldName: string, area: SucursalKitchenArea) => void
  removeKitchenArea: (sucursalId: string, areaName: string) => void
}

export const useSucursalStore = create<SucursalStore>()((set) => ({
  sucursales: [],

  _hydrate: () => {
    set({ sucursales: getSucursales() })
  },

  addSucursal: (data) => set((state) => ({
    sucursales: [...state.sucursales, {
      id: `suc-${Date.now()}`,
      name: data.name,
      address: data.address,
      phone: data.phone,
      zones: [],
      tables: [],
      meseros: [],
      admins: [],
      kitchenAreas: [],
    }],
  })),

  updateSucursal: (id, data) => set((state) => ({
    sucursales: state.sucursales.map((s) => s.id === id ? { ...s, ...data } : s),
  })),

  deleteSucursal: (id) => set((state) => ({
    sucursales: state.sucursales.filter((s) => s.id !== id),
  })),

  addZone: (sucursalId, zone) => set((state) => ({
    sucursales: state.sucursales.map((s) =>
      s.id === sucursalId ? { ...s, zones: [...s.zones, zone] } : s
    ),
  })),

  updateZone: (sucursalId, oldName, zone) => set((state) => ({
    sucursales: state.sucursales.map((s) =>
      s.id === sucursalId
        ? {
            ...s,
            zones: s.zones.map((z) => (z.name === oldName ? zone : z)),
            tables: s.tables.map((t) => (t.zone === oldName ? { ...t, zone: zone.name } : t)),
          }
        : s
    ),
  })),

  removeZone: (sucursalId, zoneName) => set((state) => ({
    sucursales: state.sucursales.map((s) =>
      s.id === sucursalId
        ? {
            ...s,
            zones: s.zones.filter((z) => z.name !== zoneName),
            tables: s.tables.filter((t) => t.zone !== zoneName),
          }
        : s
    ),
  })),

  addTable: (sucursalId, zone, seats) => set((state) => ({
    sucursales: state.sucursales.map((s) => {
      if (s.id !== sucursalId) return s
      const maxNumber = s.tables.reduce((max, t) => Math.max(max, t.number), 0)
      const newTable: TableInfo = {
        id: `t-${sucursalId}-${maxNumber + 1}`,
        number: maxNumber + 1,
        status: "libre",
        seats,
        zone,
        x: 10,
        y: 10,
      }
      return { ...s, tables: [...s.tables, newTable] }
    }),
  })),

  removeTable: (sucursalId, tableId) => set((state) => ({
    sucursales: state.sucursales.map((s) =>
      s.id === sucursalId ? { ...s, tables: s.tables.filter((t) => t.id !== tableId) } : s
    ),
  })),

  updateTableStatus: (sucursalId, tableId, status) => set((state) => ({
    sucursales: state.sucursales.map((s) =>
      s.id === sucursalId
        ? { ...s, tables: s.tables.map((t) => (t.id === tableId ? { ...t, status } : t)) }
        : s
    ),
  })),

  addMesero: (sucursalId, mesero) => set((state) => ({
    sucursales: state.sucursales.map((s) =>
      s.id === sucursalId ? { ...s, meseros: [...s.meseros, mesero] } : s
    ),
  })),

  updateMesero: (sucursalId, meseroId, data) => set((state) => ({
    sucursales: state.sucursales.map((s) =>
      s.id === sucursalId
        ? { ...s, meseros: s.meseros.map((m) => (m.id === meseroId ? { ...m, ...data } : m)) }
        : s
    ),
  })),

  removeMesero: (sucursalId, meseroId) => set((state) => ({
    sucursales: state.sucursales.map((s) =>
      s.id === sucursalId ? { ...s, meseros: s.meseros.filter((m) => m.id !== meseroId) } : s
    ),
  })),

  addAdmin: (sucursalId, admin) => set((state) => ({
    sucursales: state.sucursales.map((s) =>
      s.id === sucursalId ? { ...s, admins: [...s.admins, admin] } : s
    ),
  })),

  updateAdmin: (sucursalId, adminId, data) => set((state) => ({
    sucursales: state.sucursales.map((s) =>
      s.id === sucursalId
        ? { ...s, admins: s.admins.map((a) => (a.id === adminId ? { ...a, ...data } : a)) }
        : s
    ),
  })),

  removeAdmin: (sucursalId, adminId) => set((state) => ({
    sucursales: state.sucursales.map((s) =>
      s.id === sucursalId ? { ...s, admins: s.admins.filter((a) => a.id !== adminId) } : s
    ),
  })),

  addKitchenArea: (sucursalId, area) => set((state) => ({
    sucursales: state.sucursales.map((s) =>
      s.id === sucursalId ? { ...s, kitchenAreas: [...s.kitchenAreas, area] } : s
    ),
  })),

  updateKitchenArea: (sucursalId, oldName, area) => set((state) => ({
    sucursales: state.sucursales.map((s) =>
      s.id === sucursalId
        ? { ...s, kitchenAreas: s.kitchenAreas.map((a) => (a.name === oldName ? area : a)) }
        : s
    ),
  })),

  removeKitchenArea: (sucursalId, areaName) => set((state) => ({
    sucursales: state.sucursales.map((s) =>
      s.id === sucursalId
        ? { ...s, kitchenAreas: s.kitchenAreas.filter((a) => a.name !== areaName) }
        : s
    ),
  })),
}))
