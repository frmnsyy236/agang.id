import { motion } from 'framer-motion';
import { Star, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { menuItems, formatPrice } from '@/data/menuData';
import { Link } from 'react-router-dom';

export const FeaturedSection = () => {
  // Ambil 5 menu flagship kuliner Makassar Agang.id
  const popularItems = menuItems.slice(0, 5);

  const handleOrderItem = (itemName: string, itemPriceText: string) => {
    const message = encodeURIComponent(`Halo Agang.id! Saya ingin memesan:\n\n*${itemName}* - ${itemPriceText}\n\nMohon konfirmasi ketersediaannya. Terima kasih!`);
    window.open(`https://wa.me/6287726993572?text=${message}`, '_blank');
  };

  return (
    <section className="py-16 md:py-24 bg-[#4a0808]/60 border-t border-white/10">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-4 py-1.5 rounded-full text-xs font-bold mb-4 shadow-sm">
            <Flame size={15} className="text-amber-400" />
            <span>Paling Favorit</span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-white">
            Menu Kuliner <span className="text-gradient">Terlaris Makassar</span>
          </h2>

          <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Pilihan favorit kuliner malam Makassar: Rice Bowl krispi sambel matah, Taiwan chicken gurih, kulit crispy renyah & dimsum keju lumer.
          </p>
        </motion.div>

        {/* Menu Cards (Semantic HTML <article>) */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {popularItems.map((item, index) => {
            const displayPrice = item.priceDisplay || formatPrice(item.price);
            return (
              <motion.div key={item.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group h-full">
                <article className="bg-[#580b0b] rounded-2xl overflow-hidden border border-white/15 transition-all duration-300 hover:shadow-2xl hover:border-amber-400/40 hover:-translate-y-2 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-black/20">
                    <img
                      src={item.image}
                      alt={`${item.name} - Kuliner Makassar Agang.id`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const fallbacks = [
                          'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop',
                          'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop',
                          'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=400&fit=crop',
                          'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=400&fit=crop',
                        ];
                        e.currentTarget.src = fallbacks[index % fallbacks.length];
                      }}
                    />

                    {/* Badge */}
                    <div className="absolute top-3 left-3 bg-amber-400 text-red-950 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-md">
                      <Star size={12} fill="currentColor" />
                      Favorit
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base md:text-lg text-white line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-white/75 line-clamp-2 mt-1 leading-relaxed">{item.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-auto border-t border-white/10">
                      <span className="font-black text-amber-300 text-sm sm:text-base">{displayPrice}</span>

                      <Button
                        size="sm"
                        onClick={() => handleOrderItem(item.name, displayPrice)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-md transition-all active:scale-95"
                      >
                        Pesan
                      </Button>
                    </div>
                  </div>
                </article>
              </motion.div>
            );
          })}
        </div>

        {/* Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
          <Button
            size="lg"
            asChild
            className="bg-white hover:bg-neutral-100 text-red-950 font-black px-8 py-3.5 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all border border-white/20"
          >
            <Link to="/products">Lihat Semua Menu Lengkap</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
