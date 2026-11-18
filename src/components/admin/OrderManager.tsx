import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { OrderRecord } from '@/types/cart';
import { formatPrice } from '@/data/menuData';
import {
  ShoppingBag,
  Clock,
  MapPin,
  MessageCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  Search,
  ExternalLink,
  ChevronDown,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';

export const OrderManager: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchSearch =
        ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.customer.phone.includes(searchQuery) ||
        (ord.customer.address && ord.customer.address.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === 'all' || ord.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === 'pending').length;
    const completed = orders.filter((o) => o.status === 'completed').length;
    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return { total, pending, completed, totalRevenue };
  }, [orders]);

  const handleChatCustomer = (phone: string, orderId: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const finalPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const msg = encodeURIComponent(
      `Halo Kak ${name}! Kami dari Kasir Agang.id terkait pesanan Anda #${orderId}.`
    );
    window.open(`https://wa.me/${finalPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <div className="bg-[#6f0f0f] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <ShoppingBag size={14} />
              <span>Manajemen Pesanan Masuk</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
              Riwayat Pesanan Pelanggan Agang.id
            </h2>
            <p className="text-white/75 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Pantau seluruh pesanan checkout WhatsApp pelanggan, hubungi pemesan langsung, dan perbarui status pesanan.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10">
          <div className="bg-[#520909] p-4 rounded-2xl border border-white/10">
            <span className="text-[11px] font-bold text-white/60 block uppercase">Total Pesanan</span>
            <span className="text-2xl font-black text-white mt-1 block">{stats.total} Order</span>
          </div>

          <div className="bg-[#520909] p-4 rounded-2xl border border-white/10">
            <span className="text-[11px] font-bold text-amber-400 block uppercase">⏳ Perlu Diproses</span>
            <span className="text-2xl font-black text-amber-400 mt-1 block">{stats.pending} Order</span>
          </div>

          <div className="bg-[#520909] p-4 rounded-2xl border border-white/10">
            <span className="text-[11px] font-bold text-emerald-400 block uppercase">✅ Selesai</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">{stats.completed} Order</span>
          </div>

          <div className="bg-[#520909] p-4 rounded-2xl border border-white/10">
            <span className="text-[11px] font-bold text-amber-300 block uppercase">💰 Estimasi Omzet</span>
            <span className="text-xl sm:text-2xl font-black text-amber-300 mt-1 block truncate">
              {formatPrice(stats.totalRevenue)}
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar Filter */}
      <div className="bg-[#6f0f0f] border border-white/15 rounded-3xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari no pesanan, nama pemesan, no WA, alamat..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#520909] border border-white/20 text-white placeholder-white/40 text-xs sm:text-sm focus:outline-none focus:border-amber-400 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2.5 rounded-2xl bg-[#520909] border border-white/20 text-white text-xs font-bold focus:outline-none focus:border-amber-400 w-full sm:w-auto"
            >
              <option value="all">Semua Status</option>
              <option value="pending">⏳ Pending (Menunggu)</option>
              <option value="confirmed">👨‍🍳 Dikonfirmasi / Diproses</option>
              <option value="completed">✅ Selesai</option>
              <option value="cancelled">❌ Dibatalkan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-[#6f0f0f] border border-white/15 rounded-3xl p-12 text-center text-white">
            <ShoppingBag size={48} className="mx-auto text-white/40 mb-3" />
            <h3 className="font-display text-xl font-bold mb-1">Belum Ada Pesanan Masuk</h3>
            <p className="text-white/60 text-xs sm:text-sm max-w-md mx-auto">
              Ketika ada pelanggan yang melakukan checkout di keranjang, rincian pesanannya otomatis muncul di sini.
            </p>
          </div>
        ) : (
          filteredOrders.map((ord) => {
            const dateStr = new Date(ord.createdAt).toLocaleString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <motion.div
                key={ord.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#6f0f0f] border border-white/15 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-amber-300 text-sm sm:text-base px-3 py-1 rounded-xl bg-[#520909] border border-white/15">
                      #{ord.id}
                    </span>
                    <span className="text-xs text-white/60">{dateStr} WITA</span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/60 font-bold hidden sm:inline">Status:</span>
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border focus:outline-none ${
                        ord.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : ord.status === 'confirmed'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          : ord.status === 'cancelled'
                          ? 'bg-red-500/20 text-red-300 border-red-500/40'
                          : 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                      }`}
                    >
                      <option value="pending" className="bg-[#520909] text-white">⏳ Menunggu</option>
                      <option value="confirmed" className="bg-[#520909] text-white">👨‍🍳 Diproses</option>
                      <option value="completed" className="bg-[#520909] text-white">✅ Selesai</option>
                      <option value="cancelled" className="bg-[#520909] text-white">❌ Batal</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(ord.id)}
                      className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-white/10 transition-colors"
                      title="Hapus riwayat pesanan"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Column 1: Customer Data */}
                  <div className="space-y-2 bg-[#520909] p-4 rounded-2xl border border-white/10">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                      Data Pemesan
                    </span>
                    <div className="space-y-1 text-xs">
                      <p className="font-bold text-white text-sm">{ord.customer.name}</p>
                      <p className="text-white/80">📱 {ord.customer.phone}</p>
                      <p className="text-white/80">
                        🛵 {ord.customer.deliveryType === 'delivery' ? 'Antar ke Rumah' : 'Ambil di Outlet'}
                      </p>
                      {ord.customer.deliveryType === 'delivery' && (
                        <p className="text-white/70 pt-1 leading-relaxed">
                          📍 <span className="font-medium text-white">{ord.customer.address}</span>
                          {ord.customer.landmark && ` (Patokan: ${ord.customer.landmark})`}
                        </p>
                      )}
                      <p className="text-white/70">
                        🏬 Outlet: {ord.customer.outlet === 'inpres_maccini' ? 'Inpres Maccini' : 'Pongtiku'}
                      </p>
                      <p className="text-amber-300 font-bold uppercase text-[11px] pt-1">
                        💳 Bayar via: {ord.customer.paymentMethod}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleChatCustomer(ord.customer.phone, ord.id, ord.customer.name)}
                      className="mt-3 w-full py-2 px-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow"
                    >
                      <MessageCircle size={14} />
                      <span>Chat WhatsApp Pemesan</span>
                    </button>
                  </div>

                  {/* Column 2: Order Items */}
                  <div className="lg:col-span-2 space-y-3 bg-[#520909] p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block mb-2">
                        Menu yang Dipesan
                      </span>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {ord.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-bold text-amber-300 px-1.5 py-0.5 rounded-md bg-white/10 text-[11px]">
                                {item.quantity}x
                              </span>
                              <span className="text-white font-medium truncate">{item.name}</span>
                              {item.notes && (
                                <span className="text-[10px] text-white/50 italic truncate">
                                  ({item.notes})
                                </span>
                              )}
                            </div>
                            <span className="font-bold text-white shrink-0 ml-2">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {ord.customer.notes && (
                        <div className="mt-3 p-2.5 rounded-xl bg-black/30 border border-white/10 text-xs text-amber-200">
                          <span className="font-bold block text-[10px] uppercase text-white/60">
                            Catatan Khusus:
                          </span>
                          "{ord.customer.notes}"
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-auto">
                      <span className="text-xs font-bold text-white/70 uppercase">
                        Total Pesanan ({ord.items.reduce((s, i) => s + i.quantity, 0)} item):
                      </span>
                      <span className="font-display text-lg sm:text-xl font-black text-amber-300">
                        {formatPrice(ord.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Confirmation Modal: Delete Order */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#6f0f0f] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white text-center shadow-2xl"
            >
              <h3 className="font-display text-xl font-bold mb-2">Hapus Riwayat Pesanan?</h3>
              <p className="text-xs text-white/70 mb-6">
                Data pesanan ini akan dihapus dari daftar.
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
                    await deleteOrder(deleteConfirmId);
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
    </div>
  );
};
