export interface MenuCategory {
  id: string
  name: string
  items: MenuItemData[]
}

export interface MenuItemData {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  notes?: string
}
