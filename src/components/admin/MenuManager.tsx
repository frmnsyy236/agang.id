import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMenu } from '@/context/MenuContext';
import { MenuItem, MenuItemInput } from '@/types/menu';
import { formatPrice, categories as defaultCategories } from '@/data/menuData';
import { compressImageFile, formatFileSize } from '@/lib/imageCompression';
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  ArrowUp,
  ArrowDown,
  Star,
  Sparkles,
  UploadCloud,
  ImageIcon,
  Check,
  X,
  RotateCcw,
  AlertTriangle,
  Loader2,
  DollarSign,
  Layers,
  UtensilsCrossed,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

// Presets for quick selection
import imgTokyo from '@/assets/chicken tokyo.jpg';
import imgCheese from '@/assets/chicken chesee.jpg';
import imgOriginal from '@/assets/chicken original.jpg';
import imgKatsu from '@/assets/Ciken katsu.jpg';
import imgTaiwanCheese from '@/assets/Taiwan Chesee.jpg';
import imgTaiwanBalado from '@/assets/Taiwan Balado.jpg';
import imgTaiwanBBQ from '@/assets/Taiwan BBQ.jpg';
import imgDimsumOriginal from '@/assets/dimsum original .jpg';
import imgDimsumMentaiCheese from '@/assets/dimsummentaichesee.jpg';
import imgDimsumMentai from '@/assets/dimsummentai.jpg';

const presetPhotos = [
  { label: 'Chicken Cheese', url: imgCheese },
  { label: 'Chicken Original / Sambel Matah', url: imgOriginal },
  { label: 'Chicken Tokyo', url: imgTokyo },
  { label: 'Chicken Katsu / Kulit', url: imgKatsu },
  { label: 'Taiwan Cheese', url: imgTaiwanCheese },
  { label: 'Taiwan Balado', url: imgTaiwanBalado },
  { label: 'Taiwan BBQ', url: imgTaiwanBBQ },
  { label: 'Dimsum Original / Goreng', url: imgDimsumOriginal },
  { label: 'Dimsum Mentai Cheese', url: imgDimsumMentaiCheese },
  { label: 'Dimsum Mentai', url: imgDimsumMentai },
];

export const MenuManager: React.FC = () => {
  const {
    menuItems,
    isCloudConnected,
    isLoading,
    addMenuItem,
    updateMenuItem,
    updatePrice,
    deleteMenuItem,
    moveMenuItem,
    resetMenuToDefault,
    refreshFromCloud,
  } = useMenu();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'popular' | 'new'>('all');

  // Quick Price Edit inline state
  const [quickPriceId, setQuickPriceId] = useState<string | null>(null);
  const [quickPriceValue, setQuickPriceValue] = useState<string>('');
  const [quickPriceDisplay, setQuickPriceDisplay] = useState<string>('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Form State
  const initialFormState: MenuItemInput = {
    name: '',
    category: 'ricebowl',
    price: 15000,
    priceDisplay: '',
    description: '',
    image: presetPhotos[0].url,
    isPopular: false,
    isNew: false,
  };
  const [formData, setFormData] = useState<MenuItemInput>(initialFormState);

  // Image Upload State
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'preset' | 'url'>('upload');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadedImageInfo, setUploadedImageInfo] = useState<{ name: string; size: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.price).includes(searchQuery);

      const matchCategory = categoryFilter === 'all' || item.category === categoryFilter;

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'popular' && item.isPopular) ||
        (statusFilter === 'new' && item.isNew);

      return matchSearch && matchCategory && matchStatus;
    });
  }, [menuItems, searchQuery, categoryFilter, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: menuItems.length,
      ricebowl: menuItems.filter((i) => i.category === 'ricebowl').length,
      taiwan: menuItems.filter((i) => i.category === 'taiwan').length,
      dimsum: menuItems.filter((i) => i.category === 'dimsum').length,
      popular: menuItems.filter((i) => i.isPopular).length,
    };
  }, [menuItems]);

  // Handle open add modal
  const handleOpenAdd = () => {
    setEditingItemId(null);
    setFormData(initialFormState);
    setUploadedImageInfo(null);
    setImageInputMode('upload');
    setIsModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEdit = (item: MenuItem) => {
    setEditingItemId(item.id);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      priceDisplay: item.priceDisplay || '',
      description: item.description,
      image: item.image,
      isPopular: Boolean(item.isPopular),
      isNew: Boolean(item.isNew),
    });
    setUploadedImageInfo(null);
    setImageInputMode(item.image.startsWith('data:') ? 'upload' : 'url');
    setIsModalOpen(true);
  };

  // File upload processing with automatic compression
  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa foto/gambar (JPG, PNG, WEBP).');
      return;
    }

    setIsUploadingImage(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 900, 900, 0.82);
      setFormData((prev) => ({ ...prev, image: compressedDataUrl }));
      setUploadedImageInfo({
        name: file.name,
        size: formatFileSize(file.size),
      });
      toast.success(`Foto "${file.name}" berhasil diunggah!`);
    } catch (err: any) {
      toast.error(err.message || 'Gagal memproses foto.');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Save Add or Edit
  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Nama menu wajib diisi.');
      return;
    }
    if (!formData.image.trim()) {
      toast.error('Foto menu wajib dipilih atau diunggah.');
      return;
    }

    if (editingItemId) {
      await updateMenuItem(editingItemId, {
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price) || 0,
        priceDisplay: formData.priceDisplay?.trim() || undefined,
        description: formData.description.trim(),
        image: formData.image,
        isPopular: formData.isPopular,
        isNew: formData.isNew,
      });
    } else {
      await addMenuItem(formData);
    }

    setIsModalOpen(false);
    setEditingItemId(null);
  };

  // Start Quick Price inline edit
  const handleStartQuickPrice = (item: MenuItem) => {
    setQuickPriceId(item.id);
    setQuickPriceValue(String(item.price));
    setQuickPriceDisplay(item.priceDisplay || '');
  };

  // Save Quick Price
  const handleSaveQuickPrice = async (id: string) => {
    const numPrice = Number(quickPriceValue);
    if (isNaN(numPrice) || numPrice < 0) {
      toast.error('Format harga harus berupa angka positif.');
      return;
    }
    await updatePrice(id, numPrice, quickPriceDisplay.trim() || undefined);
    setQuickPriceId(null);
  };

  return (
    <div className="space-y-8">
      {/* Overview & Quick Action Card */}
      <div className="bg-[#6f0f0f] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <UtensilsCrossed size={14} />
              <span>Manajemen Menu & Harga Agang.id</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
              Kelola Daftar Menu, Harga & Urutan Posisi
            </h2>
            <p className="text-white/75 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Ubah harga, buat menu baru, dan atur posisi urutan tampilan secara instan tanpa perlu masuk ke kodingan lagi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={refreshFromCloud}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#520909] text-white/90 hover:text-white border border-white/15 hover:bg-[#620c0c] text-xs font-bold transition-all"
              title="Sinkronkan dengan Database Cloud"
            >
              <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
              <span>{isLoading ? 'Menyinkron...' : 'Sinkron Cloud'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-red-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all active:scale-95"
            >
              <Plus size={18} />
              <span>Posting Menu Baru</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 border-t border-white/10">
          <div className="bg-[#520909] p-4 rounded-2xl border border-white/10">
            <span className="text-[11px] font-bold text-white/60 block uppercase">Total Menu</span>
            <span className="text-2xl font-black text-white mt-1 block">{stats.total} Menu</span>
          </div>
          <div className="bg-[#520909] p-4 rounded-2xl border border-white/10">
            <span className="text-[11px] font-bold text-white/60 block uppercase">🍚 Rice Bowl</span>
            <span className="text-2xl font-black text-white mt-1 block">{stats.ricebowl} Menu</span>
          </div>
          <div className="bg-[#520909] p-4 rounded-2xl border border-white/10">
            <span className="text-[11px] font-bold text-white/60 block uppercase">🍗 Taiwan Chicken</span>
            <span className="text-2xl font-black text-white mt-1 block">{stats.taiwan} Menu</span>
          </div>
          <div className="bg-[#520909] p-4 rounded-2xl border border-white/10">
            <span className="text-[11px] font-bold text-white/60 block uppercase">🥟 Dimsum</span>
            <span className="text-2xl font-black text-white mt-1 block">{stats.dimsum} Menu</span>
          </div>
          <div className="bg-[#520909] p-4 rounded-2xl border border-white/10 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold text-amber-300/80 block uppercase">⭐ Paling Populer</span>
            <span className="text-2xl font-black text-amber-300 mt-1 block">{stats.popular} Menu</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-[#6f0f0f] border border-white/15 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama menu, deskripsi, atau harga..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#520909] border border-white/20 text-white placeholder-white/40 text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-all font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-white/60 hover:text-white bg-white/10 px-2 py-0.5 rounded-md"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {/* Category Select */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 rounded-2xl bg-[#520909] border border-white/20 text-white text-xs font-bold focus:outline-none focus:border-amber-400"
            >
              <option value="all">Semua Kategori</option>
              <option value="ricebowl">Rice Bowl</option>
              <option value="taiwan">Taiwan Chicken</option>
              <option value="dimsum">Dimsum</option>
            </select>

            {/* Status Select */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2.5 rounded-2xl bg-[#520909] border border-white/20 text-white text-xs font-bold focus:outline-none focus:border-amber-400"
            >
              <option value="all">Semua Status</option>
              <option value="popular">Hanya Favorit (⭐)</option>
              <option value="new">Hanya Baru (✨)</option>
            </select>

            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-[#520909] text-white/70 hover:text-white border border-white/15 hover:bg-[#620c0c] text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
              title="Reset ke Menu Bawaan"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Reset Standar</span>
            </button>
          </div>
        </div>

        <div className="text-[11px] text-white/60 flex items-center justify-between pt-1">
          <span>Menampilkan {filteredItems.length} dari {menuItems.length} menu</span>
          <span className="text-amber-300">
            💡 Tips: Gunakan tombol ⬆️ dan ⬇️ untuk langsung mengatur urutan posisi menu di website.
          </span>
        </div>
      </div>

      {/* Menu Items Table / Cards */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-[#6f0f0f] border border-white/15 rounded-3xl p-12 text-center text-white">
            <UtensilsCrossed size={48} className="mx-auto text-white/40 mb-4" />
            <h3 className="font-display text-xl font-bold mb-2">Tidak Ada Menu yang Sesuai</h3>
            <p className="text-white/60 text-xs sm:text-sm max-w-md mx-auto mb-6">
              Coba gunakan kata kunci pencarian yang berbeda atau reset filter kategori.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setStatusFilter('all');
              }}
              className="px-6 py-2.5 rounded-2xl bg-white text-red-950 font-bold text-xs"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          filteredItems.map((item, index) => {
            const isEditingPrice = quickPriceId === item.id;
            const isFirst = index === 0;
            const isLast = index === filteredItems.length - 1;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-[#6f0f0f] border border-white/15 hover:border-white/30 rounded-3xl p-5 sm:p-6 shadow-xl transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left: Position Badge & Image & Details */}
                  <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-1 min-w-0">
                    {/* Position Reorder Column */}
                    <div className="flex flex-col items-center justify-center gap-1.5 shrink-0 bg-[#520909] p-2 rounded-2xl border border-white/10">
                      <button
                        type="button"
                        onClick={() => moveMenuItem(item.id, 'up')}
                        disabled={isFirst}
                        className={`p-1.5 rounded-xl transition-all ${
                          isFirst
                            ? 'text-white/20 cursor-not-allowed'
                            : 'text-white/80 hover:text-white hover:bg-white/15 active:scale-90'
                        }`}
                        title="Naikkan Posisi ke Atas"
                      >
                        <ArrowUp size={16} />
                      </button>

                      <span className="text-xs font-black text-amber-300 px-1 py-0.5">
                        #{index + 1}
                      </span>

                      <button
                        type="button"
                        onClick={() => moveMenuItem(item.id, 'down')}
                        disabled={isLast}
                        className={`p-1.5 rounded-xl transition-all ${
                          isLast
                            ? 'text-white/20 cursor-not-allowed'
                            : 'text-white/80 hover:text-white hover:bg-white/15 active:scale-90'
                        }`}
                        title="Turunkan Posisi ke Bawah"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>

                    {/* Menu Thumbnail */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-black/40 border border-white/20 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      {item.isPopular && (
                        <span className="absolute top-1 left-1 bg-amber-400 text-red-950 p-1 rounded-md shadow" title="Menu Terlaris">
                          <Star size={10} fill="currentColor" />
                        </span>
                      )}
                    </div>

                    {/* Title & Info */}
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/15 text-white/90">
                          {item.category === 'ricebowl'
                            ? '🍚 Rice Bowl'
                            : item.category === 'taiwan'
                            ? '🍗 Taiwan Chicken'
                            : '🥟 Dimsum'}
                        </span>
                        {item.isPopular && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-red-950 flex items-center gap-1">
                            <Star size={10} fill="currentColor" />
                            <span>Terlaris</span>
                          </span>
                        )}
                        {item.isNew && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white flex items-center gap-1">
                            <Sparkles size={10} />
                            <span>Baru</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-display text-lg sm:text-xl font-black text-white truncate">
                        {item.name}
                      </h4>

                      <p className="text-white/70 text-xs line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Quick Price Editor & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10 shrink-0">
                    {/* Price Section */}
                    <div className="bg-[#520909] p-3.5 rounded-2xl border border-white/10 min-w-[210px]">
                      {isEditingPrice ? (
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-amber-300 block uppercase">
                            Ubah Harga Langsung
                          </span>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={quickPriceValue}
                              onChange={(e) => setQuickPriceValue(e.target.value)}
                              className="w-28 px-2 py-1 rounded-xl bg-black/40 border border-white/30 text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                              placeholder="15000"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveQuickPrice(item.id)}
                              className="p-1.5 rounded-xl bg-amber-400 text-red-950 font-bold hover:bg-amber-300 active:scale-95"
                              title="Simpan Harga"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setQuickPriceId(null)}
                              className="p-1.5 rounded-xl bg-white/15 text-white hover:bg-white/25 active:scale-90"
                              title="Batal"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <div>
                            <input
                              type="text"
                              value={quickPriceDisplay}
                              onChange={(e) => setQuickPriceDisplay(e.target.value)}
                              className="w-full px-2 py-1 rounded-xl bg-black/40 border border-white/20 text-white text-[11px] placeholder-white/40 focus:outline-none"
                              placeholder="Kustom (mis: Rp10rb - Rp15rb)"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-bold text-white/50 block uppercase">
                              Harga Saat Ini
                            </span>
                            <span className="font-display text-lg sm:text-xl font-black text-amber-300 block">
                              {item.priceDisplay || formatPrice(item.price)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleStartQuickPrice(item)}
                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
                            title="Klik untuk mengubah harga cepat"
                          >
                            <DollarSign size={13} className="text-amber-400" />
                            <span>Edit Harga</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {/* Toggle Popular */}
                      <button
                        type="button"
                        onClick={() => updateMenuItem(item.id, { isPopular: !item.isPopular })}
                        className={`p-3 rounded-2xl border transition-all ${
                          item.isPopular
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 hover:bg-amber-400/30'
                            : 'bg-[#520909] text-white/50 border-white/10 hover:text-white'
                        }`}
                        title={item.isPopular ? 'Hapus dari Menu Terlaris' : 'Jadikan Menu Terlaris'}
                      >
                        <Star size={16} fill={item.isPopular ? 'currentColor' : 'none'} />
                      </button>

                      {/* Full Edit Modal */}
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="px-4 py-3 rounded-2xl bg-[#520909] hover:bg-[#620c0c] border border-white/15 text-white font-bold text-xs transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <Edit3 size={15} />
                        <span>Edit Detail</span>
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-3 rounded-2xl bg-red-950/60 hover:bg-red-700/80 border border-red-500/30 text-red-300 hover:text-white transition-all active:scale-95"
                        title="Hapus Menu"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* MODAL: Tambah / Edit Menu */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#6f0f0f] border border-white/20 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 text-white"
            >
              <div className="p-6 border-b border-white/15 flex items-center justify-between bg-[#520909]">
                <div>
                  <h3 className="font-display text-xl font-bold">
                    {editingItemId ? 'Edit Detail Menu' : 'Posting Menu Baru'}
                  </h3>
                  <p className="text-xs text-white/70 mt-0.5">
                    Isi informasi menu di bawah ini. Menu akan langsung tampil di website.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-2xl text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveMenu} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
                {/* Nama Menu */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                    Nama Menu <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Rice Bowl Sambel Matah Spesial"
                    className="w-full px-4 py-3 rounded-2xl bg-[#520909] border border-white/20 text-white text-sm focus:outline-none focus:border-amber-400 font-semibold"
                  />
                </div>

                {/* Kategori & Harga Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                      Kategori Menu
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#520909] border border-white/20 text-white text-sm focus:outline-none focus:border-amber-400 font-semibold"
                    >
                      <option value="ricebowl">🍚 Rice Bowl</option>
                      <option value="taiwan">🍗 Taiwan Chicken & Camilan</option>
                      <option value="dimsum">🥟 Dimsum</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                      Harga Standar (Angka Rp) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={500}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      placeholder="15000"
                      className="w-full px-4 py-3 rounded-2xl bg-[#520909] border border-white/20 text-white text-sm focus:outline-none focus:border-amber-400 font-semibold"
                    />
                  </div>
                </div>

                {/* Teks Harga Kustom */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1">
                    Teks Rentang / Satuan Harga (Opsional)
                  </label>
                  <p className="text-[11px] text-white/60 mb-2">
                    Gunakan jika ada rentang harga atau satuan khusus, contoh: <code className="text-amber-300">Rp12.000 - Rp15.000</code> atau <code className="text-amber-300">Rp5.000 / satuan</code>. Jika dikosongkan, format otomatis dari angka di atas.
                  </p>
                  <input
                    type="text"
                    value={formData.priceDisplay || ''}
                    onChange={(e) => setFormData({ ...formData, priceDisplay: e.target.value })}
                    placeholder="Contoh: Rp10.000 - Rp15.000"
                    className="w-full px-4 py-3 rounded-2xl bg-[#520909] border border-white/20 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Deskripsi Menu */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                    Deskripsi Rasa & Porsi Menu
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Jelaskan kelezatan, bumbu racikan, porsi, atau rekomendasi..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#520909] border border-white/20 text-white text-sm focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                {/* Foto Menu Section */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                    Foto Menu <span className="text-red-400">*</span>
                  </label>

                  {/* Mode Selector */}
                  <div className="flex gap-2 bg-[#520909] p-1.5 rounded-2xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setImageInputMode('upload')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        imageInputMode === 'upload'
                          ? 'bg-amber-400 text-red-950 shadow-md'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      Upload dari HP/Laptop
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('preset')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        imageInputMode === 'preset'
                          ? 'bg-amber-400 text-red-950 shadow-md'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      Pilih Foto Agang
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        imageInputMode === 'url'
                          ? 'bg-amber-400 text-red-950 shadow-md'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      URL Link Foto
                    </button>
                  </div>

                  {/* Upload Box */}
                  {imageInputMode === 'upload' && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/25 hover:border-amber-400 rounded-3xl p-6 text-center cursor-pointer bg-[#520909]/60 hover:bg-[#520909] transition-all group"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileProcess(file);
                        }}
                      />
                      {isUploadingImage ? (
                        <div className="py-4 space-y-2">
                          <Loader2 size={32} className="mx-auto animate-spin text-amber-400" />
                          <p className="text-xs text-white/80 font-bold">Mengompres & memproses foto...</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <UploadCloud size={36} className="mx-auto text-amber-400 group-hover:scale-110 transition-transform" />
                          <p className="text-xs sm:text-sm font-bold text-white">
                            Klik di sini untuk memilih foto menu dari perangkat
                          </p>
                          <p className="text-[11px] text-white/60">
                            Foto otomatis dikompres ringan agar loading cepat di HP pelanggan
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Preset Selector */}
                  {imageInputMode === 'preset' && (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 max-h-48 overflow-y-auto p-2 bg-[#520909] rounded-2xl border border-white/15">
                      {presetPhotos.map((preset) => {
                        const isSelected = formData.image === preset.url;
                        return (
                          <div
                            key={preset.label}
                            onClick={() => setFormData({ ...formData, image: preset.url })}
                            className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all text-center p-1 ${
                              isSelected
                                ? 'border-amber-400 bg-white/10 scale-95 shadow-md'
                                : 'border-white/10 hover:border-white/40'
                            }`}
                          >
                            <img src={preset.url} alt={preset.label} className="w-full h-16 object-cover rounded-lg mb-1" />
                            <span className="text-[10px] font-bold text-white/80 line-clamp-1">
                              {preset.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* URL Input */}
                  {imageInputMode === 'url' && (
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://example.com/foto-menu.jpg"
                      className="w-full px-4 py-3 rounded-2xl bg-[#520909] border border-white/20 text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  )}

                  {/* Image Preview */}
                  {formData.image && (
                    <div className="flex items-center gap-4 bg-[#520909] p-3 rounded-2xl border border-white/10">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-14 h-14 rounded-xl object-cover border border-white/20"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <Check size={14} /> Foto siap digunakan
                        </span>
                        {uploadedImageInfo && (
                          <span className="text-[11px] text-white/60 block truncate">
                            {uploadedImageInfo.name} ({uploadedImageInfo.size})
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Flags Checkbox */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#520909] border border-white/15 cursor-pointer hover:bg-[#5f0c0c] transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.isPopular}
                      onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-400 focus:ring-0"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Tandai Paling Terlaris (⭐)</span>
                      <span className="text-[11px] text-white/60">Tampil di beranda Menu Terlaris</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#520909] border border-white/15 cursor-pointer hover:bg-[#5f0c0c] transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-400 focus:ring-0"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Tandai Menu Baru (✨)</span>
                      <span className="text-[11px] text-white/60">Ada label 'Baru' di kartu menu</span>
                    </div>
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-red-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl active:scale-95"
                  >
                    {editingItemId ? 'Simpan Perubahan' : 'Terbitkan Menu'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Konfirmasi Hapus */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#6f0f0f] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white text-center shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">Hapus Menu Ini?</h3>
              <p className="text-xs text-white/70 mb-6">
                Menu ini akan langsung dihapus dari daftar website. Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await deleteMenuItem(deleteConfirmId);
                    setDeleteConfirmId(null);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Konfirmasi Reset Standar */}
      <AnimatePresence>
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#6f0f0f] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white text-center shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto mb-4">
                <RotateCcw size={32} />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">Kembalikan ke Menu Bawaan?</h3>
              <p className="text-xs text-white/70 mb-6">
                Semua menu akan direset kembali ke 10 menu asli Agang.id (Rice Bowl Matah, Taiwan Chicken, Kulit Crispy, Dimsum Goreng, dsb).
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetMenuToDefault();
                    setIsResetConfirmOpen(false);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-red-950 font-black text-xs uppercase tracking-wider shadow-lg"
                >
                  Ya, Reset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
