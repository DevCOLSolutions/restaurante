import { Bell } from "lucide-react"
import { useNotificationStore } from "../stores/notificationStore"

export function NotificationBell() {
  const toggle = useNotificationStore((s) => s.toggle)
  const unread = useNotificationStore((s) => s.unread)

  return (
    <button
      onClick={toggle}
      className="relative inline-flex items-center bg-white/10 border border-white/10 text-white/70 rounded-full p-2 hover:bg-white/20 transition-colors"
    >
      <Bell size={16} />
      {unread > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#F59E0B] text-[8px] font-bold text-white">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </button>
  )
}
