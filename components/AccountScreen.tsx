import { useState } from 'react'
import { Bell, CircleHelp, ClipboardList, LogIn, LogOut, MapPin, Settings, ShieldCheck, UserRound } from '@blinkdotnew/mobile-ui'
import { Button, Input, ScrollView, SizableText, XStack, YStack } from '@blinkdotnew/mobile-ui'
import type { Order } from '@/lib/agro'
import { GREEN, GREEN_LIGHT, INK, MUTED, money, shortDate } from '@/lib/agro'
import { Logo, PageTitle, Surface } from '@/components/AgroShared'

type UserInfo = { id: string; email?: string | null; displayName?: string | null } | null

export function AccountScreen({ user, orders, onAuth, onSignOut, onNavigate, onAdmin }: {
  user: UserInfo; orders: Order[]; onAuth: (mode: 'signin' | 'signup', email: string, password: string, name: string) => Promise<void>; onSignOut: () => void; onNavigate: (screen: string) => void; onAdmin: () => void
}) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async () => {
    setError('')
    if (!email.trim() || !password) { setError('Renseignez votre e-mail et votre mot de passe.'); return }
    setBusy(true)
    try { await onAuth(mode, email.trim(), password, name.trim()) } catch (e) { setError(e instanceof Error ? e.message : 'Connexion impossible.') } finally { setBusy(false) }
  }

  return <ScrollView backgroundColor="#F5F7F2" contentContainerStyle={{ padding: 18, paddingBottom: 30 }}>
    <PageTitle title="Mon compte" subtitle="Vos informations et commandes" />
    {user ? <YStack gap="$3">
      <Surface><XStack alignItems="center" gap="$3"><YStack width={58} height={58} borderRadius="$7" backgroundColor={GREEN_LIGHT} alignItems="center" justifyContent="center"><UserRound size={28} color={GREEN} /></YStack><YStack flex={1}><SizableText color={INK} size="$5" fontWeight="800">{user.displayName || 'Client MKN Agro'}</SizableText><SizableText color={MUTED} size="$3">{user.email}</SizableText></YStack></XStack></Surface>
      <Surface><YStack gap="$2"><XStack justifyContent="space-between" alignItems="center"><SizableText color={INK} size="$5" fontWeight="800">Mes commandes</SizableText><SizableText color={GREEN} size="$3" fontWeight="700">{orders.length}</SizableText></XStack>{orders.length ? orders.slice(0, 5).map(order => <XStack key={order.id} justifyContent="space-between" alignItems="center" paddingVertical="$2" borderTopWidth={1} borderColor="#EEF1EC"><YStack><SizableText color={INK} size="$3" fontWeight="700">{order.id}</SizableText><SizableText color={MUTED} size="$2">{shortDate(order.createdAt)} · {order.status}</SizableText></YStack><SizableText color={GREEN} fontWeight="800">{money(order.totalFc)}</SizableText></XStack>) : <SizableText color={MUTED} size="$3">Vos prochaines commandes apparaîtront ici.</SizableText>}</YStack></Surface>
      <YStack backgroundColor="#FFF8E0" padding="$3" borderRadius="$4"><SizableText color="#69540A" size="$3">Les paiements mobile money et carte sont sélectionnés dans l’app, mais leur traitement en ligne n’est pas encore connecté.</SizableText></YStack>
      <AccountAction icon={<MapPin size={17} color={GREEN} />} title="Mes adresses" onPress={() => onNavigate('settings')} />
      <AccountAction icon={<Bell size={17} color={GREEN} />} title="Notifications" onPress={() => onNavigate('notifications')} />
      <AccountAction icon={<CircleHelp size={17} color={GREEN} />} title="Aide & Contact" onPress={() => onNavigate('about')} />
      <AccountAction icon={<Logo compact />} title="À propos de nous" onPress={() => onNavigate('about')} />
      <Button onPress={onAdmin} backgroundColor={GREEN_LIGHT} color={GREEN} borderRadius="$5" height={48} icon={<ShieldCheck size={17} color={GREEN} />}>Espace gestion · accès de démonstration</Button>
      <Button onPress={onSignOut} backgroundColor="#FFFFFF" color="#A34D42" borderWidth={1} borderColor="#F0DEDA" borderRadius="$5" height={48} icon={<LogOut size={17} color="#A34D42" />}>Déconnexion</Button>
    </YStack> : <YStack gap="$3">
      <YStack backgroundColor={GREEN} borderRadius="$5" padding="$5" gap="$3"><Logo /><SizableText color="#FFFFFF" size="$7" fontWeight="800">Bienvenue chez MKN Agro</SizableText><SizableText color="#DCE9DE" size="$3">Connectez-vous pour enregistrer vos commandes et les suivre.</SizableText></YStack>
      <Surface><YStack gap="$3"><XStack gap="$2"><Button flex={1} onPress={() => setMode('signin')} backgroundColor={mode === 'signin' ? GREEN : GREEN_LIGHT} color={mode === 'signin' ? '#FFFFFF' : GREEN} borderRadius="$4">Connexion</Button><Button flex={1} onPress={() => setMode('signup')} backgroundColor={mode === 'signup' ? GREEN : GREEN_LIGHT} color={mode === 'signup' ? '#FFFFFF' : GREEN} borderRadius="$4">Créer un compte</Button></XStack>
        {mode === 'signup' && <Input value={name} onChangeText={setName} placeholder="Votre nom" color={INK} backgroundColor="#FFFFFF" borderColor="#E4EAE2" borderRadius="$4" height={50} />}
        <Input value={email} onChangeText={setEmail} placeholder="Adresse e-mail" autoCapitalize="none" keyboardType="email-address" color={INK} backgroundColor="#FFFFFF" borderColor="#E4EAE2" borderRadius="$4" height={50} />
        <Input value={password} onChangeText={setPassword} placeholder="Mot de passe" secureTextEntry color={INK} backgroundColor="#FFFFFF" borderColor="#E4EAE2" borderRadius="$4" height={50} />
        {error ? <SizableText color="#A34D42" size="$3">{error}</SizableText> : null}
        <Button onPress={submit} disabled={busy} backgroundColor={GREEN} color="#FFFFFF" borderRadius="$5" height={50} icon={<LogIn size={17} color="#FFFFFF" />}>{busy ? 'Veuillez patienter…' : mode === 'signin' ? 'Se connecter' : 'Créer mon compte'}</Button>
      </YStack></Surface>
      <SizableText color={MUTED} size="$2" textAlign="center">La création de compte utilise une authentification sécurisée par e-mail.</SizableText>
    </YStack>}
  </ScrollView>
}

function AccountAction({ icon, title, onPress }: { icon: React.ReactNode; title: string; onPress: () => void }) {
  return <Button onPress={onPress} justifyContent="flex-start" height={50} borderRadius="$4" backgroundColor="#FFFFFF" borderColor="#E8ECE5" borderWidth={1}><XStack alignItems="center" gap="$3">{icon}<SizableText color={INK} size="$3" fontWeight="700">{title}</SizableText></XStack></Button>
}
