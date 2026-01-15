import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { BrandStory } from "@/components/home/BrandStory";
import { CTASection } from "@/components/home/CTASection";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Agang.id - Rice Bowl, Makanan Taiwan & Dimsum Terlezat</title>
        <meta
          name="description"
          content="Nikmati kelezatan autentik Rice Bowl, Makanan Taiwan, dan Dimsum pilihan dari Agang.id. Pesan sekarang via WhatsApp!"
        />
      </Helmet>
      <Layout>
        <HeroSection />
        <CategorySection />
        <FeaturedSection />
        <BrandStory />
        <CTASection />
      </Layout>
    </>
  );
};

export default Index;
