import { House, UtensilsCrossed, Users, ChefHat } from "lucide-react"

export const globalManagerNavItems = [
  { icon: <House size={20} />, label: "Inicio", href: "/app/global-manager" },
  { icon: <UtensilsCrossed size={20} />, label: "Menú", href: "/app/global-manager/menu" },
  { icon: <Users size={20} />, label: "Meseros", href: "/app/global-manager/meseros" },
  { icon: <ChefHat size={20} />, label: "Cocina", href: "/app/global-manager/kitchen" },
]
