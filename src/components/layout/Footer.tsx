import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, MapPin, Clock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#BD0505] text-white border-t border-white/10">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold text-white">Agang.id</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Kelezatan autentik Rice Bowl, Makanan Taiwan, dan Dimsum pilihan langsung ke meja makanmu.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/agang.id"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://wa.me/6287726993572"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-green-600 hover:text-white transition-colors"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold text-white">Menu Utama</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products?category=ricebowl" className="text-white/80 hover:text-white transition-colors">
                  Rice Bowl Crispy
                </Link>
              </li>
              <li>
                <Link to="/products?category=taiwan" className="text-white/80 hover:text-white transition-colors">
                  Taiwan Crispy Chicken
                </Link>
              </li>
              <li>
                <Link to="/products?category=dimsum" className="text-white/80 hover:text-white transition-colors">
                  Dimsum Goreng Keju
                </Link>
              </li>
              <li>
                <a href="#menu" className="text-amber-300 hover:text-white font-medium transition-colors">
                  → Menu Terlaris di Beranda
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Lokasi Cabang */}
          <div id="lokasi" className="space-y-4">
            <h4 className="font-display text-lg font-semibold text-white">Lokasi Outlet Makassar</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-white/80">
                <MapPin size={18} className="mt-0.5 shrink-0 text-amber-300" />
                <span>
                  <strong>Cabang 1:</strong> Jl. Kerung-Kerung (Area SD Inpres Maccini), Makassar
                </span>
              </li>
              <li className="flex items-start gap-2 text-white/80">
                <MapPin size={18} className="mt-0.5 shrink-0 text-amber-300" />
                <span>
                  <strong>Cabang 2:</strong> Jl. Pongtiku (Depan Bimbel JILC), Makassar
                </span>
              </li>
              <li className="flex items-center gap-2 text-white/80">
                <MessageCircle size={18} className="shrink-0 text-amber-300" />
                <a href="https://wa.me/6287726993572" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  +62 877-2699-3572 (Pesan WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-2 text-white/80">
                <Clock size={18} className="shrink-0 text-amber-300" />
                <span>Buka: 17:30 - 23:30 WITA (Setiap Hari)</span>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold text-white">Navigasi Halaman</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-white/80 hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <a href="#menu" className="text-white/80 hover:text-white transition-colors">
                  Menu Favorit
                </a>
              </li>
              <li>
                <a href="#lokasi" className="text-white/80 hover:text-white transition-colors">
                  Lokasi Outlet
                </a>
              </li>
              <li>
                <a href="#cara-pesan" className="text-white/80 hover:text-white transition-colors">
                  Cara Pesan
                </a>
              </li>
              <li>
                <Link to="/products" className="text-white/80 hover:text-white transition-colors">
                  Katalog Lengkap
                </Link>
              </li>
              <li>
                <Link to="/promo" className="text-white/80 hover:text-white transition-colors">
                  Promo Kuliner
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/80 hover:text-white transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-white/80 hover:text-white transition-colors">
                  Artikel & Berita
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/15 text-center text-sm text-white/70">
          <p>© 2024 Agang.id. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};
