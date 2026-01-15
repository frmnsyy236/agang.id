import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CTASection = () => {
  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent('Halo Agang.id! Saya ingin memesan makanan. Boleh lihat menu lengkapnya?');
    window.open(`https://wa.me/6287726993572?text=${message}`, '_blank');
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-warm text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-8xl">🥢</div>
        <div className="absolute bottom-10 right-10 text-8xl">🍜</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto space-y-6">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold">Lapar? Pesan Sekarang!</h2>
          <p className="text-lg text-primary-foreground/90">Order langsung via WhatsApp dan nikmati kelezatan Agang.id dalam hitungan menit. Gratis ongkir untuk area tertentu!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button variant="whatsapp" size="xl" onClick={handleWhatsAppOrder} className="group bg-white text-accent hover:bg-white/90">
              <MessageCircle size={20} />
              Order via WhatsApp
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          <p className="text-sm text-primary-foreground/70">Jam operasional: 17:00 - 23:30 WIB</p>
        </motion.div>
      </div>
    </section>
  );
};
