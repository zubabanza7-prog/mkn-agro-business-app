import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ActivityIndicator, Platform } from 'react-native'
import { SizableText, XStack, YStack } from '@blinkdotnew/mobile-ui'
import { blink } from '@/lib/blink'
import type { AgroNotificationsRow, AgroOrdersRow, AgroProductsRow } from '@/lib/db-types'
import type { AppScreen, CartLine, Order, Product } from '@/lib/agro'
import { DELIVERY_FEE, GREEN, LOCATIONS, MUTED, money } from '@/lib/agro'
import { HomeScreen } from '@/components/HomeScreen'
import { CatalogScreen, ProductDetailScreen } from '@/components/CatalogScreens'
import { AccountScreen } from '@/components/AccountScreen'
import { BusinessScreen } from '@/components/BusinessScreens'
import { BottomNavigation } from '@/components/BottomNavigation'
import { CartScreen, CheckoutScreen, OrderStatusScreen } from '@/components/OrderScreens'

const productsTable = blink.db.table<AgroProductsRow>('agro_products')
const ordersTable = blink.db.table<AgroOrdersRow>('agro_orders')
const notificationsTable = blink.db.table<AgroNotificationsRow>('agro_notifications')
type UserInfo = { id: string; email?: string | null; displayName?: string | null } | null

export default function Home() {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<UserInfo>(null)
  const [screen, setScreen] = useState<AppScreen>('home')
  const [city, setCity] = useState(LOCATIONS[0])
  const [category, setCategory] = useState('Tout')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Product | null>(null)
  const [cart, setCart] = useState<Record<string, CartLine>>({})
  const [address, setAddress] = useState('')
  const [extra, setExtra] = useState('')
  const [deliveryType, setDeliveryType] = useState('Livraison à domicile')
  const [payment, setPayment] = useState('Orange Money')
  const [lastOrder, setLastOrder] = useState<Order | null>(null)
  const [notice, setNotice] = useState('')

  useEffect(() => blink.auth.onAuthStateChanged(state => {
    setUser(state.user as UserInfo)
  }), [])

  const productsQuery = useQuery({ queryKey: ['agro-products'], queryFn: () => productsTable.list({ orderBy: { createdAt: 'desc' } }) })
  const ordersQuery = useQuery({ queryKey: ['agro-orders', user?.id], queryFn: () => ordersTable.list({ where: { userId: user?.id || '' }, orderBy: { createdAt: 'desc' }, limit: 50 }), enabled: Boolean(user?.id) })
  const notificationsQuery = useQuery({ queryKey: ['agro-notifications', user?.id], queryFn: () => notificationsTable.list({ where: { userId: user?.id || '' }, orderBy: { createdAt: 'desc' }, limit: 30 }), enabled: Boolean(user?.id) })
  const products = (productsQuery.data || []) as Product[]
  const orders = (ordersQuery.data || []) as Order[]
  const lines = Object.values(cart)
  const subtotal = lines.reduce((sum, line) => sum + Number(line.product.priceFc) * line.quantity, 0)
  const cartCount = lines.reduce((sum, line) => sum + line.quantity, 0)

  const orderMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Connectez-vous avant de confirmer votre commande.')
      const delivery = deliveryType === 'Retrait en magasin' ? 0 : DELIVERY_FEE
      const orderId = `MKN-${Date.now().toString().slice(-8)}`
      const created = await ordersTable.create({
        id: orderId, userId: user.id,
        itemsJson: JSON.stringify(lines.map(line => ({ productId: line.product.id, name: line.product.name, quantity: line.quantity, priceFc: Number(line.product.priceFc) }))),
        subtotalFc: subtotal, deliveryFc: delivery, totalFc: subtotal + delivery, city,
        address: deliveryType === 'Retrait en magasin' ? 'Retrait en magasin' : `${address}${extra ? ` — ${extra}` : ''}`,
        deliveryType, paymentMethod: payment, status: 'En attente',
      })
      await notificationsTable.create({ title: 'Commande enregistrée', message: `Votre commande ${orderId} est en attente de confirmation.`, kind: 'order', read: false, userId: user.id })
      return created as Order
    },
    onSuccess: async order => {
      setLastOrder(order)
      setCart({})
      setScreen('success')
      setNotice('Commande enregistrée. Le vendeur confirmera le paiement et la livraison.')
      await Promise.all([queryClient.invalidateQueries({ queryKey: ['agro-orders', user?.id] }), queryClient.invalidateQueries({ queryKey: ['agro-notifications', user?.id] })])
    },
  })

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => ({ ...prev, [product.id]: { product, quantity: (prev[product.id]?.quantity || 0) + quantity } }))
    setSelected(null)
    setScreen('cart')
    setNotice(`${product.name} ajouté au panier`)
  }
  const setQuantity = (id: string, quantity: number) => setCart(prev => {
    if (quantity <= 0) { const next = { ...prev }; delete next[id]; return next }
    return { ...prev, [id]: { ...prev[id], quantity: Math.min(quantity, Number(prev[id].product.stock)) } }
  })
  const navigate = (target: AppScreen) => { setSelected(null); setNotice(''); setScreen(target) }
  const auth = async (mode: 'signin' | 'signup', email: string, password: string, name: string) => {
    if (mode === 'signup') await blink.auth.signUp({ email, password, metadata: { displayName: name } })
    else await blink.auth.signInWithEmail(email, password)
  }
  const placeOrder = () => {
    if (!user) { setNotice('Connectez-vous depuis Mon compte pour enregistrer cette commande.'); setScreen('account'); return }
    if (!lines.length) { setScreen('cart'); return }
    orderMutation.mutate()
  }

  if (productsQuery.isLoading) return <YStack flex={1} backgroundColor="#F5F7F2" alignItems="center" justifyContent="center" gap="$3"><ActivityIndicator color={GREEN} /><SizableText color={GREEN} size="$4" fontWeight="700">Préparation de la boutique…</SizableText></YStack>
  if (productsQuery.isError) return <YStack flex={1} backgroundColor="#F5F7F2" alignItems="center" justifyContent="center" padding="$5"><SizableText color={GREEN} size="$5" fontWeight="800">La boutique ne répond pas</SizableText><SizableText color={MUTED} size="$3" textAlign="center">{productsQuery.error instanceof Error ? productsQuery.error.message : 'Vérifiez votre connexion et réessayez.'}</SizableText></YStack>

  return <YStack flex={1} backgroundColor="#F5F7F2" alignItems="center">
    <YStack flex={1} width="100%" maxWidth={1100}>
      {selected ? <ProductDetailScreen product={selected} onBack={() => setSelected(null)} onAdd={addToCart} /> : screen === 'home' ? <HomeScreen products={products} city={city} onCity={setCity} onSearch={value => { setSearch(value); setCategory('Tout'); setScreen('shop') }} onShop={value => { setCategory(value || 'Tout'); setSearch(''); setScreen('shop') }} onProduct={setSelected} /> : null}
      {!selected && screen === 'shop' && <CatalogScreen products={products} category={category} onCategory={setCategory} search={search} onSearch={setSearch} onProduct={setSelected} />}
      {!selected && screen === 'cart' && <CartScreen lines={lines} onQuantity={setQuantity} onRemove={id => setQuantity(id, 0)} onContinue={() => lines.length ? setScreen('checkout') : setScreen('shop')} onShop={() => setScreen('shop')} />}
      {!selected && screen === 'checkout' && <CheckoutScreen lines={lines} city={city} onCity={setCity} address={address} onAddress={setAddress} deliveryType={deliveryType} onDeliveryType={setDeliveryType} extra={extra} onExtra={setExtra} payment={payment} onPayment={setPayment} onPlaceOrder={placeOrder} loading={orderMutation.isPending} error={orderMutation.error instanceof Error ? orderMutation.error.message : notice} />}
      {!selected && (screen === 'success' || screen === 'tracking') && <OrderStatusScreen order={screen === 'success' ? lastOrder : lastOrder || orders[0] || null} onBack={() => navigate('home')} onAccount={() => navigate('account')} />}
      {!selected && screen === 'account' && <AccountScreen user={user} orders={orders} onAuth={auth} onSignOut={() => blink.auth.signOut()} onNavigate={name => navigate(name as AppScreen)} onAdmin={() => navigate('admin')} />}
      {!selected && ['admin', 'inventory', 'sales', 'notifications', 'settings', 'about'].includes(screen) && <BusinessScreen screen={screen} products={products} orders={orders} notifications={notificationsQuery.data || []} onBack={() => navigate('account')} onNavigate={navigate} />}
      {notice && screen !== 'checkout' && <XStack position="absolute" top={10} left="$4" right="$4" backgroundColor={GREEN} padding="$3" borderRadius="$4" zIndex={5}><SizableText color="#FFFFFF" size="$3" fontWeight="700">{notice}</SizableText></XStack>}
    </YStack>
    {!selected && <YStack width="100%" maxWidth={1100}><BottomNavigation active={screen} cartCount={cartCount} onNavigate={navigate} /></YStack>}
    {Platform.OS === 'web' ? <SizableText position="absolute" bottom={72} right={18} color="#839086" size="$1">MKN Agro Business · FC / USD</SizableText> : null}
  </YStack>
}
