import { cn } from "@/shared/lib/utils"
import { useIsMobile } from "@/shared/hooks/useMediaQuery"
import { NavLink } from "react-router-dom"
import type { ReactNode } from "react"

interface NavItem {
  icon: ReactNode
  label: string
  href: string
  onClick?: () => void
  end?: boolean
}

interface BottomNavigationProps {
  items: NavItem[]
  className?: string
}

export function BottomNavigation({ items, className }: BottomNavigationProps) {
  const isMobile = useIsMobile()

  if (!isMobile) return null

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white/80 backdrop-blur-lg",
        className,
      )}
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1">
        {items.map((item, i) => {
          if (item.onClick) {
            return (
              <button
                key={i}
                onClick={item.onClick}
                className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-600 transition-all duration-200"
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )
          }

          return (
            <NavLink
              key={i}
              to={item.href}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200",
                  isActive ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600",
                )
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
