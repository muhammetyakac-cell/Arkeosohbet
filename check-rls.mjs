import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ucscrfhemenvzmgwnnbf.supabase.co';
const supabaseKey = 'sb_publishable_un0wP7NFT6oUB1pd9clh2Q_N2oo378u';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log('🧪 Test inserting a message...');

  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        layer_id: '9cff9f2c-ccf8-4120-ba8e-ee2d4e3b849c',
        user_id: 'test-user-123',
        ancient_name: 'Test Kullanıcı',
        content: 'Bu bir test mesajıdır',
        is_artifact: false,
        restore_count: 0,
        destroy_count: 0,
      }])
      .select();

    if (error) {
      console.error('❌ Insert Error:', error);
      console.error('Full error:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ Insert successful!');
      console.log('Data:', data);
    }
  } catch (err) {
    console.error('❌ Exception:', err);
  }
}

testInsert().catch(console.error);
