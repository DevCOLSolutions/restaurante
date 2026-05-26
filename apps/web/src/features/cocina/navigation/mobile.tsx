import { LayoutDashboard, ClipboardList, ChefHat, User } from "lucide-react"

export const cocinaMobileNav = [
  { icon: <LayoutDashboard size={22} />, label: "Home", href: "/app/cocina" },
  { icon: <ClipboardList size={22} />, label: "Pendientes", href: "/app/cocina/pending" },
  { icon: <ChefHat size={22} />, label: "Preparación", href: "/app/cocina/preparing" },
  { icon: <User size={22} />, label: "Perfil", href: "/app/cocina/profile" },
]
