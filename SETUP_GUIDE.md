# STRATIGRAPH - Arkeoloji Öğrencileri İçin Anonim Sohbet Platformu

```
███████╗████████╗██████╗  █████╗ ████████╗██╗ ██████╗ ██████╗ ██╗     ██╗
██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝██║██╔════╝ ██╔══██╗██║     ██║
███████╗   ██║   ██████╔╝███████║   ██║   ██║██║  ███╗██████╔╝██║     ██║
╚════██║   ██║   ██╔══██╗██╔══██║   ██║   ██║██║   ██║██╔══██╗██║     ██║
███████║   ██║   ██║  ██║██║  ██║   ██║   ██║╚██████╔╝██║  ██║███████╗███████╗
╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝
```

> **Arkeoloji öğrencilerinin kimlik açıklamadan akademik dedikodular yapabileceği, kazı anılarını paylaşabileceği ve teknik bilgi alışverişinde bulunabileceği yaratıcı bir platform.**

---

## 🏛️ Genel Bakış

**Stratigraph**, antik çağ medeniyetlerine ilham alan, **tabakalar (layers)** halinde organize edilmiş bir gerçek zamanlı sohbet platformudur.

### Temel Özellikler:
- ✨ **Tam Anonimlik**: Rastgele antik kahraman/eser isimleri
- 📚 **Kronolojik Katmanlar**: Neolitik'ten Bizansa kadar dönemsel sohbetler
- 🎨 **Tematik Arşivler**: Seramik, Yazıtlar, Numismatik vb.
- ⚡ **Özel Odalar**: Kazı Evi Mutfağı, Kahve Sohbetleri, Gizli Adyton
- 📦 **Envanterlik Sistemi**: Önemli buluntuları işaretleme
- 🔄/⚰️ **Restore & Kül Açıları**: Upvote/Downvote alternatifi
- 🌐 **Gerçek Zamanlı**: Supabase Realtime ile anlık mesajlar
- 🏜️ **Ege Bölgesi Temaları**: İzmir/Efes kazılarına özel özellikleri

---

## 🚀 PROJESİ KURMA

### Ön Gereksinimler:
- Node.js 18+
- npm veya yarn
- Supabase hesabı (ücretsiz)
- Git

### 1. Veritabanını Kurma (Supabase)

[Supabase Dashboard](https://app.supabase.com) açın ve:

1. **Yeni proje oluştur** (`arkeosohbet` isimli)
2. **SQL Editor** → `database/schema.sql` içeriğini yapıştır → Çalıştır
3. **Realtime** ayarlarını etkinleştir:
   - Tablo: `messages` → INSERT, UPDATE, DELETE
   - Tablo: `active_users` → INSERT, UPDATE, DELETE
   - Tablo: `reactions` → INSERT, DELETE

### 2. Frontend Projesini Kurmak

```bash
# Depoyu klonla
git clone https://github.com/yourusername/arkeosohbet.git
cd arkeosohbet

# Bağımlılıkları yükle
npm install

# Supabase yapılandırması
# .env.local dosyası oluştur:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Supabase'den **URL** ve **Anon Key** bulmak için:
- Supabase Dashboard → Proje → Settings → API → URL & Anon Key

### 3. Supabase Kütüphaneleri

```bash
# Frontend
npm install @supabase/supabase-js @supabase/realtime-js

# Styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 4. Geliştirme Sunucusunu Başlat

```bash
npm run dev
```

=> http://localhost:5173

---

## 📁 Proje Yapısı

```
arkeosohbet/
├── database/
│   └── schema.sql              # Tam SQL şeması
├── src/
│   ├── components/
│   │   ├── ArchitectureGuide.tsx    # Component mimarisi + Context
│   │   ├── Sidebar.tsx              # Katman seçicisi
│   │   ├── ChatWindow.tsx           # Mesaj listesi
│   │   ├── MessageItem.tsx          # Tek mesaj kartı
│   │   └── MessageInput.tsx         # Yazma & envanter seçeneği
│   ├── hooks/
│   │   └── useRealtimeHooks.ts      # Supabase Realtime hooks
│   ├── lib/
│   │   └── supabaseClient.ts        # Supabase başlatma
│   ├── styles/
│   │   ├── globals.css              # Tailwind & kustom
│   │   └── animations.css           # Arkeolojik efektler
│   └── App.tsx                      # Ana bileşen
├── docs/
│   └── UX_UI_DESIGN_GUIDE.md        # Tam tasarım dokümantasyonu
├── tailwind.config.js               # Özel renkler & animasyonlar
├── vite.config.ts                   # Vite konfigürasyonu
├── tsconfig.json                    # TypeScript ayarları
└── README.md                        # Bu dosya
```

---

## 🎯 TEMEL WORKFLOW

### Kullanıcı Başlangıç:

```
1. Sayfa yükle
   ↓
2. Rastgele eski ad atanır (örn: "Perikles'in Hayaleti")
   ↓
3. Session ID (localStorage'de saklanır)
   ↓
4. Harita seçilir (varsayılan: Hellenik Agorası)
   ↓
5. Realtime dinleme başlar
   ↓
6. Sohbete katılır!
```

### Mesaj Gönderme:

```
1. Metin yaz
2. (İsteğe bağlı) "Envanterlik" kutusunu işaretle
3. Etiketi gir (örn: "Erken Bronz Seramikleri")
4. "Tabakaya Gönder" tıkla
5. Supabase'ye INSERT → Realtime tüm kullanıcılara iletir
6. Tüm dinleyiciler `useRealtimeMessages` aracılığıyla alırlar
```

### Oylamaya Katılma:

```
1. Bir mesajı gör
2. "🔄 Restore Et" veya "⚰️ Kül Et" tıkla
3. `reactions` tablosuna INSERT
4. `message.restore_count` veya `message.destroy_count` artar
5. `useRealtimeReactions` tüm cihazları günceller
```

---

## 💾 SUPABASE TABLO ÖZET

### messages
```sql
id: UUID (PK)
layer_id: UUID (FK → layers)
user_id: UUID (FK → active_users, nullable)
content: TEXT
is_artifact: BOOLEAN
artifact_label: VARCHAR(255)
restore_count: INTEGER
destroy_count: INTEGER
created_at: TIMESTAMP WITH TIME ZONE
updated_at: TIMESTAMP WITH TIME ZONE
edited: BOOLEAN
```

### layers
```sql
id: UUID (PK)
name: VARCHAR(100) UNIQUE
display_name: VARCHAR(150)
description: TEXT
theme_color: VARCHAR(7)
etymology: VARCHAR(255)
layer_type: ENUM('chronological', 'thematic', 'special')
icon_emoji: VARCHAR(50)
created_at: TIMESTAMP WITH TIME ZONE
```

### active_users
```sql
id: UUID (PK)
session_id: VARCHAR(255) UNIQUE
ancient_name: VARCHAR(100)
current_layer_id: UUID (FK → layers)
status: ENUM('online', 'away', 'offline')
last_seen: TIMESTAMP WITH TIME ZONE
```

### reactions
```sql
id: UUID (PK)
message_id: UUID (FK → messages)
user_session_id: VARCHAR(255)
reaction_type: ENUM('restore', 'destroy')
created_at: TIMESTAMP WITH TIME ZONE
UNIQUE(message_id, user_session_id) ← Her kullanıcı mesaj başına 1 oy
```

### ancient_names_pool
```sql
id: UUID (PK)
name: VARCHAR(100) UNIQUE
category: VARCHAR(50) ['hero', 'artifact', 'scholar', 'philosopher']
description: VARCHAR(255)
etymology: VARCHAR(150)
created_at: TIMESTAMP WITH TIME ZONE
```

---

## 🎨 STİL & TEMA

### Renk Paletini:
| Kullanım | Renk | Hex |
|----------|------|-----|
| Earth Light | Hafif Kum | #D2B48C |
| Earth Mid | Orta Toprak | #8B7355 |
| Earth Dark | Mermer | #5C4033 |
| Restore | Yeşil (Canlı) | #10B981 |
| Destroy | Kırmızı (Kül) | #EF4444 |
| Artifact | Altın | #F59E0B |

### Font Aileleri:
- **Başlıklar**: Georgia, Garamond (Serif) → Antik his
- **Gövde**: Inter, Segoe UI (Sans) → Okunabilirlik
- **Yazıtlar**: Courier New (Monospace) → Teknik detaylar

### Animasyonlar:
- `artifact-pulse`: Envanterlik kutusu yanıp sönüyor
- `excavation-glow`: Katman seçimi ışıldarıyor
- `particle-rise`: Oylamada partiküller yüksiliyor
- `message-slide`: Yeni mesajlar kaydırılarak geliyor

---

## 🔗 REALTIME HOOKS KULLANIMI

### Hook: `useRealtimeMessages`

```jsx
useRealtimeMessages(
  currentLayerId, 
  (message) => {
    // Her yeni mesaj burada alınır
    dispatchMessage({ type: 'ADD_MESSAGE', payload: message });
  }
);
```

**Ne yapar**: Belirtilen katmanda INSERT/UPDATE mesajları dinler.

### Hook: `useRealtimeActiveUsers`

```jsx
const { activeUsers } = useRealtimeActiveUsers(currentLayerId);
```

**Ne yapar**: Katmandaki online kullanıcıları gerçek zamanlıda gösterir.

### Hook: `useRealtimeReactions`

```jsx
useRealtimeReactions(
  messageId,
  (restore, destroy) => {
    updateMessageVotes(restore, destroy);
  }
);
```

**Ne yapar**: Oylamayan tablosundaki değişiklikleri dinler.

### Hook: `useRealtimeLayer`

```jsx
const { messages, activeUsers, loading, error } = useRealtimeLayer(layerId);
```

**Ne yapar**: Tüm katman verisini (mesajlar + kullanıcılar) bir kez yükler ve gerçek zamanlıda tutarlar.

---

## 🌟 ÖZELLİK HILELERİ

### 1. Envanterlik Mesajı Oluştur:

```jsx
// MessageInput bileşeninde:
const [isArtifact, setIsArtifact] = useState(false);
const [artifactLabel, setArtifactLabel] = useState('');

<label>
  <input 
    type="checkbox" 
    checked={isArtifact} 
    onChange={(e) => setIsArtifact(e.target.checked)} 
  />
  📦 Bunu envanterlik olarak işaretle
</label>

{isArtifact && (
  <input 
    type="text" 
    placeholder="Örn: Çift Körüklü Seramik Teknikleri"
    value={artifactLabel}
    onChange={(e) => setArtifactLabel(e.target.value)}
  />
)}
```

### 2. Restore/Kül Et Oylaması:

```jsx
const handleRestore = async () => {
  await supabase
    .from('reactions')
    .insert([{
      message_id: messageId,
      user_session_id: sessionId,
      reaction_type: 'restore'
    }]);
  
  // Koşullu: Aynı zaman, message.restore_count SQL'de artar
  // Realtime hook onu dinler ve günceller
};
```

### 3. Katman Değişikken Tüm Mesajları Yenile:

```jsx
useEffect(() => {
  const { messages } = useRealtimeLayer(currentLayerId);
  setMessages(messages);
}, [currentLayerId]);
```

---

## 🚦 DEPLOYMENTİ

### Vercel (Önerilen):

```bash
# Depoyu GitHub'a push et
git add .
git commit -m "Stratigraph v1 ready"
git push origin main

# Vercel.com → GitHub repo bağla → Auto deploy
```

**Env Variables (Vercel):**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Netlify:

```bash
npm run build  # dist/ klasörü oluşturur

# Netlify.com → dist klasörünü drag-drop
# Veya: netlify deploy --prod --dir=dist
```

---

## 🐛 SORUN GİDERME

| Sorun | Çözüm |
|-------|-------|
| Mesajlar ekrana gelmiyor | Supabase Realtime ayarlarını kontrol et (Enable Realtime) |
| Cast: TypeError alıyorum | `.env.local` dosyasında Supabase URL\&Key kontrol et |
| Anıl adta hiçbir şey atamazsa | `ancient_names_pool` tablosunu kontrol - boş mu? |
| Kişi sayacı çalışmıyor | `active_users` tablosu INSERT/UPDATE dinlenmiyor mu? |

---

## 📚 RESİM KAYNAKLAR

- **Supabase Doküman**: https://supabase.com/docs
- **Realtime Guide**: https://supabase.com/docs/guides/realtime
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Hooks**: https://react.dev/reference/react/hooks
- **TypeScript**: https://www.typescriptlang.org/docs/

---

## 🎭 ÖZELLİKCE IDEAS (GELECEK)

```
[ ] Arkeolojik Metin Çeviri (AI + Claude API)
[ ] "Buluntu Haritası" - Koordinatlarla kazı alanı simülasyonu
[ ] Adyton Şifre Sistemi (Gizli odalar)
[ ] Heatmap - En popüler katmanları göster
[ ] Smyrna Bot - Otomatik kazı evi bildirimleri
[ ] Profil Kartları - Gizli akademik veriler
[ ] Arkeolojik "Trophy" ve "Badge" sistemi
[ ] Podcast Entegrasyonu - Kazı podcastleri
[ ] Quiz - Antik bilgi testi
[ ] Yükleme - Kazı fotoğrafları (anonim)
```

---

## 📜 LİSANS

MIT License - İlimsel araştırmalar ve eğitim için özgürdür.

---

## 🤝 KATKI

Stratigraph'e katkı yapmak ister misiniz? PR gönder!

---

## ✉️ İLETİŞİM

**Sorularınız mı var?**
- Issues: GitHub Issues
- Discord: [Arkeosohbet Community](https://discord.gg/stratigraphy)
- Email: dev@stratigraph.io

---

## 🏺 SON NOTLAR

> *"Stratigraph, antik çağın koridorlarında rehberiniz olsun. Her tabaka, bir hikaye; her forun, bir ders; her buluntu, arkeoloji camiasının ortak hafızasıdır."*

**Happy excavating! 🔍✨**

```
   ═══════════════════════════════════════════════════════════
   STRATIGRAPH v1.0 - Archeology Students' Collaborative Platform
   "From the Surface to the Depths"
   ═══════════════════════════════════════════════════════════
```
