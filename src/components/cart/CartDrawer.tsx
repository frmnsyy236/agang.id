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
  Clock,
  Store,
  MapPin,
  Check,
  Bike,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const DELIVERY_ZONES = [
  {
    id: 'radius_3km',
    name: 'Radius ≤ 3 km (Rp7.000)',
    fee: 7000,
    desc: 'Sekitar Outlet (Maccini, Kerung-Kerung, Pongtiku, Karuwisi)',
  },
  {
    id: 'radius_5km',
    name: 'Radius 3 – 5 km (Rp10.000)',
    fee: 10000,
    desc: 'Panakkukang, Pettarani, Losari, Mamajang',
  },
  {
    id: 'radius_8km',
    name: 'Radius 5 – 8 km (Rp15.000)',
    fee: 15000,
    desc: 'Rappocini timur, Tamalate, Mariso, Antang',
  },
  {
    id: 'radius_far',
    name: 'Radius > 8 km (Rp20.000)',
    fee: 20000,
    desc: 'Tamalanrea, Unhas, Daya, Sudiang, Barombong',
  },
];

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
    deliveryZone: 'Radius ≤ 3 km (Rp7.000)',
    shippingFee: 7000,
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

  const handleDeliveryTypeChange = (type: 'delivery' | 'pickup') => {
    setCustomerData((prev) => ({
      ...prev,
      deliveryType: type,
      shippingFee: type === 'delivery' ? (prev.shippingFee || 7000) : 0,
      deliveryZone:
        type === 'delivery'
          ? prev.deliveryZone || 'Radius ≤ 3 km (Rp7.000)'
          : 'Ambil Sendiri di Outlet',
    }));
  };

  const handleZoneChange = (zoneId: string) => {
    const zone = DELIVERY_ZONES.find((z) => z.id === zoneId);
    if (zone) {
      setCustomerData((prev) => ({
        ...prev,
        deliveryZone: zone.name,
        shippingFee: zone.fee,
      }));
    }
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
      const ok = await submitOrder(customerData);
      if (ok) {
        setStep(1);
      }
    } catch (err: any) {
      toast.error('Gagal mengirim pesanan: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentShippingFee =
    customerData.deliveryType === 'delivery'
      ? (customerData.shippingFee !== undefined ? customerData.shippingFee : 7000)
      : 0;
  const grandTotal = totalPrice + currentShippingFee;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[99999] overflow-hidden">
          {/* Backdrop with smooth blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-white text-slate-800 shadow-2xl flex flex-col justify-between relative z-10 border-l border-slate-200"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900">
                      {step === 1 ? 'Keranjang Menu' : 'Informasi Pesanan'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {step === 1
                        ? `${totalItems} menu dipilih`
                        : 'Langkah 2 dari 2: Konfirmasi Data'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="Tutup Keranjang"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <ShoppingBag size={36} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display text-base font-bold text-slate-900">
                        Keranjang Kamu Masih Kosong
                      </h4>
                      <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                        Pilih Rice Bowl, Taiwan Crispy Chicken, atau Dimsum lezat untuk dinikmati!
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate('/products');
                      }}
                      className="rounded-full bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-6 shadow-md active:scale-95 transition-transform"
                    >
                      Lihat Daftar Menu
                    </Button>
                  </div>
                ) : step === 1 ? (
                  /* ========================================================
                     STEP 1: LIST MENU DI KERANJANG
                     ======================================================== */
                  <div className="space-y-4">
                    <div className="space-y-2.5">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white border border-slate-200/90 rounded-2xl p-3 flex items-center gap-3 shadow-sm hover:border-slate-300 transition-colors"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100 bg-slate-100"
                          />

                          <div className="flex-1 min-w-0 space-y-1">
                            <h5 className="font-display text-sm font-bold text-slate-900 truncate">
                              {item.name}
                            </h5>
                            <span className="text-xs font-bold text-red-700 block">
                              {formatPrice(item.price)}
                            </span>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 pt-0.5">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center active:scale-90 transition-all"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-xs font-black text-slate-900 w-5 text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center active:scale-90 transition-all"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>

                          <div className="text-right shrink-0 flex flex-col items-end justify-between h-16 py-0.5">
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-slate-400 hover:text-red-600 transition-colors p-1"
                              title="Hapus menu"
                            >
                              <Trash2 size={15} />
                            </button>
                            <span className="text-xs font-black text-slate-900">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Clear Cart Button */}
                    <div className="flex justify-between items-center pt-1 text-xs text-slate-500">
                      <span>Total {totalItems} item pesanan</span>
                      <button
                        type="button"
                        onClick={clearCart}
                        className="text-xs text-red-600 hover:text-red-700 hover:underline font-semibold"
                      >
                        Kosongkan Keranjang
                      </button>
                    </div>

                    {/* Operational Notice */}
                    <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
                      <Clock size={16} className="text-amber-700 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold block text-amber-900">Jam Buka Outlet:</span>
                        <span className="text-amber-800 leading-relaxed">
                          Minggu - Jumat 17:30 - 23:30 WITA, Sabtu 17:30 - 00:00 WITA.
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ========================================================
                     STEP 2: FORM DATA PEMESAN (RAPIIH, BERSIH, NYAMAN DI MATA)
                     ======================================================== */
                  <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                    {/* Back Button */}
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 hover:text-red-800 transition-colors"
                    >
                      <ArrowLeft size={14} />
                      <span>Kembali ke Daftar Menu</span>
                    </button>

                    {/* SECTION 1: DATA PEMESAN */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-sm space-y-3">
                      <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-900 tracking-wide">
                          1. Data Pemesan
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Nama Pemesan <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={customerData.name}
                            onChange={(e) =>
                              setCustomerData({ ...customerData, name: e.target.value })
                            }
                            placeholder="Contoh: Budi Santoso"
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-red-600 focus:bg-white transition-all font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            No. WhatsApp <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            value={customerData.phone}
                            onChange={(e) =>
                              setCustomerData({ ...customerData, phone: e.target.value })
                            }
                            placeholder="081234567890"
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-red-600 focus:bg-white transition-all font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: PENGIRIMAN & LOKASI */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-sm space-y-3">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-900 tracking-wide">
                          2. Metode Layanan & Lokasi
                        </span>
                        {customerData.deliveryType === 'delivery' && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Ongkir: {formatPrice(currentShippingFee)}
                          </span>
                        )}
                      </div>

                      {/* Delivery Segment Toggle */}
                      <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
                        <button
                          type="button"
                          onClick={() => handleDeliveryTypeChange('delivery')}
                          className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                            customerData.deliveryType === 'delivery'
                              ? 'bg-red-700 text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Bike size={14} />
                          <span>Diantar ke Alamat</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeliveryTypeChange('pickup')}
                          className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                            customerData.deliveryType === 'pickup'
                              ? 'bg-red-700 text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Store size={14} />
                          <span>Ambil Sendiri (Rp0)</span>
                        </button>
                      </div>

                      {/* Detail Delivery */}
                      {customerData.deliveryType === 'delivery' ? (
                        <div className="space-y-2.5 pt-1">
                          {/* Radius Zone Dropdown */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[11px] font-bold text-slate-600">
                                Jarak Radius Pengantaran
                              </label>
                              <span className="text-[10px] text-slate-400">
                                Dihitung dari cabang outlet
                              </span>
                            </div>

                            <select
                              value={
                                DELIVERY_ZONES.find(
                                  (z) => z.name === customerData.deliveryZone
                                )?.id || 'radius_3km'
                              }
                              onChange={(e) => handleZoneChange(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-red-600 focus:bg-white transition-all cursor-pointer"
                            >
                              {DELIVERY_ZONES.map((zone) => (
                                <option key={zone.id} value={zone.id}>
                                  {zone.name} — {zone.desc}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Alamat Pengiriman */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Alamat Lengkap & Patokan <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              required
                              rows={2}
                              value={customerData.address}
                              onChange={(e) =>
                                setCustomerData({ ...customerData, address: e.target.value })
                              }
                              placeholder="Nama jalan, nomor rumah, RT/RW, dan patokan lokasi (misal: samping masjid / pagar hijau)..."
                              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-red-600 focus:bg-white resize-none transition-all font-medium"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                          <p className="text-xs text-slate-600 font-medium">
                            Pesanan Anda akan disiapkan di outlet. Anda dapat langsung mengambilnya tanpa dikenakan biaya ongkos kirim.
                          </p>
                        </div>
                      )}

                      {/* Outlet Selector */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Cabang Outlet Pemrosesan
                        </label>
                        <select
                          value={customerData.outlet}
                          onChange={(e) =>
                            setCustomerData({
                              ...customerData,
                              outlet: e.target.value as any,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-red-600 focus:bg-white transition-all cursor-pointer"
                        >
                          <option value="pongtiku">Jl. Pongtiku (Depan Bimbel JILC), Makassar</option>
                          <option value="inpres_maccini">Area SD Inpres Maccini, Makassar</option>
                        </select>
                      </div>
                    </div>

                    {/* SECTION 3: PEMBAYARAN & CATATAN */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-sm space-y-3">
                      <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-900 tracking-wide">
                          3. Pembayaran & Catatan
                        </span>
                      </div>

                      {/* Metode Pembayaran Segment Buttons */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                          Metode Pembayaran
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { id: 'qris', label: 'QRIS', sub: 'E-Wallet/Bank' },
                            { id: 'transfer', label: 'Transfer', sub: 'BCA/Mandiri' },
                            { id: 'cash', label: 'Tunai', sub: 'Bayar COD' },
                          ].map((pay) => {
                            const isSelected = customerData.paymentMethod === pay.id;
                            return (
                              <button
                                key={pay.id}
                                type="button"
                                onClick={() =>
                                  setCustomerData({
                                    ...customerData,
                                    paymentMethod: pay.id as any,
                                  })
                                }
                                className={`py-2 px-1.5 rounded-xl border text-center transition-all ${
                                  isSelected
                                    ? 'bg-red-50 border-red-600 text-red-950 font-bold shadow-xs'
                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                              >
                                <span className="block text-xs font-bold leading-tight">
                                  {pay.label}
                                </span>
                                <span className="block text-[9px] text-slate-500 mt-0.5">
                                  {pay.sub}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Catatan Tambahan (Opsional) */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Catatan Tambahan untuk Kasir (Opsional)
                        </label>
                        <input
                          type="text"
                          value={customerData.notes || ''}
                          onChange={(e) =>
                            setCustomerData({ ...customerData, notes: e.target.value })
                          }
                          placeholder="Contoh: Saus dipisah, jangan terlalu pedas..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-red-600 focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>
                  </form>
                )}
              </div>

              {/* Sticky Footer */}
              {items.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-3 sticky bottom-0 z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                  {step === 1 ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">
                          Subtotal Menu ({totalItems})
                        </span>
                        <span className="font-display text-xl font-black text-slate-900">
                          {formatPrice(totalPrice)}
                        </span>
                      </div>

                      <Button
                        size="lg"
                        onClick={handleNextStep}
                        className="rounded-2xl bg-red-700 hover:bg-red-800 text-white font-extrabold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 px-5 py-3 active:scale-95 transition-all"
                      >
                        <span>Lanjut ke Data Pemesan</span>
                        <ArrowRight size={16} />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Price breakdown */}
                      <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-xs">
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Subtotal Menu:</span>
                          <span className="font-semibold text-slate-900">
                            {formatPrice(totalPrice)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span>
                            Ongkos Kirim (
                            {customerData.deliveryType === 'delivery'
                              ? customerData.deliveryZone?.split('(')[0].trim() || 'Radius ≤ 3 km'
                              : 'Ambil di Outlet'}
                            ):
                          </span>
                          <span
                            className={`font-semibold ${
                              customerData.deliveryType === 'delivery'
                                ? 'text-red-700'
                                : 'text-emerald-600'
                            }`}
                          >
                            {customerData.deliveryType === 'delivery'
                              ? formatPrice(currentShippingFee)
                              : 'Gratis'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-200">
                          <span className="text-xs font-black text-slate-900 uppercase">
                            Total Pembayaran:
                          </span>
                          <span className="font-display text-lg font-black text-red-700">
                            {formatPrice(grandTotal)}
                          </span>
                        </div>
                      </div>

                      {/* WhatsApp Button */}
                      <div>
                        <Button
                          form="checkout-form"
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 py-3.5 active:scale-95 cursor-pointer transition-all disabled:opacity-50"
                        >
                          <MessageCircle size={18} />
                          <span>
                            {isSubmitting
                              ? 'Menyiapkan Pesanan...'
                              : 'Kirim Pesanan ke WhatsApp'}
                          </span>
                        </Button>
                        <p className="text-[10px] text-center text-slate-500 mt-1.5 leading-tight">
                          Pesanan akan otomatis terhubung ke WhatsApp kasir Agang.id
                        </p>
                      </div>
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
