import { House, UtensilsCrossed, Users, ChefHat, Store } from "lucide-react"

export const globalManagerMobileNav = [
  { icon: <House size={22} />, label: "Inicio", href: "/app/global-manager", end: true },
  { icon: <Store size={22} />, label: "Sucursales", href: "/app/global-manager/sucursales" },
  { icon: <UtensilsCrossed size={22} />, label: "Menú", href: "/app/global-manager/menu" },
  { icon: <Users size={22} />, label: "Meseros", href: "/app/global-manager/meseros" },
  { icon: <ChefHat size={22} />, label: "Cocina", href: "/app/global-manager/kitchen" },
]
