import { motion } from "framer-motion";
import { Heart, Leaf, ChefHat } from "lucide-react";
import aboutStory from "@/assets/about-story.jpg";

const values = [
  {
    icon: ChefHat,
    title: "Kualitas Premium",
    description: "Bahan-bahan segar pilihan dan resep autentik dari chef berpengalaman",
  },
  {
    icon: Heart,
    title: "Dibuat dengan Cinta",
    description: "Setiap hidangan disiapkan dengan penuh perhatian dan dedikasi",
  },
  {
    icon: Leaf,
    title: "Bahan Segar",
    description: "Kami menggunakan bahan-bahan segar berkualitas setiap harinya",
  },
];

export const BrandStory = () => {
  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
              <img
                src={aboutStory}
                alt="Dapur Agang.id"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-display text-2xl text-accent-foreground font-bold">
                  "Kelezatan dalam setiap detail"
                </p>
              </div>
            </div>
            {/* Decoration */}
            <div className="absolute -z-10 -top-4 -left-4 w-full h-full rounded-3xl bg-primary/10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Cerita di Balik{" "}
                <span className="text-gradient">Agang.id</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Berawal dari kecintaan akan kuliner Asia, Agang.id hadir untuk
                membawa kelezatan autentik langsung ke meja makanmu. Dengan
                resep turun-temurun dan sentuhan modern, kami berkomitmen
                menyajikan hidangan terbaik.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Dari rice bowl yang praktis hingga dimsum yang menggugah selera,
                setiap menu kami adalah hasil dari passion dan dedikasi untuk
                memberikan pengalaman kuliner yang tak terlupakan.
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
                  className="flex gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <value.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
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
