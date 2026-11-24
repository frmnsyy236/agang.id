import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import heroFood from '@/assets/chicken chesee.jpg';

export const HeroSection = () => {
  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent('Halo Agang.id! Saya ingin memesan makanan. Boleh lihat menu lengkapnya?');
    const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const url = `https://wa.me/6281919491455?text=${message}`;
    if (isMobile) {
      window.location.href = url;
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden">
      <div className="container mx-auto px-6 md:px-20 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Content */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="text-center lg:text-left space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-bold">
              <span>Kelezatan Autentik Asia</span>
            </motion.div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Kuliner Rice Bowl, <span className="text-gradient">Taiwan Chicken</span> & Dimsum Goreng di Makassar
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Pilihan kuliner street food favorit di Makassar dengan bahan segar berkualitas. Nikmati kelezatan Rice Bowl ayam krispi, Taiwan crispy chicken, dimsum goreng keju lumer, dan kulit crispy. Pesan via WhatsApp atau kunjungi outlet Jl. Kerung-Kerung & Jl. Pongtiku Makassar!
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start relative z-10 pointer-events-auto">
              {/* WhatsApp */}
              <div className="text-center sm:text-left">
                {/* <p className="mb-2 text-muted-foreground select-text">Pesan langsung lewat WhatsApp kami</p> */}
                <Button variant="hero" size="xl" onClick={handleWhatsAppOrder} className="group pointer-events-auto">
                  Order via WhatsApp
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Menu */}
              <div className="text-center sm:text-left">
                {/* <p className="mb-2 text-muted-foreground select-text">Lihat daftar menu lengkap kami</p> */}
                <Button size="xl" asChild className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 font-bold">
                  <Link to="/Products">Lihat Menu</Link>
                </Button>
              </div>
            </div>

            {/* Stats
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex gap-8 justify-center lg:justify-start pt-4">
              <div className="text-center">
                <div className="font-display text-2xl md:text-3xl font-bold text-primary">11+</div>
                <div className="text-sm text-muted-foreground">Menu Pilihan</div>
              </div>
              <div className="text-center">
                <div className="font-display text-2xl md:text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Pelanggan Puas</div>
              </div>
              <div className="text-center">
                <div className="font-display text-2xl md:text-3xl font-bold text-primary">4.9</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </motion.div> */}
          </motion.div>

          {/* Hero Image */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Main Image Container */}
              <div className="absolute inset-0 rounded-full bg-gradient-warm opacity-20 blur-3xl animate-pulse-glow" />
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="relative z-10">
                <img src={heroFood} alt="Kuliner Rice Bowl, Taiwan Chicken & Dimsum Goreng Agang.id Makassar" className="w-full h-full object-cover rounded-3xl shadow-2xl" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
