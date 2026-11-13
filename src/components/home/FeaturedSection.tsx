import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { menuItems, formatPrice } from '@/data/menuData';
import { Link } from 'react-router-dom';

export const FeaturedSection = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'ricebowl' | 'taiwan' | 'dimsum'>('all');

  const filteredItems =
    activeTab === 'all'
      ? menuItems.slice(0, 8)
      : menuItems.filter((item) => item.category === activeTab);

  const handleOrderItem = (itemName: string, itemPriceText: string) => {
    const message = encodeURIComponent(`Halo Agang.id! Saya ingin memesan:\n\n*${itemName}* - ${itemPriceText}\n\nMohon konfirmasi ketersediaannya. Terima kasih!`);
    window.open(`https://wa.me/6287726993572?text=${message}`, '_blank');
  };

  return (
    <section className="py-16 md:py-24 bg-[#f8f9fa] border-b border-slate-200/80">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Lazuna-style 3 Vertical Strips Divider Motif */}
        <div className="flex items-center justify-center gap-1.5 mb-2.5">
          <span className="w-1.5 h-6 bg-[#eb7300] rounded-full" />
          <span className="w-1.5 h-6 bg-[#c1002d] rounded-full" />
          <span className="w-1.5 h-6 bg-[#eb7300] rounded-full" />
        </div>

        {/* Section Header */}
        <div className="text-center mb-10 space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900">
            MENU TERLARIS <span className="text-[#c1002d]">AGANG.ID</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Pilihan kuliner favorit malam Makassar: Rice Bowl renyah sambel matah, Taiwan chicken aneka rasa & dimsum keju lumer.
          </p>
        </div>

        {/* Category Filter Pills (Model Lazuna Chicken) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          {[
            { id: 'all', label: 'SEMUA MENU' },
            { id: 'ricebowl', label: 'RICE BOWL MAKASSAR' },
            { id: 'taiwan', label: 'TAIWAN CHICKEN' },
            { id: 'dimsum', label: 'DIMSUM GORENG' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(cat.id as any)}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                activeTab === cat.id
                  ? 'bg-[#c1002d] text-white shadow-md scale-105'
                  : 'bg-white border border-slate-300 text-slate-700 hover:border-[#c1002d] hover:text-[#c1002d]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid (Model Lazuna Chicken Product Card) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => {
            const displayPrice = item.priceDisplay || formatPrice(item.price);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group h-full"
              >
                <article className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col justify-between">
                  {/* Food Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={`${item.name} - Kuliner Makassar Agang.id`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Badge */}
                    {item.isPopular && (
                      <div className="absolute top-3 left-3 bg-[#c1002d] text-white px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <Star size={11} fill="currentColor" />
                        <span>Best Seller</span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
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
                        onClick={() => handleOrderItem(item.name, displayPrice)}
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
          })}
        </div>

        {/* View All Menu CTA */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            asChild
            className="rounded-full px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all"
          >
            <Link to="/products" className="inline-flex items-center gap-2">
              <span>Buka Seluruh Menu Lengkap</span>
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
