import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ucscrfhemenvzmgwnnbf.supabase.co';
const supabaseKey = 'sb_publishable_un0wP7NFT6oUB1pd9clh2Q_N2oo378u';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testWithProperUUID() {
  console.log('🧪 Testing with proper UUID...');

  try {
    const testUUID = crypto.randomUUID();
    
    const { data: result, error } = await supabase
      .from('messages')
      .insert([{
        layer_id: '9cff9f2c-ccf8-4120-ba8e-ee2d4e3b849c',
        user_id: testUUID,
        content: 'Test message',
        is_artifact: false,
        restore_count: 0,
        destroy_count: 0,
      }])
      .select();

    if (error) {
      console.error('❌ Error:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ SUCCESS! Message inserted:');
      console.log(JSON.stringify(result[0], null, 2));
    }
  } catch (err) {
    console.error('❌ Exception:', err);
  }
}

testWithProperUUID().catch(console.error);
