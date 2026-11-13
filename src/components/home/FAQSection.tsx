import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const faqs = [
  {
    id: 'faq-1',
    question: 'Di mana lokasi outlet kuliner Agang.id di Makassar?',
    answer:
      'Outlet Agang.id dapat Anda kunjungi di 2 titik strategis Kota Makassar: Jl. Pongtiku (tepat di depan Bimbel JILC) dan di Area SD Inpres Maccini, Kota Makassar, Sulawesi Selatan 90143.',
  },
  {
    id: 'faq-2',
    question: 'Jam berapa Agang.id buka untuk kuliner malam di Makassar?',
    answer:
      'Agang.id melayani pecinta kuliner malam Makassar setiap hari dengan jadwal: Minggu - Jumat pukul 17:30 - 23:30 WITA, dan Sabtu pukul 17:30 - 00:00 WITA (tengah malam).',
  },
  {
    id: 'faq-3',
    question: 'Apa saja menu favorit dan kisaran harga di Agang.id Makassar?',
    answer:
      'Menu terlaris kami mencakup Rice Bowl Sambel Matah (Rp12.000 - Rp15.000), Rice Bowl Cheese creamy (Rp15.000 - Rp18.000), Taiwan Chicken Crispy (Rp10.000 - Rp15.000), Kulit Crispy gurih (Rp10.000 - Rp15.000), dan Dimsum Goreng Keju Lumer (Rp5.000/satuan, Rp15.000/porsi). Seluruh menu terjangkau dengan rentang harga Rp5.000 hingga Rp18.000.',
  },
  {
    id: 'faq-4',
    question: 'Bagaimana cara memesan makanan di Agang.id via WhatsApp?',
    answer:
      'Pemesanan sangat praktis! Anda cukup klik tombol "Order via WhatsApp" di website ini atau hubungi langsung nomor resmi WhatsApp Agang.id di +62 877-2699-3572 untuk pesan antar (delivery) maupun take away.',
  },
  {
    id: 'faq-5',
    question: 'Apakah Agang.id melayani pesanan partai besar atau konsumsi acara subuh di Makassar?',
    answer:
      'Ya! Agang.id melayani pesanan partai besar (rice bowl box atau snack box) untuk konsumsi kantor, arisan, rapat, syukuran, hingga kebutuhan acara subuh di Makassar. Pemesanan partai besar dapat dikonfirmasi minimal H-1 via WhatsApp di +62 877-2699-3572.',
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="py-16 md:py-24 bg-background border-t border-border/40">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
            <HelpCircle size={16} />
            <span>Tanya Jawab (FAQ)</span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Pertanyaan Seputar <span className="text-gradient">Kuliner Makassar Agang.id</span>
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            Temukan jawaban lengkap seputar lokasi outlet, jam buka malam, menu favorit, hingga layanan pesanan via WhatsApp.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm"
        >
          <Accordion type="single" collapsible defaultValue="faq-1" className="w-full space-y-4">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border border-border/60 rounded-xl px-4 md:px-6 transition-colors hover:border-primary/40"
              >
                <AccordionTrigger className="text-left font-display text-base md:text-lg font-semibold text-foreground py-4 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm md:text-base text-muted-foreground leading-relaxed pt-1 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
