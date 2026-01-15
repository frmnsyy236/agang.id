import { motion } from "framer-motion";
import { categories } from "@/data/menuData";

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  const allCategories = [
    { id: "all", name: "Semua", icon: "🍽️" },
    ...categories,
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {allCategories.map((category) => (
        <motion.button
          key={category.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(category.id)}
          className={`relative px-5 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
            activeCategory === category.id
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-card text-foreground border border-border hover:border-primary/30"
          }`}
        >
          <span className="text-lg">{category.icon}</span>
          <span>{category.name}</span>
        </motion.button>
      ))}
    </div>
  );
};
