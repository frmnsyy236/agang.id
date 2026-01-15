import { motion } from "framer-motion";
import { Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuItem, formatPrice } from "@/data/menuData";

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

export const MenuCard = ({ item, index }: MenuCardProps) => {
  const handleOrder = () => {
    const message = encodeURIComponent(
      `Halo Agang.id! Saya ingin memesan:\n\n*${item.name}*\nHarga: ${formatPrice(item.price)}\n\nMohon konfirmasi ketersediaannya. Terima kasih!`
    );
    window.open(`https://wa.me/6287726993572?text=${message}`, "_blank");
  };

  const getFallbackImage = () => {
    const images: Record<string, string> = {
      ricebowl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop",
      taiwan: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop",
      dimsum: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=400&fit=crop",
    };
    return images[item.category] || images.ricebowl;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <div className="bg-card rounded-2xl overflow-hidden border border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col">
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
          Badges
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {item.isPopular && (
              <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <Star size={12} fill="currentColor" />
                Favorit
              </div>
            )}
            {item.isNew && (
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <Sparkles size={12} />
                Baru
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-1">
              {item.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="font-bold text-primary text-xl">
              {formatPrice(item.price)}
            </span>
            <Button variant="hero" size="sm" onClick={handleOrder}>
              Pesan
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
