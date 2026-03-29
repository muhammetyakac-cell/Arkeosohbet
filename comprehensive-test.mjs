import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ucscrfhemenvzmgwnnbf.supabase.co';
const supabaseKey = 'sb_publishable_un0wP7NFT6oUB1pd9clh2Q_N2oo378u';

const supabase = createClient(supabaseUrl, supabaseKey);

async function comprehensiveTest() {
  console.log('\n🔍 ARKEOSOHBET OY SISTEMI ANALIZI\n');
  console.log('='.repeat(50));

  try {
    // 1. RLS CHECK
    console.log('\n1️⃣ RLS POLİCY DURUMU');
    console.log('-'.repeat(50));
    
    const { data: rlsData, error: rlsError } = await supabase
      .from('information_schema.tables')
      .select('table_name, row_security_active')
      .in('table_name', ['reactions', 'messages', 'active_users']);
    
    if (!rlsError && rlsData) {
      rlsData.forEach(t => {
        console.log(`${t.table_name}: ${t.row_security_active ? '🔒 RLS AKTIF' : '🔓 RLS KAPAL'}`);
      });
    }

    // 2. TEST MESSAGE OLUŞTUR
    console.log('\n2️⃣ TEST MESAJI OLUŞTUR');
    console.log('-'.repeat(50));
    
    const testSessionId = 'test-user-' + Math.random().toString(36).substr(2, 9);
    const testMessage = {
      layer_id: '1', // Default layer
      user_id: testSessionId,
      ancient_name: 'Test Arkeolog',
      content: 'Test mesajı - Oylamayı test et',
      is_artifact: false,
      restore_count: 0,
      destroy_count: 0,
      created_at: new Date().toISOString(),
    };

    const { data: msgData, error: msgError } = await supabase
      .from('messages')
      .insert([testMessage])
      .select();

    if (msgError) {
      console.log('❌ MESAJ OLUŞTURULAMADI:', msgError.message);
      console.log('   Error Code:', msgError.code);
      console.log('   Details:', msgError.details);
      return;
    }

    const createdMessageId = msgData[0].id;
    console.log('✅ Mesaj oluşturuldu:', createdMessageId);

    // 3. LAYERLERI KONTROL ET
    console.log('\n3️⃣ KATMANLAR');
    console.log('-'.repeat(50));
    
    const { data: layers, error: layerError } = await supabase
      .from('layers')
      .select('id, name, display_name')
      .limit(3);
    
    if (!layerError && layers) {
      console.log('Mevcut katmanlar:');
      layers.forEach(l => console.log(`  - ${l.id}: ${l.display_name}`));
    }

    // 4. REACTION EKLEME TESTI (TESTİ MESAJ İLE)
    console.log('\n4️⃣ REACTION EKLEME TESTİ');
    console.log('-'.repeat(50));
    
    const testReaction = {
      message_id: createdMessageId,
      user_session_id: testSessionId,
      reaction_type: 'restore',
    };

    const { data: rxData, error: rxError } = await supabase
      .from('reactions')
      .insert([testReaction])
      .select();

    if (rxError) {
      console.log('❌ REACTION EKLENEMEDI!');
      console.log('   Error:', rxError.message);
      console.log('   Code:', rxError.code);
      console.log('   Details:', JSON.stringify(rxError.details, null, 2));
      console.log('\n📋 RLS Policy ihtiyacı:');
      console.log('ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;');
      console.log('CREATE POLICY "reactions_all" ON reactions');
      console.log('  FOR ALL USING (true) WITH CHECK (true);');
    } else {
      console.log('✅ Reaction başarıyla eklendi!', rxData);
    }

    // 5. MEVCUT REACTIONS'I KONTROL ET
    console.log('\n5️⃣ MEVCUT REACTIONS');
    console.log('-'.repeat(50));
    
    const { data: existingRx, error: rxReadError } = await supabase
      .from('reactions')
      .select('*')
      .limit(5);

    if (rxReadError) {
      console.log('❌ Reactions okunamadı:', rxReadError.message);
    } else {
      console.log(`✅ ${existingRx?.length || 0} reaction bulundu`);
      if (existingRx && existingRx.length > 0) {
        existingRx.forEach(r => {
          console.log(`   - ${r.message_id}: ${r.reaction_type} (${r.user_session_id})`);
        });
      }
    }

    // 6. REALTIME SUBSCRIPTIONS
    console.log('\n6️⃣ REALTIME SUBSCRIPTIONS');
    console.log('-'.repeat(50));
    
    const { data: realtimeStatus } = await supabase
      .from('messages')
      .on('INSERT', payload => {
        console.log('📨 Realtime aktif - Yeni mesaj:', payload.new.id);
      })
      .subscribe();

    console.log('✅ Realtime subscriptions kontrol edildi');

    // 7. AUTHENTICATION
    console.log('\n7️⃣ AUTHENTICATION');
    console.log('-'.repeat(50));
    
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.log('⚠️  Auth hatası:', authError.message);
    } else if (authData.session) {
      console.log('✅ Authenticated user var');
    } else {
      console.log('⚠️  Anonim (session yok) - Bu normal');
    }

    // ÖZET
    console.log('\n' + '='.repeat(50));
    console.log('📊 SORUN ANALIZI ÖZET');
    console.log('='.repeat(50));
    console.log('\nEğer Reaction eklenemedi ise:');
    console.log('1. RLS Policy kontrol et (ALTER TABLE reactions ENABLE ROW LEVEL SECURITY)');
    console.log('2. Policies oluştur (CREATE POLICY)');
    console.log('3. Supabase authentication kontrol et');
    console.log('4. Realtime permissions kontrol et');
    
  } catch (err) {
    console.error('❌ GENEL HATA:', err.message);
  }
}

comprehensiveTest();
