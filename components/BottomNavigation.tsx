import { Bell, ClipboardList, Home, ShoppingBag, ShoppingCart, UserRound } from '@blinkdotnew/mobile-ui'
import { Button, SizableText, XStack, YStack } from '@blinkdotnew/mobile-ui'
import type { AppScreen } from '@/lib/agro'
import { GREEN, MUTED } from '@/lib/agro'

const tabs: { id: AppScreen; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Accueil', icon: Home },
  { id: 'shop', label: 'Boutique', icon: ShoppingBag },
  { id: 'cart', label: 'Panier', icon: ShoppingCart },
  { id: 'tracking', label: 'Commandes', icon: ClipboardList },
  { id: 'account', label: 'Compte', icon: UserRound },
]

export function BottomNavigation({ active, cartCount, onNavigate }: { active: AppScreen; cartCount: number; onNavigate: (screen: AppScreen) => void }) {
  const selected = active === 'success' ? 'tracking' : active
  return <XStack backgroundColor="#FFFFFF" borderTopWidth={1} borderColor="#E8ECE5" paddingHorizontal="$2" paddingTop="$2" paddingBottom="$2" justifyContent="space-around">
    {tabs.map(tab => {
      const Icon = tab.icon
      const isActive = selected === tab.id
      return <Button key={tab.id} chromeless flex={1} height={55} onPress={() => onNavigate(tab.id)} paddingHorizontal="$1">
        <YStack alignItems="center" gap="$1" position="relative">
          <Icon size={20} color={isActive ? GREEN : MUTED} />
          {tab.id === 'cart' && cartCount > 0 ? <YStack position="absolute" top={-6} right={-12} minWidth={16} height={16} borderRadius="$5" backgroundColor="#F4C542" alignItems="center" justifyContent="center"><SizableText color={GREEN} size="$1" fontWeight="800">{cartCount}</SizableText></YStack> : null}
          <SizableText color={isActive ? GREEN : MUTED} size="$1" fontWeight={isActive ? '800' : '600'}>{tab.label}</SizableText>
        </YStack>
      </Button>
    })}
  </XStack>
}
