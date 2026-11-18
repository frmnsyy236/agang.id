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
                  {/* Angka warna Hijau (seperti Yotta) */}
                  <h2 className="text-4xl md:text-5xl font-bold text-white-700">{item.value}</h2>
                  {/* Label warna Gelap/Abu agar jelas di background putih */}
                  <p className="text-sm font-medium text-white-600 mt-2 uppercase tracking-wide">{item.label}</p>
                </div>
              ))}
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
