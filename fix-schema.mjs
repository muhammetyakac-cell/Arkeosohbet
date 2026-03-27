import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ucscrfhemenvzmgwnnbf.supabase.co';
const supabaseKey = 'sb_publishable_un0wP7NFT6oUB1pd9clh2Q_N2oo378u';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixSchema() {
  console.log('🔧 Attempting to fix messages table schema...\n');

  // SQL ile messages table'ını yeniden oluştur
  const sql = `
    -- Yeni messages table (foreign key olmadan)
    CREATE TABLE IF NOT EXISTS messages_new (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      layer_id TEXT NOT NULL REFERENCES layers(id),
      user_session_id TEXT NOT NULL,
      content TEXT NOT NULL,
      is_artifact BOOLEAN DEFAULT false,
      artifact_label TEXT,
      restore_count INTEGER DEFAULT 0,
      destroy_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );

    -- Eski mesajları kopyala (varsa)
    INSERT INTO messages_new (id, layer_id, user_session_id, content, is_artifact, artifact_label, restore_count, destroy_count, created_at)
    SELECT id, layer_id, CAST(user_id AS TEXT), content, is_artifact, artifact_label, restore_count, destroy_count, created_at
    FROM messages
    ON CONFLICT DO NOTHING;

    -- Eski table'ı sil
    DROP TABLE IF EXISTS messages CASCADE;

    -- Yeni table'ı eski adla yeniden adlandır
    ALTER TABLE messages_new RENAME TO messages;
  `;

  console.log('This needs to be run manually in Supabase SQL Editor');
  console.log('\nCopy and paste this SQL:');
  console.log(sql);
}

fixSchema().catch(console.error);
