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
    { id: "all", name: "SEMUA MENU", icon: "🍽️" },
    ...categories.map((c) => ({ ...c, name: c.name.toUpperCase() })),
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2.5">
      {allCategories.map((category) => (
        <motion.button
          key={category.id}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onCategoryChange(category.id)}
          className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
            activeCategory === category.id
              ? "bg-[#c1002d] text-white shadow-md"
              : "bg-white text-slate-700 border border-slate-300 hover:border-[#c1002d] hover:text-[#c1002d]"
          }`}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
        </motion.button>
      ))}
    </div>
  );
};
