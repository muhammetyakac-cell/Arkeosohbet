import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ucscrfhemenvzmgwnnbf.supabase.co';
const supabaseKey = 'sb_publishable_un0wP7NFT6oUB1pd9clh2Q_N2oo378u';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMessages() {
  console.log('🔍 Checking messages in database...');

  try {
    // Tüm mesajları kontrol et
    const { data: allMessages, error } = await supabase
      .from('messages')
      .select('*');

    if (error) {
      console.error('❌ Error:', error);
    } else {
      console.log(`✅ Total messages in DB: ${allMessages.length}`);
      if (allMessages.length > 0) {
        console.log('Sample messages:');
        allMessages.slice(0, 3).forEach(msg => {
          console.log(`  - [${msg.layer_id}] ${msg.ancient_name}: ${msg.content.substring(0, 50)}...`);
        });
      }
    }

    // Katmanlar
    const { data: layers } = await supabase.from('layers').select('id, display_name');
    console.log('\n✅ Layers:');
    layers.forEach(l => console.log(`  - ${l.id}: ${l.display_name}`));

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

checkMessages().catch(console.error);
