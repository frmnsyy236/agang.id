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
    window.open(`https://wa.me/6281234567890?text=${message}`, "_blank");
  };

  return (
    <>
      <Helmet>
        <title>Promo - Agang.id | Penawaran Spesial Hari Ini</title>
        <meta
          name="description"
          content="Dapatkan promo dan diskon menarik dari Agang.id! Paket hemat dimsum, diskon 20%, dan berbagai penawaran spesial lainnya."
        />
      </Helmet>
      <Layout>
        <section className="py-12 md:py-20 bg-gradient-hero min-h-screen">
          <div className="container mx-auto px-4">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Sparkles size={16} />
                <span>Penawaran Terbatas</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Promo <span className="text-gradient">Spesial</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Jangan lewatkan promo-promo menarik dari Agang.id! Pesan sekarang
                dan nikmati kelezatan dengan harga spesial.
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
                  <div className="relative bg-card rounded-2xl overflow-hidden border border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col">
                    {/* Gradient Header */}
                    <div
                      className={`bg-gradient-to-r ${promo.gradient} p-6 text-primary-foreground`}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                        <promo.icon size={28} />
                      </div>
                      <h3 className="font-display text-xl font-bold">
                        {promo.title}
                      </h3>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <p className="text-muted-foreground mb-4 flex-1">
                        {promo.description}
                      </p>

                      {/* Code */}
                      <div className="bg-muted rounded-xl p-3 mb-4 text-center">
                        <span className="text-xs text-muted-foreground block mb-1">
                          Kode Promo
                        </span>
                        <span className="font-mono font-bold text-lg text-foreground">
                          {promo.code}
                        </span>
                      </div>

                      {/* Valid Until */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Clock size={14} />
                        <span>Berlaku hingga: {promo.validUntil}</span>
                      </div>

                      <Button
                        variant="hero"
                        className="w-full"
                        onClick={() =>
                          handleClaimPromo(promo.code, promo.title)
                        }
                      >
                        Klaim Promo
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
