import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Promo', path: '/promo' },
  { name: 'About Us', path: '/about' },
  { name: 'Blog', path: '/blog' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { totalItems, setIsCartOpen } = useCart();

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent('Halo Agang.id! Saya ingin memesan makanan. Boleh lihat menu lengkapnya?');
    const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const url = `https://wa.me/6281919491455?text=${message}`;
    if (isMobile) {
      window.location.href = url;
    } else {
      window.open(url, '_blank');
    }
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/blog') return location.pathname.startsWith('/blog') || location.pathname === '/BlogPost';
    if (path === '/products') return location.pathname.toLowerCase().startsWith('/product') || location.pathname === '/menu';
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-4 md:px-10">
      <div className="mx-auto max-w-7xl bg-white text-slate-900 rounded-lg md:rounded-xl shadow-md border border-slate-200">
        <div className="container mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="font-display text-xl md:text-2xl font-extrabold text-red-600">Agang.id</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative font-semibold text-sm transition-colors duration-300 ${active ? 'text-red-600' : 'text-slate-700 hover:text-red-500'}`}
                  >
                    {link.name}
                    {active && <motion.div layoutId="activeNav" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600 rounded-full" />}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Cart Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full text-slate-800 hover:text-red-600 hover:bg-red-50 transition-colors border border-slate-200"
                title="Buka Keranjang Belanja"
                aria-label="Buka Keranjang Belanja"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center shadow-md animate-bounce">
                    {totalItems}
                  </span>
                )}
              </button>

              <Button
                variant="whatsapp"
                className="rounded-full px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
                asChild
              >
                <a
                  href={totalItems > 0 ? '#cart' : `https://wa.me/6281919491455?text=${encodeURIComponent('Halo Agang.id! Saya ingin memesan makanan.')}`}
                  target={totalItems > 0 ? undefined : '_blank'}
                  rel={totalItems > 0 ? undefined : 'noopener noreferrer'}
                  onClick={(e) => {
                    if (totalItems > 0) {
                      e.preventDefault();
                      setIsCartOpen(true);
                    }
                  }}
                >
                  <MessageCircle size={16} />
                  <span>{totalItems > 0 ? `Checkout (${totalItems})` : 'Order Sekarang'}</span>
                </a>
              </Button>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-xl text-slate-800 hover:text-red-600 hover:bg-slate-100 transition-colors"
                title="Buka Keranjang Belanja"
                aria-label="Buka Keranjang Belanja"
              >
                <ShoppingBag size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center shadow">
                    {totalItems}
                  </span>
                )}
              </button>

              <button className="p-2 text-slate-800" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="md:hidden mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block font-semibold ${isActive(link.path) ? 'text-red-600' : 'text-slate-700'}`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Cart Trigger */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-red-950 font-black text-xs flex items-center justify-between shadow-md"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag size={17} />
                  <span>Buka Keranjang Belanja</span>
                </span>
                <span className="bg-red-700 text-white px-2 py-0.5 rounded-full text-[10px] font-black">
                  {totalItems} item
                </span>
              </button>

              <Button
                variant="whatsapp"
                className="w-full rounded-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 shadow-md flex items-center justify-center gap-2"
                asChild
              >
                <a
                  href={totalItems > 0 ? '#cart' : `https://wa.me/6281919491455?text=${encodeURIComponent('Halo Agang.id! Saya ingin memesan makanan.')}`}
                  target={totalItems > 0 ? undefined : '_blank'}
                  rel={totalItems > 0 ? undefined : 'noopener noreferrer'}
                  onClick={(e) => {
                    if (totalItems > 0) {
                      e.preventDefault();
                      setIsOpen(false);
                      setIsCartOpen(true);
                    } else {
                      setIsOpen(false);
                    }
                  }}
                >
                  <MessageCircle size={18} />
                  <span>{totalItems > 0 ? `Checkout (${totalItems} Menu)` : 'Order Sekarang via WhatsApp'}</span>
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
