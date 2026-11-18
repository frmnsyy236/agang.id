import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/menuData';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const FloatingCartButton: React.FC = () => {
  const { totalItems, totalPrice, setIsCartOpen, isCartOpen } = useCart();

  if (totalItems === 0 || isCartOpen) return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="fixed bottom-6 right-4 sm:right-8 z-40"
        aria-label="Keranjang Belanja Mengambang"
      >
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="group flex items-center gap-3 px-5 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-red-950 font-black shadow-2xl hover:shadow-amber-400/30 transition-all border-2 border-white/40 active:scale-95"
        >
          {/* Badge Counter */}
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-red-700 text-white flex items-center justify-center font-black text-xs shadow-md">
              <ShoppingBag size={17} />
            </div>
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-green-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow">
              {totalItems}
            </span>
          </div>

          {/* Details */}
          <div className="text-left">
            <span className="block text-[10px] uppercase tracking-wider font-extrabold opacity-80 leading-none">
              Lihat Keranjang
            </span>
            <span className="block text-sm sm:text-base font-black">
              {formatPrice(totalPrice)}
            </span>
          </div>

          <div className="w-7 h-7 rounded-full bg-red-950/15 flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <ArrowRight size={15} />
          </div>
        </button>
      </motion.aside>
    </AnimatePresence>
  );
};
