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

        {/* Section Stats dengan Garis Oranye di Atasnya */}
        <section className="bg-red py-12 border-t-[6px] border-yellow-500">
          <div className="container mx-auto px-4 md:px-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '20 K+', label: 'Member Active' },
                { value: '1 +', label: 'Outlet Store' },
                { value: '0 +', label: 'Signature Store' },
                { value: '1 +', label: 'Years Experience' },
              ].map((item, index) => (
                <div key={index}>
                  <div className="text-4xl md:text-5xl font-bold text-white-700">{item.value}</div>
                  <p className="text-sm font-medium text-white-600 mt-2 uppercase tracking-wide">{item.label}</p>
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
