import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { MenuCard } from "@/components/menu/MenuCard";
import { CategoryFilter } from "@/components/menu/CategoryFilter";
import { menuItems } from "@/data/menuData";
import { Helmet } from "react-helmet-async";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "all"
  );

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setActiveCategory(category);
    }
  }, [searchParams]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>Menu Kuliner Makassar - Agang.id | Rice Bowl, Taiwan Chicken & Dimsum</title>
        <meta
          name="description"
          content="Daftar menu lengkap Agang.id Makassar: Rice Bowl Sambel Matah, Rice Bowl Cheese, Taiwan Chicken Crispy, Kulit Crispy & Dimsum Goreng Keju Lumer. Pesan via WhatsApp!"
        />
      </Helmet>
      <Layout>
        <section className="pt-32 pb-20 md:pt-40 md:pb-24 bg-gradient-hero min-h-screen">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
                Daftar Menu <span className="text-gradient">Agang.id</span>
              </h1>
              <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                Pilih hidangan favoritmu dan pesan langsung via WhatsApp. Semua hidangan disajikan hangat dengan bahan segar berkualitas!
              </p>
            </motion.div>

            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-10"
            >
              <CategoryFilter
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
              />
            </motion.div>

            {/* Menu Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <MenuCard key={item.id} item={item} index={index} />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">
                  Tidak ada menu yang ditemukan.
                </p>
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Products;
