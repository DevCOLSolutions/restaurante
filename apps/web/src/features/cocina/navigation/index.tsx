import { LayoutDashboard, ClipboardList, ChefHat, User } from "lucide-react"

export const cocinaNavItems = [
  { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/app/cocina" },
  { icon: <ClipboardList size={20} />, label: "Pendientes", href: "/app/cocina/pending" },
  { icon: <ChefHat size={20} />, label: "En Preparación", href: "/app/cocina/preparing" },
  { icon: <User size={20} />, label: "Perfil", href: "/app/cocina/profile" },
]
