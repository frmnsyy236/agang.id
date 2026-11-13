import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, MapPin, Clock, Banknote, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#0b1325] text-white border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-18 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c1002d] to-[#9c0f12] text-white font-black flex items-center justify-center text-base shadow-md">
                A
              </span>
              <span className="font-display text-2xl font-black tracking-tight text-white">
                Agang<span className="text-[#c1002d]">.id</span>
              </span>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Kuliner malam Makassar favorit yang menyajikan Rice Bowl krispi sambal matah, Taiwan chicken gurih, kulit crispy renyah, dan dimsum keju lumer.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/agang.id"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Agang.id"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#c1002d] text-white flex items-center justify-center transition-all duration-200"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://wa.me/6287726993572"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Agang.id"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#16a34a] text-white flex items-center justify-center transition-all duration-200"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Menu Series (Model Lazuna) */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-black uppercase tracking-wider text-amber-300">
              Menu Kategori
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/products?category=ricebowl" className="text-slate-400 hover:text-white transition-colors">
                  Rice Bowl Sambel Matah
                </Link>
              </li>
              <li>
                <Link to="/products?category=ricebowl" className="text-slate-400 hover:text-white transition-colors">
                  Rice Bowl Creamy Cheese
                </Link>
              </li>
              <li>
                <Link to="/products?category=taiwan" className="text-slate-400 hover:text-white transition-colors">
                  Taiwan Crispy Chicken
                </Link>
              </li>
              <li>
                <Link to="/products?category=taiwan" className="text-slate-400 hover:text-white transition-colors">
                  Kulit Crispy Renyah
                </Link>
              </li>
              <li>
                <Link to="/products?category=dimsum" className="text-slate-400 hover:text-white transition-colors">
                  Dimsum Goreng Keju Lumer
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak & Outlet */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-black uppercase tracking-wider text-amber-300">
              Lokasi & Jam Buka
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin size={17} className="mt-0.5 text-[#c1002d] shrink-0" />
                <span>
                  Jl. Pongtiku (Depan JILC) & Area SD Inpres Maccini, Kota Makassar, Sulsel 90143
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle size={17} className="text-[#16a34a] shrink-0" />
                <a
                  href="https://wa.me/6287726993572"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-white font-bold"
                >
                  +62 877-2699-3572
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={17} className="mt-0.5 text-[#eb7300] shrink-0" />
                <div>
                  <p className="text-white font-bold">17:30 - 23:30 WITA</p>
                  <p className="text-[11px] text-slate-500">Sabtu Buka Hingga 00:00 WITA</p>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Banknote size={17} className="text-amber-400 shrink-0" />
                <span>Kisaran: Rp5.000 - Rp18.000</span>
              </li>
            </ul>
          </div>

          {/* Navigasi */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-black uppercase tracking-wider text-amber-300">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-slate-400 hover:text-white transition-colors">
                  Daftar Menu Lengkap
                </Link>
              </li>
              <li>
                <Link to="/promo" className="text-slate-400 hover:text-white transition-colors">
                  Promo Terkini
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                  Tentang Agang.id
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-slate-400 hover:text-white transition-colors">
                  Artikel & Berita
                </Link>
              </li>
              <li>
                <Link to="/#outlet" className="text-slate-400 hover:text-white transition-colors">
                  Lokasi Outlet
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Agang.id - Kuliner Malam Makassar Favorit. Semua hak dilindungi.</p>
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck size={14} className="text-[#16a34a]" />
            <span>100% Halal Certified Taste</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
