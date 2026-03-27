# STRATIGRAPH - REACT COMPONENT MIMARÎS REHBERİ

## 📊 Component Hiyerarşisi

```
App (Ana Wrapper)
├── AuthProvider (Global State: Oturum, Kullanıcı)
│   └── ChatProvider (Global State: Mesajlar, Katmanlar, Realtime)
│       └── MainLayout
│           ├── Sidebar
│           │   ├── LayerSelector
│           │   │   └── LayerItem[] (Her katman)
│           │   ├── UserProfile
│           │   └── ActiveUsers
│           │
│           ├── Header
│           │   ├── LayerInfo (Seçili katmanın detayları)
│           │   └── SystemStatus (Realtime durumu)
│           │
│           ├── ChatWindow
│           │   └── MessageItem[] (Her mesaj)
│           │       ├── ArtifactBadge
│           │       ├── MessageActions
│           │       └── MessageContent
│           │
│           └── MessageInput
│               ├── TextArea
│               ├── ArtifactToggle
│               └── SendButton
│
└── Modal Components (Portal)
    ├── LayerDetailsModal
    ├── ArtifactDetailsModal
    └── EgyptianNameGenerator
```

---

## 🔑 CONTEXT API YAPISI

### 1. AuthContext
**Amaç**: Kullanıcı oturumu ve kimlik yönetimi

```typescript
interface User {
  sessionId: string;
  ancientName: string;
  currentLayerId: string;
  status: 'online' | 'away' | 'offline';
  lastSeen: Date;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  updateStatus: (status: 'online' | 'away' | 'offline') => void;
}
```

**Kullanım**:
```tsx
const { user, setUser, logout, updateStatus } = useAuth();
```

### 2. ChatContext
**Amaç**: Mesajlar, katmanlar ve realtime state yönetimi

```typescript
interface ChatContextType {
  layers: Layer[];
  currentLayerId: string | null;
  messages: Message[];
  activeUsers: any[];
  setCurrentLayer: (layerId: string) => void;
  addMessage: (message: Message) => void;
  updateMessageReaction: (messageId: string, type: 'restore' | 'destroy', delta: number) => void;
  loading: boolean;
  error: string | null;
}
```

**Kullanım**:
```tsx
const { layers, currentLayerId, messages, setCurrentLayer, addMessage } = useChat();
```

---

## 📁 FILE STRUCTURE

```
src/
├── components/
│   ├── ArchitectureGuide.tsx          # Ana export: Context + Components
│   ├── Sidebar.tsx                    # Duvar navigasyonu
│   ├── ChatWindow.tsx                 # Mesaj listesi
│   ├── MessageItem.tsx                # Tek mesaj kartı
│   ├── MessageInput.tsx               # Yazma formu
│   ├── Header.tsx                     # Üst bar
│   └── Modals/
│       ├── LayerDetailsModal.tsx
│       ├── ArtifactDetailsModal.tsx
│       └── NameGeneratorModal.tsx
│
├── hooks/
│   ├── useRealtimeHooks.ts            # Supabase Realtime hooks
│   ├── useLocalStorage.ts             # Session bilgileri
│   └── useWindowSize.ts               # Responsive design
│
├── lib/
│   └── supabaseClient.ts              # Supabase SDK & helpers
│
├── styles/
│   └── globals.css                    # Tailwind + Custom animasyonlar
│
├── types/
│   └── index.ts                       # TypeScript interfaces
│
├── App.tsx                            # Ana wrapper
└── main.tsx                           # Entry point
```

---

## 🎯 KEY COMPONENTS

### LayerSelector
Katmanlar arasında geçiş yapar.

```tsx
<LayerSelector />
// İç görevleri:
// - layers'ı kategoriler'e ayırır (chronological, thematic, special)
// - Seçili katmanı vurgular
// - onClick → setCurrentLayer(layerId)
```

### ChatWindow
Seçili katmandaki tüm mesajları gösterir.

```tsx
const { messages, currentLayerId } = useChat();
const layerMessages = messages.filter(m => m.layerId === currentLayerId);
// messageItem bileşenleri render et
```

### MessageItem
Tek bir mesajın UI'ı (buluntusu, oyları, vb.)

```tsx
interface MessageItemProps {
  message: Message;
}
// ArtifactBadge (eğer is_artifact === true)
// MessageActions (Restore/Destroy buttons)
// Content rendering
```

### MessageInput
Yeni mesaj yazma ve envanterlik işaretleme

```tsx
<input placeholder="Arkeolojik buluntunuzu yazın..." />
<label>
  <input type="checkbox" onChange={(e) => setIsArtifact(e.target.checked)} />
  📦 Bunu envanterlik olarak işaretle
</label>
{isArtifact && <input placeholder="Etiketi gir..." />}
<button onClick={handleSend}>⬆️ Tabakaya Gönder</button>
```

---

## 🔌 REALTIME INTEGRATION

### Hook: useRealtimeMessages
```tsx
useRealtimeMessages(
  currentLayerId,
  (message) => {
    // Her INSERT/UPDATE olayı für bu katman
    addMessage(message);
  }
);
```

### Hook: useRealtimeActiveUsers
```tsx
const { activeUsers } = useRealtimeActiveUsers(currentLayerId);
// Aktif kullanıcılar dinamik güncellenir
```

### Hook: useRealtimeReactions
```tsx
useRealtimeReactions(
  messageId,
  (restore, destroy) => {
    updateMessageVotes(restore, destroy);
  }
);
```

---

## 📊 STATE MANAGEMENT AKIŞI

### Şu Durum Akışı:

```
1. Kullanıcı katman seçer
   ↓
2. setCurrentLayer(layerId) çağrılır (ChatContext)
   ↓
3. useEffect → Eski channel'i sil
   ↓
4. Yeni katman için Realtime channel kur
   ↓
5. İlk mesajları SQLから getir
   ↓
6. useRealtimeMessages dinleme başladı
   ↓
7. Her yeni mesaj/oy → addMessage() veya updateMessageReaction()
   ↓
8. State güncellendi → Component re-render
```

### Mesaj Ekleme:

```
1. Kullanıcı "Gönder" tıklar
   ↓
2. MessageInput → supabase.from('messages').insert()
   ↓
3. PostgreSQL INSERT olayı Realtime'a emit
   ↓
4. useRealtimeMessages dinlemesi yakalar
   ↓
5. onMessageReceived callback çağrılır
   ↓
6. addMessage(message) → ChatContext state'ini günceller
   ↓
7. ChatWindow re-render edilir
```

---

## 🎨 STYLING STRATEGY

### Tailwind + Custom CSS:

**tailwind.config.js**:
- `colors.earth.*`: Toprak tonu paletini
- `colors.restore` / `colors.destroy` / `colors.artifact`: Aksanlar
- `animation.*`: Custom animasyonlar (artifactPulse, messageSlide, vb.)
- `fontFamily.serif`, `.sans`, `.mono`: Yazı tipi seçimleri

**globals.css**:
- `@keyframes artifactPulse`: Envanterlik mesaj pulsing
- `@keyframes messageSlide`: Yeni mesaj gelişi

**Component Styling**:
```tsx
<div className="p-4 bg-white rounded-lg border-l-4 border-artifact hover:bg-earth-50 transition-colors">
  {message.content}
</div>
```

---

## 🔄 LIFECYCLE HOOKS

### useEffect: Katman değişikliği
```tsx
useEffect(() => {
  // Eski channel'i temizle
  return () => unsubscribe();
}, [currentLayerId]);
```

### useEffect: İlk yükleme
```tsx
useEffect(() => {
  healthCheck(); // Supabase bağlantısını doğrula
}, []);
```

### useEffect: Window boyutu (Responsive)
```tsx
useEffect(() => {
  const handleResize = () => {
    // Responsive davranış
  };
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

---

## ✨ ÖZEL ÖĞELER

### 1. Envanterlik Sistemi
- `message.is_artifact === true`
- `message.artifact_label` (örn: "Çift Körüklü Seramik")
- UI: ArtifactBadge + glow animation

### 2. Oy Sistemi
- UNIQUE constraint: `(message_id, user_session_id)` → her kullanıcı mesaj başına 1 kez oy
- INSERT → Otomatik restore_count/destroy_count artar (SQL triggers veya app logic)
- useRealtimeReactions dinler güncellemi

### 3. Aktif Kullanıcılar
- `active_users` tablosunda session_id track'i
- Oturum açıklarında/ayrılırken UPDATE
- Gerçek zamanlıda sidesbar'da göster

---

## 🚀 DEPLOYMENT NOTES

### Build:
```bash
npm run build
```
→ `dist/` klasörü oluştur (Vite)

### Environment Variables:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### Hosting:
- **Vercel**: `vercel deploy` (env vars otomatik)
- **Netlify**: `netlify deploy --prod --dir=dist`

---

## 📚 ÖRNEK COMPONENT

```tsx
// Basit MessageItem örneği
const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const { updateMessageReaction } = useChat();

  return (
    <div className="card-message">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-amber-900">{message.ancientName}</h4>
        {message.edited && <span className="text-xs text-gray-400">düzenlendi</span>}
      </div>

      {/* Envanterlik İşareti */}
      {message.isArtifact && (
        <div className="artifact-glow mb-2 p-2 bg-yellow-50 rounded">
          <span className="font-bold text-amber-900">📦 {message.artifactLabel}</span>
        </div>
      )}

      {/* İçerik */}
      <p className="text-gray-800 mb-3">{message.content}</p>

      {/* Oylar */}
      <div className="flex gap-2">
        <button
          onClick={() => updateMessageReaction(message.id, 'restore', 1)}
          className="btn-restore"
        >
          🔄 {message.restoreCount}
        </button>
        <button
          onClick={() => updateMessageReaction(message.id, 'destroy', 1)}
          className="btn-destroy"
        >
          ⚰️ {message.destroyCount}
        </button>
      </div>
    </div>
  );
};
```

---

## 🎓 BEST PRACTICES

1. **Prop Drilling'ı Azalt**: Context API ile global state kullan
2. **Memoization**: `memo()` ile gereksiz re-render'ı önle
3. **Custom Hooks**: Tekrar eden logic'i `useYourHook` olarak ayır
4. **TypeScript**: Her prop ve state için tür tanımla
5. **Error Boundaries**: Supabase hata durumlarını ele al
6. **Accessibility**: `aria-*` ve semantic HTML kullan
7. **Performance**: Realtime subscription'ları cleanup'sız bırakma

---

**Daha fazla detay için:**
- [ArchitectureGuide.tsx](./src/components/ArchitectureGuide.tsx) - Tam component kodu
- [useRealtimeHooks.ts](./src/hooks/useRealtimeHooks.ts) - Realtime hook implementasyonu
- [tailwind.config.js](./tailwind.config.js) - Theme & custom utilities
