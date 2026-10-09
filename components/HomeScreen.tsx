import { Image } from 'expo-image'
import { Search, ChevronRight, MapPin, Sparkles } from '@blinkdotnew/mobile-ui'
import { Button, Input, ScrollView, SizableText, XStack, YStack } from '@blinkdotnew/mobile-ui'
import type { Product } from '@/lib/agro'
import { BG, CATEGORIES, GREEN, GREEN_LIGHT, INK, LOCATIONS, MUTED, money } from '@/lib/agro'
import { Logo, LocationLabel, ProductCard } from '@/components/AgroShared'
import { useState } from 'react'
import type { Currency } from '@/lib/agro'

export function HomeScreen({ products, city, onCity, onSearch, onShop, onProduct, currency, onCurrency }: {
  products: Product[]; city: string; onCity: (city: string) => void; onSearch: (value: string) => void; onShop: (category?: string) => void; onProduct: (product: Product) => void; currency: Currency; onCurrency: () => void
}) {
  const [query, setQuery] = useState('')
  return (
    <ScrollView backgroundColor={BG} contentContainerStyle={{ padding: 18, paddingBottom: 28 }}>
      <XStack justifyContent="space-between" alignItems="center" paddingVertical="$2">
        <YStack gap="$1"><Logo /><SizableText color={MUTED} size="$2">Élever aujourd’hui, nourrir demain</SizableText></YStack>
        <XStack gap="$2"><Button chromeless onPress={onCurrency} backgroundColor="#FFFFFF" borderWidth={1} borderColor="#E4EAE2" borderRadius="$5" height={42} paddingHorizontal="$3"><SizableText color={GREEN} size="$3" fontWeight="800">{currency}</SizableText></Button><Button chromeless onPress={() => onCity(city === LOCATIONS[0] ? LOCATIONS[1] : LOCATIONS[0])} backgroundColor="#FFFFFF" borderWidth={1} borderColor="#E4EAE2" borderRadius="$5" height={42} icon={<MapPin size={15} color={GREEN} />}>
          <SizableText color={GREEN} size="$3" fontWeight="700">{city}</SizableText>
        </Button></XStack>
      </XStack>
      <YStack height={210} borderRadius="$6" overflow="hidden" marginTop="$4" backgroundColor={GREEN}>
        <Image source={{ uri: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=90' }} contentFit="cover" style={{ position: 'absolute', width: '100%', height: '100%' }} />
        <YStack flex={1} justifyContent="center" padding="$5" gap="$2" backgroundColor="#143A2BCB">
          <XStack alignItems="center" gap="$2"><Sparkles size={15} color="#F4C542" /><SizableText color={GREEN_LIGHT} size="$2" fontWeight="800">DU CHAMP À VOTRE TABLE</SizableText></XStack>
          <SizableText color="#FFFFFF" size="$8" fontWeight="800" maxWidth={380}>L’agriculture locale, simplement.</SizableText>
          <SizableText color="#EDF4E9" size="$3" maxWidth={350}>Des produits frais et des animaux élevés avec soin, près de chez vous.</SizableText>
          <Button onPress={() => onShop()} backgroundColor="#F4C542" color={GREEN} fontWeight="800" borderRadius="$5" alignSelf="flex-start" marginTop="$2">Découvrir la boutique <ChevronRight size={16} color={GREEN} /></Button>
        </YStack>
      </YStack>
      <XStack marginTop="$4" backgroundColor="#FFFFFF" borderWidth={1} borderColor="#E8ECE5" borderRadius="$5" alignItems="center" paddingHorizontal="$3" gap="$2">
        <Search size={19} color={MUTED} /><Input flex={1} placeholder="Rechercher un produit…" value={query} onChangeText={setQuery} onSubmitEditing={() => onSearch(query)} borderWidth={0} backgroundColor="transparent" color={INK} height={48} /><Button chromeless onPress={() => onSearch(query)} color={GREEN} fontWeight="700">Rechercher</Button>
      </XStack>
      <XStack justifyContent="space-between" alignItems="center" marginTop="$5" marginBottom="$3">
        <YStack><SizableText color={INK} size="$6" fontWeight="800">Nos catégories</SizableText><SizableText color={MUTED} size="$3">Tout ce qu’il vous faut à la ferme</SizableText></YStack>
        <Button chromeless onPress={() => onShop()} color={GREEN} fontWeight="700">Tout voir <ChevronRight size={16} color={GREEN} /></Button>
      </XStack>
      <XStack flexWrap="wrap" gap="$2">
        {CATEGORIES.slice(1, 8).map((category, index) => (
          <Button key={category} onPress={() => onShop(category)} backgroundColor="#FFFFFF" borderColor="#E6ECE4" borderWidth={1} borderRadius="$5" height={42} paddingHorizontal="$3" icon={<SizableText size="$4">{['🥚','🐔','🍗','🐖','🐦','🐇','🐐'][index]}</SizableText>}>
            <SizableText color={GREEN} size="$3" fontWeight="700">{category}</SizableText>
          </Button>
        ))}
      </XStack>
      <XStack justifyContent="space-between" alignItems="center" marginTop="$5" marginBottom="$3">
        <YStack><SizableText color={INK} size="$6" fontWeight="800">Les plus appréciés</SizableText><SizableText color={MUTED} size="$3">La qualité de nos fermes partenaires</SizableText></YStack>
        <Button chromeless onPress={() => onShop()} color={GREEN} fontWeight="700">Voir tout</Button>
      </XStack>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 8 }}>
        {products.slice(0, 6).map(product => <ProductCard key={product.id} product={product} compact currency={currency} onPress={() => onProduct(product)} />)}
      </ScrollView>
      <YStack marginTop="$4" padding="$4" borderRadius="$5" backgroundColor={GREEN_LIGHT} gap="$2">
        <SizableText color={GREEN} size="$5" fontWeight="800">Une nouvelle récolte vous attend</SizableText>
        <SizableText color="#52695B" size="$3">Livraison disponible à Kolwezi et Lubumbashi. Commandez auprès de producteurs locaux.</SizableText>
      </YStack>
      <SizableText color={MUTED} size="$2" textAlign="center" marginTop="$4">Prix indicatifs · {products.length} produits disponibles · FC / USD</SizableText>
    </ScrollView>
  )
}
