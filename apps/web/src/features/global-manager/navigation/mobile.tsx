import { LayoutDashboard, UtensilsCrossed, ClipboardList, ChefHat, User } from "lucide-react"

export const globalManagerMobileNav = [
  { icon: <LayoutDashboard size={22} />, label: "Home", href: "/app/global-manager" },
  { icon: <UtensilsCrossed size={22} />, label: "Mesas", href: "/app/global-manager/tables" },
  { icon: <ClipboardList size={22} />, label: "Órdenes", href: "/app/global-manager/orders" },
  { icon: <ChefHat size={22} />, label: "Cocina", href: "/app/global-manager/kitchen" },
  { icon: <User size={22} />, label: "Perfil", href: "/app/global-manager/profile" },
]
