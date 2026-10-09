import { useState } from 'react'
import { Image } from 'expo-image'
import { Check, ChevronRight, CircleCheck, MapPin, Minus, Plus, ShoppingBag, Trash2, Truck, WalletCards } from '@blinkdotnew/mobile-ui'
import { Button, Input, ScrollView, SizableText, XStack, YStack } from '@blinkdotnew/mobile-ui'
import type { CartLine, Order } from '@/lib/agro'
import { DELIVERY_FEE, GREEN, GREEN_LIGHT, INK, LOCATIONS, MUTED, money, shortDate } from '@/lib/agro'
import { PageTitle, PrimaryButton, Surface } from '@/components/AgroShared'

const paymentOptions = ['Orange Money', 'Airtel Money', 'Carte bancaire', 'Espèces à la livraison', 'Autre moyen de paiement']

export function CartScreen({ lines, onQuantity, onRemove, onContinue, onShop }: {
  lines: CartLine[]; onQuantity: (id: string, count: number) => void; onRemove: (id: string) => void; onContinue: () => void; onShop: () => void
}) {
  const subtotal = lines.reduce((sum, line) => sum + Number(line.product.priceFc) * line.quantity, 0)
  return (
    <ScrollView backgroundColor="#F5F7F2" contentContainerStyle={{ padding: 18, paddingBottom: 30 }}>
      <PageTitle title="Mon panier" subtitle={`${lines.reduce((a, b) => a + b.quantity, 0)} article(s)`} />
      {!lines.length ? <YStack alignItems="center" gap="$3" padding="$6"><ShoppingBag size={42} color={GREEN} /><SizableText color={INK} size="$6" fontWeight="800">Votre panier est vide</SizableText><SizableText color={MUTED} size="$3" textAlign="center">Découvrez les produits frais de nos fermes partenaires.</SizableText><PrimaryButton title="Découvrir la boutique" onPress={onShop} /></YStack> : <YStack gap="$3">
        {lines.map(line => <Surface key={line.product.id}>
          <XStack alignItems="center" gap="$3">
            <YStack width={78} height={78} borderRadius="$4" overflow="hidden" backgroundColor={GREEN_LIGHT}><ImageThumb uri={line.product.imageUrl} /></YStack>
            <YStack flex={1} gap="$1"><SizableText color={INK} size="$4" fontWeight="700">{line.product.name}</SizableText><SizableText color={GREEN} size="$4" fontWeight="800">{money(Number(line.product.priceFc) * line.quantity)}</SizableText><SizableText color={MUTED} size="$2">{money(line.product.priceFc)} / unité</SizableText></YStack>
            <YStack alignItems="center" gap="$1"><XStack alignItems="center" gap="$2"><Button onPress={() => onQuantity(line.product.id, line.quantity - 1)} width={35} height={35} borderRadius="$5" backgroundColor={GREEN_LIGHT}><Minus size={14} color={GREEN} /></Button><SizableText color={INK} fontWeight="800">{line.quantity}</SizableText><Button onPress={() => onQuantity(line.product.id, line.quantity + 1)} width={35} height={35} borderRadius="$5" backgroundColor={GREEN_LIGHT}><Plus size={14} color={GREEN} /></Button></XStack><Button chromeless onPress={() => onRemove(line.product.id)} height={30} icon={<Trash2 size={14} color="#A34D42" />}><SizableText color="#A34D42" size="$2">Retirer</SizableText></Button></YStack>
          </XStack>
        </Surface>)}
        <OrderTotal subtotal={subtotal} delivery={DELIVERY_FEE} />
        <PrimaryButton title="Passer la commande" onPress={onContinue} icon={<ChevronRight size={17} color="#FFFFFF" />} />
      </YStack>}
    </ScrollView>
  )
}

function ImageThumb({ uri }: { uri: string }) {
  return <Image source={{ uri }} contentFit="cover" style={{ width: '100%', height: '100%' }} />
}

function OrderTotal({ subtotal, delivery }: { subtotal: number; delivery: number }) {
  return <Surface><YStack gap="$3"><SizableText color={INK} size="$5" fontWeight="800">Récapitulatif</SizableText><TotalRow label="Sous-total" value={money(subtotal)} /><TotalRow label="Livraison estimée" value={money(delivery)} /><XStack borderTopWidth={1} borderColor="#E9EEE8" paddingTop="$3" justifyContent="space-between"><SizableText color={INK} size="$4" fontWeight="800">Total</SizableText><SizableText color={GREEN} size="$5" fontWeight="800">{money(subtotal + delivery)}</SizableText></XStack><SizableText color={MUTED} size="$2">Soit {money(subtotal + delivery, 'USD')} au taux indicatif du jour.</SizableText></YStack></Surface>
}

function TotalRow({ label, value }: { label: string; value: string }) { return <XStack justifyContent="space-between"><SizableText color={MUTED} size="$3">{label}</SizableText><SizableText color={INK} size="$3" fontWeight="700">{value}</SizableText></XStack> }

export function CheckoutScreen({ lines, city, onCity, address, onAddress, deliveryType, onDeliveryType, extra, onExtra, payment, onPayment, onPlaceOrder, loading, error }: {
  lines: CartLine[]; city: string; onCity: (v: string) => void; address: string; onAddress: (v: string) => void; deliveryType: string; onDeliveryType: (v: string) => void; extra: string; onExtra: (v: string) => void; payment: string; onPayment: (v: string) => void; onPlaceOrder: () => void; loading: boolean; error?: string
}) {
  const [step, setStep] = useState<'delivery' | 'payment'>('delivery')
  const subtotal = lines.reduce((sum, line) => sum + Number(line.product.priceFc) * line.quantity, 0)
  const delivery = deliveryType === 'Retrait en magasin' ? 0 : DELIVERY_FEE
  return (
    <ScrollView backgroundColor="#F5F7F2" contentContainerStyle={{ padding: 18, paddingBottom: 30 }}>
      <PageTitle title={step === 'delivery' ? 'Livraison' : 'Paiement'} subtitle={step === 'delivery' ? 'Où souhaitez-vous recevoir votre commande ?' : 'Choisissez votre mode de paiement'} onBack={() => step === 'payment' ? setStep('delivery') : undefined} />
      {step === 'delivery' ? <YStack gap="$3">
        <Surface><YStack gap="$3"><SizableText color={INK} size="$5" fontWeight="800">Votre ville</SizableText><XStack gap="$2">{LOCATIONS.map(option => <Button key={option} onPress={() => onCity(option)} flex={1} height={48} borderRadius="$5" backgroundColor={city === option ? GREEN : '#F2F5F0'}><SizableText color={city === option ? '#FFFFFF' : GREEN} fontWeight="700">{option}</SizableText></Button>)}</XStack></YStack></Surface>
        <Surface><YStack gap="$3"><SizableText color={INK} size="$5" fontWeight="800">Mode de réception</SizableText>{['Livraison à domicile', 'Retrait en magasin'].map(option => <Button key={option} onPress={() => onDeliveryType(option)} justifyContent="flex-start" borderWidth={1} borderColor={deliveryType === option ? GREEN : '#E7ECE5'} backgroundColor={deliveryType === option ? GREEN_LIGHT : '#FFFFFF'} borderRadius="$4" height={48} icon={deliveryType === option ? <CircleCheck size={17} color={GREEN} /> : <Truck size={17} color={MUTED} />}><SizableText color={INK} fontWeight="600">{option}</SizableText></Button>)}</YStack></Surface>
        <YStack gap="$2"><SizableText color={INK} size="$3" fontWeight="700">Adresse précise</SizableText><Input value={address} onChangeText={onAddress} placeholder="Quartier, avenue, numéro…" backgroundColor="#FFFFFF" borderColor="#E3EAE2" borderRadius="$4" color={INK} minHeight={52} /></YStack>
        <YStack gap="$2"><SizableText color={INK} size="$3" fontWeight="700">Informations supplémentaires</SizableText><Input value={extra} onChangeText={onExtra} placeholder="Repère, consigne au livreur…" backgroundColor="#FFFFFF" borderColor="#E3EAE2" borderRadius="$4" color={INK} minHeight={52} /></YStack>
        <PrimaryButton title="Continuer vers le paiement" onPress={() => setStep('payment')} disabled={deliveryType === 'Livraison à domicile' && !address.trim()} />
      </YStack> : <YStack gap="$3">
        <Surface><YStack gap="$2"><SizableText color={INK} size="$5" fontWeight="800">Mode de paiement</SizableText>{paymentOptions.map(option => <Button key={option} onPress={() => onPayment(option)} justifyContent="flex-start" borderWidth={1} borderColor={payment === option ? GREEN : '#E7ECE5'} backgroundColor={payment === option ? GREEN_LIGHT : '#FFFFFF'} borderRadius="$4" height={48} icon={payment === option ? <CircleCheck size={17} color={GREEN} /> : <WalletCards size={17} color={MUTED} />}><SizableText color={INK} fontWeight="600">{option}</SizableText></Button>)}<SizableText color={MUTED} size="$2">Ce choix sera enregistré avec la commande. Aucun paiement n’est débité depuis l’application pour le moment.</SizableText></YStack></Surface>
        <OrderTotal subtotal={subtotal} delivery={delivery} />
        {error && <SizableText color="#A34D42" size="$3">{error}</SizableText>}
        <PrimaryButton title={loading ? 'Création de la commande…' : 'Confirmer la commande'} onPress={onPlaceOrder} disabled={loading || !payment} />
      </YStack>}
    </ScrollView>
  )
}

export function OrderStatusScreen({ order, onBack, onAccount }: { order: Order | null; onBack: () => void; onAccount: () => void }) {
  const isComplete = Boolean(order)
  const statuses = ['Commande passée', 'En préparation', 'En livraison', 'Livrée']
  const current = Math.max(0, statuses.findIndex(s => s === (order?.status === 'En attente' ? statuses[0] : order?.status)))
  return (
    <ScrollView backgroundColor="#F5F7F2" contentContainerStyle={{ padding: 20, paddingBottom: 30 }}>
      <YStack alignItems="center" gap="$3" paddingVertical="$5"><YStack width={76} height={76} borderRadius="$7" backgroundColor={GREEN_LIGHT} alignItems="center" justifyContent="center"><Check size={38} color={GREEN} strokeWidth={3} /></YStack><SizableText color={INK} size="$8" fontWeight="800" textAlign="center">{isComplete ? 'Commande confirmée !' : 'Suivi de commande'}</SizableText><SizableText color={MUTED} size="$3" textAlign="center">{isComplete ? 'Merci de soutenir les producteurs locaux.' : 'Suivez votre commande à chaque étape.'}</SizableText></YStack>
      {order ? <Surface><YStack gap="$3"><TotalRow label="Numéro de commande" value={order.id} /><TotalRow label="Montant total" value={money(order.totalFc)} /><TotalRow label="Paiement" value={order.paymentMethod} /><TotalRow label="Ville" value={order.city} /><TotalRow label="Date" value={shortDate(order.createdAt)} /></YStack></Surface> : <YStack />}
      <YStack marginTop="$4" gap="$2" padding="$4" backgroundColor="#FFFFFF" borderRadius="$5" borderWidth={1} borderColor="#E8ECE5"><SizableText color={INK} size="$5" fontWeight="800">Progression</SizableText>{statuses.map((status, index) => <XStack key={status} alignItems="center" gap="$3" paddingVertical="$2"><YStack width={28} height={28} borderRadius="$6" alignItems="center" justifyContent="center" backgroundColor={index <= current ? GREEN : '#E8ECE5'}><SizableText color={index <= current ? '#FFFFFF' : MUTED} size="$2" fontWeight="800">{index < current ? '✓' : index + 1}</SizableText></YStack><YStack><SizableText color={index <= current ? GREEN : MUTED} size="$4" fontWeight="700">{status}</SizableText>{index === current && <SizableText color={MUTED} size="$2">Mise à jour dès que le statut change</SizableText>}</YStack></XStack>)}</YStack>
      <XStack gap="$2" marginTop="$4"><Button flex={1} onPress={onAccount} backgroundColor={GREEN_LIGHT} color={GREEN} borderRadius="$5" height={48}>Voir mes commandes</Button><Button flex={1} onPress={onBack} backgroundColor={GREEN} color="#FFFFFF" borderRadius="$5" height={48}>Retour accueil</Button></XStack>
      <Button marginTop="$3" chromeless onPress={() => {}}><SizableText color={GREEN} size="$3" fontWeight="700">Contacter le vendeur · +243 000 000 000</SizableText></Button>
    </ScrollView>
  )
}
