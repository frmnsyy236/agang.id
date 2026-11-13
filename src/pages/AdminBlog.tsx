import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useBlog } from '@/context/BlogContext';
import { Article, ArticleInput } from '@/types/blog';
import { sampleCoverImages } from '@/data/initialArticles';
import { compressImageFile, formatFileSize } from '@/lib/imageCompression';
import {
  Shield,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Search,
  Key,
  LogOut,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  X,
  Image as ImageIcon,
  BookOpen,
  Eye,
  RotateCcw,
  Check,
  UploadCloud,
  ImagePlus,
  Loader2,
  RefreshCw,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';

export const AdminBlog: React.FC = () => {
  const navigate = useNavigate();
  const {
    articles,
    isAdminAuthenticated,
    adminPin,
    loginAdmin,
    logoutAdmin,
    updateAdminPin,
    addArticle,
    updateArticle,
    deleteArticle,
    resetToDefault,
    isCloudConnected
  } = useBlog();

  // PIN Authentication state
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin Active Tab: 'analytics' (Grafik Pengunjung) atau 'articles' (Kelola Berita)
  const [adminActiveTab, setAdminActiveTab] = useState<'analytics' | 'articles'>('analytics');

  // Dashboard Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua');

  // Modal States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Article Form State
  const initialFormState: ArticleInput = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Kabar Agang',
    coverImage: sampleCoverImages[0].url,
    author: 'Tim Editorial Agang',
    isFeatured: false,
    tags: ['Agang.id']
  };
  const [formData, setFormData] = useState<ArticleInput>(initialFormState);
  const [tagsString, setTagsString] = useState('Agang.id, Berita');

  // File Upload State for Images
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'preset' | 'url'>('upload');
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingBodyImage, setIsUploadingBodyImage] = useState(false);
  const [uploadedCoverInfo, setUploadedCoverInfo] = useState<{ name: string; size: string } | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const bodyImageInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handler for Cover Photo
  const handleCoverFileProcess = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('File yang dipilih harus berupa gambar (JPG, PNG, WEBP).');
      return;
    }

    setIsUploadingCover(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 1200, 1200, 0.82);
      setFormData(prev => ({ ...prev, coverImage: compressedDataUrl }));
      setUploadedCoverInfo({
        name: file.name,
        size: formatFileSize(file.size)
      });
      toast.success(`Foto "${file.name}" berhasil diunggah & siap diterbitkan!`);
    } catch (err: any) {
      toast.error(err.message || 'Gagal memproses file foto.');
    } finally {
      setIsUploadingCover(false);
      if (coverFileInputRef.current) coverFileInputRef.current.value = '';
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleCoverFileProcess(file);
  };

  const handleCoverDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleCoverFileProcess(file);
  };

  // File Upload Handler for Body Image Insertion
  const handleBodyImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('File yang dipilih harus berupa gambar.');
      return;
    }

    setIsUploadingBodyImage(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 1000, 1000, 0.82);
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      const markdownImage = `\n\n![${cleanName}](${compressedDataUrl})\n\n`;
      setFormData(prev => ({
        ...prev,
        content: (prev.content ? prev.content + markdownImage : markdownImage.trim())
      }));
      toast.success(`Foto "${cleanName}" berhasil disisipkan ke isi teks artikel!`);
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyisipkan foto.');
    } finally {
      setIsUploadingBodyImage(false);
      if (bodyImageInputRef.current) bodyImageInputRef.current.value = '';
    }
  };

  // Change PIN Form State
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [pinChangeError, setPinChangeError] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(pinInput)) {
      setLoginError('');
      toast.success('Berhasil masuk sebagai Super Admin!');
    } else {
      setLoginError('PIN salah! Silakan coba lagi.');
    }
  };

  // Open Editor for Creating New
  const handleOpenCreateModal = () => {
    setEditingArticleId(null);
    setFormData(initialFormState);
    setTagsString('Agang.id, Berita');
    setImageInputMode('upload');
    setUploadedCoverInfo(null);
    setIsEditorOpen(true);
  };

  // Open Editor for Editing
  const handleOpenEditModal = (article: Article) => {
    setEditingArticleId(article.id);
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      coverImage: article.coverImage,
      author: article.author,
      date: article.date,
      readTime: article.readTime,
      isFeatured: article.isFeatured || false,
      tags: article.tags || ['Agang.id']
    });
    setTagsString(article.tags ? article.tags.join(', ') : 'Agang.id');
    setImageInputMode('upload');
    setUploadedCoverInfo({
      name: 'Foto Sampul Tersimpan',
      size: 'Siap Pakai'
    });
    setIsEditorOpen(true);
  };

  // Auto-slug generator when title changes (if creating new)
  const handleTitleChange = (val: string) => {
    const updated = { ...formData, title: val };
    if (!editingArticleId) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      updated.slug = generated;
    }
    setFormData(updated);
  };

  // Save Article (Create or Update)
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Judul dan Isi artikel wajib diisi!');
      return;
    }

    const processedTags = tagsString
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const articlePayload: ArticleInput = {
      ...formData,
      tags: processedTags
    };

    if (editingArticleId) {
      updateArticle(editingArticleId, articlePayload);
      toast.success('Artikel berhasil diperbarui!');
    } else {
      addArticle(articlePayload);
      toast.success('Artikel baru berhasil dipublikasikan!');
    }

    setIsEditorOpen(false);
  };

  // Handle Delete Article
  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deleteArticle(deleteConfirmId);
      toast.success('Artikel berhasil dihapus!');
      setDeleteConfirmId(null);
    }
  };

  // Handle Change PIN
  const handleUpdatePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (updateAdminPin(currentPinInput, newPinInput)) {
      setPinChangeSuccess(true);
      setPinChangeError('');
      toast.success('PIN Super Admin berhasil diganti!');
      setTimeout(() => {
        setIsPinModalOpen(false);
        setPinChangeSuccess(false);
        setCurrentPinInput('');
        setNewPinInput('');
      }, 1500);
    } else {
      setPinChangeError('PIN lama salah atau PIN baru kurang dari 4 karakter.');
    }
  };

  // Handle Reset to Default
  const handleConfirmReset = () => {
    resetToDefault();
    setIsResetConfirmOpen(false);
    toast.success('Database artikel berhasil di-reset ke data bawaan!');
  };

  // Filtered Articles for Table
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchCat = filterCategory === 'Semua' || art.category === filterCategory;
      const matchSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.slug.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [articles, filterCategory, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const categoriesSet = new Set(articles.map((a) => a.category));
    const featuredCount = articles.filter((a) => a.isFeatured).length;
    return {
      total: articles.length,
      categories: categoriesSet.size,
      featured: featuredCount
    };
  }, [articles]);

  // IF NOT AUTHENTICATED: Show Login Screen
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#580c0c] via-[#730f0f] to-[#520909] text-white flex items-center justify-center p-4">
        <Helmet>
          <title>Login Super Admin - Agang.id</title>
        </Helmet>

        <div className="w-full max-w-md bg-[#6f0f0f] border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="text-center space-y-3 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white text-red-950 flex items-center justify-center mx-auto shadow-lg mb-2">
              <Shield size={36} />
            </div>
            <h1 className="font-display text-2xl font-black text-white">
              Portal Super Admin Agang.id
            </h1>
            <p className="text-white/75 text-xs leading-relaxed">
              Panel eksklusif untuk menerbitkan, memperbarui, dan mengelola artikel serta berita resmi Agang.id.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Masukkan PIN Keamanan
              </label>
              <div className="relative">
                <Key size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Ketik PIN Admin..."
                  autoFocus
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#520909] border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 font-bold"
                />
              </div>
              <p className="text-[11px] text-white/60 mt-2">
                💡 <span className="font-semibold text-white">PIN Bawaan:</span> <code className="bg-[#520909] px-2 py-0.5 rounded text-white font-mono">admin123</code> (bisa diganti di dalam panel).
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-bold flex items-center gap-2">
                <AlertTriangle size={15} className="text-red-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-red-950 font-black text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Shield size={16} />
              <span>Masuk ke Panel Super Admin</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Kembali ke Beranda Agang.id</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // IF AUTHENTICATED: Show Super Admin Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#580c0c] via-[#730f0f] to-[#520909] text-white pb-20">
      <Helmet>
        <title>Dashboard Super Admin Berita & Artikel - Agang.id</title>
      </Helmet>

      {/* Top Navbar Admin */}
      <header className="bg-[#520909] border-b border-white/10 sticky top-0 z-30 shadow-xl backdrop-blur-md">
        <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-white text-red-950 font-black flex items-center justify-center text-sm shadow-md">
                A
              </span>
              <span className="font-display text-lg font-black text-white">
                Agang<span className="text-red-200">.id</span>
              </span>
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
              Super Admin CMS
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/blog"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6f0f0f] hover:bg-[#7e1414] text-white text-xs font-bold border border-white/15 transition-colors"
              title="Lihat halaman blog publik"
            >
              <Eye size={14} className="text-white/80" />
              <span className="hidden sm:inline">Lihat Web Publik</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsPinModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6f0f0f] hover:bg-[#7e1414] text-white text-xs font-bold border border-white/15 transition-colors"
              title="Ganti PIN Keamanan"
            >
              <Key size={14} />
              <span className="hidden sm:inline">Ganti PIN</span>
            </button>

            <button
              type="button"
              onClick={logoutAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-bold border border-red-500/30 transition-colors"
              title="Keluar dari panel"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="container mx-auto px-4 max-w-7xl pt-8 space-y-8">
        {/* Navigation Tabs Admin: Analytics vs Artikel */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setAdminActiveTab('analytics')}
            className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-lg active:scale-95 ${
              adminActiveTab === 'analytics'
                ? 'bg-white text-red-950 shadow-2xl scale-[1.02]'
                : 'bg-[#6f0f0f] text-white/75 hover:text-white border border-white/15 hover:bg-[#7e1414]'
            }`}
          >
            <BarChart3 size={18} className={adminActiveTab === 'analytics' ? 'text-red-700' : 'text-amber-400'} />
            <span>Grafik Pengunjung Web</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminActiveTab('articles')}
            className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-lg active:scale-95 ${
              adminActiveTab === 'articles'
                ? 'bg-white text-red-950 shadow-2xl scale-[1.02]'
                : 'bg-[#6f0f0f] text-white/75 hover:text-white border border-white/15 hover:bg-[#7e1414]'
            }`}
          >
            <BookOpen size={18} className={adminActiveTab === 'articles' ? 'text-red-700' : 'text-red-300'} />
            <span>Kelola Artikel & Berita</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#520909] text-white">
              {stats.total}
            </span>
          </button>
        </div>

        {/* Tab 1: Analytics Dashboard with Visitor Charts */}
        {adminActiveTab === 'analytics' && <AnalyticsDashboard />}

        {/* Tab 2: Article Management */}
        {adminActiveTab === 'articles' && (
          <div className="space-y-8">
            {/* Welcome & Stats Row */}
        <div className="bg-[#6f0f0f] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#520909] text-white text-xs font-bold uppercase tracking-wider mb-2 border border-white/20">
                <Sparkles size={13} className="text-red-200" />
                <span>Pusat Manajemen Berita & Konten</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-white">
                Dashboard Super Admin Artikel
              </h1>
              <p className="text-white/75 text-xs sm:text-sm mt-1">
                Kelola publikasi cerita, tips kuliner, dan pengumuman promo Agang.id secara real-time.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="self-start md:self-auto inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-neutral-100 text-red-950 font-black text-xs sm:text-sm shadow-xl transition-all active:scale-95 border border-white/30"
            >
              <Plus size={18} />
              <span>+ Tulis Artikel Baru</span>
            </button>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
            <div className="p-4 rounded-2xl bg-[#520909] border border-white/10">
              <span className="block text-[11px] font-bold text-white/60 uppercase">Total Artikel</span>
              <span className="font-display text-2xl sm:text-3xl font-black text-white">
                {stats.total}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#520909] border border-white/10">
              <span className="block text-[11px] font-bold text-white/60 uppercase">Kategori Aktif</span>
              <span className="font-display text-2xl sm:text-3xl font-black text-white">
                {stats.categories}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#520909] border border-white/10">
              <span className="block text-[11px] font-bold text-white/60 uppercase">Artikel Unggulan</span>
              <span className="font-display text-2xl sm:text-3xl font-black text-white">
                {stats.featured}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#520909] border border-white/10">
              <span className="block text-[11px] font-bold text-white/60 uppercase">Database Status</span>
              <span className={`font-display text-xs sm:text-sm font-bold flex items-center gap-1 mt-2 ${isCloudConnected ? 'text-emerald-400' : 'text-amber-300'}`}>
                <CheckCircle2 size={15} />
                <span>{isCloudConnected ? 'Supabase Cloud Aktif' : 'Menghubungkan Cloud...'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Supabase Status Banner if not connected */}
        {!isCloudConnected && (
          <div className="bg-amber-950/80 border-2 border-amber-500 rounded-3xl p-5 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={24} />
              <div>
                <h4 className="font-bold text-white text-sm sm:text-base">
                  Database Cloud Supabase Belum Aktif (Tabel articles belum dibuat)
                </h4>
                <p className="text-white/80 text-xs sm:text-sm mt-0.5">
                  Artikel baru yang Anda buat saat ini <strong>hanya tersimpan di browser Anda</strong> dan tidak akan terlihat oleh orang lain. Silakan buka <strong>SQL Editor</strong> di dashboard Supabase lalu jalankan script pembuat tabel agar artikel tersinkronisasi online untuk semua orang.
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

        {/* Action Toolbar */}
        <div className="bg-[#6f0f0f] border border-white/15 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari artikel berdasarkan judul/penulis..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#520909] border border-white/20 text-white placeholder-white/30 text-xs focus:outline-none focus:border-white font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="py-2 px-3 rounded-xl bg-[#520909] border border-white/20 text-white text-xs font-bold focus:outline-none focus:border-white"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Kabar Agang">Kabar Agang</option>
              <option value="Tips Kuliner">Tips Kuliner</option>
              <option value="Promo & Event">Promo & Event</option>
              <option value="Resep & Menu">Resep & Menu</option>
            </select>

            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#520909] hover:bg-white/10 text-white/70 hover:text-white border border-white/20 text-xs font-bold transition-colors"
              title="Kembalikan artikel bawaan"
            >
              <RotateCcw size={13} />
              <span className="hidden md:inline">Reset Default</span>
            </button>
          </div>
        </div>

        {/* Article Table Container */}
        <div className="bg-[#6f0f0f] border border-white/15 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#520909] text-white font-bold border-b border-white/15 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-4 sm:px-6">Artikel</th>
                  <th className="py-4 px-4 hidden md:table-cell">Kategori</th>
                  <th className="py-4 px-4 hidden sm:table-cell">Penulis & Tanggal</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4 sm:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-white/60">
                      <BookOpen size={32} className="mx-auto text-white/50 mb-2" />
                      <p className="font-bold">Tidak ada artikel yang sesuai kriteria.</p>
                      <button
                        type="button"
                        onClick={handleOpenCreateModal}
                        className="mt-3 text-xs text-white underline font-bold"
                      >
                        + Tulis artikel pertama sekarang
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((article) => (
                    <tr
                      key={article.id}
                      className="hover:bg-[#580c0c]/80 transition-colors group"
                    >
                      {/* Title & Thumbnail */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={article.coverImage}
                            alt=""
                            className="w-14 h-14 rounded-xl object-cover shrink-0 bg-[#520909] border border-white/15"
                          />
                          <div className="min-w-0 max-w-xs sm:max-w-md">
                            <h3 className="font-display font-black text-white text-xs sm:text-sm truncate group-hover:text-red-200 transition-colors">
                              {article.title}
                            </h3>
                            <p className="text-white/60 text-[11px] truncate">
                              /{article.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 hidden md:table-cell">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#520909] text-white border border-white/20 text-[11px] font-bold">
                          {article.category}
                        </span>
                      </td>

                      {/* Author & Date */}
                      <td className="py-4 px-4 hidden sm:table-cell">
                        <div className="text-xs">
                          <span className="block font-bold text-white">{article.author}</span>
                          <span className="text-white/60 text-[11px]">{article.date}</span>
                        </div>
                      </td>

                      {/* Featured Status */}
                      <td className="py-4 px-4 text-center">
                        {article.isFeatured ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-red-950 font-black text-[10px] shadow-sm">
                            <Sparkles size={11} />
                            <span>Unggulan</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-white/50">Standar</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            to={`/blog/${article.slug}`}
                            target="_blank"
                            className="p-2 rounded-lg bg-[#520909] hover:bg-white hover:text-red-950 text-white/80 transition-colors"
                            title="Buka artikel di tab baru"
                          >
                            <ExternalLink size={15} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(article)}
                            className="p-2 rounded-lg bg-[#520909] hover:bg-white hover:text-red-950 text-white transition-colors"
                            title="Edit Artikel"
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(article.id)}
                            className="p-2 rounded-lg bg-[#520909] hover:bg-red-700 text-red-300 transition-colors"
                            title="Hapus Artikel"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}
  </main>

      {/* MODAL: CREATE / EDIT ARTICLE */}
      <AnimatePresence>
        {isEditorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl bg-[#6f0f0f] border border-white/20 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-[#520909] p-5 sm:p-6 border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white text-red-950 flex items-center justify-center font-black">
                    {editingArticleId ? <Edit3 size={20} /> : <Plus size={20} />}
                  </div>
                  <div>
                    <h2 className="font-display text-lg sm:text-xl font-black text-white">
                      {editingArticleId ? 'Edit Artikel Agang' : 'Tulis Artikel Baru'}
                    </h2>
                    <p className="text-white/60 text-xs">
                      {editingArticleId ? 'Perbarui konten artikel yang telah terbit' : 'Terbitkan kabar terbaru untuk pelanggan Agang.id'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Form Body (Scrollable) */}
              <form onSubmit={handleSaveArticle} className="p-5 sm:p-8 space-y-6 overflow-y-auto flex-1">
                {/* Title & Slug */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                      Judul Artikel *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Contoh: Menu Baru Rice Bowl Sambal Matah..."
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-[#520909] border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                      Slug URL (Otomatis)
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="menu-baru-rice-bowl"
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-[#520909] border border-white/20 text-white/90 placeholder-white/30 text-sm focus:outline-none focus:border-white font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Category & Author & Featured */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                      Kategori *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#520909] border border-white/20 text-white text-xs font-bold focus:outline-none focus:border-white"
                    >
                      <option value="Kabar Agang">Kabar Agang</option>
                      <option value="Tips Kuliner">Tips Kuliner</option>
                      <option value="Promo & Event">Promo & Event</option>
                      <option value="Resep & Menu">Resep & Menu</option>
                      <option value="Info Resto">Info Resto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                      Nama Penulis
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Tim Editorial Agang"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#520909] border border-white/20 text-white text-xs font-bold focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="w-5 h-5 rounded accent-red-600 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-white flex items-center gap-1">
                        <Sparkles size={14} className="text-red-200" />
                        Jadikan Artikel Unggulan
                      </span>
                    </label>
                  </div>
                </div>

                {/* Excerpt / Ringkasan */}
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                    Ringkasan Singkat (Excerpt) *
                  </label>
                  <textarea
                    rows={2}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Tulis 1-2 kalimat ringkasan yang menarik untuk kartu pratinjau..."
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#520909] border border-white/20 text-white placeholder-white/30 text-xs sm:text-sm focus:outline-none focus:border-white leading-relaxed font-medium"
                  />
                </div>

                {/* Cover Image Section with File Upload as Primary */}
                <div className="bg-[#520909] p-4 sm:p-5 rounded-2xl border border-white/15 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <ImageIcon size={15} className="text-white/80" />
                        <span>Foto Sampul Artikel (Cover Image) *</span>
                      </label>
                      <p className="text-[11px] text-white/70">
                        Upload foto dari laptop/HP Anda atau gunakan galeri siap pakai.
                      </p>
                    </div>

                    {/* Mode Selector Tabs */}
                    <div className="flex items-center gap-1 bg-[#3d0505] p-1 rounded-xl border border-white/10 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setImageInputMode('upload')}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                          imageInputMode === 'upload'
                            ? 'bg-white text-red-950 font-black shadow'
                            : 'text-white/70 hover:text-white'
                        }`}
                      >
                        <UploadCloud size={13} />
                        <span>Upload File</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageInputMode('preset')}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                          imageInputMode === 'preset'
                            ? 'bg-white text-red-950 font-black shadow'
                            : 'text-white/70 hover:text-white'
                        }`}
                      >
                        <ImageIcon size={13} />
                        <span>Foto Agang</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageInputMode('url')}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                          imageInputMode === 'url'
                            ? 'bg-white text-red-950 font-black shadow'
                            : 'text-white/70 hover:text-white'
                        }`}
                      >
                        <span>Link URL</span>
                      </button>
                    </div>
                  </div>

                  {/* Hidden File Input for Cover */}
                  <input
                    ref={coverFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileChange}
                    className="hidden"
                  />

                  {/* TAB 1: FILE UPLOAD DIRECTLY FROM PC / PHONE */}
                  {imageInputMode === 'upload' && (
                    <div className="space-y-3">
                      {formData.coverImage ? (
                        <div className="space-y-3">
                          <div className="relative aspect-video max-h-64 rounded-2xl overflow-hidden border border-white/30 bg-[#3a0606] shadow-xl group">
                            <img
                              src={formData.coverImage}
                              alt="Cover Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-4">
                              <div className="text-white text-xs">
                                <span className="font-bold text-white block truncate max-w-sm sm:max-w-md">
                                  {uploadedCoverInfo?.name || 'Foto Sampul Terpilih'}
                                </span>
                                <span className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1 mt-0.5">
                                  <Check size={12} />
                                  <span>Foto siap diterbitkan (Otomatis dikompres)</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => coverFileInputRef.current?.click()}
                              disabled={isUploadingCover}
                              className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-100 text-red-950 text-xs font-black transition-all flex items-center gap-1.5 shadow active:scale-95"
                            >
                              {isUploadingCover ? (
                                <>
                                  <Loader2 size={14} className="animate-spin" />
                                  <span>Memproses Foto...</span>
                                </>
                              ) : (
                                <>
                                  <RefreshCw size={14} />
                                  <span>Ganti Foto dari File Lain</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, coverImage: '' }));
                                setUploadedCoverInfo(null);
                              }}
                              className="px-3 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-bold transition-all border border-red-500/30 flex items-center gap-1.5"
                            >
                              <Trash2 size={13} />
                              <span>Kosongkan Foto</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => coverFileInputRef.current?.click()}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingOver(true);
                          }}
                          onDragLeave={() => setIsDraggingOver(false)}
                          onDrop={handleCoverDrop}
                          className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                            isDraggingOver
                              ? 'border-white bg-white/10'
                              : 'border-white/30 hover:border-white bg-[#3d0505]/70 hover:bg-[#3d0505]'
                          }`}
                        >
                          <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center shadow-inner">
                            {isUploadingCover ? (
                              <Loader2 size={28} className="animate-spin text-white" />
                            ) : (
                              <UploadCloud size={28} className="text-white" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">
                              {isUploadingCover
                                ? 'Sedang memproses & mengompres foto...'
                                : 'Klik di Sini untuk Memilih File Foto dari Perangkat'}
                            </p>
                            <p className="text-xs text-white/70 mt-1">
                              Pilih foto dari Galeri HP atau Komputer Anda (JPG, PNG, WEBP)
                            </p>
                          </div>
                          <span className="px-5 py-2 rounded-xl bg-white text-red-950 font-black text-xs shadow-md mt-1 flex items-center gap-1.5">
                            <UploadCloud size={14} />
                            <span>Pilih Berkas Foto Galeri</span>
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: PRESET AGANG PHOTOS */}
                  {imageInputMode === 'preset' && (
                    <div className="space-y-3">
                      <p className="text-xs text-white/75">
                        Pilih foto resmi Agang.id siap pakai berikut:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {sampleCoverImages.map((img, idx) => {
                          const isSelected = formData.coverImage === img.url;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, coverImage: img.url }));
                                setUploadedCoverInfo({ name: img.name, size: 'Galeri Agang' });
                                toast.success(`Foto "${img.name}" dipilih!`);
                              }}
                              className={`relative aspect-video rounded-xl overflow-hidden border-2 text-left transition-all group ${
                                isSelected
                                  ? 'border-white ring-2 ring-white/40 scale-[1.02]'
                                  : 'border-white/20 hover:border-white/40'
                              }`}
                            >
                              <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-2">
                                <span className="text-[11px] font-bold text-white line-clamp-1">
                                  {img.name}
                                </span>
                              </div>
                              {isSelected && (
                                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white text-red-950 flex items-center justify-center font-black shadow">
                                  <Check size={12} />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: URL LINK */}
                  {imageInputMode === 'url' && (
                    <div className="space-y-2">
                      <div className="relative">
                        <ImageIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
                        <input
                          type="url"
                          value={formData.coverImage}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, coverImage: e.target.value }));
                            setUploadedCoverInfo({ name: 'Link URL Gambar', size: 'Online' });
                          }}
                          placeholder="https://example.com/foto-kuliner.jpg"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#3d0505] border border-white/20 text-white placeholder-white/30 text-xs focus:outline-none focus:border-white font-mono"
                        />
                      </div>
                      <p className="text-[11px] text-white/60">
                        Hanya gunakan opsi ini jika Anda memiliki tautan gambar eksternal di internet.
                      </p>
                    </div>
                  )}
                </div>

                {/* Content / Body */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <label className="text-xs font-bold text-white uppercase tracking-wider">
                      Isi Lengkap Artikel *
                    </label>

                    <div className="flex items-center gap-2">
                      {/* Hidden File Input for Body Image Insertion */}
                      <input
                        ref={bodyImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleBodyImageFileChange}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => bodyImageInputRef.current?.click()}
                        disabled={isUploadingBodyImage}
                        className="px-3 py-1.5 rounded-xl bg-[#520909] hover:bg-white hover:text-red-950 text-white border border-white/20 text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                        title="Pilih file foto dari laptop/HP untuk disisipkan ke dalam paragraf artikel"
                      >
                        {isUploadingBodyImage ? (
                          <>
                            <Loader2 size={13} className="animate-spin" />
                            <span>Menyisipkan Foto...</span>
                          </>
                        ) : (
                          <>
                            <ImagePlus size={14} />
                            <span>+ Sisipkan Foto ke Teks Artikel</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-white/60 mb-2">
                    Mendukung format: <code className="text-red-200">### Sub Judul</code>, <code className="text-red-200">&gt; Kutipan</code>, <code className="text-red-200">**Tebal**</code>, <code className="text-red-200">- Poin</code>
                  </p>

                  <textarea
                    rows={8}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Tuliskan cerita lengkap atau berita seputar Agang.id di sini..."
                    required
                    className="w-full p-4 rounded-xl bg-[#520909] border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white leading-relaxed font-sans"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                    Kata Kunci / Tag (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={tagsString}
                    onChange={(e) => setTagsString(e.target.value)}
                    placeholder="Makassar, Rice Bowl, Dimsum, Promo"
                    className="w-full px-4 py-2 rounded-xl bg-[#520909] border border-white/20 text-white text-xs font-medium focus:outline-none focus:border-white"
                  />
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-[#520909] hover:bg-red-950 text-white/80 hover:text-white text-xs font-bold transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-red-950 font-black text-xs shadow-xl transition-all active:scale-95 flex items-center gap-2"
                  >
                    <CheckCircle2 size={16} />
                    <span>{editingArticleId ? 'Simpan Perubahan' : 'Terbitkan Artikel Sekarang'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: DELETE CONFIRMATION */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#6f0f0f] border border-red-500/40 rounded-3xl p-6 shadow-2xl text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-900/80 text-red-200 flex items-center justify-center mx-auto border border-red-500/30">
                <Trash2 size={28} />
              </div>
              <h3 className="font-display text-lg font-black text-white">
                Hapus Artikel Ini?
              </h3>
              <p className="text-white/75 text-xs leading-relaxed">
                Artikel yang dihapus tidak akan ditampilkan lagi di halaman blog publik. Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-5 py-2 rounded-xl bg-[#520909] text-white/80 text-xs font-bold hover:bg-red-950"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-lg"
                >
                  Ya, Hapus Sekarang
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: CHANGE ADMIN PIN */}
      <AnimatePresence>
        {isPinModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#6f0f0f] border border-white/20 rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setIsPinModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-white/60 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white text-red-950 flex items-center justify-center font-black">
                  <Key size={20} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-black text-white">
                    Ganti PIN Super Admin
                  </h3>
                  <p className="text-white/60 text-xs">
                    Perbarui PIN rahasia untuk akses admin
                  </p>
                </div>
              </div>

              <form onSubmit={handleUpdatePinSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    PIN Lama
                  </label>
                  <input
                    type="password"
                    value={currentPinInput}
                    onChange={(e) => setCurrentPinInput(e.target.value)}
                    placeholder="Masukkan PIN saat ini..."
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#520909] border border-white/20 text-white text-sm focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    PIN Baru (Minimal 4 Karakter)
                  </label>
                  <input
                    type="password"
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    placeholder="Ketik PIN baru..."
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#520909] border border-white/20 text-white text-sm focus:outline-none focus:border-white"
                  />
                </div>

                {pinChangeError && (
                  <p className="text-xs text-red-300 font-bold bg-red-950/80 p-2.5 rounded-xl border border-red-500/30">
                    {pinChangeError}
                  </p>
                )}

                {pinChangeSuccess && (
                  <p className="text-xs text-emerald-300 font-bold bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-500/30 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    PIN berhasil diperbarui!
                  </p>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPinModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#520909] text-white/80 text-xs font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-white hover:bg-neutral-100 text-red-950 text-xs font-black shadow-lg"
                  >
                    Simpan PIN Baru
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: RESET TO DEFAULT CONFIRM */}
      <AnimatePresence>
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#6f0f0f] border border-white/20 rounded-3xl p-6 shadow-2xl text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center mx-auto border border-white/20">
                <RotateCcw size={28} />
              </div>
              <h3 className="font-display text-lg font-black text-white">
                Reset ke Artikel Bawaan?
              </h3>
              <p className="text-white/75 text-xs leading-relaxed">
                Ini akan mengembalikan daftar artikel ke 5 artikel resmi awal Agang.id. Artikel kustom yang baru saja dibuat akan ditimpa.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="px-5 py-2 rounded-xl bg-[#520909] text-white/80 text-xs font-bold hover:bg-red-950"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="px-5 py-2 rounded-xl bg-white hover:bg-neutral-100 text-red-950 text-xs font-black shadow-lg"
                >
                  Ya, Reset Sekarang
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBlog;
