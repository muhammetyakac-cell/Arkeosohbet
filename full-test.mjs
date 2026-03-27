import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ucscrfhemenvzmgwnnbf.supabase.co';
const supabaseKey = 'sb_publishable_un0wP7NFT6oUB1pd9clh2Q_N2oo378u';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fullTest() {
  console.log('=== FULL TEST ===\n');

  // 1. Test mesaj yazma
  console.log('1️⃣ Testing message INSERT...');
  const testUUID = crypto.randomUUID();
  const { data: insertData, error: insertError } = await supabase
    .from('messages')
    .insert([{
      layer_id: '9cff9f2c-ccf8-4120-ba8e-ee2d4e3b849c',
      user_id: testUUID,
      content: 'Test mesajı - ' + new Date().toISOString(),
      is_artifact: false,
      restore_count: 0,
      destroy_count: 0,
    }])
    .select();

  if (insertError) {
    console.error('❌ INSERT FAILED:', insertError.message);
    return;
  } else {
    console.log('✅ Message inserted successfully!');
    console.log('   ID:', insertData[0].id);
  }

  // 2. Test mesaj okuma
  console.log('\n2️⃣ Testing message SELECT...');
  const { data: selectData, error: selectError } = await supabase
    .from('messages')
    .select('*')
    .eq('layer_id', '9cff9f2c-ccf8-4120-ba8e-ee2d4e3b849c');

  if (selectError) {
    console.error('❌ SELECT FAILED:', selectError.message);
  } else {
    console.log('✅ Messages retrieved:', selectData.length);
    selectData.forEach(msg => {
      console.log(`   - ${msg.content.substring(0, 40)}`);
    });
  }

  // 3. Tüm mesajları kontrol et
  console.log('\n3️⃣ Total messages in database...');
  const { data: allMessages } = await supabase
    .from('messages')
    .select('*');
  console.log(`✅ Total: ${allMessages.length}`);
}

fullTest().catch(console.error);
