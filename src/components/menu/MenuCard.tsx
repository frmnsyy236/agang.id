import { motion } from 'framer-motion';
import { Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuItem, formatPrice } from '@/data/menuData';

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

export const MenuCard = ({ item, index }: MenuCardProps) => {
  const displayPrice = item.priceDisplay || formatPrice(item.price);

  const handleOrder = () => {
    const message = encodeURIComponent(`Halo Agang.id! Saya ingin memesan:\n\n*${item.name}*\nHarga: ${displayPrice}\n\nMohon konfirmasi ketersediaannya. Terima kasih!`);
    window.open(`https://wa.me/6287726993572?text=${message}`, '_blank');
  };

  const getFallbackImage = () => {
    const images: Record<string, string> = {
      ricebowl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop',
      taiwan: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop',
      dimsum: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=400&fit=crop',
    };
    return images[item.category] || images.ricebowl;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="group h-full">
      <article className="bg-[#580b0b] rounded-2xl overflow-hidden border border-white/15 transition-all duration-300 hover:shadow-2xl hover:border-amber-400/40 hover:-translate-y-2 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-black/20">
          <img
            src={item.image}
            alt={`${item.name} - Kuliner Makassar Agang.id`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = getFallbackImage();
            }}
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {item.isPopular && (
              <div className="bg-amber-400 text-red-950 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-md">
                <Star size={12} fill="currentColor" />
                Favorit
              </div>
            )}
            {item.isNew && (
              <div className="bg-white text-red-950 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-md">
                <Sparkles size={12} />
                Baru
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold text-white mb-1.5 line-clamp-1">{item.name}</h3>
            <p className="text-xs sm:text-sm text-white/75 line-clamp-2 leading-relaxed">{item.description}</p>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
            <div className="rounded-lg">
              <span className="font-black text-amber-300 text-base md:text-lg">{displayPrice}</span>
            </div>

            <Button size="sm" onClick={handleOrder} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-xl shadow-md transition-all active:scale-95">
              Pesan
            </Button>
          </div>
        </div>
      </article>
    </motion.div>
  );
};
