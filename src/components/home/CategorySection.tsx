import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/menuData";

export const CategorySection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pilihan <span className="text-gradient">Menu Kami</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Jelajahi berbagai kategori makanan lezat yang kami sediakan dengan
            bahan-bahan segar berkualitas
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Link
                to={`/menu?category=${category.id}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-8 transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1">
                  {/* Icon */}
                  <div className="text-6xl mb-4 transition-transform duration-300 group-hover:scale-110">
                    {category.icon}
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {category.description}
                  </p>

                  {/* Link */}
                  <div className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                    <span>Lihat Menu</span>
                    <ArrowRight size={18} />
                  </div>

                  {/* Background Decoration */}
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/5 rounded-full transition-transform duration-300 group-hover:scale-150" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
