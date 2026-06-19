import { useState } from "react"
import type { SucursalData } from "../types"

type ModalType = "editSuc" | "addSuc" | "zone" | "mesero" | "admin" | null

interface ModalState {
  activeModal: ModalType
  selectedSucursal: SucursalData | null
  open: (modal: NonNullable<ModalType>, suc?: SucursalData | null) => void
  close: () => void
}

export function useModalState(): ModalState {
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [selectedSucursal, setSelectedSucursal] = useState<SucursalData | null>(null)

  const open = (modal: NonNullable<ModalType>, suc?: SucursalData | null) => {
    setActiveModal(modal)
    setSelectedSucursal(suc ?? null)
  }

  const close = () => {
    setActiveModal(null)
    setSelectedSucursal(null)
  }

  return { activeModal, selectedSucursal, open, close }
}
