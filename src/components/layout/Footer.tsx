import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, MapPin, Clock, Banknote } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold">Agang.id</h3>
            <p className="text-accent-foreground/80 text-sm leading-relaxed">
              Kuliner Makassar favorit: Rice Bowl ayam krispi sambal matah, Taiwan Chicken gurih, kulit crispy renyah, dan Dimsum goreng lumer.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/agang.id"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Agang.id"
                className="p-2 rounded-full bg-accent-foreground/10 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://wa.me/6287726993572"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Agang.id"
                className="p-2 rounded-full bg-accent-foreground/10 hover:bg-[hsl(142,70%,45%)] hover:text-white transition-colors"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold">Menu Makassar</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products?category=ricebowl" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  Rice Bowl Makassar
                </Link>
              </li>
              <li>
                <Link to="/products?category=taiwan" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  Taiwan Chicken & Camilan
                </Link>
              </li>
              <li>
                <Link to="/products?category=dimsum" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  Dimsum Goreng Keju
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Outlet */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold">Kontak & Outlet</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-accent-foreground/80">
                <MapPin size={18} className="mt-0.5 shrink-0" />
                <span>
                  Jl. Pongtiku (Depan Bimbel JILC) & Area SD Inpres Maccini, Kota Makassar, Sulawesi Selatan 90143
                </span>
              </li>
              <li className="flex items-center gap-2 text-accent-foreground/80">
                <MessageCircle size={18} className="shrink-0" />
                <a href="https://wa.me/6287726993572" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  +6287726993572 (0877-2699-3572)
                </a>
              </li>
              <li className="flex items-start gap-2 text-accent-foreground/80">
                <Clock size={18} className="mt-0.5 shrink-0" />
                <div>
                  <p>Minggu - Jumat: 17:30 - 23:30 WITA</p>
                  <p>Sabtu: 17:30 - 00:00 WITA</p>
                </div>
              </li>
              <li className="flex items-center gap-2 text-accent-foreground/80">
                <Banknote size={18} className="shrink-0" />
                <span>Kisaran Harga: Rp5.000 - Rp18.000</span>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold">Navigasi</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  Menu Lengkap
                </Link>
              </li>
              <li>
                <Link to="/promo" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  Promo
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  Artikel & Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-accent-foreground/20 text-center text-sm text-accent-foreground/60">
          <p>© 2026 Agang.id - Kuliner Makassar: Rice Bowl, Taiwan Chicken & Dimsum Goreng. Hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};
