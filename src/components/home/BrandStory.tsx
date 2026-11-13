import { motion } from 'framer-motion';
import { Heart, Leaf, ChefHat } from 'lucide-react';
import aboutStory from '@/assets/cerita nya gerobak.jpg.jpeg';

const values = [
  {
    icon: ChefHat,
    title: 'Kualitas Premium',
    description: 'Bahan-bahan segar pilihan dan resep autentik dari chef berpengalaman',
  },
  {
    icon: Heart,
    title: 'Dibuat dengan Cinta',
    description: 'Setiap hidangan disiapkan dengan penuh perhatian dan dedikasi',
  },
  {
    icon: Leaf,
    title: 'Bahan Segar',
    description: 'Kami menggunakan bahan-bahan segar berkualitas setiap harinya',
  },
];

export const BrandStory = () => {
  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
              <img src={aboutStory} alt="Dapur Agang.id" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-accent/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-display text-2xl text-accent-foreground font-bold">"Hari ini gerobak, besok jaringan usaha"</p>
              </div>
            </div>
            {/* Decoration */}
            <div className="absolute -z-10 -top-4 -left-4 w-full h-full rounded-3xl bg-primary/10" />
          </motion.div>

          {/* Content */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
            <div className="space-y-4">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
                Cerita di Balik <span className="text-gradient">Agang.id</span>
              </h2>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed">
                Di pinggir jalan, berdiri sebuah gerobak sederhana bernama Agang.id. Terlihat biasa, tapi menyimpan mimpi yang luar biasa. Setiap porsi yang disajikan bukan hanya tentang makanan, tapi tentang perjuangan, konsistensi, dan
                harapan akan masa depan.
              </p>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed">
                Hari ini mungkin kecil, tapi Agang.id tidak dibangun untuk hari ini saja melainkan untuk sesuatu yang jauh lebih besar. Semua yang besar, selalu dimulai dari yang sederhana.
              </p>
            </div>

            <div className="grid gap-4 pt-4">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="flex gap-4 p-4 rounded-2xl bg-[#580b0b] border border-white/15 hover:border-amber-400/30 transition-colors"
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-amber-400/15 flex items-center justify-center text-amber-300">
                    <value.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">{value.title}</h3>
                    <p className="text-white/75 text-xs sm:text-sm leading-relaxed">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
