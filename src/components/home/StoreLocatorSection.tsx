import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ExternalLink, Navigation } from 'lucide-react';

const outlets = [
  {
    id: 'pongtiku',
    name: 'OUTLET PONGTIKU (DEPAN JILC)',
    address: 'Jl. Pongtiku (Tepat di Depan Bimbel JILC), Kota Makassar, Sulawesi Selatan 90143',
    hours: 'Minggu - Jumat: 17:30 - 23:30 WITA | Sabtu: 17:30 - 00:00 WITA',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jl+Pongtiku+Makassar',
    phone: '+62 877-2699-3572',
    isPrimary: true,
  },
  {
    id: 'maccini',
    name: 'OUTLET INPRES MACCINI',
    address: 'Area SD Inpres Maccini, Kota Makassar, Sulawesi Selatan 90143',
    hours: 'Setiap Hari: 17:30 - 23:30 WITA',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=SD+Inpres+Maccini+Makassar',
    phone: '+62 877-2699-3572',
    isPrimary: false,
  },
];

export const StoreLocatorSection: React.FC = () => {
  return (
    <section id="outlet" className="py-16 md:py-24 bg-white border-b border-slate-200/80">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Lazuna-style 3 Vertical Strips Divider Motif */}
        <div className="flex items-center justify-center gap-1.5 mb-2.5">
          <span className="w-1.5 h-6 bg-[#eb7300] rounded-full" />
          <span className="w-1.5 h-6 bg-[#c1002d] rounded-full" />
          <span className="w-1.5 h-6 bg-[#eb7300] rounded-full" />
        </div>

        {/* Section Header */}
        <div className="text-center mb-12 space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900">
            OUTLET KAMI DI <span className="text-[#c1002d]">MAKASSAR</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Kunjungi outlet Agang.id terdekat di Kota Makassar untuk take away atau nongkrong santai kuliner malam.
          </p>
        </div>

        {/* Outlet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {outlets.map((outlet, index) => (
            <motion.div
              key={outlet.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl border border-slate-200 p-7 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-[#c1002d]/40"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-red-50 text-[#c1002d] flex items-center justify-center font-black">
                    <MapPin size={20} />
                  </span>
                  {outlet.isPrimary && (
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-[#eb7300] border border-amber-200 text-[10px] font-black uppercase tracking-wider">
                      Outlet Utama
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-display text-lg sm:text-xl font-black text-slate-900 group-hover:text-[#c1002d] transition-colors">
                    {outlet.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {outlet.address}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <Clock size={15} className="text-[#eb7300] shrink-0 mt-0.5" />
                    <span>{outlet.hours}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4">
                <a
                  href={outlet.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full border-2 border-[#c1002d] text-[#c1002d] hover:bg-[#c1002d] hover:text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm"
                >
                  <Navigation size={14} />
                  <span>Lihat Petunjuk Arah di Maps</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
