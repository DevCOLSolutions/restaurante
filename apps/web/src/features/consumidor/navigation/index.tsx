import { LayoutDashboard, ShoppingBag, ClipboardList, Menu, User } from "lucide-react"

export const consumidorNavItems = [
  { icon: <LayoutDashboard size={20} />, label: "Inicio", href: "/app/consumidor" },
  { icon: <Menu size={20} />, label: "Menú", href: "/app/consumidor/menu" },
  { icon: <ShoppingBag size={20} />, label: "Carrito", href: "/app/consumidor/cart" },
  { icon: <ClipboardList size={20} />, label: "Mis Pedidos", href: "/app/consumidor/orders" },
  { icon: <User size={20} />, label: "Perfil", href: "/app/consumidor/profile" },
]
