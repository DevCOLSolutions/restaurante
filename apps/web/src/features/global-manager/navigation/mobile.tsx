import { House, UtensilsCrossed, Users, ChefHat } from "lucide-react"

export const globalManagerMobileNav = [
  { icon: <House size={22} />, label: "Inicio", href: "/app/global-manager" },
  { icon: <UtensilsCrossed size={22} />, label: "Menú", href: "/app/global-manager/menu" },
  { icon: <Users size={22} />, label: "Meseros", href: "/app/global-manager/meseros" },
  { icon: <ChefHat size={22} />, label: "Cocina", href: "/app/global-manager/kitchen" },
]
