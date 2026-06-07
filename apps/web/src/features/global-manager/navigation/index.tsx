import { House, UtensilsCrossed, Users, ChefHat, Store } from "lucide-react"

export const globalManagerNavItems = [
  { icon: <House size={20} />, label: "Inicio", href: "/app/global-manager", end: true },
  { icon: <Store size={20} />, label: "Sucursales", href: "/app/global-manager/sucursales" },
  { icon: <UtensilsCrossed size={20} />, label: "Menú", href: "/app/global-manager/menu" },
  { icon: <Users size={20} />, label: "Meseros", href: "/app/global-manager/meseros" },
  { icon: <ChefHat size={20} />, label: "Cocina", href: "/app/global-manager/kitchen" },
]
