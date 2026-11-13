import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, Instagram, MessageCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import aboutTeam from '@/assets/about team agang.jpg';

const About = () => {
  const handleWhatsApp = () => {
    const message = encodeURIComponent('Halo Agang.id! Saya ingin bertanya tentang menu dan layanan.');
    window.open(`https://wa.me/6287726993572?text=${message}`, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>Tentang Kami - Agang.id | Kuliner Makassar</title>
        <meta name="description" content="Kenali lebih dekat Agang.id - bisnis kuliner Makassar yang menyajikan Rice Bowl, Makanan Taiwan, dan Dimsum premium." />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-hero border-b border-slate-200">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              {/* 3 Strips Motif */}
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <span className="w-1.5 h-6 bg-[#eb7300] rounded-full" />
                <span className="w-1.5 h-6 bg-[#c1002d] rounded-full" />
                <span className="w-1.5 h-6 bg-[#eb7300] rounded-full" />
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-slate-900 mb-4">
                Tentang <span className="text-[#c1002d]">Agang.id</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Kami adalah brand kuliner lokal Makassar yang berdedikasi membawa kelezatan autentik ayam krispi sambal matah, saus keju gurih, dan aneka jajanan lezat langsung ke meja makan Anda.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Cerita Kami</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Agang.id lahir dari kecintaan mendalam terhadap kuliner Asia. Dimulai dari dapur kecil dengan resep turun-temurun, kini kami telah melayani ribuan pelanggan yang mencari kelezatan autentik.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Setiap menu yang kami sajikan dibuat dengan bahan-bahan segar pilihan dan dimasak dengan penuh perhatian. Dari Rice Bowl yang praktis, hidangan Taiwan yang otentik, hingga Dimsum yang juicy - semua dibuat untuk memberikan
                  pengalaman kuliner terbaik.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Visi kami sederhana: membuat makanan lezat yang bisa dinikmati siapa saja, kapan saja. Dengan layanan order via WhatsApp yang mudah, kelezatan Agang.id hanya satu pesan jauhnya!
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden">
                  <img src={aboutTeam} alt="Tim Agang.id" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full rounded-3xl bg-primary/10" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Hubungi <span className="text-gradient">Kami</span>
              </h2>
              <p className="text-muted-foreground">Ada pertanyaan? Jangan ragu untuk menghubungi kami!</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
                <div className="bg-card rounded-2xl p-6 border border-border space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Lokasi Outlet</h3>
                      <p className="text-slate-600 text-sm">Jl. Pongtiku (Depan JILC) & Area SD Inpres Maccini, Kota Makassar</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">WhatsApp Pemesanan</h3>
                      <p className="text-slate-600 text-sm">+62 877-2699-3572</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#eb7300] shrink-0">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Jam Operasional</h3>
                      <p className="text-slate-600 text-sm">Minggu - Jumat: 17:30 - 23:30 WITA | Sabtu: 17:30 - 00:00 WITA</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full" onClick={handleWhatsApp}>
                      <MessageCircle size={18} />
                      WhatsApp
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-full border-slate-300 text-slate-800 hover:border-[#c1002d] hover:text-[#c1002d]" onClick={() => window.open('https://instagram.com/agang.id', '_blank')}>
                      <Instagram size={18} />
                      Instagram
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Map */}
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-card rounded-2xl overflow-hidden border border-border h-80 md:h-auto">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d920.3427618108874!2d119.42706002217083!3d-5.140419672707036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbefddc00ab3cff%3A0xba6a673c57976b31!2sAgang.id!5e0!3m2!1sid!2sid!4v1768498182853!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '320px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Agang.id"
                />
              </motion.div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default About;
