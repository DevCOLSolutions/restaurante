import { LayoutDashboard, ShoppingBag, ClipboardList, Menu, User } from "lucide-react"

export const consumidorMobileNav = [
  { icon: <LayoutDashboard size={22} />, label: "Inicio", href: "/app/consumidor" },
  { icon: <Menu size={22} />, label: "Menú", href: "/app/consumidor/menu" },
  { icon: <ShoppingBag size={22} />, label: "Carrito", href: "/app/consumidor/cart" },
  { icon: <ClipboardList size={22} />, label: "Pedidos", href: "/app/consumidor/orders" },
  { icon: <User size={22} />, label: "Perfil", href: "/app/consumidor/profile" },
]
