import { motion } from 'framer-motion';
import { Star, MessageCircle, Sparkles } from 'lucide-react';
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
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group h-full"
    >
      <article className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col justify-between">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={item.image}
            alt={`${item.name} - Kuliner Makassar Agang.id`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = getFallbackImage();
            }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {item.isPopular && (
              <div className="bg-[#c1002d] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                <Star size={10} fill="currentColor" />
                <span>Favorit</span>
              </div>
            )}
            {item.isNew && (
              <div className="bg-[#eb7300] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                <Sparkles size={10} />
                <span>Baru</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-[#c1002d] transition-colors line-clamp-1">
              {item.name}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase">Harga</span>
              <span className="font-display text-base sm:text-lg font-black text-[#c1002d]">
                {displayPrice}
              </span>
            </div>

            <Button
              size="sm"
              onClick={handleOrder}
              className="bg-[#c1002d] hover:bg-[#9c0f12] text-white font-extrabold text-xs uppercase px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <MessageCircle size={14} />
              <span>Pesan</span>
            </Button>
          </div>
        </div>
      </article>
    </motion.div>
  );
};
