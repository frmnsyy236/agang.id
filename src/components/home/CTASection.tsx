import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CTASection = () => {
  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent('Halo Agang.id! Saya ingin memesan makanan. Boleh lihat menu lengkapnya?');
    window.open(`https://wa.me/6287726993572?text=${message}`, '_blank');
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-[#4a0808] via-[#630b0b] to-[#450707] text-white relative overflow-hidden border-t border-white/10">
      {/* Background Decorative Emojis */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
        <div className="absolute top-10 left-10 text-8xl">🥢</div>
        <div className="absolute bottom-10 right-10 text-8xl">🍜</div>
        <div className="absolute top-1/2 right-1/4 text-7xl">🍚</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 text-amber-300 border border-white/15 px-4 py-1.5 rounded-full text-xs font-bold">
            <span>Fast Delivery & Take Away</span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-white">
            Lapar Malam Hari? <span className="text-gradient">Pesan Sekarang!</span>
          </h2>

          <p className="text-base sm:text-lg text-white/85 max-w-xl mx-auto leading-relaxed">
            Order langsung lewat WhatsApp dan nikmati kelezatan Rice Bowl, Taiwan Chicken, & Dimsum hangat Agang.id tanpa perlu antre lama!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Button
              variant="whatsapp"
              size="xl"
              onClick={handleWhatsAppOrder}
              className="group bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base px-10 rounded-2xl shadow-2xl hover:shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle size={22} />
              <span>Order via WhatsApp Sekarang</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <p className="text-xs sm:text-sm text-white/70 pt-2">
            Jam operasional: Minggu - Jumat 17:30 - 23:30 WITA | Sabtu 17:30 - 00:00 WITA
          </p>
        </motion.div>
      </div>
    </section>
  );
};
