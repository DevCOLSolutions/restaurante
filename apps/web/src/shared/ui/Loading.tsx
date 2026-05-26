import { Loader2 } from "lucide-react"
import { cn } from "@/shared/lib/utils"

interface LoadingProps {
  size?: number
  text?: string
  className?: string
}

export function Loading({ size = 24, text, className }: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-neutral-400", className)}>
      <Loader2 size={size} className="animate-spin" />
      {text && <p className="mt-2 text-sm">{text}</p>}
    </div>
  )
}
