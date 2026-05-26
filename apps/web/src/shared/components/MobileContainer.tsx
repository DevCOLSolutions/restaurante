import { cn } from "@/shared/lib/utils"
import type { ReactNode } from "react"

interface MobileContainerProps {
  children: ReactNode
  className?: string
}

export function MobileContainer({ children, className }: MobileContainerProps) {
  return (
    <div className={cn("relative min-h-screen w-full bg-neutral-50", className)}>
      {children}
    </div>
  )
}
