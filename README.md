# 🏛️ STRATIGRAPH - Arkeoloji Öğrencileri İçin Anonim Sohbet Platformu

```
███████╗████████╗██████╗  █████╗ ████████╗██╗ ██████╗ ██████╗ ██╗     ██╗
██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝██║██╔════╝ ██╔══██╗██║     ██║
███████╗   ██║   ██████╔╝███████║   ██║   ██║██║  ███╗██████╔╝██║     ██║
╚════██║   ██║   ██╔══██╗██╔══██║   ██║   ██║██║   ██║██╔══██╗██║     ██║
███████║   ██║   ██║  ██║██║  ██║   ██║   ██║╚██████╔╝██║  ██║███████╗███████╗
╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝
```

> Arkeoloji öğrencilerinin **kimlik açıklamadan** akademik dedikodular yapabileceği, kazı anılarını paylaşabileceği ve teknik bilgi alışverişinde bulunabileceği yaratıcı bir web sitesi.

---

## ✨ Temel Özellikler

| Özellik | Açıklama |
|---------|----------|
| 🎭 **Tam Anonimlik** | Rastgele antik kahraman/eser isimleri (Anonim Amfora, Uykusuz Epigrafist) |
| 📚 **Kronolojik Katmanlar** | Neolitik'ten Bizansa kadar dönem odaları |
| 🎨 **Tematik Arşivler** | Seramik, Yazıtlar, Numismatik, Mimari... |
| ⚡ **Özel Odalar** | Kazı Evi Mutfağı, Kahve Sohbetleri, Gizli Adyton |
| 📦 **Envanterlik Sistemi** | Önemli konuşmaları "buluntu" olarak işaretleme |
| 🔄/⚰️ **Restore & Kül Et** | Mesajları "kurtarma" (upvote) veya "tarihten silme" (downvote) |
| 🌐 **Gerçek Zamanlı Chat** | Supabase Realtime ile anlık mesaj alımı |
| 🏜️ **Ege Esintisi** | İzmir/Efes kazılarına özel temalar |

---

## 🚀 HIZLI BAŞLANGIÇ

### 1. Depoyu Klonla
```bash
git clone https://github.com/yourusername/arkeosohbet.git
cd arkeosohbet
```

### 2. Supabase Veritabanını Kur
- [Supabase](https://app.supabase.com) hesabı oluştur
- `database/schema.sql` dosyasını SQL Editor'e yapıştır ve çalıştır
- Realtime'ı etkinleştir (`messages`, `active_users`, `reactions`)

### 3. Frontend Kur
```bash
npm install
echo 'VITE_SUPABASE_URL=YOUR_URL' > .env.local
echo 'VITE_SUPABASE_ANON_KEY=YOUR_KEY' >> .env.local
npm run dev
```

### 4. Tarayıcıda Aç
```
http://localhost:5173
```

---

## 📖 DETAYLI SETUP REHBERI

Tam kurulum talimatları için 👉 [SETUP_GUIDE.md](SETUP_GUIDE.md)

---

## 🏛️ TEKNIK STACK

| Teknoloji | Kullanım |
|-----------|----------|
| **Frontend** | React 18 + Vite + TypeScript |
| **Styling** | Tailwind CSS (Özel tema) |
| **Backend & DB** | Supabase (PostgreSQL) |
| **Realtime** | Supabase Realtime WebSocket |
| **State Management** | React Context API |
| **Deployment** | Vercel / Netlify |

---

## 📁 PROJE YAPISI

```
arkeosohbet/
├── database/
│   └── schema.sql                   # Supabase SQL şeması
├── src/
│   ├── components/
│   │   ├── ArchitectureGuide.tsx    # React component mimarisi
│   │   ├── Sidebar.tsx              # Katman navigasyonu
│   │   ├── ChatWindow.tsx           # Mesaj listesi
│   │   └── MessageInput.tsx         # Mesaj yazma formu
│   ├── hooks/
│   │   └── useRealtimeHooks.ts      # Supabase Realtime hooks
│   ├── lib/
│   │   └── supabaseClient.ts        # Supabase başlatma
│   └── App.tsx
├── docs/
│   └── UX_UI_DESIGN_GUIDE.md        # Detaylı tasarım felsefesi
├── tailwind.config.js               # Özel renkler & animasyonlar
├── SETUP_GUIDE.md                   # Adım adım kurulum
└── README.md                        # Bu dosya
```

---

## 🎨 TASARIM ÖĞELERI

### 📐 Stratifikasyon Görsel Dili
Her katmana geçiş, **antik tabakaya inme** hissi verir. Renklendirme kronolojik derinliğe göre değişir.

### 📦 Arkeolojik Buluntu Kutusu
Mesajları "envanterlik" olarak işaretleyebilirsiniz. Parıltılı animasyon + altın rengi ile vurgulanır.

### 🗳️ Restore/Kül Et Oylaması
- **🔄 Restore Et**: "Bu bilgi korunmalı" (Yeşil, canlı)
- **⚰️ Kül Et**: "Bu tarih olmalı" (Kırmızı, kül)

Detaylı UX/UI rehberi 👉 [UX_UI_DESIGN_GUIDE.md](docs/UX_UI_DESIGN_GUIDE.md)

---

## 🔌 REALTIME HOOKS

### `useRealtimeMessages`
```jsx
useRealtimeMessages(layerId, (message) => {
  // Her yeni mesaj burada alınır
  addMessage(message);
});
```

### `useRealtimeActiveUsers`
```jsx
const { activeUsers } = useRealtimeActiveUsers(layerId);
// Katmandaki online kullanıcılar listesi
```

### `useRealtimeReactions`
```jsx
useRealtimeReactions(messageId, (restore, destroy) => {
  // Oy tutanağı güncellenir
  updateMessageVotes(restore, destroy);
});
```

👉 Detaylar için [useRealtimeHooks.ts](src/hooks/useRealtimeHooks.ts)

---

## 💾 SUPABASE TABLOLARI

| Tablo | Amaç |
|-------|------|
| **messages** | Sohbet mesajları (content, is_artifact, restore_count, destroy_count) |
| **layers** | Katmanlar (Neolitik, Roma, Seramik Atölyesi vb.) |
| **active_users** | Ortak seçinde (session_id, ancient_name, current_layer_id, status) |
| **reactions** | Oy verisi (message_id, "restore" / "destroy") |
| **ancient_names_pool** | Rastgele ad havuzu (1500+ antik isim) |
| **research_logs** | İsteğe bağlı - Kullanım analizi |

---

## 🎯 ÖRNEK KATMANLAR

### Kronolojik:
- 🪨 Neolitik Katmanı
- 🏺 Bronz Çağı Forumu
- 🏛️ Hellen Agorası
- 🗿 Roma Forumu
- ✨ Bizans Kütüphanesi

### Tematik:
- 🏺 Seramik Atölyesi
- 📜 Yazıt Arşivi
- 🪙 Para Koleksiyonu
- 🏗️ Yapı Kasiyer

### Özel:
- 🍲 Kazı Evi Mutfağı (Deneyim paylaşımı)
- ☕ Kahve Sohbetleri (Rahat konuşmalar)
- 🔐 Adyton (Gizli, şifreli oda)

---

## 🌟 ÖZELLİK HILELERİ

### Envanterlik Mesaj Oluştur
1. Mesaj yaz
2. "📦 Bunu envanterlik olarak işaretle" kutusunu tikle
3. Doküman etiketi gir (örn: "2. Milenyum Seramikleri")
4. Gönder!

### Oylamaya Katıl
- 🔄 **Restore Et**: Bilgi değerli, korunmalı
- ⚰️ **Kül Et**: Hatalı, kaldırılmalı

### Katmanları Keşfet
Sidebarda kaydır, kronolojik dönemler veya tematik arşivler arasında dolaş.

---

## 📊 VERITABANI ŞEMASI

```sql
-- Basitleştirilmiş yapı (Detaylı schema.sql dosyasında)

CREATE TABLE layers (
  id UUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE,
  display_name VARCHAR(150),
  theme_color VARCHAR(7),
  etymology VARCHAR(255),
  layer_type ENUM('chronological', 'thematic', 'special')
);

CREATE TABLE messages (
  id UUID PRIMARY KEY,
  layer_id UUID REFERENCES layers(id),
  user_id UUID REFERENCES active_users(id),
  content TEXT,
  is_artifact BOOLEAN DEFAULT FALSE,
  artifact_label VARCHAR(255),
  restore_count INTEGER DEFAULT 0,
  destroy_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE reactions (
  id UUID PRIMARY KEY,
  message_id UUID REFERENCES messages(id),
  user_session_id VARCHAR(255),
  reaction_type ENUM('restore', 'destroy'),
  UNIQUE(message_id, user_session_id)
);
```

--

## 🚀 DEPLOYMENT

### Vercel (Önerilen)
```bash
npm run build
git add . && git commit -m "Stratigraph ready"
git push origin main
# Vercel auto-deploy
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

**Env Variables:**
```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key
```

---

## 🐛 SORUN GİDERME

**Mesajlar ekrana gelmiyor?**
→ Supabase Dashboard → Realtime → `messages` tablosunu enable et

**"Cast: TypeError" hatası?**
→ `.env.local` dosyasını kontrol et, Supabase URL & Key doğru mu?

**Antik ad atanmıyor?**
→ `ancient_names_pool` tablosu boş mu? Schema'yı yeniden çalıştır

---

## 📚 KAYNAKLAR

- [Supabase Docs](https://supabase.com/docs)
- [Realtime Guide](https://supabase.com/docs/guides/realtime)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🎭 GELECEK SONRAKELERİ

- [ ] Arkeolojik Metin Çeviri (Claude API)
- [ ] "Buluntu Haritası" (Koordinat tabanlı kazı simülasyonu)
- [ ] Adyton Şifre Sistemi
- [ ] Heatmap - En popüler katmanlar
- [ ] Smyrna Bot - Otomatik kazı evi bildirimleri
- [ ] Profil Kartları ve Badge Sistemi
- [ ] Podcast Entegrasyonu

---

## 📜 LİSANS

MIT License - Eğitim ve bilimsel araştırma için özgürdür.

---

## 🤝 KATKI

PR'ler açıktır! Stratigraph'e katkı yap:

```bash
1. Fork et
2. Feature branch oluştur (`git checkout -b feature/amazing`)
3. Commit et (`git commit -m 'Şaşırtıcı özellik eklendi'`)
4. Push et (`git push origin feature/amazing`)
5. PR aç
```

---

## ✉️ İLETİŞİM

**Sorularınız mı var?**
- 📮 Email: dev@stratigraph.io
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/arkeosohbet/issues)
- 💬 Discord: [Stratigraph Community](https://discord.gg/stratigraphy)

---

## 🏺 ÖZLETMESİ

> *Stratigraph, antik çağın koridorlarında arkeoloji öğrencilerinin rehberi olsun. Her tabaka bir hikaye, her forun bir ders, her buluntu ise bilim camiasının ortak hafızasıdır.*

```
═══════════════════════════════════════════════════════════
STRATIGRAPH v1.0 - Archeology Students' Collaborative Platform
"From the Surface to the Depths" 🔍✨
═══════════════════════════════════════════════════════════
```

---

**Daha fazlası için 👉 [SETUP_GUIDE.md](SETUP_GUIDE.md) ve [UX_UI_DESIGN_GUIDE.md](docs/UX_UI_DESIGN_GUIDE.md)**