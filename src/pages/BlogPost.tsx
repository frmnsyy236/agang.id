import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const posts = [
  {
    id: 1,
    title: "Kenapa Rice Bowl Jadi Makanan Favorit Anak Muda?",
    excerpt: "Rice bowl praktis, lezat, dan mengenyangkan. Ini alasan kenapa makin banyak anak muda yang pilih rice bowl sebagai menu harian mereka.",
    date: "19 April 2026",
    category: "Tips Kuliner",
    slug: "kenapa-rice-bowl-favorit"
  },
  {
    id: 2,
    title: "5 Alasan Dimsum Cocok Untuk Makan Malam Keluarga",
    excerpt: "Dimsum bukan cuma makanan restoran mewah. Kini bisa dinikmati di rumah dengan mudah dan terjangkau.",
    date: "15 April 2026",
    category: "Info Menu",
    slug: "dimsum-makan-malam-keluarga"
  },
];

const Blog = () => {
  return (
    <>
      <Helmet>
        <title>Blog - Agang.id | Tips Kuliner & Info Menu</title>
        <meta name="description" content="Baca artikel seputar kuliner Asia, tips makan, dan info menu terbaru dari Agang.id." />
      </Helmet>
      <Layout>
        <section className="py-12 md:py-20 bg-gradient-hero min-h-screen">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Blog <span className="text-gradient">Kami</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Tips kuliner, cerita di balik menu, dan info menarik seputar makanan Asia.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {posts.map((post, index) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className="p-6">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <h2 className="font-display text-xl font-bold text-foreground mt-4 mb-2">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                      <span className="text-primary text-sm font-medium cursor-pointer hover:underline">
                        Baca →
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Blog; 