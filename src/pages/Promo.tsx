import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Sparkles, Clock, Gift, Percent } from "lucide-react";
import { Helmet } from "react-helmet-async";

const promos = [
  {
    id: 1,
    title: "Paket Hemat Dimsum",
    description:
      "Beli 3 porsi dimsum pilihan, GRATIS 1 porsi Hakau Premium senilai Rp 32.000!",
    validUntil: "31 Desember 2024",
    code: "DIMSUM3+1",
    icon: Gift,
    gradient: "from-primary to-secondary",
  },
  {
    id: 2,
    title: "Diskon 20% Semua Menu",
    description:
      "Khusus order pertama via WhatsApp! Dapatkan diskon 20% untuk semua menu.",
    validUntil: "Berlaku setiap hari",
    code: "WELCOME20",
    icon: Percent,
    gradient: "from-secondary to-golden",
  },
  {
    id: 3,
    title: "Rice Bowl Combo",
    description:
      "Pesan 2 Rice Bowl + 2 Minuman hanya Rp 75.000! Hemat hingga Rp 25.000.",
    validUntil: "15 Januari 2025",
    code: "COMBO75K",
    icon: Sparkles,
    gradient: "from-accent to-primary",
  },
];

const Promo = () => {
  const handleClaimPromo = (promoCode: string, promoTitle: string) => {
    const message = encodeURIComponent(
      `Halo Agang.id! Saya ingin menggunakan promo:\n\n*${promoTitle}*\nKode: ${promoCode}\n\nMohon infonya ya!`
    );
    window.open(`https://wa.me/6287726993572?text=${message}`, "_blank");
  };

  return (
    <>
      <Helmet>
        <title>Promo Spesial - Agang.id | Penawaran Hemat Kuliner Makassar</title>
        <meta
          name="description"
          content="Dapatkan promo dan diskon menarik dari Agang.id! Paket hemat dimsum, diskon 20%, dan berbagai penawaran spesial lainnya."
        />
      </Helmet>
      <Layout>
        <section className="pt-28 pb-20 md:pt-36 md:pb-24 bg-[#f8f9fa] min-h-screen border-b border-slate-200">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12 space-y-2"
            >
              <div className="inline-flex items-center gap-2 bg-amber-50 text-[#eb7300] border border-amber-200 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-2">
                <Sparkles size={15} className="text-[#eb7300]" />
                <span>Penawaran Hemat Terbatas</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-slate-900">
                PROMO SPESIAL <span className="text-[#c1002d]">AGANG.ID</span>
              </h1>
              <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                Jangan lewatkan promo-promo menarik dari Agang.id! Pesan sekarang via WhatsApp dan nikmati kelezatan dengan harga hemat.
              </p>
            </motion.div>

            {/* Promo Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {promos.map((promo, index) => (
                <motion.div
                  key={promo.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col">
                    {/* Gradient Header */}
                    <div className="bg-gradient-to-r from-[#9c0f12] to-[#c1002d] p-6 text-white">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
                        <promo.icon size={24} className="text-amber-300" />
                      </div>
                      <h3 className="font-display text-xl font-bold">
                        {promo.title}
                      </h3>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">
                        {promo.description}
                      </p>

                      {/* Code */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-4 text-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                          Kode Promo
                        </span>
                        <span className="font-mono font-black text-lg text-[#c1002d]">
                          {promo.code}
                        </span>
                      </div>

                      {/* Valid Until */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-5">
                        <Clock size={14} className="text-[#eb7300]" />
                        <span>Masa berlaku: {promo.validUntil}</span>
                      </div>

                      <Button
                        className="w-full rounded-full py-3 bg-[#c1002d] hover:bg-[#9c0f12] text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                        onClick={() =>
                          handleClaimPromo(promo.code, promo.title)
                        }
                      >
                        Klaim Promo via WhatsApp
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mt-12"
            >
              <p className="text-sm text-muted-foreground">
                * Promo tidak dapat digabung dengan penawaran lainnya. Syarat dan
                ketentuan berlaku.
              </p>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Promo;
