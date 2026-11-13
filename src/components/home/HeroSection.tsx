import { motion } from 'framer-motion';
import { ArrowRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import heroFood from '@/assets/chicken chesee.jpg';

export const HeroSection = () => {
  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent('Halo Agang.id! Saya ingin memesan makanan. Boleh lihat menu lengkapnya?');
    window.open(`https://wa.me/6287726993572?text=${message}`, '_blank');
  };

  return (
    <section className="relative min-h-[85vh] flex items-center bg-gradient-hero overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/15 text-amber-200 border border-white/25 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold backdrop-blur-sm shadow-sm"
            >
              <Flame size={15} className="text-amber-400" />
              <span>Kuliner Malam Makassar Favorit</span>
            </motion.div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white max-w-2xl">
              Kuliner Malam Makassar: <span className="text-gradient">Rice Bowl, Taiwan Chicken & Dimsum Goreng Renyah</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Pilihan kuliner Makassar terenak di Inpres Maccini & Jl. Pongtiku (depan Bimbel JILC): Rice Bowl krispi sambel matah, Taiwan chicken gurih, kulit crispy renyah & dimsum keju lumer. Buka 17.30 - 23.30 WITA!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start relative z-10 pt-2">
              {/* WhatsApp Button */}
              <Button
                variant="whatsapp"
                size="lg"
                onClick={handleWhatsAppOrder}
                className="group bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Order via WhatsApp
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>

              {/* Menu Button */}
              <Button
                size="lg"
                asChild
                className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-sm px-8 font-bold shadow-md hover:scale-105 transition-all active:scale-95"
              >
                <Link to="/products">Lihat Daftar Menu</Link>
              </Button>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md lg:max-w-lg mx-auto">
              <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-3xl animate-pulse-glow" />
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10"
              >
                <img
                  src={heroFood}
                  alt="Kuliner Makassar Agang.id - Rice Bowl, Taiwan Chicken, Kulit Crispy dan Dimsum Goreng"
                  className="w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-white/15"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
