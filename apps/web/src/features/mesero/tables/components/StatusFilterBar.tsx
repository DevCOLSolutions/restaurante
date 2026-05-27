import type { Filter } from "../types"

interface StatusFilterBarProps {
  filters: Filter[]
  active: string
  onChange: (value: string) => void
}

export function StatusFilterBar({ filters, active, onChange }: StatusFilterBarProps) {
  return (
    <div className="flex items-center justify-center mb-3">
      <div className="flex items-center gap-1">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-all ${
              active === f.value
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  )
}
