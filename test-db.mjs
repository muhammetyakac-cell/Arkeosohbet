import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ucscrfhemenvzmgwnnbf.supabase.co';
const supabaseKey = 'sb_publishable_un0wP7NFT6oUB1pd9clh2Q_N2oo378u';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  console.log('\n📝 VERİTABANI TEST\n');

  // 1. Reactions tablosunu kontrol et
  console.log('1️⃣ Reactions tablosunu kontrol ediyorum...');
  const { data: reactions, error: reactionsError } = await supabase
    .from('reactions')
    .select('*')
    .limit(1);
  
  if (reactionsError) {
    console.log('❌ REACTIONS TABLOSU BULUNAMADI:', reactionsError.message);
  } else {
    console.log('✅ Reactions tablosu OK');
  }

  // 2. Mesajları kontrol et
  console.log('\n2️⃣ Messages tablosunu kontrol ediyorum...');
  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select('*')
    .limit(1);
  
  if (messagesError) {
    console.log('❌ MESSAGES TABLOSU BULUNAMADI:', messagesError.message);
  } else {
    if (messages && messages.length > 0) {
      console.log('✅ Messages tablosu OK');
      console.log('📊 Örnek mesaj alanları:', Object.keys(messages[0]));
    }
  }

  // 3. Reaction ekle testi
  console.log('\n3️⃣ Reaction ekleme testi...');
  const testMessageId = '11111111-1111-1111-1111-111111111111';
  const testSessionId = 'test-session-' + Math.random().toString(36).substr(2, 9);
  
  const { data: insertData, error: insertError } = await supabase
    .from('reactions')
    .insert({
      message_id: testMessageId,
      user_session_id: testSessionId,
      reaction_type: 'restore',
    })
    .select();

  if (insertError) {
    console.log('❌ INSERT HATASI:', insertError.message);
  } else {
    console.log('✅ Reaction ekleme başarısız - bu normal (message yok)');
    console.log('   Ama tablo yazılabilir durumda');
  }

  // 4. Tabloları listele (metadata)
  console.log('\n4️⃣ Tüm tablolar:');
  const { data: tables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public');

  if (!tablesError) {
    console.log('Mevcut tablolar:');
    tables?.forEach(t => console.log(`  - ${t.table_name}`));
  }
}

testDatabase().catch(console.error);
