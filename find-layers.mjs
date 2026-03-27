import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ucscrfhemenvzmgwnnbf.supabase.co';
const supabaseKey = 'sb_publishable_un0wP7NFT6oUB1pd9clh2Q_N2oo378u';

const supabase = createClient(supabaseUrl, supabaseKey);

async function findLayers() {
  console.log('\n🔎 KATMAN BİLGİLERİ\n');

  const { data: layers, error } = await supabase
    .from('layers')
    .select('id, name, display_name')
    .limit(5);

  if (error) {
    console.log('❌ Layers alınamadı:', error.message);
    return;
  }

  console.log('Mevcut katmanlar:');
  layers?.forEach(l => {
    console.log(`ID: ${l.id}`);
    console.log(`   Name: ${l.name}`);
    console.log(`   Display: ${l.display_name}`);
    console.log('');
  });

  // İlk layer'ın ID'si ile test et
  if (layers && layers.length > 0) {
    const firstLayerId = layers[0].id;
    console.log('\n📝 İlk katmandan test mesajı oluşturuyorum...\n');

    const testSessionId = 'test-user-' + Math.random().toString(36).substr(2, 9);
    
    const { data: msgData, error: msgError } = await supabase
      .from('messages')
      .insert([{
        layer_id: firstLayerId,
        user_id: testSessionId,
        ancient_name: 'Test Arkeolog',
        content: 'Test mesajı',
        is_artifact: false,
        restore_count: 0,
        destroy_count: 0,
        created_at: new Date().toISOString(),
      }])
      .select();

    if (msgError) {
      console.log('❌ Mesaj oluşturulamadı:', msgError.message);
      console.log('   Code:', msgError.code);
      return;
    }

    const createdMessageId = msgData[0].id;
    console.log('✅ Mesaj oluşturuldu:', createdMessageId);
    console.log('   Session:', testSessionId);

    // Şimdi reaction ekle
    console.log('\n4️⃣ REACTION EKLEME TESTİ\n');

    const { data: rxData, error: rxError } = await supabase
      .from('reactions')
      .insert({
        message_id: createdMessageId,
        user_session_id: testSessionId,
        reaction_type: 'restore',
      })
      .select();

    if (rxError) {
      console.log('❌ REACTION EKLENEMEDI!');
      console.log('   Error:', rxError.message);
      console.log('   Code:', rxError.code);
      console.log('   Details:', rxError.details);
      console.log('\n🔧 FİX: Supabase Dashboard SQL Editor\'de çalıştır:');
      console.log(`
ALTER TABLE reactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
      `);
    } else {
      console.log('✅ Reaction başarıyla eklendi!');
      console.log('   ID:', rxData.id);
    }
  }
}

findLayers();
