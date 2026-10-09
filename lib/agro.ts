import type { AgroProductsRow, AgroOrdersRow } from '@/lib/db-types'

export type Product = AgroProductsRow
export type Order = AgroOrdersRow
export type Currency = 'FC' | 'USD'
export type CartLine = { product: Product; quantity: number }
export type AppScreen = 'home' | 'shop' | 'cart' | 'checkout' | 'payment' | 'success' | 'tracking' | 'account' | 'admin' | 'inventory' | 'sales' | 'notifications' | 'settings' | 'about'

export const GREEN = '#173F2C'
export const GREEN_LIGHT = '#E6F0E5'
export const BG = '#F5F7F2'
export const GOLD = '#F4C542'
export const INK = '#1E2D23'
export const MUTED = '#718078'
export const CATEGORIES = ['Tout', 'Œufs', 'Poules', 'Poulets de chair', 'Porcs', 'Cailles', 'Lapins', 'Autres animaux', 'Agriculture']
export const LOCATIONS = ['Lubumbashi', 'Kolwezi']
export const DELIVERY_FEE = 5000
export const USD_RATE = 2800

export function money(fc: number | string, currency: 'FC' | 'USD' = 'FC') {
  const value = Number(fc) || 0
  if (currency === 'USD') return `$${(value / USD_RATE).toFixed(2)}`
  return `${new Intl.NumberFormat('fr-FR').format(value)} FC`
}

export function shortDate(date?: string) {
  return date ? new Date(date).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }) : 'Aujourd’hui'
}

export function errorText(error: unknown) {
  return error instanceof Error ? error.message : 'Une erreur est survenue. Réessayez.'
}
