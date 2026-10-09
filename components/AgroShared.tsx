import { Platform, Pressable } from 'react-native'
import { Image } from 'expo-image'
import { ArrowLeft, Leaf, MapPin, Star } from '@blinkdotnew/mobile-ui'
import { Button, SizableText, XStack, YStack } from '@blinkdotnew/mobile-ui'
import type { Product } from '@/lib/agro'
import { BG, GREEN, GREEN_LIGHT, INK, MUTED, money } from '@/lib/agro'

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <XStack alignItems="center" gap="$2">
      <YStack width={compact ? 34 : 40} height={compact ? 34 : 40} borderRadius="$4" backgroundColor={GREEN} alignItems="center" justifyContent="center">
        <Leaf size={compact ? 18 : 21} color="#FFFFFF" />
      </YStack>
      <YStack gap={0}>
        <SizableText color={GREEN} size={compact ? "$4" : "$5"} fontWeight="800">MKN Agro</SizableText>
        {!compact && <SizableText color={MUTED} size="$2">BUSINESS</SizableText>}
      </YStack>
    </XStack>
  )
}

export function PageTitle({ title, subtitle, onBack, action }: { title: string; subtitle?: string; onBack?: () => void; action?: React.ReactNode }) {
  return (
    <XStack alignItems="center" justifyContent="space-between" gap="$3" paddingVertical="$3">
      <XStack alignItems="center" gap="$3" flex={1}>
        {onBack && <Button chromeless onPress={onBack} width={42} height={42} backgroundColor="#FFFFFF" borderRadius="$5"><ArrowLeft size={19} color={GREEN} /></Button>}
        <YStack flex={1}>
          <SizableText color={INK} size="$7" fontWeight="800">{title}</SizableText>
          {subtitle && <SizableText color={MUTED} size="$3">{subtitle}</SizableText>}
        </YStack>
      </XStack>
      {action}
    </XStack>
  )
}

export function ProductCard({ product, onPress, compact = false, currency = 'FC' }: { product: Product; onPress: () => void; compact?: boolean; currency?: 'FC' | 'USD' }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ width: compact ? 184 : '48%', transform: [{ scale: pressed ? 0.98 : 1 }], opacity: pressed ? 0.94 : 1 })}>
      <YStack backgroundColor="#FFFFFF" borderRadius="$5" overflow="hidden" borderWidth={1} borderColor="#E8ECE5">
        <YStack height={compact ? 118 : 142}>
          <Image source={{ uri: product.imageUrl }} contentFit="cover" style={{ width: '100%', height: '100%' }} transition={180} />
          <YStack position="absolute" top={10} left={10} backgroundColor="#FFFFFFE8" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$5">
            <SizableText color={GREEN} size="$2" fontWeight="700">{Number(product.stock) > 0 ? 'En stock' : 'Indisponible'}</SizableText>
          </YStack>
        </YStack>
        <YStack padding="$3" gap="$2">
          <SizableText color={INK} size="$4" fontWeight="700" numberOfLines={1}>{product.name}</SizableText>
          <XStack alignItems="center" justifyContent="space-between" gap="$2">
            <SizableText color={GREEN} size="$4" fontWeight="800">{money(product.priceFc)}</SizableText>
            <XStack alignItems="center" gap="$1"><Star size={13} color="#D7A600" fill="#D7A600" /><SizableText color={MUTED} size="$2">{Number(product.rating).toFixed(1)}</SizableText></XStack>
          </XStack>
          {!compact && <SizableText color={MUTED} size="$2">{product.category} · {product.stock} disponibles</SizableText>}
        </YStack>
      </YStack>
    </Pressable>
  )
}

export function LocationLabel({ city }: { city: string }) {
  return <XStack alignItems="center" gap="$1"><MapPin size={14} color={GREEN} /><SizableText color={GREEN} size="$3" fontWeight="700">{city}</SizableText></XStack>
}

export function Surface({ children, padding = '$4' }: { children: React.ReactNode; padding?: string }) {
  return <YStack backgroundColor="#FFFFFF" borderRadius="$5" borderWidth={1} borderColor="#E8ECE5" padding={padding as any}>{children}</YStack>
}

export function PrimaryButton({ title, onPress, disabled = false, icon }: { title: string; onPress: () => void; disabled?: boolean; icon?: React.ReactNode }) {
  return <Button onPress={onPress} disabled={disabled} backgroundColor={GREEN} color="#FFFFFF" borderRadius="$5" height={50} fontWeight="700" opacity={disabled ? 0.5 : 1}><XStack alignItems="center" justifyContent="center" gap="$2">{icon}<SizableText color="#FFFFFF" fontWeight="700">{title}</SizableText></XStack></Button>
}

export function PageBackground({ children }: { children: React.ReactNode }) {
  return <YStack flex={1} backgroundColor={BG} paddingHorizontal="$4">{children}</YStack>
}

export function hapticSelection() {
  if (Platform.OS !== 'web') void import('expo-haptics').then(({ selectionAsync }) => selectionAsync())
}
