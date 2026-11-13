import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { CategorySection } from '@/components/home/CategorySection';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { BrandStory } from '@/components/home/BrandStory';
import { StoreLocatorSection } from '@/components/home/StoreLocatorSection';
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
        {/* 1. Hero Section (Model Lazuna Food Staging) */}
        <HeroSection />

        {/* 2. Value Props Ribbon (Model Lazuna Highlights) */}
        <section className="bg-white border-b border-slate-200/80 py-8 md:py-10">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
              {[
                { title: '100% Halal & Segar', desc: 'Daging ayam segar pilihan berkualitas', icon: '🍗' },
                { title: 'Mulai Rp5.000', desc: 'Harga ramah & porsi kenyang', icon: '💰' },
                { title: 'Buka Malam Hari', desc: '17.30 - 23.30 WITA setiap hari', icon: '🌙' },
                { title: 'Order Antar Mudah', desc: 'Pesan langsung via WhatsApp', icon: '🛵' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#c1002d]/40 hover:shadow-md transition-all group"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-[#c1002d] transition-colors">
                    {item.title}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Featured Menu Showcase with Filter Pills */}
        <FeaturedSection />

        {/* 4. Signature Brand Story Feature Card */}
        <BrandStory />

        {/* 5. Category Overview */}
        <CategorySection />

        {/* 6. Store Locator (Model Lazuna "Store Kami di Makassar") */}
        <StoreLocatorSection />

        {/* 7. FAQ Section */}
        <FAQSection />

        {/* 8. WhatsApp Community / Fast Order Call-To-Action Banner */}
        <CTASection />
      </Layout>
    </>
  );
};

export default Index;
