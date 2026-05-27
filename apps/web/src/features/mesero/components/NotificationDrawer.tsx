import { createPortal } from "react-dom"
import { X, Bell, CookingPot, ClipboardCheck, Ban, Info, Trash2 } from "lucide-react"
import { useNotificationStore } from "../stores/notificationStore"
import { useNavigate } from "react-router-dom"

const typeConfig: Record<string, { icon: React.ReactNode; bg: string }> = {
  order_ready: { icon: <CookingPot size={16} />, bg: "bg-emerald-100 text-emerald-600" },
  order_sent: { icon: <ClipboardCheck size={16} />, bg: "bg-blue-100 text-blue-600" },
  order_cancelled: { icon: <Ban size={16} />, bg: "bg-red-100 text-red-600" },
  info: { icon: <Info size={16} />, bg: "bg-amber-100 text-amber-600" },
}

export function NotificationDrawer() {
  const { open, setOpen, notifications, markRead, markAllRead, remove, unreadCount } = useNotificationStore()
  const navigate = useNavigate()

  const handleNotifClick = (id: string, tableNumber?: number) => {
    markRead(id)
    if (tableNumber) {
      setOpen(false)
      navigate("/app/mesero/tables")
    }
  }

  if (!open) return null

  return createPortal(
    <>
      <div className="fixed inset-0 z-[100] bg-black/30" onClick={() => setOpen(false)} />
      <div className="fixed bottom-0 left-0 right-0 z-[101] w-full max-h-[75vh] rounded-t-2xl bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-neutral-100 shrink-0">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-neutral-700" />
            <h3 className="text-base font-semibold text-neutral-900">Notificaciones</h3>
            {unreadCount() > 0 && (
              <span className="text-[10px] font-medium bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">
                {unreadCount()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount() > 0 && (
              <button onClick={markAllRead} className="text-xs text-neutral-500 hover:text-neutral-700 font-medium">
                Marcar todas leídas
              </button>
            )}
            <button onClick={() => setOpen(false)} className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-2 space-y-1">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Bell size={32} className="text-neutral-300 mb-2" />
              <p className="text-sm text-neutral-500">Sin notificaciones</p>
            </div>
          ) : (
            notifications.map((n) => {
              const cfg = typeConfig[n.type] ?? typeConfig.info
              return (
                <button
                  key={n.id}
                  onClick={() => handleNotifClick(n.id, n.tableNumber)}
                  className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                    n.read ? "hover:bg-neutral-50" : "bg-blue-50/40 hover:bg-blue-50"
                  }`}
                >
                  <span className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${cfg.bg}`}>
                    {cfg.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm ${n.read ? "text-neutral-700" : "text-neutral-900 font-medium"}`}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-neutral-400 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{n.description}</p>
                    {n.tableNumber && (
                      <span className="text-[10px] text-neutral-400 mt-0.5 inline-block">Mesa {String(n.tableNumber).padStart(2, "0")}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); remove(n.id) }}
                      className="rounded-full p-1 text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>
    </>,
    document.body
  )
}