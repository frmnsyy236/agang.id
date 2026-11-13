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
