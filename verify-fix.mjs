import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ucscrfhemenvzmgwnnbf.supabase.co';
const supabaseKey = 'sb_publishable_un0wP7NFT6oUB1pd9clh2Q_N2oo378u';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log('🔍 Verifying database and testing insert...\n');

  // 1. Test INSERT
  console.log('1️⃣ Testing INSERT...');
  const testUUID = crypto.randomUUID();
  const { data: insertResult, error: insertError } = await supabase
    .from('messages')
    .insert([{
      layer_id: '9cff9f2c-ccf8-4120-ba8e-ee2d4e3b849c',
      user_id: testUUID,
      ancient_name: 'Test Kullanıcı',
      content: 'Test mesajı - ' + new Date().toLocaleString('tr-TR'),
      is_artifact: false,
      restore_count: 0,
      destroy_count: 0,
    }])
    .select();

  if (insertError) {
    console.error('❌ INSERT ERROR:', insertError.message);
    console.error('Code:', insertError.code);
    return;
  } else {
    console.log('✅ Message inserted!');
    console.log('   ID:', insertResult[0].id);
  }

  // 2. Test SELECT all messages
  console.log('\n2️⃣ Testing SELECT...');
  const { data: allMessages, error: selectError } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (selectError) {
    console.error('❌ SELECT ERROR:', selectError.message);
  } else {
    console.log(`✅ Found ${allMessages.length} messages total`);
    if (allMessages.length > 0) {
      console.log('\n📝 Last 3 messages:');
      allMessages.slice(0, 3).forEach((msg, i) => {
        console.log(`   ${i+1}. [${msg.layer_id}] ${msg.ancient_name}: "${msg.content.substring(0, 40)}..."`);
      });
    }
  }

  // 3. Test SELECT for specific layer
  console.log('\n3️⃣ Testing SELECT for Neolithic layer...');
  const { data: layerMessages, error: layerError } = await supabase
    .from('messages')
    .select('*')
    .eq('layer_id', '9cff9f2c-ccf8-4120-ba8e-ee2d4e3b849c')
    .order('created_at', { ascending: false });

  if (layerError) {
    console.error('❌ SELECT ERROR:', layerError.message);
  } else {
    console.log(`✅ Found ${layerMessages.length} messages in this layer`);
  }
}

verify().catch(console.error);
