import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight, CheckCircle2, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CTASection = () => {
  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent('Halo Agang.id! Saya ingin memesan makanan untuk diantar / ambil sendiri. Boleh minta daftar menu hari ini?');
    window.open(`https://wa.me/6287726993572?text=${message}`, '_blank');
  };

  return (
    <section className="py-16 md:py-24 bg-[#f8f9fa]">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Lazuna-style Dark Navy High-Contrast Banner (#0b1325) */}
        <div className="relative rounded-3xl bg-[#0b1325] text-white p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#c1002d]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#eb7300]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
            {/* Left Content (8 cols) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-8 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-amber-300 border border-white/15 text-xs font-black uppercase tracking-wider">
                <PhoneCall size={14} className="text-amber-300" />
                <span>Layanan Cepat Tanggap 17:30 - 23:30 WITA</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                PESAN CEPAT LEWAT WHATSAPP <span className="text-[#c1002d]">AGANG.ID</span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                Nikmati kemudahan pesan antar (delivery) langsung ke rumah, kantor, atau kost di Makassar. Kami juga melayani pesanan partai besar (box catering & konsumsi acara).
              </p>

              {/* 4 Key Benefits Bullets (Model Lazuna) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  '100% Daging Ayam Segar & Halal',
                  'Harga Murah Meriah Mulai Rp5.000',
                  'Dimasak Fresh Hangat Saat Dipesan',
                  'Bisa Pesanan Partai Besar / Acara Kantor',
                ].map((perk, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-200">
                    <CheckCircle2 size={16} className="text-[#eb7300] shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Button
                  size="xl"
                  onClick={handleWhatsAppOrder}
                  className="rounded-full px-8 py-4 bg-[#c1002d] hover:bg-[#9c0f12] text-white font-black text-sm uppercase tracking-wider shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <MessageCircle size={20} />
                  <span>Chat WhatsApp Sekarang</span>
                  <ArrowRight size={18} />
                </Button>

                <span className="text-xs text-slate-400 font-medium">
                  Nomor Kasir: <strong>+62 877-2699-3572</strong>
                </span>
              </div>
            </motion.div>

            {/* Right Visual Badge (4 cols) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-4 text-center lg:text-right"
            >
              <div className="inline-block p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl text-center space-y-4 max-w-sm mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#c1002d] to-[#eb7300] text-white flex items-center justify-center mx-auto text-3xl shadow-lg">
                  🍗
                </div>
                <div>
                  <span className="block text-xs font-bold text-amber-300 uppercase tracking-widest">
                    Kuliner Malam Makassar
                  </span>
                  <h3 className="font-display text-xl font-black text-white mt-1">
                    Buka Setiap Malam
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Minggu - Jumat: 17.30 - 23.30 WITA<br />
                    Sabtu: 17.30 - 00.00 WITA
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 text-[11px] text-slate-400">
                  Jl. Pongtiku & Area SD Inpres Maccini
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
