import { Building2, House, UtensilsCrossed } from "lucide-react"

export const globalManagerNavItems = [
  { icon: <House size={20} />, label: "Inicio", href: "/app/global-manager", end: true },
  { icon: <Building2 size={20} />, label: "Sucursales", href: "/app/global-manager/sucursales" },
  { icon: <UtensilsCrossed size={20} />, label: "Menú", href: "/app/global-manager/menu" },
]
