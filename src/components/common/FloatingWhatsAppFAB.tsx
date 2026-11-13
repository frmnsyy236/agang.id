import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsAppFAB: React.FC = () => {
  const handleWhatsApp = () => {
    const message = encodeURIComponent('Halo Agang.id! Saya ingin memesan makanan.');
    window.open(`https://wa.me/6287726993572?text=${message}`, '_blank');
  };

  return (
    <aside aria-label="Kontak Pemesanan" className="fixed bottom-6 right-6 z-40">
      <button
        type="button"
        onClick={handleWhatsApp}
        className="group flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl hover:shadow-emerald-600/40 transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/80"
        title="Chat & Order via WhatsApp"
        aria-label="Order via WhatsApp"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>
        <MessageCircle size={22} className="shrink-0" />
        <span className="font-extrabold text-xs uppercase tracking-wider hidden sm:inline">
          Order Online
        </span>
      </button>
    </aside>
  );
};
