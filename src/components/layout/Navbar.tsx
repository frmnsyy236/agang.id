import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { name: 'HOME', path: '/' },
  { name: 'MENU', path: '/products' },
  { name: 'PROMO', path: '/promo' },
  { name: 'TENTANG KAMI', path: '/about' },
  { name: 'BLOG', path: '/blog' },
  { name: 'OUTLET', path: '/#outlet' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/blog') return location.pathname.startsWith('/blog') || location.pathname === '/BlogPost';
    if (path === '/products') return location.pathname.toLowerCase().startsWith('/product') || location.pathname === '/menu';
    if (path.startsWith('/#')) return false;
    return location.pathname.startsWith(path);
  };

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent('Halo Agang.id! Saya ingin memesan makanan. Boleh lihat menu lengkapnya?');
    window.open(`https://wa.me/6287726993572?text=${message}`, '_blank');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#c1002d] to-[#9c0f12] text-white font-black flex items-center justify-center text-lg shadow-md group-hover:scale-105 transition-transform">
              A
            </span>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-black tracking-tight text-[#111827]">
                Agang<span className="text-[#c1002d]">.id</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest -mt-1">
                Kuliner Makassar
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs font-extrabold uppercase tracking-wider transition-colors duration-200 py-1 relative ${
                    active ? 'text-[#c1002d]' : 'text-slate-700 hover:text-[#c1002d]'
                  }`}
                >
                  {link.name}
                  {active && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#c1002d] rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              onClick={handleWhatsAppOrder}
              className="rounded-full px-6 py-2.5 bg-[#c1002d] hover:bg-[#9c0f12] text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
            >
              <MessageCircle size={16} />
              <span>Order Sekarang</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-200 shadow-xl overflow-hidden"
          >
            <div className="container mx-auto px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 text-sm font-extrabold uppercase tracking-wider border-b border-slate-100 ${
                    isActive(link.path) ? 'text-[#c1002d]' : 'text-slate-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-2">
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    handleWhatsAppOrder();
                  }}
                  className="w-full rounded-full py-3 bg-[#c1002d] hover:bg-[#9c0f12] text-white font-extrabold text-sm uppercase tracking-wider shadow-md"
                >
                  Order via WhatsApp
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
