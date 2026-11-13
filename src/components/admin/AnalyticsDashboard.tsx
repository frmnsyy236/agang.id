import React, { useState, useEffect, useCallback } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  Eye,
  Smartphone,
  Compass,
  RefreshCw,
  Calendar,
  AlertTriangle,
  ExternalLink,
  TrendingUp,
  BarChart3,
  Layers,
  Sparkles,
} from 'lucide-react';
import { fetchAnalyticsData, AnalyticsSummary } from '@/lib/analytics';
import { toast } from 'sonner';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const views = payload.find((p) => p.dataKey === 'views')?.value || 0;
    const visitors = payload.find((p) => p.dataKey === 'visitors')?.value || 0;

    return (
      <div className="bg-[#3a0606] border border-red-400/40 rounded-xl p-3 shadow-2xl text-xs text-white backdrop-blur-md">
        <p className="font-bold text-red-200 border-b border-white/10 pb-1 mb-2">{label}</p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-white/80">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span>Total Tayangan:</span>
            </span>
            <span className="font-black text-white">{views}x</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-white/80">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Pengunjung Unik:</span>
            </span>
            <span className="font-black text-amber-300">{visitors} orang</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const AnalyticsDashboard: React.FC = () => {
  const [daysRange, setDaysRange] = useState<number>(7);
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);

  const loadData = useCallback(async (days: number) => {
    setIsLoading(true);
    try {
      const result = await fetchAnalyticsData(days);
      setSummary(result);
    } catch (err) {
      toast.error('Gagal memuat statistik kunjungan.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(daysRange);
  }, [daysRange, loadData]);

  const handleRefresh = async () => {
    await loadData(daysRange);
    toast.success('Data statistik berhasil diperbarui!');
  };

  const topDevice = summary?.devices?.[0]?.device || 'Mobile (HP)';
  const topDevicePct = summary?.devices?.[0]?.percentage || 100;

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-[#6f0f0f] border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#520909] text-white text-xs font-bold uppercase tracking-wider mb-2 border border-white/20">
            <TrendingUp size={13} className="text-amber-400" />
            <span>Real-time Traffic Monitor</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Grafik Penelusuran & Pengunjung Agang.id</span>
          </h2>
          <p className="text-white/75 text-xs sm:text-sm mt-1">
            Pantau seberapa banyak orang yang mengunjungi website, melihat menu, dan membaca artikel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Pilihan Rentang Waktu */}
          <div className="flex items-center bg-[#520909] p-1 rounded-2xl border border-white/15 text-xs font-bold">
            <button
              type="button"
              onClick={() => setDaysRange(7)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                daysRange === 7 ? 'bg-white text-red-950 font-black shadow-md' : 'text-white/70 hover:text-white'
              }`}
            >
              7 Hari
            </button>
            <button
              type="button"
              onClick={() => setDaysRange(14)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                daysRange === 14 ? 'bg-white text-red-950 font-black shadow-md' : 'text-white/70 hover:text-white'
              }`}
            >
              14 Hari
            </button>
            <button
              type="button"
              onClick={() => setDaysRange(30)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                daysRange === 30 ? 'bg-white text-red-950 font-black shadow-md' : 'text-white/70 hover:text-white'
              }`}
            >
              30 Hari
            </button>
          </div>

          {/* Toggle Area / Bar */}
          <div className="flex items-center bg-[#520909] p-1 rounded-2xl border border-white/15 text-xs">
            <button
              type="button"
              onClick={() => setChartType('area')}
              title="Grafik Tren Area"
              className={`p-2 rounded-xl transition-all ${
                chartType === 'area' ? 'bg-white text-red-950 shadow-md' : 'text-white/70 hover:text-white'
              }`}
            >
              <TrendingUp size={16} />
            </button>
            <button
              type="button"
              onClick={() => setChartType('bar')}
              title="Grafik Batang Harian"
              className={`p-2 rounded-xl transition-all ${
                chartType === 'bar' ? 'bg-white text-red-950 shadow-md' : 'text-white/70 hover:text-white'
              }`}
            >
              <BarChart3 size={16} />
            </button>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#520909] hover:bg-[#450707] border border-white/20 text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
            title="Segarkan data statistik"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin text-amber-400' : 'text-white'} />
            <span className="hidden sm:inline">Segarkan</span>
          </button>
        </div>
      </div>

      {/* Warning Banner if table site_visits doesn't exist */}
      {summary && !summary.isTableCreated && (
        <div className="bg-amber-950/90 border-2 border-amber-500 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={26} />
            <div>
              <h4 className="font-bold text-white text-sm sm:text-base">
                Tabel Statistik `site_visits` Belum Dibuat di Supabase
              </h4>
              <p className="text-white/80 text-xs sm:text-sm mt-1">
                Agar jumlah pengunjung dan grafik dapat mulai mencatat otomatis setiap orang yang membuka website, silakan jalankan script SQL di Supabase SQL Editor.
              </p>
            </div>
          </div>
          <a
            href="https://supabase.com/dashboard/project/zvuwswmwiypwdalnhddi/sql/new"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <span>Buka SQL Editor Supabase</span>
            <ExternalLink size={14} />
          </a>
        </div>
      )}

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Page Views */}
        <div className="bg-[#6f0f0f] border border-white/15 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-white/70 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Total Tayangan</span>
            <div className="w-8 h-8 rounded-xl bg-[#520909] flex items-center justify-center text-red-200">
              <Eye size={16} />
            </div>
          </div>
          <div className="font-display text-3xl sm:text-4xl font-black text-white">
            {isLoading ? '...' : `${summary?.totalViews.toLocaleString() || 0}x`}
          </div>
          <p className="text-[11px] text-white/60 mt-1">
            Total halaman dibuka dalam {daysRange} hari
          </p>
        </div>

        {/* Card 2: Unique Visitors */}
        <div className="bg-[#6f0f0f] border border-white/15 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-white/70 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Pengunjung Unik</span>
            <div className="w-8 h-8 rounded-xl bg-[#520909] flex items-center justify-center text-amber-300">
              <Users size={16} />
            </div>
          </div>
          <div className="font-display text-3xl sm:text-4xl font-black text-white">
            {isLoading ? '...' : `${summary?.uniqueVisitors.toLocaleString() || 0}`}
          </div>
          <p className="text-[11px] text-white/60 mt-1">
            Orang berbeda yang mengakses website
          </p>
        </div>

        {/* Card 3: Hari Ini */}
        <div className="bg-[#6f0f0f] border border-white/15 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-white/70 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Hari Ini</span>
            <div className="w-8 h-8 rounded-xl bg-[#520909] flex items-center justify-center text-emerald-400">
              <Calendar size={16} />
            </div>
          </div>
          <div className="font-display text-3xl sm:text-4xl font-black text-emerald-400">
            {isLoading ? '...' : `${summary?.todayVisitors || 0}`}
            <span className="text-sm font-normal text-white/60 ml-1">orang</span>
          </div>
          <p className="text-[11px] text-white/60 mt-1">
            {summary?.todayViews || 0}x total tayangan hari ini
          </p>
        </div>

        {/* Card 4: Device Terpopuler */}
        <div className="bg-[#6f0f0f] border border-white/15 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-white/70 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Perangkat Utama</span>
            <div className="w-8 h-8 rounded-xl bg-[#520909] flex items-center justify-center text-sky-300">
              <Smartphone size={16} />
            </div>
          </div>
          <div className="font-display text-2xl sm:text-3xl font-black text-white truncate">
            {isLoading ? '...' : topDevice}
          </div>
          <p className="text-[11px] text-white/60 mt-1">
            Mendominasi sekitar {topDevicePct}% pengunjung
          </p>
        </div>
      </div>

      {/* Main Chart Container */}
      <div className="bg-[#6f0f0f] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-display text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <BarChart3 size={20} className="text-red-300" />
              <span>Tren Kunjungan Harian ({daysRange} Hari Terakhir)</span>
            </h3>
            <p className="text-white/60 text-xs mt-0.5">
              Grafik membandingkan total tayangan halaman dengan jumlah pengunjung unik tiap hari.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="text-white/80">Total Tayangan (Views)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="text-amber-300">Pengunjung Unik</span>
            </div>
          </div>
        </div>

        {/* Chart View */}
        <div className="w-full h-72 sm:h-80 pt-2">
          {summary?.dailyStats && summary.dailyStats.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart data={summary.dailyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f87171" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#f87171" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    stroke="rgba(255,255,255,0.5)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.15)' }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.15)' }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#f87171"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#viewsGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#fbbf24"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#visitorsGradient)"
                  />
                </AreaChart>
              ) : (
                <BarChart data={summary.dailyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    stroke="rgba(255,255,255,0.5)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.15)' }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.15)' }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="views" fill="#f87171" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="visitors" fill="#fbbf24" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/50 space-y-2">
              <Layers size={32} />
              <p className="text-xs">Belum ada catatan pengunjung pada rentang waktu ini.</p>
            </div>
          )}
        </div>
      </div>

      {/* Two Column Grid: Top Pages & Traffic/Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages List */}
        <div className="bg-[#6f0f0f] border border-white/15 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="font-display text-base font-black text-white flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" />
              <span>Halaman & Menu Paling Sering Dilihat</span>
            </h4>
            <span className="text-[11px] font-bold text-white/50">Tayangan</span>
          </div>

          <div className="space-y-3">
            {summary?.topPages && summary.topPages.length > 0 ? (
              summary.topPages.map((page, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white truncate max-w-[240px] sm:max-w-[320px]">
                      {page.title}
                      <span className="text-[10px] font-normal text-white/50 ml-1.5 font-mono">
                        ({page.path})
                      </span>
                    </span>
                    <span className="font-black text-amber-300 shrink-0">
                      {page.views}x ({page.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#520909] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-400 to-amber-400 transition-all duration-500"
                      style={{ width: `${Math.max(page.percentage, 4)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-white/50 py-6 text-center">
                Belum ada data halaman yang tercatat.
              </p>
            )}
          </div>
        </div>

        {/* Traffic Sources & Device Distribution */}
        <div className="bg-[#6f0f0f] border border-white/15 rounded-3xl p-6 shadow-xl space-y-6">
          {/* Traffic Sources */}
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <h4 className="font-display text-base font-black text-white flex items-center gap-2">
                <Compass size={16} className="text-sky-300" />
                <span>Asal / Sumber Kunjungan (Referrer)</span>
              </h4>
            </div>

            <div className="space-y-2.5">
              {summary?.referrers && summary.referrers.length > 0 ? (
                summary.referrers.map((ref, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#520909] border border-white/10 text-xs"
                  >
                    <span className="font-bold text-white truncate">{ref.source}</span>
                    <span className="font-black text-sky-300 shrink-0">
                      {ref.count}x ({ref.percentage}%)
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-white/50 py-2 text-center">
                  Belum ada data sumber kunjungan.
                </p>
              )}
            </div>
          </div>

          {/* Device Breakdown */}
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
              <h5 className="font-bold text-xs uppercase text-white/70 flex items-center gap-1.5">
                <Smartphone size={14} className="text-emerald-400" />
                <span>Distribusi Perangkat</span>
              </h5>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {summary?.devices && summary.devices.length > 0 ? (
                summary.devices.map((dev, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#520909] border border-white/10 text-center"
                  >
                    <span className="block text-[11px] font-bold text-white/60 truncate">
                      {dev.device}
                    </span>
                    <span className="font-display text-xl font-black text-white">
                      {dev.percentage}%
                    </span>
                    <span className="block text-[10px] text-white/40">{dev.count} kunjungan</span>
                  </div>
                ))
              ) : (
                <p className="col-span-2 text-xs text-white/50 text-center py-2">
                  Belum ada data perangkat.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
