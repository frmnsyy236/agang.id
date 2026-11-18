import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, MapPin, Clock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold">Agang.id</h3>
            <p className="text-accent-foreground/80 text-sm leading-relaxed">Kelezatan autentik Rice Bowl, Makanan Taiwan, dan Dimsum pilihan langsung ke meja makanmu.</p>
            <div className="flex gap-4">
              <a href="https://instagram.com/agang.id" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-accent-foreground/10 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://wa.me/6287726993572" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-accent-foreground/10 hover:bg-[hsl(142,70%,45%)] hover:text-white transition-colors">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold">Menu</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/menu?category=ricebowl" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  Rice Bowl
                </Link>
              </li>
              <li>
                <Link to="/menu?category=taiwan" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  Makanan Taiwan
                </Link>
              </li>
              <li>
                <Link to="/menu?category=dimsum" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  Dimsum
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold">Kontak</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-accent-foreground/80">
                <MapPin size={18} className="mt-0.5 shrink-0" />
                <span>Jl. Kerung kerung</span>
              </li>
              <li className="flex items-center gap-2 text-accent-foreground/80">
                <MessageCircle size={18} className="shrink-0" />
                <span>+62 877-2699-3572</span>
              </li>
              <li className="flex items-center gap-2 text-accent-foreground/80">
                <Clock size={18} className="shrink-0" />
                <span>17:00 - 23:30 WIB</span>
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
                <Link to="/menu" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
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
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-accent-foreground/20 text-center text-sm text-accent-foreground/60">
          <p>© 2024 Agang.id. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};
