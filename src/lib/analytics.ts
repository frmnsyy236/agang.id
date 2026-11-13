import { supabase } from './supabase';

export interface VisitRecord {
  id: string;
  page_path: string;
  page_title: string | null;
  visitor_id: string;
  session_id: string | null;
  referrer: string | null;
  device_type: string | null;
  browser: string | null;
  created_at: string;
}

export interface DailyStat {
  dateKey: string;     // YYYY-MM-DD
  label: string;       // misal '13 Nov'
  views: number;       // total tayangan
  visitors: number;    // orang unik
}

export interface PageStat {
  path: string;
  title: string;
  views: number;
  percentage: number;
}

export interface DeviceStat {
  device: string;
  count: number;
  percentage: number;
}

export interface ReferrerStat {
  source: string;
  count: number;
  percentage: number;
}

export interface AnalyticsSummary {
  totalViews: number;
  uniqueVisitors: number;
  todayViews: number;
  todayVisitors: number;
  dailyStats: DailyStat[];
  topPages: PageStat[];
  devices: DeviceStat[];
  referrers: ReferrerStat[];
  isTableCreated: boolean;
  errorMessage?: string;
}

const VISITOR_ID_KEY = 'agang_visitor_id';
const SESSION_ID_KEY = 'agang_session_id';

export function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = 'v_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return 'v_anonymous_' + Date.now();
  }
}

export function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_ID_KEY);
    if (!id) {
      id = 's_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      sessionStorage.setItem(SESSION_ID_KEY, id);
    }
    return id;
  } catch {
    return 's_session_' + Date.now();
  }
}

export function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua) || window.innerWidth < 768) {
    return 'Mobile (HP)';
  }
  return 'Desktop / Laptop';
}

export function getBrowserName(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  return 'Browser Lain';
}

export function getCleanReferrer(): string {
  const ref = document.referrer;
  if (!ref) return 'Langsung (Direct / WhatsApp)';
  try {
    const url = new URL(ref);
    if (url.hostname.includes('google')) return 'Google Search';
    if (url.hostname.includes('instagram')) return 'Instagram';
    if (url.hostname.includes('facebook')) return 'Facebook';
    if (url.hostname.includes('tiktok')) return 'TikTok';
    if (url.hostname.includes('wa.me') || url.hostname.includes('whatsapp')) return 'WhatsApp Chat';
    return url.hostname;
  } catch {
    return ref.substring(0, 40);
  }
}

/**
 * Mencatat kunjungan halaman ke Supabase (otomatis skip halaman admin)
 */
export async function trackPageView(path: string, customTitle?: string): Promise<void> {
  // Jangan lacak aktivitas di dalam admin dashboard
  if (path.startsWith('/admin')) {
    return;
  }

  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const deviceType = getDeviceType();
    const browser = getBrowserName();
    const referrer = getCleanReferrer();
    const title = customTitle || document.title || 'Agang.id';

    await supabase.from('site_visits').insert([
      {
        page_path: path,
        page_title: title,
        visitor_id: visitorId,
        session_id: sessionId,
        referrer: referrer,
        device_type: deviceType,
        browser: browser,
      },
    ]);
  } catch (err) {
    // Silent fail agar tidak mengganggu browsing pengunjung
    console.debug('Analytics tracker notice:', err);
  }
}

/**
 * Mengambil dan mengagregasi data analitik kunjungan untuk Dashboard Admin
 */
export async function fetchAnalyticsData(daysRange: number = 7): Promise<AnalyticsSummary> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (daysRange - 1));
    startDate.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('site_visits')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      // Jika tabel belum dibuat di Supabase
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return {
          totalViews: 0,
          uniqueVisitors: 0,
          todayViews: 0,
          todayVisitors: 0,
          dailyStats: generateEmptyDays(daysRange),
          topPages: [],
          devices: [],
          referrers: [],
          isTableCreated: false,
          errorMessage: 'Tabel site_visits belum dibuat di Supabase.',
        };
      }
      throw error;
    }

    const rows: VisitRecord[] = data || [];

    // Hari ini (WITA / Local)
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayRows = rows.filter((r) => r.created_at.slice(0, 10) === todayStr);

    const totalViews = rows.length;
    const uniqueVisitors = new Set(rows.map((r) => r.visitor_id)).size;
    const todayViews = todayRows.length;
    const todayVisitors = new Set(todayRows.map((r) => r.visitor_id)).size;

    // 1. Daily Stats (untuk Grafik Recharts)
    const dayMap = new Map<string, { views: number; visitors: Set<string> }>();
    
    // Inisialisasi setiap hari dalam rentang waktu agar grafik berkesinambungan
    for (let i = daysRange - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dayMap.set(key, { views: 0, visitors: new Set<string>() });
    }

    rows.forEach((r) => {
      const key = r.created_at.slice(0, 10);
      if (dayMap.has(key)) {
        const item = dayMap.get(key)!;
        item.views += 1;
        item.visitors.add(r.visitor_id);
      }
    });

    const dailyStats: DailyStat[] = Array.from(dayMap.entries()).map(([key, val]) => {
      const dateObj = new Date(key + 'T00:00:00');
      const day = dateObj.getDate();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const label = `${day} ${monthNames[dateObj.getMonth()]}`;

      return {
        dateKey: key,
        label,
        views: val.views,
        visitors: val.visitors.size,
      };
    });

    // 2. Top Pages
    const pageCountMap = new Map<string, { count: number; title: string }>();
    rows.forEach((r) => {
      const path = r.page_path || '/';
      const existing = pageCountMap.get(path);
      const displayTitle = r.page_title || formatPathTitle(path);
      if (existing) {
        existing.count += 1;
      } else {
        pageCountMap.set(path, { count: 1, title: displayTitle });
      }
    });

    const topPages: PageStat[] = Array.from(pageCountMap.entries())
      .map(([path, info]) => ({
        path,
        title: info.title,
        views: info.count,
        percentage: totalViews > 0 ? Math.round((info.count / totalViews) * 100) : 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 6);

    // 3. Device Breakdown
    const deviceCountMap = new Map<string, number>();
    rows.forEach((r) => {
      const dev = r.device_type || 'Mobile (HP)';
      deviceCountMap.set(dev, (deviceCountMap.get(dev) || 0) + 1);
    });

    const devices: DeviceStat[] = Array.from(deviceCountMap.entries())
      .map(([device, count]) => ({
        device,
        count,
        percentage: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // 4. Referrer Breakdown
    const refCountMap = new Map<string, number>();
    rows.forEach((r) => {
      const source = r.referrer || 'Langsung (Direct / WhatsApp)';
      refCountMap.set(source, (refCountMap.get(source) || 0) + 1);
    });

    const referrers: ReferrerStat[] = Array.from(refCountMap.entries())
      .map(([source, count]) => ({
        source,
        count,
        percentage: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalViews,
      uniqueVisitors,
      todayViews,
      todayVisitors,
      dailyStats,
      topPages,
      devices,
      referrers,
      isTableCreated: true,
    };
  } catch (err: any) {
    console.error('Error fetching analytics:', err);
    return {
      totalViews: 0,
      uniqueVisitors: 0,
      todayViews: 0,
      todayVisitors: 0,
      dailyStats: generateEmptyDays(daysRange),
      topPages: [],
      devices: [],
      referrers: [],
      isTableCreated: false,
      errorMessage: err.message || 'Gagal memuat analitik.',
    };
  }
}

function generateEmptyDays(daysRange: number): DailyStat[] {
  const list: DailyStat[] = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  for (let i = daysRange - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    list.push({
      dateKey: key,
      label: `${d.getDate()} ${monthNames[d.getMonth()]}`,
      views: 0,
      visitors: 0,
    });
  }
  return list;
}

function formatPathTitle(path: string): string {
  if (path === '/') return 'Halaman Utama (Beranda)';
  if (path === '/products' || path === '/Products' || path === '/menu') return 'Daftar Menu Kuliner';
  if (path === '/blog' || path === '/BlogPost') return 'Artikel & Berita';
  if (path === '/promo') return 'Halaman Promo';
  if (path === '/about') return 'Tentang Agang.id';
  if (path.startsWith('/blog/')) return `Artikel: ${path.replace('/blog/', '')}`;
  return path;
}
