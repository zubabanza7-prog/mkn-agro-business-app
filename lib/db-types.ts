// Auto-generated from your database schema — do not edit by hand.
// Regenerates automatically whenever a table is created or altered.

export type AgroNotificationsRow = {
  id: string
  userId: string
  title: string
  message: string
  kind: string
  read: boolean
  createdAt: string
}

export type AgroOrdersRow = {
  id: string
  userId: string
  itemsJson: string
  subtotalFc: number | string
  deliveryFc: number | string
  totalFc: number | string
  city: string
  address: string
  deliveryType: string
  paymentMethod: string
  status: string
  createdAt: string
}

export type AgroProductsRow = {
  id: string
  name: string
  category: string
  priceFc: number | string
  stock: number | string
  available: boolean
  imageUrl: string
  description: string
  rating: number | string
  age: string | null
  weight: string | null
  sex: string | null
  createdAt: string
}
