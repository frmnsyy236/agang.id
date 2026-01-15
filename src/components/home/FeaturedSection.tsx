import { motion } from 'framer-motion';
import { Star, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { menuItems, formatPrice } from '@/data/menuData';
import { Link } from 'react-router-dom';

export const FeaturedSection = () => {
  // FIX: ambil 4 menu pertama sebagai menu favorit
  const popularItems = menuItems.slice(0, 4);

  const handleOrderItem = (itemName: string, itemPrice: number) => {
    const message = encodeURIComponent(`Halo Agang.id! Saya ingin memesan:\n\n${itemName} - ${formatPrice(itemPrice)}\n\nMohon konfirmasi ketersediaannya. Terima kasih!`);

    window.open(`https://wa.me/6287726993572?text=${message}`, '_blank');
  };

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-4">
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
          {popularItems.map((item, index) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group">
              <div className="bg-card rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
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
                  <div className="absolute top-3 left-3 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Star size={12} fill="currentColor" />
                    Favorit
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>

                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold text-primary text-lg">{formatPrice(item.price)}</span>

                    <Button variant="hero" size="sm" onClick={() => handleOrderItem(item.name, item.price)}>
                      Pesan
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-10">
          <Button variant="outline" size="lg" asChild>
            <Link to="/menu">Lihat Semua Menu</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
