import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ucscrfhemenvzmgwnnbf.supabase.co';
const supabaseKey = 'sb_publishable_un0wP7NFT6oUB1pd9clh2Q_N2oo378u';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedData() {
  console.log('🌱 Seeding database...');

  // Insert layers
  const layers = [
    { name: 'neolithic', display_name: 'Neolitik Katmanı', description: 'Taş devri teknolojileri ve buluntuları hakkında tartışmalar', theme_color: '#A0826D', etymology: 'Neo (yeni) + lithos (taş)', layer_type: 'chronological', icon_emoji: '🪨' },
    { name: 'bronze_age', display_name: 'Bronz Çağı Forumu', description: 'Bronz işçiliği, göçler ve ticari ağlar', theme_color: '#CD7F32', etymology: 'Bronze metalurjisi ve sanatı', layer_type: 'chronological', icon_emoji: '🏺' },
    { name: 'hellenic', display_name: 'Hellen Agorası', description: 'Antik Yunan medeniyeti, felsefe ve politika', theme_color: '#D4A574', etymology: 'Agora (pazar meydanı)', layer_type: 'chronological', icon_emoji: '🏛️' },
    { name: 'roman_forum', display_name: 'Roma Forumu', description: 'Roma imparatorluğu, mühendislik ve hukuk', theme_color: '#8B7355', etymology: 'Forum (kamusal alan)', layer_type: 'chronological', icon_emoji: '🗿' },
    { name: 'byzantine', display_name: 'Bizans Kütüphanesi', description: 'Geç antik dönem, mosaiklerin ve mimarinin altın çağı', theme_color: '#DAA520', etymology: 'Byzantium (İstanbul)', layer_type: 'chronological', icon_emoji: '✨' },
    { name: 'ceramics', display_name: 'Seramik Atölyesi', description: 'Keramik prodüksiyon teknikleri, desenler ve stratigrafik analiz', theme_color: '#CD853F', etymology: 'Keramos (kil)', layer_type: 'thematic', icon_emoji: '🏺' },
    { name: 'epigraphy', display_name: 'Yazıt Arşivi', description: 'Yazıtlar, Fenisyen alfabesi, Luwice ve diğer yazı sistemleri', theme_color: '#696969', etymology: 'Epigraphia (yazılı)', layer_type: 'thematic', icon_emoji: '📜' },
    { name: 'numismatics', display_name: 'Para Koleksiyonu', description: 'Antik paraları, değiş-tokuş sistemleri ve ekonomi', theme_color: '#FFD700', etymology: 'Numisma (madeni para)', layer_type: 'thematic', icon_emoji: '🪙' },
    { name: 'architecture', display_name: 'Yapı Kasiyer', description: 'Mimarî kültür, stratigrafik değerlendirme, inşaat teknikleri', theme_color: '#696969', etymology: 'Architectura (inşaat sanatı)', layer_type: 'thematic', icon_emoji: '🏗️' },
    { name: 'excavation_house', display_name: 'Kazı Evi Mutfağı', description: 'Kazı anıları, alanlardan güvenlik ve sosyal sohbetler', theme_color: '#DEB887', etymology: 'Kazı kampı hayatı', layer_type: 'special', icon_emoji: '🍲' },
    { name: 'coffee_talk', display_name: 'Kahve Sohbetleri', description: 'Rahat talk: üniversite stresinden mezuniyet bütcesine', theme_color: '#8B4513', etymology: 'Akademik konuşmalar', layer_type: 'special', icon_emoji: '☕' },
    { name: 'adyton', display_name: 'Adyton (Gizli Oda)', description: 'Tamamen anonim, entelektüel tartışmalar - şifre gerekir', theme_color: '#1C1C1C', etymology: 'Adyton (antik tapınaklardaki gizli oda)', layer_type: 'special', icon_emoji: '🔐' }
  ];

  try {
    const { data: layersData, error: layersError } = await supabase
      .from('layers')
      .insert(layers);

    if (layersError) {
      console.error('❌ Layers insert error:', layersError);
    } else {
      console.log('✅ Layers inserted successfully');
    }
  } catch (err) {
    console.error('❌ Layers error:', err);
  }

  // Insert ancient names
  const names = [
    { name: 'Anonim Amfora', category: 'hero', description: 'Sözler taşıyan gizemli bir arkeolog', etymology: 'Amphoreus (taşıyıcı)' },
    { name: 'Uykusuz Epigrafist', category: 'scholar', description: 'Gece gündüz yazıtları çözen bilge', etymology: 'Epigraphia' },
    { name: 'Perikles Hayaleti', category: 'philosopher', description: 'Ürpertici ama ustaca bir harita çizer', etymology: 'Perikles (Athen lideri)' },
    { name: 'Troia Temeli', category: 'artifact', description: 'Kazışlarda her zaman en dipteki tabaka', etymology: 'Troia (efsanevi şehir)' },
    { name: 'Homeros Kitabı', category: 'artifact', description: 'Her kelimenin bir hikayesi var', etymology: 'Homeros (İlyada yazarı)' },
    { name: 'Ariadne İpliği', category: 'hero', description: 'Labirent stratejistleri için kılavuz', etymology: 'Ariadne (Minos kızı)' },
    { name: 'Delfoi Şifreleri', category: 'scholar', description: 'Mistik ve kripto-yazılar konusunda uzman', etymology: 'Delfoi (Apollon tapınağı)' },
    { name: 'Midas Dokunuşu', category: 'hero', description: 'Altın buluntularla konuşur', etymology: 'Kral Midas' },
    { name: 'Sosyal Sokrates', category: 'philosopher', description: 'Sorularıyla her konuyu aydınlatır', etymology: 'Sokrates' },
    { name: 'Platonik Gerçek', category: 'philosopher', description: 'İdeaları tartışan idealist bir araştırmacı', etymology: 'Platon' },
    { name: 'Aristoteles Öğrencisi', category: 'scholar', description: 'Sistematik ve mantıklı analiz yapan', etymology: 'Aristoteles' },
    { name: 'Heraklit Ateşi', category: 'philosopher', description: 'Her şey değişir, ama bu platform değişmez', etymology: 'Heraklit' },
    { name: 'Diogenes Feneri', category: 'philosopher', description: 'Sahici olmayan her şeyi sorgulayan sinik', etymology: 'Diogenes' },
    { name: 'Dr. Toz Bulutu', category: 'hero', description: 'Kazı sahasının en toza batmış kişi', etymology: 'Kazı deneyimi' },
    { name: 'Çizim Ustası', category: 'scholar', description: 'Bitmeyen stratigrafik çizimlerle savaşan', etymology: 'Teknik bilgisi' },
    { name: 'Mermer Yutağı', category: 'artifact', description: 'Antik yapı taşlarının sırrını bilen', etymology: 'Mermer işçiliği' },
    { name: 'Şemsiye Unutkan', category: 'hero', description: 'Güneşteki günlerin gerçek kahramanı', etymology: 'Ege bölgesi sıcağı' },
    { name: 'Fotoğrafçı', category: 'scholar', description: 'Her eşya için bin fotoğraf çeken', etymology: 'Fotoğrafçılık teknikleri' },
    { name: 'Smyrna Rüyası', category: 'philosopher', description: 'İzmir in az bilinen detaylarını araştıran', etymology: 'Smyrna (eski İzmir)' },
    { name: 'Efes Kütüphanecisi', category: 'artifact', description: 'Celsus Kütüphanesi nin hayranı', etymology: 'Kütüphane mimarisi' },
    { name: 'Bergama Pergameni', category: 'scholar', description: 'Antik yazıtları ve parşömeni inceliyor', etymology: 'Pergamon' },
    { name: 'Halikarnasos Mozolesi', category: 'artifact', description: 'Büyük mezarlıkların mimarisini bilen', etymology: 'Halikarnasos (Bodrum)' },
    { name: 'Çeşme Korsanı', category: 'hero', description: 'Deniz ticaret rotalarından konuşan', etymology: 'Antik göçler' }
  ];

  try {
    const { data: namesData, error: namesError } = await supabase
      .from('ancient_names_pool')
      .insert(names);

    if (namesError) {
      console.error('❌ Names insert error:', namesError);
    } else {
      console.log('✅ Ancient names inserted successfully');
    }
  } catch (err) {
    console.error('❌ Names error:', err);
  }

  console.log('🎉 Database seeding completed!');
}

seedData().catch(console.error);
