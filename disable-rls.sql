-- =============================================
-- RLS (ROW-LEVEL SECURITY) POLİCİLERİNİ DİSABLE ET
-- =============================================
-- Arkeosohbet uygulaması anonim olduğundan,
-- RLS kontrol etmek yerine herkese açık tutuyoruz.

-- 1. Reactions tablosu - RLS'yi devre dışı bırak
ALTER TABLE reactions DISABLE ROW LEVEL SECURITY;

-- 2. Messages tablosu - RLS'yi devre dışı bırak
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

-- 3. Active Users tablosu - RLS'yi devre dışı bırak
ALTER TABLE active_users DISABLE ROW LEVEL SECURITY;

-- 4. Ancient Names tablosu - RLS'yi devre dışı bırak
ALTER TABLE ancient_names_pool DISABLE ROW LEVEL SECURITY;

-- 5. Layers tablosu - RLS'yi devre dışı bırak
ALTER TABLE layers DISABLE ROW LEVEL SECURITY;

-- Status
--- ✅ RLS disabled
-- Tüm tablolar artık açık erişim
-- Supabase Dashboard'da SQL Editor'de bu script'i çalıştır
