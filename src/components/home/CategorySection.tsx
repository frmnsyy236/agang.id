import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/data/menuData';

export const CategorySection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Pilihan <span className="text-gradient">Kategori Menu</span>
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Jelajahi berbagai hidangan lezat Agang.id yang disiapkan hangat dengan bahan-bahan segar berkualitas tinggi.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div key={category.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15 }}>
              <Link to={`/products?category=${category.id}`} className="group block h-full">
                <div className="relative overflow-hidden rounded-3xl bg-[#580b0b] border border-white/15 p-8 transition-all duration-300 hover:shadow-2xl hover:border-amber-400/40 hover:-translate-y-1.5 h-full flex flex-col justify-between">
                  <div>
                    {/* Icon */}
                    <div className="text-5xl mb-5 transition-transform duration-300 group-hover:scale-110">{category.icon}</div>

                    {/* Content */}
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">{category.name}</h3>
                    <p className="text-white/75 text-sm leading-relaxed mb-6">{category.description}</p>
                  </div>

                  {/* Link */}
                  <div className="inline-flex items-center gap-2 text-amber-300 font-bold group-hover:gap-3 transition-all pt-4 border-t border-white/10 text-sm">
                    <span>Lihat Menu {category.name}</span>
                    <ArrowRight size={16} />
                  </div>

                  {/* Background Decoration */}
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-400/5 rounded-full transition-transform duration-300 group-hover:scale-150" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
