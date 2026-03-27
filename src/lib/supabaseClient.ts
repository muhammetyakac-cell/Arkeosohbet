// ============================================
// STRATIGRAPH: Supabase Client Setup
// ============================================

import { createClient } from '@supabase/supabase-js';

// Supabase URL ve Key'i .env.local'dan al
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    '❌ Supabase konfigürasyonu eksik! .env.local dosyasını kontrol et:\n' +
    'VITE_SUPABASE_URL=...\n' +
    'VITE_SUPABASE_ANON_KEY=...'
  );
}

/**
 * Supabase Client
 * 
 * Realtime subscriptions aktif hale getirilmiştir.
 * Bu client uygulamanın her yerinde kullanılabilir.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  // Veritabanı seçenekleri
  db: {
    schema: 'public',
  },
  // Auth seçenekleri (opsiyonel)
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Yardımcı Fonksiyonlar
 */

/**
 * Rastgele eski isim al
 * Uygulamayı ilk kez açan kullanıcıya verilir
 */
export const getRandomAncientName = async (): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('ancient_names_pool')
      .select('name')
      .order('RANDOM()')
      .limit(1)
      .single();

    if (error) throw error;
    return data?.name || 'Anonim Araştırmacı';
  } catch (err) {
    console.error('❌ İsim seçilemedi:', err);
    return `Anonim #${Math.floor(Math.random() * 10000)}`;
  }
};

/**
 * Tüm katmanları getir
 */
export const getLayers = async () => {
  const { data, error } = await supabase
    .from('layers')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

/**
 * Spesifik katmandaki mesajları getir
 */
export const getMessagesByLayer = async (layerId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      active_users (
        ancient_name
      )
    `)
    .eq('layer_id', layerId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

/**
 * Yeni mesaj ekle
 */
export const insertMessage = async (message: {
  layer_id: string;
  user_id: string;
  content: string;
  is_artifact: boolean;
  artifact_label?: string;
}) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([message])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Kullanıcıyı aktif olarak işaretle
 */
export const registerActiveUser = async (user: {
  session_id: string;
  ancient_name: string;
  current_layer_id: string;
  status: 'online' | 'away' | 'offline';
}) => {
  const { data, error } = await supabase
    .from('active_users')
    .insert([user])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Kullanıcı durumunu güncelle
 */
export const updateUserStatus = async (
  sessionId: string,
  status: 'online' | 'away' | 'offline'
) => {
  const { data, error } = await supabase
    .from('active_users')
    .update({
      status,
      last_seen: new Date().toISOString(),
    })
    .eq('session_id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Oy ekle (Restore/Destroy)
 */
export const addReaction = async (reaction: {
  message_id: string;
  user_session_id: string;
  reaction_type: 'restore' | 'destroy';
}) => {
  const { data, error } = await supabase
    .from('reactions')
    .insert([reaction])
    .select()
    .single();

  if (error) {
    // Eğer kullanıcı zaten oy verdiyse, update et
    if (error.code === '23505') {
      // UNIQUE constraint violation
      const deleteError = await supabase
        .from('reactions')
        .delete()
        .eq('message_id', reaction.message_id)
        .eq('user_session_id', reaction.user_session_id);

      if (deleteError.error) throw deleteError.error;

      // Yeni oy ekle
      const { data: newData, error: newError } = await supabase
        .from('reactions')
        .insert([reaction])
        .select()
        .single();

      if (newError) throw newError;
      return newData;
    }
    throw error;
  }

  return data;
};

/**
 * Aktif kullanıcıları al
 */
export const getActiveUsers = async (layerId: string) => {
  const { data, error } = await supabase
    .from('active_users')
    .select('*')
    .eq('current_layer_id', layerId)
    .eq('status', 'online');

  if (error) throw error;
  return data || [];
};

/**
 * Debug: Veritabanını kontrol et
 */
export const healthCheck = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('layers').select('count()').limit(1);
    if (error) {
      console.error('❌ Supabase health check başarısız:', error);
      return false;
    }
    console.log('✅ Supabase bağlantısı başarılı');
    return true;
  } catch (err) {
    console.error('❌ Health check hatası:', err);
    return false;
  }
};

export default supabase;
