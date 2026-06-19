import { AlertTriangle, Loader2 } from "lucide-react"
import { Modal } from "@/shared/ui/Modal"

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  isLoading?: boolean
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = "Eliminar", isLoading }: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={isLoading ? () => {} : onClose}>
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
          <AlertTriangle size={24} className="text-rose-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>
          <p className="text-sm text-neutral-500 mt-1">{message}</p>
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-xl bg-rose-500 text-white py-2.5 text-sm font-medium hover:bg-rose-600 disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : null}
            {isLoading ? "Eliminando..." : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
