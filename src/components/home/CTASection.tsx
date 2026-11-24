import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CTASection = () => {
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
    <section id="cara-pesan" className="py-16 md:py-24 bg-[#630303] border-t border-b border-white/10 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto space-y-6"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Cara Pesan Cepat Agang.id Makassar
          </h2>

          <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-xl mx-auto">
            Lapar? Order langsung via WhatsApp resmi dan nikmati Rice Bowl, Taiwan Chicken, serta Dimsum Goreng hangat dalam hitungan menit. Tersedia layanan takeaway dan dine-in di outlet Jl. Kerung-Kerung & Jl. Pongtiku Makassar!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Button
              size="xl"
              asChild
              className="group bg-white text-red-950 hover:bg-neutral-100 font-black text-sm uppercase tracking-wider rounded-full px-8 py-4 shadow-2xl active:scale-95 flex items-center justify-center gap-2"
            >
              <a
                href={`https://wa.me/6281919491455?text=${encodeURIComponent('Halo Agang.id! Saya ingin memesan makanan. Boleh lihat menu lengkapnya?')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={20} className="text-green-600" />
                <span>Order via WhatsApp</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-red-600" />
              </a>
            </Button>
          </div>

          <p className="text-xs sm:text-sm text-white/80 font-medium pt-2">
            Jam operasional: 17:30 - 23:30 WITA (Buka Setiap Hari di Outlet Makassar)
          </p>
        </motion.div>
      </div>
    </section>
  );
};
