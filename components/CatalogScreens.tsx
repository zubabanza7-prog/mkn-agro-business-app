import { useState } from 'react'
import { Image } from 'expo-image'
import { ArrowLeft, Check, Minus, Plus, ShoppingBag, Star } from '@blinkdotnew/mobile-ui'
import { Button, Input, ScrollView, SizableText, XStack, YStack } from '@blinkdotnew/mobile-ui'
import type { Product } from '@/lib/agro'
import { CATEGORIES, GREEN, GREEN_LIGHT, INK, MUTED, money } from '@/lib/agro'
import { PageTitle, ProductCard, PrimaryButton } from '@/components/AgroShared'

export function CatalogScreen({ products, category, onCategory, search, onSearch, onProduct }: {
  products: Product[]; category: string; onCategory: (category: string) => void; search: string; onSearch: (value: string) => void; onProduct: (product: Product) => void
}) {
  const filtered = products.filter(p => (category === 'Tout' || p.category === category) && p.name.toLocaleLowerCase('fr').includes(search.toLocaleLowerCase('fr')))
  return (
    <ScrollView backgroundColor="#F5F7F2" contentContainerStyle={{ padding: 18, paddingBottom: 28 }}>
      <PageTitle title="La boutique" subtitle={`${filtered.length} produits disponibles`} />
      <XStack backgroundColor="#FFFFFF" borderWidth={1} borderColor="#E8ECE5" borderRadius="$5" alignItems="center" paddingHorizontal="$3" gap="$2" marginTop="$2">
        <Input flex={1} placeholder="Rechercher dans la boutique" value={search} onChangeText={onSearch} borderWidth={0} backgroundColor="transparent" color={INK} height={46} />
      </XStack>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 16 }}>
        {CATEGORIES.map(item => <Button key={item} onPress={() => onCategory(item)} borderRadius="$5" backgroundColor={category === item ? GREEN : '#FFFFFF'} borderWidth={1} borderColor={category === item ? GREEN : '#E4EAE2'} height={38} paddingHorizontal="$3"><SizableText color={category === item ? '#FFFFFF' : GREEN} size="$3" fontWeight="700">{item}</SizableText></Button>)}
      </ScrollView>
      {filtered.length ? <XStack flexWrap="wrap" justifyContent="space-between" gap="$3">
        {filtered.map(product => <ProductCard key={product.id} product={product} onPress={() => onProduct(product)} />)}
      </XStack> : <YStack alignItems="center" padding="$6" gap="$3"><ShoppingBag size={34} color={GREEN} /><SizableText color={INK} size="$5" fontWeight="700">Aucun produit trouvé</SizableText><SizableText color={MUTED} size="$3">Essayez une autre recherche ou catégorie.</SizableText></YStack>}
    </ScrollView>
  )
}

export function ProductDetailScreen({ product, onBack, onAdd }: { product: Product; onBack: () => void; onAdd: (product: Product, quantity: number) => void }) {
  const [quantity, setQuantity] = useState(1)
  return (
    <ScrollView backgroundColor="#F5F7F2" contentContainerStyle={{ paddingBottom: 30 }}>
      <YStack height={290}>
        <Image source={{ uri: product.imageUrl }} contentFit="cover" style={{ width: '100%', height: '100%' }} />
        <Button position="absolute" top={18} left={18} onPress={onBack} width={44} height={44} borderRadius="$6" backgroundColor="#FFFFFFE8"><ArrowLeft size={18} color={GREEN} /></Button>
      </YStack>
      <YStack padding="$4" gap="$3">
        <XStack justifyContent="space-between" alignItems="flex-start" gap="$3">
          <YStack flex={1} gap="$1"><SizableText color={GREEN} size="$2" fontWeight="800">{product.category.toUpperCase()}</SizableText><SizableText color={INK} size="$8" fontWeight="800">{product.name}</SizableText></YStack>
          <XStack alignItems="center" gap="$1" backgroundColor="#FFF5D5" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$4"><Star size={14} color="#D7A600" fill="#D7A600" /><SizableText color={INK} size="$3" fontWeight="700">{Number(product.rating).toFixed(1)}</SizableText></XStack>
        </XStack>
        <SizableText color={GREEN} size="$7" fontWeight="800">{money(product.priceFc)}</SizableText>
        <SizableText color={MUTED} size="$3">{money(product.priceFc, 'USD')} environ · taux indicatif</SizableText>
        <SizableText color="#4B5A50" size="$4" lineHeight={24}>{product.description}</SizableText>
        <XStack flexWrap="wrap" gap="$2">
          {[product.age && `Âge : ${product.age}`, product.weight && `Poids : ${product.weight}`, product.sex && `Sexe : ${product.sex}`].filter(Boolean).map(item => <YStack key={item} backgroundColor={GREEN_LIGHT} paddingHorizontal="$3" paddingVertical="$2" borderRadius="$4"><SizableText color={GREEN} size="$3" fontWeight="600">{item}</SizableText></YStack>)}
          <XStack alignItems="center" gap="$1" backgroundColor="#EFF5EF" paddingHorizontal="$3" paddingVertical="$2" borderRadius="$4"><Check size={14} color={GREEN} /><SizableText color={GREEN} size="$3" fontWeight="600">{product.stock} disponibles</SizableText></XStack>
        </XStack>
        <XStack alignItems="center" justifyContent="space-between" marginTop="$3" padding="$3" backgroundColor="#FFFFFF" borderRadius="$5" borderWidth={1} borderColor="#E8ECE5">
          <YStack><SizableText color={INK} size="$4" fontWeight="700">Quantité</SizableText><SizableText color={MUTED} size="$2">{money(Number(product.priceFc) * quantity)}</SizableText></YStack>
          <XStack alignItems="center" gap="$3"><Button onPress={() => setQuantity((q: number) => Math.max(1, q - 1))} width={42} height={42} borderRadius="$5" backgroundColor={GREEN_LIGHT}><Minus size={17} color={GREEN} /></Button><SizableText color={INK} size="$5" fontWeight="800">{quantity}</SizableText><Button onPress={() => setQuantity((q: number) => Math.min(Number(product.stock), q + 1))} width={42} height={42} borderRadius="$5" backgroundColor={GREEN_LIGHT}><Plus size={17} color={GREEN} /></Button></XStack>
        </XStack>
        <PrimaryButton title="Ajouter au panier" icon={<ShoppingBag size={17} color="#FFFFFF" />} disabled={Number(product.stock) < 1} onPress={() => onAdd(product, quantity)} />
      </YStack>
    </ScrollView>
  )
}
