# STRATIGRAPH: UX/UI DESTİLERİ & YARATICI ÖNERİLER

## 📐 Genel Tasarım Felsefesi

**Vizyonumuz**: Arkeolojik kazı alanının dijital ortamdaki yansıması.

Kullanıcılar uygulamaya girdiğinde, sanki bir **antik tabakaya iniyorlarmış** gibi hissetsinler. Her katmana geçiş, zaman yolculuğunun bir parçası olsun.

---

## 🎨 1. STRATIFIKASYON GÖRSEL DİLİ: "Tabakalar Arası Sürüş"

### Açıklama:
Normalde chat uygulamalarında odalar sekmeler şeklinde gösterilir. **Stratigraph'te** her katmana geçiş, **zeminde derinleşme hissi** verir.

### Tasarım Detayları:

```
┌─────────────────────────────────────┐
│  📦 Tabakalar Arasında Gezinti      │
├─────────────────────────────────────┤
│                                     │
│  ◄───── NEOLITIK KATMANI ────────►  │  ← Şimdiki Görünüm
│          (Yüzey - En Yeni)         │
│  [Taş dokusu bg]                    │
│                                     │
│  ───────────────────────────────    │  ← Geçiş Animasyonu
│     BRONZE ÇAĞI (Derinleşmek)      │
│  [Mermer vb. Doku]                  │
│                                     │
│  ───────────────────────────────    │  ← En Eski Tabaka
│     PALEOLITIK İZLER (Çok Derin)   │
│  [Koyu, bitirme dokusu]             │
│                                     │
└─────────────────────────────────────┘
```

### Teknik Uygulama:
- **Sidebar scrolling**: Katmanlar listesi, yukarıdan aşağıya **kronolojik sıra** ile uzanır
- **Color Gradients**: Her katmanın rengi, **derinleştikçe daha koyu** hale gelir
  - Neolitik: Açık toprak tonu (#D2B48C)
  - Bronze Çağı: Orta toprak (#CD7F32)
  - Roma: Koyu mermer (#5C4033)
- **Depth Shadows**: Seçili katmanın kartı, **3D perspective** ile ön plana gelir
  ```css
  transform: translateX(10px) perspective(1000px) rotateY(-5deg);
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  ```

### Kod Örneği (Tailwind):
```jsx
<div
  className={`transition-all duration-500 relative
    ${isActive ? 'translate-x-2 shadow-lg scale-105' : ''}
  `}
  style={{
    backgroundColor: layer.themeColor,
    opacity: isActive ? 1 : 0.6,
    borderLeft: `6px solid ${layer.themeColor}`,
    backgroundImage: `linear-gradient(135deg, ${layer.themeColor}80, ${layer.themeColor}40)`,
  }}
>
  {layer.displayName}
</div>
```

---

## 🏺 2. ARKEOLOJIK "BULUNTU KUTUSU": Envanterlik Animasyonu

### Açıklama:
Kullanıcı bir mesajı "envanterlik" olarak işaretlediğinde, ekranda **bir arkeolojik eser kütüphanesi simülasyonu** oluşur.

### Tasarım Detayları:

```
Normal Mesaj          Envanterlik Mesajı
┌──────────────┐     ┌──────────────────┐
│ Anonim       │     │ 📦 ENVANTERLİK   │
│ Seramik      │     │ "2. Milenyum      │  ← Parıltılı
│ Buldu        │     │  Mermer Teknikleri"
│              │     │                  │
└──────────────┘     └──────────────────┘
                     ✨ (Animasyon: Gıldır Gıldır)
```

### Animasyon Öğeleri:
1. **Pulsing Border**: Buluntu kutusunun kenarlığı yanıp sönüyor
   ```css
   @keyframes artifact-pulse {
     0%, 100% { box-shadow: 0 0 0 0 rgba(218, 165, 32, 0.7); }
     50% { box-shadow: 0 0 0 20px rgba(218, 165, 32, 0); }
   }
   ```

2. **Ekran Köşelerine Parıltı Efekti**: Buluntu mesajı kalp çarpıyor
   ```css
   background: linear-gradient(-45deg, #FFD700, #FFA500, #FFD700);
   background-size: 300% 300%;
   animation: artifact-shine 3s ease infinite;
   ```

3. **Notification Badge**: Yeni buluntu bildiği 🏺 emoji ile
   ```jsx
   <div className="animate-bounce">
     <span className="text-2xl">📦</span>
   </div>
   ```

4. **Context Menu**: Sağ tıkla envanterlik detaylarını aç
   - Buluntunun açıklaması
   - En çok "restore" alan benzer buluntular
   - "Bu buluntu nereye kataloglanmalı?" önerisi

### Kod Örneği:
```jsx
<div
  className={`
    p-4 rounded-lg transition-all duration-300
    ${message.isArtifact
      ? 'border-2 border-yellow-400 shadow-lg animate-pulse bg-gradient-to-r from-amber-50 to-yellow-50'
      : 'border-l-4 border-amber-300 bg-white'
    }
  `}
>
  {message.isArtifact && (
    <>
      <span className="inline-block text-2xl animate-bounce mr-2">📦</span>
      <span className="font-bold text-amber-900">ENVANTERLİK</span>
      <p className="text-sm text-amber-700">{message.artifactLabel}</p>
    </>
  )}
  <p className="mt-2">{message.content}</p>
</div>
```

---

## 🗣️ 3. OYLAMA MEKANİZMASI: "Restore vs. Kül Et"

### Açıklama:
- **🔄 Restore Et** (Upvote): "Bu bilgi korunmalı, koleksiyona almalı"
- **⚰️ Kül Et** (Downvote): "Bu yanlış, tarihten silinmeli"

### Tasarım Fikirler:

#### A. Reaksiyon Animasyonları:
```jsx
// Restore Et: Yeşil ışık animasyonu (canlanma)
const RestoreButton = ({ onClick, count }) => (
  <button
    onClick={{
      onClick();
      triggerParticle('restore'); // 16 zelzele partikülü çıkıyor
    }}
    className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700"
  >
    🔄 {count}
  </button>
);

// Kül Et: Kırmızı/kahverengi duman efekti
const DestroyButton = ({ onClick, count }) => (
  <button
    onClick={{
      onClick();
      triggerParticle('destroy'); // Kül partikülü yüksek çıkıyor
    }}
    className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700"
  >
    ⚰️ {count}
  </button>
);

// Partikül efekti (Confetti-benzeri)
const triggerParticle = (type) => {
  const emojis = type === 'restore' ? ['🌿', '✅', '☑️'] : ['🔥', '💨', '⚖️'];
  for (let i = 0; i < 16; i++) {
    const particle = createParticle(emojis[Math.floor(Math.random() * emojis.length)]);
    animateParticle(particle);
  }
};
```

#### B. Toplam Skor Gösterimi:
```jsx
<div className="mt-3 p-2 bg-gradient-to-r from-green-100 to-red-100 rounded text-center text-sm font-bold">
  <span className="text-green-700">🔄 {message.restoreCount}</span>
  <span className="mx-2 text-gray-400">|</span>
  <span className="text-red-700">⚰️ {message.destroyCount}</span>
  <br />
  <span className="text-xs text-gray-600">
    Net Skor: {message.restoreCount - message.destroyCount}
  </span>
</div>
```

#### C. Leaderboard View (İsteğe Bağlı):
Ay'ın en eyi "Envanterlik" buluntuları:
```jsx
<div className="bg-amber-100 p-4 rounded">
  <h3 className="font-bold mb-3">🏆 Bu Ay''ın En Değerli Buluntuları</h3>
  <div className="space-y-2">
    {topArtifacts.map((art, idx) => (
      <div key={art.id} className="flex items-center justify-between p-2 bg-white rounded">
        <span className="text-lg">{['🥇', '🥈', '🥉'][idx]}</span>
        <span className="flex-1 ml-2">{art.label}</span>
        <span className="text-green-600 font-bold">+{art.restoreCount}</span>
      </div>
    ))}
  </div>
</div>
```

---

## 🎭 BONUS: EGE BÖLGESI FLEVÖRİ ÖZEL ODALARI

### Smyrna Kazı Evi "Sosyal Kanal"

Başlık: "☕ Kazı Evi Mutfağı - İzmir Tuz Kokundan Konuşuyoruz"

Özel öğeler:
- ☀️ **Güneş Sayacı**: "Saat 14:00'de +5°C daha artabilir" ikazı
- 🏜️ **Toz Hava Durumu**: "Bugün Sahara rüzgarı var, 3-5 cm toz bekliyoruz"
- 🧊 **Su Kampanya Bildirimi**: "Şimdiye kadar 12L su Sucu depolanmış" (motivatör badge)
- 🍅 **Yemek Anketi**: "Bugün Hevi mi ne yiyeceğiz? Oyla!"
  - Domatesli mercimek çorbası 🍲
  - Döner 🌯
  - Şarküterilik 🥪
  - Kazı evi standartu (ekmek + peynir) 🧀

Mesaj Türleri:
1. **Bitmeyen Çizim Şikayeti**: "3 saat yatay hatlar ve hala 5 satır var"
2. **Alet Kaybı Ayarı**: "Kim benim 1:20 mimarisini aldı??? 🔨"
3. **Arkeologların Minik Şekil Sanatı**: Çizim ekran görüntüleri (toz maskeleri v.s.)

---

## 🏛️ ÖZETLEŞTİRİLMİŞ IMPLEMENTATION CHECKLIST

| Özellik | Teknik Detay | Tailwind CSS Class | Supabase Tablosu |
|---------|------------|------------------|-----------------|
| **Stratifikasyon Görsel Dili** | Depth transition, color gradient | `transition-all duration-500 scale-105` | `layers.theme_color` |
| **Envanterlik Animasyonu** | Pulsing border, gradient shine | `animate-pulse border-yellow-400` | `messages.is_artifact` |
| **Restore/Kül Et Oy** | Particle effects, score display | `text-green-700 / text-red-700` | `reactions.reaction_type` |
| **Aktif Kullanıcılar** | Real-time dot, online status | `bg-green-500 animate-pulse` | `active_users.status` |
| **Kazı Evi Tema** | Özel layer stylı, weather widgets | Custom `bg-orange-50` | `layers.name = 'excavation_house'` |

---

## 💻 GENEL STİL KURALLAR

### Renk Paletini:
```css
/* Toprak Tonları (Ana) */
--color-earth-light: #D2B48C;    /* Hafif kum */
--color-earth-mid: #8B7355;      /* Orta toprak */
--color-earth-dark: #5C4033;     /* Koyu mermer */

/* Accent Renkler */
--color-restore: #10B981;        /* Yeşil (Canlanma) */
--color-destroy: #EF4444;        /* Kırmızı (Kül) */
--color-artifact: #F59E0B;       /* Altın (Ön Plan) */

/* Arka Plan */
--color-bg-light: #FFFBF0;       /* Vintage kağıt */
--color-bg-dark: #1F1F1F;        /* Gece modu - mermer */
```

### Font Stack:
```css
/* Başlıklar - Serif (Antik hissiyattı) */
font-family: 'Georgia', 'Garamond', serif;

/* Metinler - Sans-serif (Okunabilirlik) */
font-family: 'Inter', 'Segoe UI', sans-serif;

/* Monospace - Tekil Yazıtlar */
font-family: 'Courier New', monospace;
```

### Spacing & Layout:
- **Satır Yüksekliği**: 1.75rem (antik yazıtlar için yer)
- **Padding**: 1.5rem (kazı alanı "serileri" gibi düşün)
- **Margin**: Katmanlar arasında 2rem boşluk

---

## 🔮 GELECEK GENIŞLEME FİKİRLERİ

1. **"Arkeolojik Haritalandırma"** (Heatmap): En popüler oda/katmanlar
2. **"Buluntu Zaman Çizelgesi"** (Timeline): Gün içinde paylaşılan en önemli konular
3. **"Adyton Gizli Sohbet Şosu"**: Katmanın kapalı odası, şifreli erişim
4. **"Smyrna Sohbet Botu"**: Kazı evi duruma göre otomatik mesajlar (sıcak uyarısı, su anısı)
5. **"Arkeolog Profil Kartı"**: Her kullanıcının gizli "akademik profili" (favorisındı katmanlar)

---

**Tasarım felsefesi**: Arkeoloji öğrencileri dijital ortamda da **tedavi etmiş hissedecekler** - kazı alanının stresi, keyfi, buluntu heyecanı hepsi burada.

İyi tasarım, başlıca anı tekrar yaşatan tasarımdır. 🏺✨
