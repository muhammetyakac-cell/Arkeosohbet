// ============================================
// STRATIGRAPH: Supabase Realtime Hooks
// ============================================

import React, { useEffect, useRef, useCallback } from 'react';
import { RealtimeChannel } from '@supabase/realtime-js';
import { supabase } from '../lib/supabaseClient';

/**
 * 1. REALTIME MESAJ LİSTENER
 * 
 * Kullanım:
 * const { unsubscribe } = useRealtimeMessages(layerId, (message) => {
 *   dispatchMessage({ type: 'ADD_MESSAGE', payload: message });
 * });
 */
export const useRealtimeMessages = (
  layerId: string | null,
  onMessageReceived: (message: any) => void
) => {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!layerId) return;

    // Belirli katman için gerçek zamanlı mesajları dinle
    const channel = supabase
      .channel(`messages:layer_${layerId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `layer_id=eq.${layerId}`,
        },
        (payload) => {
          console.log('📨 Yeni mesaj alındı:', payload.new);
          onMessageReceived(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `layer_id=eq.${layerId}`,
        },
        (payload) => {
          console.log('✏️ Mesaj düzenlendi:', payload.new);
          onMessageReceived({ ...payload.new, edited: true });
        }
      )
      .subscribe((status) => {
        console.log(`📡 Gerçek zamanlı bağlantı durumu (${layerId}):`, status);
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [layerId, onMessageReceived]);

  const unsubscribe = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, []);

  return { unsubscribe };
};

/**
 * 2. REALTIME AKTIF KULLANICILAR
 * 
 * Kullanım:
 * const { activeUsers } = useRealtimeActiveUsers(layerId);
 */
export const useRealtimeActiveUsers = (layerId: string | null) => {
  const [activeUsers, setActiveUsers] = React.useState<any[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!layerId) return;

    const channel = supabase
      .channel(`active_users:layer_${layerId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'active_users',
          filter: `current_layer_id=eq.${layerId}`,
        },
        (payload) => {
          console.log('🟢 Kullanıcı online oldu:', payload.new.ancient_name);
          setActiveUsers((prev) => {
            const exists = prev.find((u) => u.id === payload.new.id);
            return exists ? prev : [...prev, payload.new];
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'active_users',
          filter: `current_layer_id=eq.${layerId}`,
        },
        (payload) => {
          console.log('👤 Kullanıcı durumu güncellendi:', payload.new.status);
          setActiveUsers((prev) =>
            prev.map((u) => (u.id === payload.new.id ? payload.new : u))
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'active_users',
          filter: `current_layer_id=eq.${layerId}`,
        },
        (payload) => {
          console.log('⚪ Kullanıcı çıktı:', payload.old.ancient_name);
          setActiveUsers((prev) => prev.filter((u) => u.id !== payload.old.id));
        }
      )
      .subscribe((status) => {
        console.log(`👥 Aktif kullanıcılar durumu:`, status);
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [layerId]);

  return { activeUsers };
};

/**
 * 3. REALTIME OY SİSTEMİ (Restore/Kül Et)
 * 
 * Kullanım:
 * useRealtimeReactions(messageId, (reactions) => {
 *   updateMessageVotes(messageId, reactions);
 * });
 */
export const useRealtimeReactions = (
  messageId: string,
  onReactionUpdate: (restore: number, destroy: number) => void
) => {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!messageId) return;

    const channel = supabase
      .channel(`reactions:msg_${messageId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reactions',
          filter: `message_id=eq.${messageId}`,
        },
        async (payload) => {
          const { reaction_type } = payload.new;
          
          // Sayıları güncelle
          const { data } = await supabase
            .from('messages')
            .select('restore_count, destroy_count')
            .eq('id', messageId)
            .single();

          if (data) {
            onReactionUpdate(data.restore_count, data.destroy_count);
          }

          console.log(`${reaction_type === 'restore' ? '🔄' : '⚰️'} Oy alındı`);
        }
      )
      .subscribe((status) => {
        console.log(`⭐ Oy sistemi durumu:`, status);
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [messageId, onReactionUpdate]);
};

/**
 * 4. REALTIME KATMAN AYRINTI
 * 
 * Katman değiştirildiğinde tüm mesajları, kullanıcıları ve reaksiyonları güncelle
 */
export const useRealtimeLayer = (layerId: string | null) => {
  const [layerData, setLayerData] = React.useState<{
    messages: any[];
    activeUsers: any[];
    loading: boolean;
    error: string | null;
  }>({
    messages: [],
    activeUsers: [],
    loading: true,
    error: null,
  });

  const messagesChannelRef = useRef<RealtimeChannel | null>(null);
  const usersChannelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!layerId) return;

    const fetchInitialData = async () => {
      try {
        // İlk mesajları yükle
        const { data: messages, error: msgError } = await supabase
          .from('messages')
          .select('*')
          .eq('layer_id', layerId)
          .order('created_at', { ascending: true });

        if (msgError) throw msgError;

        // Aktif kullanıcıları yükle
        const { data: users, error: usersError } = await supabase
          .from('active_users')
          .select('*')
          .eq('current_layer_id', layerId)
          .eq('status', 'online');

        if (usersError) throw usersError;

        setLayerData((prev) => ({
          ...prev,
          messages,
          activeUsers: users,
          loading: false,
        }));
      } catch (error) {
        console.error('❌ Veri yükleme hatası:', error);
        setLayerData((prev) => ({
          ...prev,
          error: String(error),
          loading: false,
        }));
      }
    };

    fetchInitialData();

    // Mesaj kanalını dinle
    const messagesChannel = supabase
      .channel(`layer_messages:${layerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `layer_id=eq.${layerId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLayerData((prev) => ({
              ...prev,
              messages: [...prev.messages, payload.new],
            }));
          } else if (payload.eventType === 'UPDATE') {
            setLayerData((prev) => ({
              ...prev,
              messages: prev.messages.map((m) =>
                m.id === payload.new.id ? payload.new : m
              ),
            }));
          }
        }
      )
      .subscribe();

    // Kullanıcı kanalını dinle
    const usersChannel = supabase
      .channel(`layer_users:${layerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_users',
          filter: `current_layer_id=eq.${layerId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLayerData((prev) => ({
              ...prev,
              activeUsers: [...prev.activeUsers, payload.new],
            }));
          } else if (payload.eventType === 'DELETE') {
            setLayerData((prev) => ({
              ...prev,
              activeUsers: prev.activeUsers.filter(
                (u) => u.id !== payload.old.id
              ),
            }));
          }
        }
      )
      .subscribe();

    messagesChannelRef.current = messagesChannel;
    usersChannelRef.current = usersChannel;

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(usersChannel);
    };
  }, [layerId]);

  return layerData;
};

/**
 * 6. CUSTOM HOOK: SUPABASE REALTIME HAZIRLIĞı
 * 
 * Bağlantı durumunu izle ve hata yönet
 */
export const useSupabaseRealtimeStatus = () => {
  const [status, setStatus] = React.useState<'CONNECTING' | 'CONNECTED' | 'DISCONNECTED'>('CONNECTING');
  const [lastError, setLastError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const channel = supabase.channel('system');

    const subscription = channel
      .on('system', { event: 'subscribe' }, () => {
        setStatus('CONNECTED');
        console.log('✅ Supabase Realtime bağlantı başarılı');
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setStatus('CONNECTED');
        } else if (status === 'CLOSED') {
          setStatus('DISCONNECTED');
          setLastError('Bağlantı kapatıldı');
        } else if (status === 'CHANNEL_ERROR') {
          setStatus('DISCONNECTED');
          setLastError('Kanal hatası oluştu');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { status, lastError };
};
