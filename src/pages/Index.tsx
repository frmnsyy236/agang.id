import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { CategorySection } from '@/components/home/CategorySection';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { BrandStory } from '@/components/home/BrandStory';
import { FAQSection } from '@/components/home/FAQSection';
import { CTASection } from '@/components/home/CTASection';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Agang.id - Kuliner Makassar: Rice Bowl, Taiwan Chicken & Dimsum Goreng</title>
        <meta
          name="description"
          content="Nikmati kuliner Makassar terbaik dari Agang.id: Rice Bowl krispi sambel matah, Taiwan chicken gurih, kulit crispy & dimsum goreng lumer. Hadir di Inpres Maccini & Jalan Pongtiku depan Bimbel JILC Makassar. Buka Minggu-Jumat 17.30 - 23.30 WITA, Sabtu 17.30 - 00.00 WITA. Pesan via WhatsApp!"
        />
        <meta property="og:title" content="Agang.id - Kuliner Makassar: Rice Bowl, Taiwan Chicken & Dimsum Goreng" />
        <meta
          property="og:description"
          content="Nikmati kuliner Makassar terbaik dari Agang.id: Rice Bowl krispi sambel matah, Taiwan chicken gurih, kulit crispy & dimsum goreng lumer. Hadir di Inpres Maccini & Jalan Pongtiku depan Bimbel JILC Makassar. Buka 17.30 - 23.30 WITA!"
        />
        <meta property="og:type" content="restaurant" />
      </Helmet>

      <Layout>
        <HeroSection />

        {/* Section Keunggulan Agang.id */}
        <section className="bg-[#520909] border-y border-white/15 py-8 md:py-10 shadow-inner">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
              {[
                { title: '100% Halal & Segar', desc: 'Daging ayam segar kualitas premium', icon: '🍗' },
                { title: 'Mulai Rp5.000', desc: 'Harga merakyat & porsi kenyang', icon: '💰' },
                { title: 'Buka Malam Hari', desc: '17.30 - 23.30 WITA setiap hari', icon: '🌙' },
                { title: 'Order Antar Mudah', desc: 'Pesan langsung via WhatsApp', icon: '🛵' },
              ].map((item, index) => (
                <div key={index} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/30 transition-all">
                  <div className="text-2xl sm:text-3xl mb-2">{item.icon}</div>
                  <div className="text-sm sm:text-base font-black text-white">{item.title}</div>
                  <p className="text-xs text-white/70 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CategorySection />
        <FeaturedSection />
        <BrandStory />
        <FAQSection />
        <CTASection />
      </Layout>
    </>
  );
};

export default Index;
