import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { MenuCard } from "@/components/menu/MenuCard";
import { CategoryFilter } from "@/components/menu/CategoryFilter";
import { menuItems } from "@/data/menuData";
import { Helmet } from "react-helmet-async";

const Menu = () => {
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
        <title>Menu - Agang.id | Rice Bowl, Taiwan & Dimsum</title>
        <meta
          name="description"
          content="Jelajahi menu lengkap Agang.id - Rice Bowl, Makanan Taiwan, dan Dimsum premium dengan harga terjangkau."
        />
      </Helmet>
      <Layout>
        <section className="py-12 md:py-20 bg-gradient-hero min-h-screen">
          <div className="container mx-auto px-4">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Menu <span className="text-gradient">Kami</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Pilih hidangan favoritmu dan pesan langsung via WhatsApp. Semua
                menu dibuat fresh dengan bahan berkualitas!
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

export default Menu;
