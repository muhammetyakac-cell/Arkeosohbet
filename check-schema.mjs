import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ucscrfhemenvzmgwnnbf.supabase.co';
const supabaseKey = 'sb_publishable_un0wP7NFT6oUB1pd9clh2Q_N2oo378u';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('🔍 Checking messages table schema...');

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .limit(0);

    if (error) {
      console.error('❌ Error:', error);
    } else {
      console.log('✅ Table exists. Testing with minimal insert...');
      
      // Try without ancient_name
      const { data: result, error: insertError } = await supabase
        .from('messages')
        .insert([{
          layer_id: '9cff9f2c-ccf8-4120-ba8e-ee2d4e3b849c',
          user_id: 'test-user-123',
          content: 'Test message',
          is_artifact: false,
          restore_count: 0,
          destroy_count: 0,
        }])
        .select();

      if (insertError) {
        console.error('❌ Insert Error:', insertError.message);
      } else {
        console.log('✅ Success without ancient_name!');
        console.log('Inserted:', result);
      }
    }
  } catch (err) {
    console.error('❌ Exception:', err);
  }
}

checkSchema().catch(console.error);
