import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/menuData';
import { OrderCustomerData } from '@/types/cart';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  MapPin,
  Clock,
  Building2,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Store,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    submitOrder,
  } = useCart();

  // Wizard Step: 1 = Review Items, 2 = Customer Form
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [customerData, setCustomerData] = useState<OrderCustomerData>({
    name: '',
    phone: '',
    deliveryType: 'delivery',
    address: '',
    landmark: '',
    outlet: 'pongtiku',
    paymentMethod: 'qris',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNextStep = () => {
    if (items.length === 0) {
      toast.error('Keranjang masih kosong!');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerData.name.trim()) {
      toast.error('Mohon masukkan nama pemesan.');
      return;
    }

    if (!customerData.phone.trim()) {
      toast.error('Mohon masukkan nomor WhatsApp yang aktif.');
      return;
    }

    if (customerData.deliveryType === 'delivery' && !customerData.address.trim()) {
      toast.error('Mohon isi alamat pengiriman lengkap.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitOrder(customerData);
      setStep(1);
    } catch (err: any) {
      toast.error('Gagal mengirim pesanan: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[99999] overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-[#520909] text-white border-l border-white/15 shadow-2xl flex flex-col justify-between relative z-10"
            >
              {/* Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#400707]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400 text-red-950 flex items-center justify-center font-black shadow-md">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold">
                      {step === 1 ? 'Keranjang Belanja' : 'Data Pemesan'}
                    </h3>
                    <p className="text-[11px] text-white/70">
                      {step === 1
                        ? `${totalItems} item dipilih`
                        : 'Lengkapi rincian untuk WhatsApp Kasir'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-2xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-white/40">
                      <ShoppingBag size={40} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display text-lg font-bold text-white">
                        Keranjang Kamu Masih Kosong
                      </h4>
                      <p className="text-xs text-white/60 max-w-xs leading-relaxed">
                        Yuk pilih Rice Bowl, Taiwan Chicken, atau Dimsum lezat untuk makan malammu!
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate('/products');
                      }}
                      className="rounded-full bg-amber-400 hover:bg-amber-300 text-red-950 font-extrabold text-xs px-6 shadow-lg active:scale-95"
                    >
                      Lihat & Pesan Menu Sekarang
                    </Button>
                  </div>
                ) : step === 1 ? (
                  /* STEP 1: ITEM REVIEW */
                  <div className="space-y-4">
                    {/* Items List */}
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-[#650c0c] border border-white/10 rounded-2xl p-3.5 flex items-center gap-3 shadow-md"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/15"
                          />

                          <div className="flex-1 min-w-0 space-y-1">
                            <h5 className="font-display text-sm font-bold text-white truncate">
                              {item.name}
                            </h5>
                            <span className="text-xs font-bold text-amber-300 block">
                              {formatPrice(item.price)}
                            </span>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-6 h-6 rounded-lg bg-white/15 hover:bg-white/25 text-white flex items-center justify-center active:scale-90 transition-transform"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-xs font-black text-white w-5 text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-6 h-6 rounded-lg bg-white/15 hover:bg-white/25 text-white flex items-center justify-center active:scale-90 transition-transform"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>

                          <div className="text-right shrink-0 flex flex-col items-end justify-between h-16 py-0.5">
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-white/50 hover:text-red-300 transition-colors p-1"
                              title="Hapus"
                            >
                              <Trash2 size={15} />
                            </button>
                            <span className="text-xs font-black text-white">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Clear Cart Button */}
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={clearCart}
                        className="text-[11px] text-white/60 hover:text-white underline decoration-white/30"
                      >
                        Kosongkan Keranjang
                      </button>
                    </div>

                    {/* Operational Notice */}
                    <div className="bg-[#400707] border border-white/10 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-white/80">
                      <Clock size={16} className="text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold block text-white">Jam Buka Outlet:</span>
                        <span>Minggu - Jumat 17:30 - 23:30 WITA, Sabtu 17:30 - 00:00 WITA.</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* STEP 2: CHECKOUT FORM */
                  <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:underline mb-1"
                    >
                      <ArrowLeft size={14} />
                      <span>Kembali ke Daftar Menu</span>
                    </button>

                    {/* Delivery Method Toggle */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                        Pilihan Layanan
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setCustomerData({ ...customerData, deliveryType: 'delivery' })}
                          className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                            customerData.deliveryType === 'delivery'
                              ? 'bg-amber-400 text-red-950 border-amber-300 shadow-md font-black'
                              : 'bg-[#650c0c] text-white/80 border-white/15 hover:bg-[#771010]'
                          }`}
                        >
                          <span className="text-lg">🛵</span>
                          <span>Diantar ke Alamat</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCustomerData({ ...customerData, deliveryType: 'pickup' })}
                          className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                            customerData.deliveryType === 'pickup'
                              ? 'bg-amber-400 text-red-950 border-amber-300 shadow-md font-black'
                              : 'bg-[#650c0c] text-white/80 border-white/15 hover:bg-[#771010]'
                          }`}
                        >
                          <span className="text-lg">🏬</span>
                          <span>Ambil di Outlet</span>
                        </button>
                      </div>
                    </div>

                    {/* Nama Pemesan */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                        Nama Pemesan <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customerData.name}
                        onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#650c0c] border border-white/20 text-white placeholder-white/40 text-xs sm:text-sm focus:outline-none focus:border-amber-400 font-medium"
                      />
                    </div>

                    {/* Nomor WhatsApp */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                        Nomor WhatsApp Aktif <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerData.phone}
                        onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                        placeholder="Contoh: 081234567890"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#650c0c] border border-white/20 text-white placeholder-white/40 text-xs sm:text-sm focus:outline-none focus:border-amber-400 font-medium"
                      />
                    </div>

                    {/* Alamat (Jika Delivery) */}
                    {customerData.deliveryType === 'delivery' && (
                      <div className="space-y-3 pt-1">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                            Alamat Pengiriman Lengkap <span className="text-red-400">*</span>
                          </label>
                          <textarea
                            required
                            rows={2}
                            value={customerData.address}
                            onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                            placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#650c0c] border border-white/20 text-white placeholder-white/40 text-xs sm:text-sm focus:outline-none focus:border-amber-400 resize-none font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                            Patokan Lokasi (Opsional)
                          </label>
                          <input
                            type="text"
                            value={customerData.landmark || ''}
                            onChange={(e) => setCustomerData({ ...customerData, landmark: e.target.value })}
                            placeholder="Dekat minimarket, samping masjid, pagar hitam..."
                            className="w-full px-3.5 py-2 rounded-xl bg-[#650c0c] border border-white/20 text-white placeholder-white/40 text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>
                    )}

                    {/* Pilihan Outlet */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                        Pilihan Cabang Outlet Terdekat
                      </label>
                      <select
                        value={customerData.outlet}
                        onChange={(e) => setCustomerData({ ...customerData, outlet: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#650c0c] border border-white/20 text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                      >
                        <option value="pongtiku">Jl. Pongtiku (Depan Bimbel JILC)</option>
                        <option value="inpres_maccini">Area SD Inpres Maccini, Makassar</option>
                      </select>
                    </div>

                    {/* Metode Pembayaran */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                        Metode Pembayaran
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'qris', label: 'QRIS', sub: 'E-Wallet/Bank' },
                          { id: 'transfer', label: 'Transfer', sub: 'BCA / Mandiri' },
                          { id: 'cash', label: 'Tunai', sub: 'Bayar di Tempat' },
                        ].map((pay) => (
                          <button
                            key={pay.id}
                            type="button"
                            onClick={() => setCustomerData({ ...customerData, paymentMethod: pay.id as any })}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              customerData.paymentMethod === pay.id
                                ? 'bg-amber-400 text-red-950 border-amber-300 font-black shadow-md'
                                : 'bg-[#650c0c] text-white/80 border-white/15 hover:bg-[#771010]'
                            }`}
                          >
                            <span className="block text-xs font-bold">{pay.label}</span>
                            <span className="block text-[9px] opacity-75">{pay.sub}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Catatan Khusus */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                        Catatan Tambahan untuk Kasir (Opsional)
                      </label>
                      <input
                        type="text"
                        value={customerData.notes || ''}
                        onChange={(e) => setCustomerData({ ...customerData, notes: e.target.value })}
                        placeholder="Contoh: Sambel matah dipisah, jangan terlalu pedas..."
                        className="w-full px-3.5 py-2 rounded-xl bg-[#650c0c] border border-white/20 text-white placeholder-white/40 text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </form>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-5 border-t border-white/10 bg-[#400707] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70 uppercase tracking-wider font-bold">
                      Total Pesanan ({totalItems} Menu):
                    </span>
                    <span className="font-display text-xl sm:text-2xl font-black text-amber-300">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  {step === 1 ? (
                    <Button
                      size="xl"
                      onClick={handleNextStep}
                      className="w-full rounded-2xl bg-amber-400 hover:bg-amber-300 text-red-950 font-black text-sm uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 py-4 active:scale-95"
                    >
                      <span>Lanjut Isi Data Pengiriman</span>
                      <ArrowRight size={18} />
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        form="checkout-form"
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-2xl bg-green-500 hover:bg-green-600 text-white font-black text-sm uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 py-4 active:scale-95"
                      >
                        <MessageCircle size={20} />
                        <span>{isSubmitting ? 'Mengarahkan...' : 'Kirim Pesanan ke WhatsApp'}</span>
                      </Button>
                      <p className="text-[11px] text-center text-amber-200/90 font-medium leading-relaxed">
                        ⚠️ Aplikasi WhatsApp akan otomatis terbuka. Pastikan tekan tombol <strong>KIRIM (Send)</strong> di WhatsApp agar pesanan masuk ke kasir Agang.id.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
