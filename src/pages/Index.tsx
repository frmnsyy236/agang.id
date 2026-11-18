import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { CategorySection } from '@/components/home/CategorySection';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { BrandStory } from '@/components/home/BrandStory';
import { CTASection } from '@/components/home/CTASection';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Agang.id - Rice Bowl, Makanan Taiwan & Dimsum Terlezat</title>
        <meta name="description" content="Nikmati kelezatan autentik Rice Bowl, Makanan Taiwan, dan Dimsum pilihan dari Agang.id. Pesan sekarang via WhatsApp!" />
      </Helmet>

      <Layout>
        <HeroSection />

        {/* Section Stats Kompak & Rapi (Tanpa Garis Kuning) */}
        <section className="py-6 sm:py-8 bg-background relative z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-black/20 border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-md">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-white/15">
                {[
                  { value: '20K+', label: 'Member Active' },
                  { value: '2+', label: 'Outlet Store' },
                  { value: '4.9★', label: 'Rating Kepuasan' },
                  { value: '1+ Thn', label: 'Years Experience' },
                ].map((item, index) => (
                  <div key={index} className="pt-3 md:pt-0 px-2 sm:px-4 space-y-1">
                    <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-300">
                      {item.value}
                    </div>
                    <p className="text-[11px] sm:text-xs font-bold text-white/85 uppercase tracking-wider">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <CategorySection />
        <FeaturedSection />
        <BrandStory />
        <CTASection />
      </Layout>
    </>
  );
}; // <-- Tambahkan kurung kurawal penutup di sini

export default Index; // Jangan lupa export default jika ini adalah file page
