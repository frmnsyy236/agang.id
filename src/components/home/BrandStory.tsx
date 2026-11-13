import { motion } from 'framer-motion';
import { ChefHat, Heart, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import aboutStory from '@/assets/cerita nya gerobak.jpg.jpeg';

export const BrandStory = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Large Rounded Signature Card (Model Lazuna Chicken "Sekilas Tentang...") */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#80080a] via-[#9e0d10] to-[#c1002d] text-white p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
            {/* Story Content (7 cols) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-white/15 text-amber-300 border border-white/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-sm">
                <Award size={14} className="text-amber-300" />
                <span>Pelopor Kuliner Malam Makassar</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                DARI GEROBAK SEDERHANA, <span className="text-amber-300">RASA KELAS DUNIA</span>
              </h2>

              <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                Di pinggir jalan Kota Makassar, berdiri sebuah gerobak sederhana bernama <strong>Agang.id</strong>. Terlihat sederhana, tapi menyimpan mimpi yang luar biasa. Setiap porsi disiapkan fresh dengan potongan daging ayam pilihan, sambal matah racikan segar, dan bumbu khas yang menggoyang lidah.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 border border-white/15">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-red-950 flex items-center justify-center font-bold">
                    <ChefHat size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Resep Autentik</h3>
                    <p className="text-xs text-white/70">Bumbu rempah racikan khas</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 border border-white/15">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-red-950 flex items-center justify-center font-bold">
                    <Heart size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Disajikan Hangat</h3>
                    <p className="text-xs text-white/70">Dibuat fresh saat dipesan</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full border-2 border-white text-white hover:bg-white hover:text-[#c1002d] font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-md"
                >
                  <span>Sekilas Tentang Agang.id</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>

            {/* Photo Column (5 cols) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-5"
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                <img
                  src={aboutStory}
                  alt="Cerita Gerobak Agang.id Makassar"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                  <p className="text-white font-extrabold text-base sm:text-lg italic">
                    "Hari ini gerobak, besok jaringan usaha kuliner kebanggaan Makassar."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
