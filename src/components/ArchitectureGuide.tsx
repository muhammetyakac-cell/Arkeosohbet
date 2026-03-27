// ============================================
// STRATIGRAPH: React Component Ağacı ve State Yönetimi
// ============================================

/**
 * COMPONENT HIYERARŞI:
 * 
 * App (Ana Container)
 * ├── AuthContext (Global State - Oturum & Kimlik)
 * ├── ChatContext (Global State - Mesajlar & Realtime)
 * ├── Layout
 * │   ├── Sidebar (Katmanlar Navigasyonu)
 * │   │   ├── LayerSelector
 * │   │   │   └── LayerItem (Her katman için)
 * │   │   ├── UserProfile (Anonim Ad Gösterimi)
 * │   │   └── ActiveUsers (Online Kullanıcılar)
 * │   │
 * │   ├── MainContent
 * │   │   ├── ChatWindow (Mesaj Listesi)
 * │   │   │   └── MessageItem (Her mesaj için)
 * │   │   │       ├── ArtifactBadge (Envanterlik İşareti)
 * │   │   │       ├── MessageActions (Restore/Kül Et)
 * │   │   │       └── Voting (Oy Tutanağı)
 * │   │   │
 * │   │   └── MessageInput (Mesaj Yazma & Envanterlik Seçeneği)
 * │   │
 * │   └── Header
 * │       ├── LayerInfo (Seçili Katmanın Detayları)
 * │       └── SystemStatus (Realtime Durumu)
 * │
 * └── Modal Components
 *     ├── LayerDetailsModal (Katman Tarihi & Etimolojisi)
 *     ├── ArtifactDetailsModal (Envanterlik Detayları)
 *     └── EgyptianNameGenerator (Rastgele Ad Seçer)
 */

// ============================================
// 1. GLOBAL CONTEXT: AuthContext
// ============================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface User {
  sessionId: string;
  ancientName: string;
  currentLayerId: string;
  status: 'online' | 'away' | 'offline';
  lastSeen: Date;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  updateStatus: (status: 'online' | 'away' | 'offline') => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Otomatik oturum açma
    const initializeUser = async () => {
      const sessionId = localStorage.getItem('stratSession') || crypto.randomUUID();
      localStorage.setItem('stratSession', sessionId);

      // Rastgele antik isim üret
      const { data: names } = await supabase.from('ancient_names_pool').select('name').limit(1).order('RANDOM()');
      const ancientName = names?.[0]?.name || 'Anonim Arkeolog';

      const newUser: User = {
        sessionId,
        ancientName,
        currentLayerId: '1', // Default katman
        status: 'online',
        lastSeen: new Date(),
      };

      setUser(newUser);
    };

    initializeUser();
  }, []);

  const updateStatus = (status: 'online' | 'away' | 'offline') => {
    if (user) {
      setUser({ ...user, status, lastSeen: new Date() });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stratSession');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, updateStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// ============================================
// 2. GLOBAL CONTEXT: ChatContext
// ============================================

interface Message {
  id: string;
  layer_id: string;
  user_id: string;
  ancient_name: string;
  content: string;
  is_artifact: boolean;
  artifact_label?: string;
  restore_count: number;
  destroy_count: number;
  created_at: string;
  edited: boolean;
}

interface Layer {
  id: string;
  name: string;
  display_name: string;
  description: string;
  theme_color: string;
  etymology?: string;
  layer_type: 'chronological' | 'thematic' | 'special';
  icon_emoji: string;
}

interface ChatContextType {
  layers: Layer[];
  currentLayerId: string | null;
  messages: Message[];
  activeUsers: any[];
  setCurrentLayer: (layerId: string) => void;
  addMessage: (message: Message) => void;
  updateMessageReaction: (messageId: string, type: 'restore' | 'destroy', delta: number) => void;
  loading: boolean;
  error: string | null;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [currentLayerId, setCurrentLayerId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Katmanları yükle
  useEffect(() => {
    setLoading(true);
    // Supabase'den katmanları getir
    const fetchLayers = async () => {
      try {
        const { data, error } = await supabase.from('layers').select('*').order('created_at');
        if (error) throw error;
        setLayers(data || []);
        if (data && data.length > 0 && !currentLayerId) {
          setCurrentLayerId(data[0].id);
        }
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchLayers();
  }, []);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const updateMessageReaction = (messageId: string, type: 'restore' | 'destroy', delta: number) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? type === 'restore'
            ? { ...msg, restore_count: msg.restore_count + delta }
            : { ...msg, destroy_count: msg.destroy_count + delta }
          : msg
      )
    );
  };

  return (
    <ChatContext.Provider
      value={{
        layers,
        currentLayerId,
        messages,
        activeUsers,
        setCurrentLayer: setCurrentLayerId,
        addMessage,
        updateMessageReaction,
        loading,
        error,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};

// ============================================
// 3. SIDEBAR: Katman Seçimi
// ============================================

interface LayerItemProps {
  layer: Layer;
  isActive: boolean;
  onSelect: (layerId: string) => void;
}

export const LayerItem: React.FC<LayerItemProps> = ({ layer, isActive, onSelect }) => {
  const bgColor = isActive ? layer.theme_color : 'transparent';
  const textColor = isActive ? 'text-white' : 'text-gray-700';

  return (
    <button
      onClick={() => onSelect(layer.id)}
      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 hover:bg-opacity-10 hover:bg-gray-400 ${textColor}`}
      style={{
        backgroundColor: isActive ? bgColor : undefined,
        borderLeft: isActive ? `4px solid ${layer.theme_color}` : 'none',
      }}
      title={layer.etymology}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">{layer.icon_emoji}</span>
        <span className="font-medium truncate">{layer.display_name}</span>
      </div>
      <p className="text-xs text-gray-500 mt-1 truncate">{layer.description}</p>
    </button>
  );
};

export const LayerSelector: React.FC = () => {
  const { layers, currentLayerId, setCurrentLayer } = useChat();

  const chronologicalLayers = layers.filter(l => l.layer_type === 'chronological');
  const thematicLayers = layers.filter(l => l.layer_type === 'thematic');
  const specialLayers = layers.filter(l => l.layer_type === 'special');

  return (
    <div className="flex flex-col gap-6 p-4 bg-gradient-to-b from-amber-50 to-stone-100 rounded-lg">
      {/* Kronolojik Katmanlar */}
      <div>
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
          📚 Kronolojik Tabakalar
        </h3>
        <div className="space-y-2">
          {chronologicalLayers.map(layer => (
            <LayerItem
              key={layer.id}
              layer={layer}
              isActive={currentLayerId === layer.id}
              onSelect={setCurrentLayer}
            />
          ))}
        </div>
      </div>

      {/* Tematik Katmanlar */}
      <div>
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
          🎨 Tematik Arşivler
        </h3>
        <div className="space-y-2">
          {thematicLayers.map(layer => (
            <LayerItem
              key={layer.id}
              layer={layer}
              isActive={currentLayerId === layer.id}
              onSelect={setCurrentLayer}
            />
          ))}
        </div>
      </div>

      {/* Özel Katmanlar */}
      <div>
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
          ⚡ Özel Odalar
        </h3>
        <div className="space-y-2">
          {specialLayers.map(layer => (
            <LayerItem
              key={layer.id}
              layer={layer}
              isActive={currentLayerId === layer.id}
              onSelect={setCurrentLayer}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-gradient-to-b from-amber-50 via-stone-50 to-amber-100 border-r border-amber-200 overflow-y-auto">
      {/* Profil Bölümü */}
      <div className="p-4 border-b border-amber-200 bg-white">
        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase mb-2">Profil</p>
          <h2 className="text-lg font-bold text-amber-900 truncate">{user?.ancientName}</h2>
          <p className="text-xs text-amber-600 mt-1">
            {user?.status === 'online' ? '🟢 Online' : '⚪ Meşgul'}
          </p>
        </div>
      </div>

      {/* Katman Seçicisi */}
      <div className="p-4">
        <LayerSelector />
      </div>

      {/* Aktif Kullanıcılar */}
      <div className="p-4 border-t border-amber-200">
        <h3 className="text-xs font-bold text-gray-700 uppercase mb-3">Aktif Arkeologlar</h3>
        <div className="space-y-2 text-xs">
          <p className="text-gray-600">👥 Şu anda toplam 12 kişi online</p>
        </div>
      </div>
    </aside>
  );
};

// ============================================
// 4. CHAT PENCERESI: Mesajlar Listesi
// ============================================

interface MessageItemProps {
  message: Message;
}

export const ArtifactBadge: React.FC<{ label?: string }> = ({ label }) => {
  if (!label) return null;
  return (
    <div className="inline-block bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-semibold mb-2">
      📦 Envanterlik: {label}
    </div>
  );
};

export const MessageActions: React.FC<MessageItemProps> = ({ message }) => {
  const { updateMessageReaction } = useChat();

  return (
    <div className="flex gap-4 mt-2 justify-between items-center">
      <div className="flex gap-2">
        <button
          onClick={() => updateMessageReaction(message.id, 'restore', 1)}
          className="flex items-center gap-1 px-3 py-1 rounded bg-green-100 hover:bg-green-200 text-green-700 text-sm font-medium transition"
          title="Restore Et - Bunu Kurtarmalıyız!"
        >
          🔄 {message.restore_count}
        </button>
        <button
          onClick={() => updateMessageReaction(message.id, 'destroy', 1)}
          className="flex items-center gap-1 px-3 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium transition"
          title="Kül Et - Tarihten Sil"
        >
          ⚰️ {message.destroy_count}
        </button>
      </div>
      <p className="text-xs text-gray-500">
        {new Date(message.created_at).toLocaleTimeString('tr-TR')}
      </p>
    </div>
  );
};

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <div className="mb-4 p-4 bg-white rounded-lg border-l-4 border-amber-300 hover:bg-amber-50 transition">
      {/* Başlık: Kullanıcı Adı */}
      <div className="flex items-center justify-between mb-2">
        <p className="font-bold text-amber-900">{message.ancient_name}</p>
        {message.edited && <span className="text-xs text-gray-400">düzenlendi</span>}
      </div>

      {/* Envanterlik İşareti */}
      {message.is_artifact && <ArtifactBadge label={message.artifact_label} />}

      {/* Mesaj İçeriği */}
      <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>

      {/* Aksiyonlar */}
      <MessageActions message={message} />
    </div>
  );
};

export const ChatWindow: React.FC = () => {
  const { messages, currentLayerId } = useChat();
  const layerMessages = messages.filter(m => m.layer_id === currentLayerId);

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-white via-amber-50 to-white">
      {layerMessages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p className="text-center">
            <span className="text-4xl block mb-2">🏺</span>
            Bu katmanda henüz buluntu yok. Konuşmayı başlat!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {layerMessages.map(message => (
            <MessageItem key={message.id} message={message} />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// 5. MESAJ İNPUT: Yazma ve Envanterlik Seçeneği
// ============================================

export const MessageInput: React.FC = () => {
  const [content, setContent] = useState('');
  const [isArtifact, setIsArtifact] = useState(false);
  const [artifactLabel, setArtifactLabel] = useState('');
  const { user } = useAuth();
  const { currentLayerId, addMessage } = useChat();

  const handleSend = async () => {
    if (!content.trim() || !user || !currentLayerId) return;

    const message: Message = {
      id: crypto.randomUUID(),
      layer_id: currentLayerId!,
      user_id: user.sessionId,
      ancient_name: user.ancientName,
      content,
      is_artifact: isArtifact,
      artifact_label: isArtifact ? artifactLabel : undefined,
      restore_count: 0,
      destroy_count: 0,
      created_at: new Date().toISOString(),
      edited: false,
    };

    addMessage(message);
    setContent('');
    setIsArtifact(false);
    setArtifactLabel('');

    // Supabase''ye kaydet
    // await supabase.from('messages').insert([message]);
  };

  return (
    <div className="p-4 border-t border-amber-200 bg-stone-50">
      <div className="space-y-3">
        {/* Envanterlik Seçeneği */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isArtifact}
            onChange={e => setIsArtifact(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-amber-900 font-medium">📦 Bunu envanterlik olarak işaretle</span>
        </label>

        {/* Envanterlik Etiketi */}
        {isArtifact && (
          <input
            type="text"
            placeholder="Örn: Çift Körüklü Seramik Teknikleri"
            value={artifactLabel}
            onChange={e => setArtifactLabel(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-amber-200 rounded bg-white"
          />
        )}

        {/* Mesaj Alanı */}
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Arkeolojik buluntunuzu yazın..."
          className="w-full px-4 py-3 border border-amber-200 rounded-lg bg-white text-sm resize-none"
          rows={3}
        />

        {/* Gönder Butonu */}
        <button
          onClick={handleSend}
          disabled={!content.trim()}
          className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition"
        >
          ⬆️ Tabakaya Gönder
        </button>
      </div>
    </div>
  );
};

// ============================================
// 6. ANA LAYOUT
// ============================================

export const MainLayout: React.FC = () => {
  const { currentLayerId, layers } = useChat();
  const currentLayer = layers.find(l => l.id === currentLayerId);

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sol Sidebar */}
      <Sidebar />

      {/* Ana İçerik */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-amber-700 to-amber-600 text-white px-6 py-4 shadow-md">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {currentLayer?.icon_emoji} {currentLayer?.display_name || 'Stratigraph'}
          </h1>
          <p className="text-amber-100 text-sm mt-1">{currentLayer?.etymology}</p>
        </header>

        {/* Chat Penceresi */}
        <ChatWindow />

        {/* Mesaj İnput */}
        <MessageInput />
      </div>
    </div>
  );
};

// ============================================
// 7. ANA APP
// ============================================

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ChatProvider>
        <MainLayout />
      </ChatProvider>
    </AuthProvider>
  );
};

export default App;
