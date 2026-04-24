import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products ' },
  { name: 'Promo', path: '/promo' },
  { name: 'About Us', path: '/about' },
  { name: 'Blog', path: 'https://www.knowlagi.my.id/2025/09/agandid.html' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent('Halo Agang.id! Saya ingin memesan makanan. Boleh lihat menu lengkapnya?');
    window.open(`https://wa.me/6287726993572?text=${message}`, '_blank');
  };

  return (
    // 1. Hilangkan bg-background & border-b di nav utama agar transparan
    <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-4 md:px-10">
      {/* 2. Container ini yang kita buat jadi warna putih melayang */}
      <div className="mx-auto max-w-7xl bg-white text-slate-900 rounded-lg md:rounded-xl shadow-md border border-black-100">
        <div className="container mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              {/* Ganti text-gradient dengan warna solid gelap agar kontras di background putih */}
              <span className="font-display text-xl md:text-2xl font-extrabold text-red-600">Agang.id</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} className={`relative font-semibold text-sm transition-colors duration-300 ${location.pathname === link.path ? 'text-red-600' : 'text-black-600 hover:text-red-500'}`}>
                  {link.name}
                  {location.pathname === link.path && <motion.div layoutId="activeNav" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600 rounded-full" />}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button variant="whatsapp" className="rounded-full px-6 bg-green-500 hover:bg-red-600 text-white" onClick={handleWhatsAppOrder}>
                Order Sekarang
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-slate-800" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Sama seperti sebelumnya, tapi sesuaikan warnanya) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="md:hidden mt-2 bg-white rounded-2xl shadow-xl border border-black-100 overflow-hidden">
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className="block font-semibold text-black-600">
                  {link.name}
                </Link>
              ))}
              <Button variant="whatsapp" className="w-full rounded-full" onClick={handleWhatsAppOrder}>
                Order Sekarang
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
