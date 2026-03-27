import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ucscrfhemenvzmgwnnbf.supabase.co';
const supabaseKey = 'sb_publishable_un0wP7NFT6oUB1pd9clh2Q_N2oo378u';

const supabase = createClient(supabaseUrl, supabaseKey);

async function disableRLS() {
  console.log('🔓 Disabling RLS policies...');

  try {
    // Disable RLS for layers table
    const { error: layersError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE layers DISABLE ROW LEVEL SECURITY;'
    });

    if (layersError) {
      console.error('❌ Layers RLS disable error:', layersError);
    } else {
      console.log('✅ Layers RLS disabled');
    }

    // Disable RLS for ancient_names_pool table
    const { error: namesError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE ancient_names_pool DISABLE ROW LEVEL SECURITY;'
    });

    if (namesError) {
      console.error('❌ Names RLS disable error:', namesError);
    } else {
      console.log('✅ Names RLS disabled');
    }

  } catch (err) {
    console.error('❌ RLS disable error:', err);
  }

  console.log('🎉 RLS policies disabled!');
}

disableRLS().catch(console.error);
