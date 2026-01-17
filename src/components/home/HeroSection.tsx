import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import heroFood from '@/assets/chicken chesee.jpg';

export const HeroSection = () => {
  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent('Halo Agang.id! Saya ingin memesan makanan. Boleh lihat menu lengkapnya?');
    window.open(`https://wa.me/6287726993572?text=${message}`, '_blank');
  };

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 text-8xl">🍜</div>
        <div className="absolute top-40 right-20 text-6xl">🥟</div>
        <div className="absolute bottom-32 left-1/4 text-7xl">🍚</div>
        <div className="absolute bottom-20 right-10 text-5xl">🥢</div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="text-center lg:text-left space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles size={16} />
              <span>Kelezatan Autentik Asia</span>
            </motion.div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Nikmati Cita Rasa <span className="text-gradient">Istimewa</span> di Setiap Suapanmu
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">Rice Bowl, Makanan Taiwan, dan Dimsum pilihan dengan bahan segar berkualitas. Pesan sekarang dan rasakan kelezatannya!</p>

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
                <Button variant="outline" size="xl" asChild className="pointer-events-auto">
                  <Link to="/menu">Lihat Menu</Link>
                </Button>
              </div>
            </div>

            {/* Stats */}
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
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Main Image Container */}
              <div className="absolute inset-0 rounded-full bg-gradient-warm opacity-20 blur-3xl animate-pulse-glow" />
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="relative z-10">
                <img src={heroFood} alt="Makanan lezat dari Agang.id - Rice Bowl, Taiwan, Dimsum" className="w-full h-full object-cover rounded-3xl shadow-2xl" />
              </motion.div>

              {/* Floating Elements */}
              <motion.div animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute -top-4 -right-4 bg-card p-4 rounded-2xl shadow-lg">
                <div className="text-3xl">🥟</div>
                <div className="text-xs font-medium text-foreground mt-1">Dimsum</div>
              </motion.div>

              <motion.div animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} className="absolute -bottom-4 -left-4 bg-card p-4 rounded-2xl shadow-lg">
                <div className="text-3xl">🍚</div>
                <div className="text-xs font-medium text-foreground mt-1">Rice Bowl</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
