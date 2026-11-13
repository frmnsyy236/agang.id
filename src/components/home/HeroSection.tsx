import { motion } from 'framer-motion';
import { ArrowRight, Flame, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import heroFood from '@/assets/chicken chesee.jpg';

export const HeroSection = () => {
  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent('Halo Agang.id! Saya ingin memesan makanan. Boleh lihat menu lengkapnya?');
    window.open(`https://wa.me/6287726993572?text=${message}`, '_blank');
  };

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-b from-white via-[#fff5f5] to-white overflow-hidden border-b border-slate-100">
      {/* Decorative Warm Blurred Background Circles */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-100/60 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Content Column (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 text-center lg:text-left space-y-6"
          >
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 bg-red-50 text-[#c1002d] border border-red-200/80 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-sm">
              <Flame size={15} className="text-[#c1002d]" />
              <span>Kuliner Malam Makassar Terfavorit</span>
            </div>

            {/* H1 Heading */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black leading-[1.15] text-slate-900 tracking-tight">
              Kelezatan Renyah:{' '}
              <span className="text-[#c1002d]">Rice Bowl</span>,{' '}
              <span className="text-[#eb7300]">Taiwan Chicken</span> & Dimsum Goreng
            </h1>

            {/* Paragraph */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Nikmati racikan ayam krispi hangat sambel matah segar khas Makassar, lumuran saus keju creamy gurih, dan dimsum keju lumer. Hadir di Inpres Maccini & Jl. Pongtiku depan JILC!
            </p>

            {/* Value Highlights */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm font-bold text-slate-700 pt-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-[#c1002d]" />
                <span>100% Halal & Segar</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={16} className="text-[#eb7300]" />
                <span>Buka 17.30 - 23.30 WITA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={16} className="text-[#c1002d]" />
                <span>Pongtiku & Inpres Maccini</span>
              </div>
            </div>

            {/* Dual Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start pt-2">
              <Button
                onClick={handleWhatsAppOrder}
                className="bg-[#c1002d] hover:bg-[#9c0f12] text-white font-black text-sm uppercase tracking-wider px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Order via WhatsApp</span>
                <ArrowRight size={18} />
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-2 border-slate-300 hover:border-[#c1002d] text-slate-800 hover:text-[#c1002d] hover:bg-red-50/50 font-black text-sm uppercase tracking-wider px-7 py-3.5 rounded-full shadow-sm transition-all"
              >
                <Link to="/products">Lihat Daftar Menu</Link>
              </Button>
            </div>

            {/* Delivery Aggregator Bar (Model Lazuna) */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 text-xs text-slate-500 font-bold">
              <span>Tersedia pemesanan cepat di:</span>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-extrabold text-[11px] border border-slate-200">
                  WhatsApp Antar
                </span>
                <span className="px-3 py-1 rounded-lg bg-green-50 text-green-700 font-extrabold text-[11px] border border-green-200">
                  GrabFood
                </span>
                <span className="px-3 py-1 rounded-lg bg-orange-50 text-orange-700 font-extrabold text-[11px] border border-orange-200">
                  ShopeeFood
                </span>
                <span className="px-3 py-1 rounded-lg bg-red-50 text-red-700 font-extrabold text-[11px] border border-red-200">
                  GoFood
                </span>
              </div>
            </div>
          </motion.div>

          {/* Hero Visual Column (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Warm Background Halo */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#c1002d]/20 via-[#eb7300]/20 to-amber-300/30 blur-2xl animate-pulse-glow" />

              {/* Main Image */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 w-full h-full"
              >
                <img
                  src={heroFood}
                  alt="Kuliner Makassar Agang.id - Rice Bowl, Taiwan Chicken, Kulit Crispy dan Dimsum Goreng"
                  className="w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-white"
                />

                {/* Floating Price Tag Badge (Model Lazuna) */}
                <div className="absolute -bottom-4 -left-4 bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#c1002d] text-white flex items-center justify-center font-black text-sm">
                    Rp
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Mulai Dari
                    </span>
                    <span className="font-display text-lg font-black text-[#c1002d]">
                      Rp5.000 <span className="text-xs font-bold text-slate-700">/ porsi</span>
                    </span>
                  </div>
                </div>

                {/* Floating Rating Badge */}
                <div className="absolute -top-3 -right-3 bg-white border border-slate-200 rounded-2xl px-3.5 py-2 shadow-lg flex items-center gap-1.5">
                  <span className="text-amber-400 text-sm">★★★★★</span>
                  <span className="text-xs font-black text-slate-800">4.9/5</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
