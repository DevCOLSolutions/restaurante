import { cn } from "@/shared/lib/utils"
import { useState } from "react"
import { NavLink } from "react-router-dom"
import { PanelLeftClose, PanelLeft } from "lucide-react"
import type { ReactNode } from "react"

interface NavItem {
  icon: ReactNode
  label: string
  href: string
  badge?: string | number
  onClick?: () => void
}

interface SidebarProps {
  items: NavItem[]
  logo?: ReactNode
  bottomItems?: NavItem[]
}

export function Sidebar({ items, logo, bottomItems }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <nav
      className={cn(
        "sticky top-0 z-40 flex h-screen flex-col border-r border-neutral-200 bg-white transition-all duration-300 flex-shrink-0",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between border-b border-neutral-100 p-4">
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            {logo ?? <span className="text-lg font-bold tracking-tight text-neutral-800 whitespace-nowrap">Rest2025</span>}
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
        >
          {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {items.map((item, i) => (
          <SidebarItem key={i} item={item} collapsed={collapsed} />
        ))}
      </div>

      {bottomItems && (
        <div className="border-t border-neutral-100 p-3 space-y-1">
          {bottomItems.map((item, i) => (
            <SidebarItem key={i} item={item} collapsed={collapsed} />
          ))}
        </div>
      )}
    </nav>
  )
}

function SidebarItem({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  if (item.onClick) {
    return (
      <button
        onClick={item.onClick}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
          "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700",
        )}
      >
        <span className="flex-shrink-0">{item.icon}</span>
        {!collapsed && (
          <>
            <span className="flex-1 truncate text-left">{item.label}</span>
            {item.badge && (
              <span className="flex-shrink-0 rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-white">
                {item.badge}
              </span>
            )}
          </>
        )}
      </button>
    )
  }

  return (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-neutral-100 text-neutral-900"
            : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700",
        )
      }
    >
      <span className="flex-shrink-0">{item.icon}</span>
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <span className="flex-shrink-0 rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-white">
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}
