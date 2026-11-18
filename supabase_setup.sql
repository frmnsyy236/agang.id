-- ===============================================================
-- SKRIP SETUP DATABASE SUPABASE LENGKAP UNTUK AGANG.ID
-- Salin dan jalankan skrip ini di SQL Editor Supabase Anda:
-- https://supabase.com/dashboard/project/zvuwswmwiypwdalnhddi/sql/new
-- ===============================================================

-- 1. TABEL STATISTIK PENGUNJUNG / ANALYTICS (site_visits)
CREATE TABLE IF NOT EXISTS public.site_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  page_title TEXT,
  visitor_id TEXT NOT NULL,
  session_id TEXT,
  referrer TEXT,
  device_type TEXT,
  browser TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes untuk query grafik & tanggal yang sangat cepat
CREATE INDEX IF NOT EXISTS idx_site_visits_created_at ON public.site_visits (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_visits_page_path ON public.site_visits (page_path);
CREATE INDEX IF NOT EXISTS idx_site_visits_visitor_id ON public.site_visits (visitor_id);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

-- Policy untuk tabel site_visits
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_visits' AND policyname = 'Public insert site_visits') THEN
    CREATE POLICY "Public insert site_visits" ON public.site_visits FOR INSERT TO public WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_visits' AND policyname = 'Public read site_visits') THEN
    CREATE POLICY "Public read site_visits" ON public.site_visits FOR SELECT TO public USING (true);
  END IF;
END $$;


-- 2. TABEL ARTIKEL & BERITA (articles)
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Kabar Agang',
  cover_image TEXT,
  author TEXT DEFAULT 'Tim Editorial Agang',
  date TEXT,
  read_time TEXT DEFAULT '3 menit',
  is_featured BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Aktifkan RLS untuk articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Policy untuk tabel articles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'articles' AND policyname = 'Public read articles') THEN
    CREATE POLICY "Public read articles" ON public.articles FOR SELECT TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'articles' AND policyname = 'Public insert articles') THEN
    CREATE POLICY "Public insert articles" ON public.articles FOR INSERT TO public WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'articles' AND policyname = 'Public update articles') THEN
    CREATE POLICY "Public update articles" ON public.articles FOR UPDATE TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'articles' AND policyname = 'Public delete articles') THEN
    CREATE POLICY "Public delete articles" ON public.articles FOR DELETE TO public USING (true);
  END IF;
END $$;


-- 3. TABEL DAFTAR MENU & HARGA (menu_items)
CREATE TABLE IF NOT EXISTS public.menu_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  price_display TEXT,
  image TEXT,
  category TEXT NOT NULL DEFAULT 'ricebowl',
  is_popular BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index urutan posisi
CREATE INDEX IF NOT EXISTS idx_menu_items_display_order ON public.menu_items (display_order ASC);

-- Aktifkan RLS untuk menu_items
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Policy untuk tabel menu_items (Public Read & Public Insert/Update/Delete via anon)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'menu_items' AND policyname = 'Public read menu_items') THEN
    CREATE POLICY "Public read menu_items" ON public.menu_items FOR SELECT TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'menu_items' AND policyname = 'Public insert menu_items') THEN
    CREATE POLICY "Public insert menu_items" ON public.menu_items FOR INSERT TO public WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'menu_items' AND policyname = 'Public update menu_items') THEN
    CREATE POLICY "Public update menu_items" ON public.menu_items FOR UPDATE TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'menu_items' AND policyname = 'Public delete menu_items') THEN
    CREATE POLICY "Public delete menu_items" ON public.menu_items FOR DELETE TO public USING (true);
  END IF;
END $$;

-- Aktifkan Realtime Replication untuk menu_items (opsional)
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
EXCEPTION WHEN OTHERS THEN
  -- lewati jika sudah terdaftar
  NULL;
END $$;
