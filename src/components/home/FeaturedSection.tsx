import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, Flame, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/data/menuData';
import { useMenu } from '@/context/MenuContext';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';

export const FeaturedSection = () => {
  const { menuItems } = useMenu();
  const { items: cartItems, addToCart, updateQuantity } = useCart();

  // Ambil menu yang ditandai Favorit/Populer sesuai urutan posisi, atau fallback ke 4 menu teratas
  const popularItems = useMemo(() => {
    const popular = menuItems.filter((i) => i.isPopular);
    return popular.length >= 4 ? popular.slice(0, 4) : menuItems.slice(0, 4);
  }, [menuItems]);

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red/100 text-yellow-500 px-4 py-2 rounded-full text-sm font-bold mb-4">
            <Flame size={16} />
            <span>Paling Favorit</span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Menu <span className="text-gradient">Terlaris</span>
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto">Pilihan favorit pelanggan kami yang wajib kamu coba</p>
        </motion.div>

        {/* Menu Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularItems.map((item, index) => {
            const priceText = item.priceDisplay || formatPrice(item.price);
            const inCart = cartItems.find((ci) => ci.id === item.id);

            return (
              <motion.div key={item.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group">
                <div className="bg-card rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col justify-between">
                  <div>
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
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
                      {item.isPopular && (
                        <div className="absolute top-3 left-3 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
                          <Star size={12} fill="currentColor" />
                          Favorit
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <div className="flex items-center justify-between pt-3 border-t border-border/40">
                      <span className="font-bold text-white text-base md:text-lg">{priceText}</span>

                      {/* Cart Controller */}
                      {inCart ? (
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
                            {inCart.quantity}
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
          })}
        </div>

        {/* Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-10">
          <Button size="lg" asChild className="bg-white text-red-600 hover:bg-gray-200 font-bold px-8 rounded-xl shadow-lg-100">
            <Link to="/products">Lihat Semua Menu</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
