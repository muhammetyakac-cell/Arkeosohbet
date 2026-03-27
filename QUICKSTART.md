# ⚡ STRATIGRAPH - HIZLI BAŞLANGIÇ

> **15 Dakika İçinde Stratigraph'ı Çalıştırın!**

---

## 📋 ÖLÜMLÜ KONTROL LİSTESİ

### ADIM 1️⃣: Supabase Veritabanını Kur (5 dakika)

```bash
# 1. Supabase''ye git
browser "https://app.supabase.com"

# 2. Yeni project oluştur: "arkeosohbet"
# - Region: Europe (Frankfurt) veya yakınında
# - Databasesi oluşturulacak

# 3. SQL Editor aç ve schema.sql''ı yapıştır
# Dosya: database/schema.sql
# Copy-paste → SQL Editor → RUN

# 4. Realtime etkinleştir:
# - Projects → Settings → Realtime → Enable
# - Tablo: messages ✓
# - Tablo: active_users ✓
# - Tablo: reactions ✓

# 5. Credentials al:
# - Settings → API → Copy:
#   - Project URL
#   - Anon Key
```

### ADIM 2️⃣: Frontend Kur (5 dakika)

```bash
# Terminal'de bu klasöre git
cd /workspaces/Arkeosohbet

# .env.local dosyası oluştur
cp .env.local.example .env.local

# Supabase credentials'ı ekle (ADIM 1''den)
# Dosya: .env.local
# VITE_SUPABASE_URL=https://YOUR-ID.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJ...

# Package'ları yükle
npm install

# Dev server'ı başlat
npm run dev
```

### ADIM 3️⃣: Uygulamayı Test Et (5 dakika)

```
Browser: http://localhost:5173

1. Sayfa açılırken rastgele bir antik ad alacaksın
   (Örn: "Perikles''in Hayaleti" 👻)

2. Katmanlardan birini seç (Sidebar''dan)
   - 🪨 Neolitik Katmanı
   - 🏺 Bronz Çağı Forumu
   - 🏛️ Hellen Agorası
   vs.

3. Mesaj yaz ve gönder

4. Başka bir sekme açıp test et
   → Realtime mesajlar diğer sekmeye de geliyor mu?

5. Oylamayı test et
   - 🔄 Restore Et (Yeşil)
   - ⚰️ Kül Et (Kırmızı)

🎉 Tebrikler! Stratigraph çalışıyor!
```

---

## 📁 PROJE DOSYA HARITASI

```
stratigraph/
│
├── 📄 README.md                    ← ANA DOKÜMANTASYON
├── 📄 SETUP_GUIDE.md              ← DETAYLI SETUP (adım adım)
├── ⚡ QUICKSTART.md               ← Bu dosya (hızlı setup)
│
├── 🗄️ database/
│   └── schema.sql                 ← Supabase SQL şeması
│
├── 📦 src/
│   ├── App.tsx                    ← Ana wrapper
│   ├── main.tsx                   ← Entry point
│   │
│   ├── components/
│   │   └── ArchitectureGuide.tsx  ← Tüm components + Context
│   │
│   ├── hooks/
│   │   └── useRealtimeHooks.ts    ← Supabase Realtime
│   │
│   ├── lib/
│   │   └── supabaseClient.ts      ← Supabase SDK
│   │
│   └── styles/
│       └── globals.css             ← Tailwind + Custom CSS
│
├── 📚 docs/
│   ├── UX_UI_DESIGN_GUIDE.md      ← Tasarım felsefesi
│   └── ARCHITECTURE.md             ← Component mimarisi
│
├── 🎨 tailwind.config.js          ← Renkler, animasyonlar
├── 📋 package.json                ← Dependencies
├── tsconfig.json                  ← TypeScript config
├── vite.config.ts                 ← Vite config
├── index.html                     ← HTML giriş noktası
└── .env.local.example             ← Env variables template
```

---

## 🔍 BAŞLICA DOSYALARI AÇIKLA

| Dosya | Ne Yapar? |
|-------|-----------|
| [database/schema.sql](database/schema.sql) | Supabase tabloları ve ilişkiler |
| [src/components/ArchitectureGuide.tsx](src/components/ArchitectureGuide.tsx) | React mimarisi (Context + Components) |
| [src/hooks/useRealtimeHooks.ts](src/hooks/useRealtimeHooks.ts) | Realtime event dinleyicileri |
| [tailwind.config.js](tailwind.config.js) | Özel renkler + animasyonlar |
| [docs/UX_UI_DESIGN_GUIDE.md](docs/UX_UI_DESIGN_GUIDE.md) | Tasarım açıklamaları |

---

## ❓ SORUN GİDERME

**"Port 5173 zaten kullanımda"**
```bash
npm run dev -- --port 5174
```

**"Supabase'e bağlanamıyor"**
→ .env.local dosyasını kontrol et
→ Credentials doğru mu?

**"Mesajlar gösterilmiyor"**
→ Supabase SQL Editor'de: `SELECT * FROM messages;`
→ Veritabanında veri var mı?
→ Realtime enabled mi?

**"React error: Could not find a valid context"**
→ App.tsx içinde AuthProvider & ChatProvider sarılmış mı?

---

## 🚀 İLK DAĞITIM

### Vercel''ye Deploy:
```bash
# 1. GitHub''a push et
git add .
git commit -m "Stratigraph ready"
git push origin main

# 2. Vercel.com aç
# 3. GitHub repo bağla
# 4. Env variables ekle:
#    VITE_SUPABASE_URL=...
#    VITE_SUPABASE_ANON_KEY=...

# 5. Deploy!
```

---

## 📚 SONRAKI ADIMLAR

Starter kodu tamamlandı! Şimdi şunları yapabilirsin:

- [ ] UI bileşenlerini tamamla (Sidebar, ChatWindow)
- [ ] Modal işlevini kur (Layer detayları, Artifact)
- [ ] Envanterlik animasyonlarını test et
- [ ] Dark mode ekle (tailwind'de `darkMode: 'class'`)
- [ ] PWA desteği ekle (service worker)
- [ ] Arkeolog profilleri ekle
- [ ] Heatmap (en popüler katmanlar)
- [ ] Badge/Trophy sistemi

---

## 🎓 DEĞERLİ BAĞLANTILAR

- [Supabase Docs](https://supabase.com/docs) - Veritabanı
- [React Docs](https://react.dev) - Framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [TypeScript](https://www.typescriptlang.org/docs/) - Type safety
- [Vite Docs](https://vitejs.dev) - Build tool

---

## ✨ BAŞARILAR!

```
🏛️ Stratigraph v1.0 ✓
Frontend ✓
Database ✓
Realtime ✓

Şimdi sohbete başlamaya hazır!
```

**Sorularınız mı var?**
→ [SETUP_GUIDE.md](SETUP_GUIDE.md) detaylı rehberi oku
→ [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) component mimarisini incele
→ [docs/UX_UI_DESIGN_GUIDE.md](docs/UX_UI_DESIGN_GUIDE.md) tasarım fikirlerini görüntüle

---

**Happy coding! 🔍✨**
