import { motion } from 'framer-motion';
import { Star, Sparkles, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuItem, formatPrice } from '@/data/menuData';
import { useCart } from '@/context/CartContext';

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

export const MenuCard = ({ item, index }: MenuCardProps) => {
  const { items, addToCart, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.id === item.id);
  const displayPrice = item.priceDisplay || formatPrice(item.price);

  const getFallbackImage = () => {
    const images: Record<string, string> = {
      ricebowl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop',
      taiwan: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop',
      dimsum: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=400&fit=crop',
    };
    return images[item.category] || images.ricebowl;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="group">
      <div className="bg-card rounded-2xl overflow-hidden border border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col justify-between">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = getFallbackImage();
            }}
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {item.isPopular && (
              <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
                <Star size={12} fill="currentColor" />
                Favorit
              </div>
            )}
            {item.isNew && (
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
                <Sparkles size={12} />
                Baru
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-1">{item.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            {/* Harga */}
            <div>
              <span className="font-bold text-white text-base md:text-lg">{displayPrice}</span>
            </div>

            {/* Cart Controller */}
            {cartItem ? (
              <div className="flex items-center gap-2 bg-[#520909] px-2.5 py-1.5 rounded-xl border border-white/20 shadow-inner">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-6 h-6 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold active:scale-90 transition-transform"
                  title="Kurang"
                >
                  <Minus size={12} />
                </button>
                <span className="text-xs font-black text-amber-300 w-5 text-center">
                  {cartItem.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-6 h-6 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold active:scale-90 transition-transform"
                  title="Tambah"
                >
                  <Plus size={12} />
                </button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => addToCart(item, 1)}
                className="bg-amber-400 hover:bg-amber-300 text-red-950 font-black text-xs px-3.5 py-2 rounded-xl shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>+ Pesan</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
