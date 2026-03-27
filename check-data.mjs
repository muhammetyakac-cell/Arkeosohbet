import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ucscrfhemenvzmgwnnbf.supabase.co';
const supabaseKey = 'sb_publishable_un0wP7NFT6oUB1pd9clh2Q_N2oo378u';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log('🔍 Checking database data...');

  try {
    // Check layers
    const { data: layers, error: layersError } = await supabase
      .from('layers')
      .select('*');

    if (layersError) {
      console.error('❌ Layers fetch error:', layersError);
    } else {
      console.log(`✅ Layers found: ${layers.length}`);
      if (layers.length > 0) {
        console.log('First layer:', layers[0]);
      }
    }

    // Check ancient names
    const { data: names, error: namesError } = await supabase
      .from('ancient_names_pool')
      .select('*');

    if (namesError) {
      console.error('❌ Names fetch error:', namesError);
    } else {
      console.log(`✅ Ancient names found: ${names.length}`);
      if (names.length > 0) {
        console.log('First name:', names[0]);
      }
    }

  } catch (err) {
    console.error('❌ Check error:', err);
  }
}

checkData().catch(console.error);
