-- ============================================
-- STRATIGRAPH: Arkeoloji Öğrencileri Sohbet Platformu
-- Supabase PostgreSQL Veritabanı Şeması
-- ============================================

-- 1. KATMANLAR (ROOMS/CHANNELS) TABLOSU
CREATE TABLE layers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(150) NOT NULL,
  description TEXT,
  theme_color VARCHAR(7) DEFAULT '#8B7355', -- Toprak tonu varsayılan
  etymology VARCHAR(255), -- Antik adının etimolojisi
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  layer_type VARCHAR(50) CHECK (layer_type IN ('chronological', 'thematic', 'special')) DEFAULT 'chronological',
  icon_emoji VARCHAR(50) DEFAULT '🏛️'
);

-- 2. AKTİF KULLANICILAR TABLOSU (Gerçek Zamanlı Takip)
CREATE TABLE active_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  ancient_name VARCHAR(100) NOT NULL, -- Örn: "Anonim Amfora", "Uykusuz Epigrafist"
  current_layer_id UUID REFERENCES layers(id) ON DELETE CASCADE,
  status VARCHAR(50) CHECK (status IN ('online', 'away', 'offline')) DEFAULT 'online',
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. MESAJLAR TABLOSU
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layer_id UUID NOT NULL REFERENCES layers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES active_users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_artifact BOOLEAN DEFAULT FALSE, -- "Envanterlik" işareti
  artifact_label VARCHAR(255), -- Eğer artifact ise etiketi
  restore_count INTEGER DEFAULT 0, -- "Restore Et" (upvote)
  destroy_count INTEGER DEFAULT 0, -- "Kül Et" (downvote)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  edited BOOLEAN DEFAULT FALSE
);

-- 4. İLEŞKİ GEÇMİŞİ (Restore/Destroy Voting)
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_session_id VARCHAR(255) NOT NULL,
  reaction_type VARCHAR(50) CHECK (reaction_type IN ('restore', 'destroy')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_session_id) -- Her kullanıcı mesaj başına bir kez oy versin
);

-- 5. ANTIK KAHRAMAN İSİMLERİ POOL'U (Random Ad Atamas
)
CREATE TABLE ancient_names_pool (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50), -- 'hero', 'artifact', 'scholar', 'philosopher'
  description VARCHAR(255),
  etymology VARCHAR(150),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. SADELEŞTİRİLMİŞ ARAŞTIRMA LOGLARı
CREATE TABLE research_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES active_users(id) ON DELETE SET NULL,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  interaction_type VARCHAR(50), -- 'view', 'save', 'share', 'report'
  metadata JSONB, -- Esnek ek bilgi
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- İNDEKSLER (Performans)
-- ============================================

CREATE INDEX idx_messages_layer_id ON messages(layer_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_active_users_session_id ON active_users(session_id);
CREATE INDEX idx_active_users_current_layer ON active_users(current_layer_id);
CREATE INDEX idx_reactions_message_id ON reactions(message_id);
CREATE INDEX idx_research_logs_created_at ON research_logs(created_at DESC);

-- ============================================
-- BAŞLANGIÇ VERİLERİ: KATMANLAR
-- ============================================

INSERT INTO layers (name, display_name, description, theme_color, etymology, layer_type, icon_emoji) VALUES
-- Kronolojik Katmanlar
('neolithic', 'Neolitik Katmanı', 'Taş devri teknolojileri ve buluntuları hakkında tartışmalar', '#A0826D', 'Neo (yeni) + lithos (taş)', 'chronological', '🪨'),
('bronze_age', 'Bronz Çağı Forumu', 'Bronz işçiliği, göçler ve ticari ağlar', '#CD7F32', 'Bronze metalurjisi ve sanatı', 'chronological', '🏺'),
('hellenic', 'Hellen Agorası', 'Antik Yunan medeniyeti, felsefe ve politika', '#D4A574', 'Agora (pazar meydanı)', 'chronological', '🏛️'),
('roman_forum', 'Roma Forumu', 'Roma imparatorluğu, mühendislik ve hukuk', '#8B7355', 'Forum (kamusal alan)', 'chronological', '🗿'),
('byzantine', 'Bizans Kütüphanesi', 'Geç antik dönem, mosaiklerin ve mimarinin altın çağı', '#DAA520', 'Byzantium (İstanbul)', 'chronological', '✨'),

-- Tematik Katmanlar
('ceramics', 'Seramik Atölyesi', 'Keramik prodüksiyon teknikleri, desenler ve stratigrafik analiz', '#CD853F', 'Keramos (kil)', 'thematic', '🏺'),
('epigraphy', 'Yazıt Arşivi', 'Yazıtlar, Fenisyen alfabesi, Luwice ve diğer yazı sistemleri', '#696969', 'Epigraphia (yazılı)', 'thematic', '📜'),
('numismatics', 'Para Koleksiyonu', 'Antik paraları, değiş-tokuş sistemleri ve ekonomi', '#FFD700', 'Numisma (madeni para)', 'thematic', '🪙'),
('architecture', 'Yapı Kasiyer', 'Mimarî kültür, stratigrafik değerlendirme, inşaat teknikleri', '#696969', 'Architectura (inşaat sanatı)', 'thematic', '🏗️'),

-- Özel Katmanlar
('excavation_house', 'Kazı Evi Mutfağı', 'Kazı anıları, alanlardan güvenlik ve sosyal sohbetler', '#DEB887', 'Kazı kampı hayatı', 'special', '🍲'),
('coffee_talk', 'Kahve Sohbetleri', 'Rahat talk: üniversite stresinden mezuniyet bütcesine', '#8B4513', 'Akademik konuşmalar', 'special', '☕'),
('adyton', 'Adyton (Gizli Oda)', 'Tamamen anonim, entelektüel tartışmalar - şifre gerekir', '#1C1C1C', 'Adyton (antik tapınaklardaki gizli oda)', 'special', '🔐');

-- ============================================
-- BAŞLANGIÇ VERİLERİ: ANTIK KAHRAMAN İSİMLERİ
-- ============================================

INSERT INTO ancient_names_pool (name, category, description, etymology) VALUES
-- Kahramanlar
('Anonim Amfora', 'hero', 'Sözler taşıyan gizemli bir arkeolog', 'Amphoreus (taşıyıcı)'),
('Uykusuz Epigrafist', 'scholar', 'Gece gündüz yazıtları çözen bilge', 'Epigraphia'),
('Perikles''in Hayaleti', 'philosopher', 'Ürpertici ama ustaca bir harita çizer', 'Perikles (Athen''in liderİ)'),
('Troia''nın Temeli', 'artifact', 'Kazışlarda her zaman en dipteki tabaka', 'Troia (safsatacı şehir)'),

-- Eserler
('Homeros''un Sevgili Kitabı', 'artifact', 'Her kelimenin bir hikayesi var', 'Homeros (Îlyada yazarı)'),
('Ariadne''nin İpliği', 'hero', 'Labirerint stratejistleri için kılavuz', 'Ariadne (Minos''un kızı)'),
('Delfoi Şifreleri', 'scholar', 'Mutikal ve kripto-yazılar konusunda uzman', 'Delfoi (apollon tapınağı)'),
('Midas''ın Dokunuşu', 'hero', 'Altın buluntularla konuşur', 'Kral Midas'),

-- Filozoflar
('Sosyal Sokrates', 'philosopher', 'Sorularıyla her konuyu aydınlatır', 'Sokrates'),
('Platonik Gerçek', 'philosopher', 'İdeaları tartışan idealist bir araştırmacı', 'Platon'),
('Aristoteles''in Öğrencisi', 'scholar', 'Sistematik ve mantıklı analiz yapan', 'Aristoteles'),
('Heraklit''in Ateşi', 'philosopher', 'Her şey değişir, ama bu platform değişmez', 'Heraklit'),
('Diogenes''in Fenerİ', 'philosopher', 'Sahici olmayan her şeyi sorgulayan sinik', 'Diogenes'),

-- Modern Arkeologlar (Humoristik)
('Dr. Toz Bulutu', 'hero', 'Kazı sahasının en toza batmış kişi', 'Kazı deneyimi'),
('Çizim Ustası', 'scholar', 'Bitmeyen stratigrafik çizimlerle savaşan', 'Teknik bilgisi'),
('Mermer Yutağı', 'artifact', 'Antik yapı taşlarının sırrını bilenSi'),
('Şemsiye Unutkan', 'hero', 'Güneşteki günlerin gerçek kahramanı', 'Ege bölgesi sıcağı'),
('Fototeatya Fotoğrafçı', 'scholar', 'Her eşya için ondan bin fotoğraf çekilen', 'Fotoğrafçılık teknikleri'),

-- Ege Öznelliği
('Smyrna''nın Rüyası', 'philosopher', 'İzmir''in az bilinen detaylarını araştıran', 'Smyrna (eski İzmir)'),
('Efes''in Kütüphanecisi', 'artifact', 'Celsus Kütüphanesi''nin hayranı', 'Kütüphane mimarisi'),
('Bergama''nın Pergameni', 'scholar', 'Antik yazıtları ve parchment''ı inceliyor', 'Pergamon'),
('Halicarnassos''un Mozolesi', 'artifact', 'Büyük mezarlıkların mimarisini bilen', 'Halikarnasos (Bodrum)'),
('Çeşme''nin Korsanı', 'hero', 'Deniz ticaret rotalarından konuşanSi', 'Antik göçler');

-- ============================================
-- REALTIME SUBSCRIPTIONS (Supabase konfig)
-- ============================================
-- Not: Bu SQL dosyasını Supabase SQL Editor''de çalıştırdıktan sonra,
-- Supabase Dashboard''da Realtime koşullarını etkinleştir:
-- - messages tablosu :: INSERT, UPDATE, DELETE
-- - active_users tablosu :: INSERT, UPDATE, DELETE
-- - reactions tablosu :: INSERT, DELETE
