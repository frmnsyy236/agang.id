import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useBlog } from '@/context/BlogContext';
import { Search, Calendar, Clock, ArrowRight, Sparkles, Bookmark } from 'lucide-react';
import { articleCategories } from '@/data/initialArticles';

const BlogPost = () => {
  const { articles } = useBlog();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Kategori');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter articles based on category and search query
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchCategory =
        selectedCategory === 'Semua Kategori' || article.category === selectedCategory;
      const matchSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchCategory && matchSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  // Find featured article (or first article if none marked featured)
  const featuredArticle = useMemo(() => {
    return articles.find((a) => a.isFeatured) || articles[0];
  }, [articles]);

  return (
    <>
      <Helmet>
        <title>Blog & Berita Agang.id | Warta Kuliner, Promo, dan Tips Masak</title>
        <meta
          name="description"
          content="Ikuti warta terbaru seputar Agang.id, promo kuliner, tips memilih rice bowl lezat, dan rahasia saus mentai autentik Makassar."
        />
      </Helmet>

      <Layout>
        <div className="min-h-screen bg-gradient-hero text-foreground pt-28 pb-20">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Header Title Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto pt-6 pb-8"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                <Sparkles size={14} />
                <span>Warta Resmi & Inspirasi Kuliner</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
                Kabar Terbaru & Cerita Rasa <span className="text-gradient">Agang.id</span>
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed">
                Temukan tips menikmati menu favorit, kabar outlet terbaru, promo potongan harga, hingga cerita di balik resep autentik kami.
              </p>
            </motion.div>

            {/* Search & Filter Toolbar */}
            <div className="bg-card border border-border rounded-2xl p-4 md:p-6 mb-10 shadow-xl backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                {/* Search Input Box */}
                <div className="relative w-full max-w-md">
                  <Search
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari judul artikel, topik, atau kata kunci..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/20 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/60 hover:text-white bg-white/10 px-2 py-0.5 rounded-md"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="text-xs text-white/70 hidden sm:block font-medium">
                  Menampilkan {filteredArticles.length} artikel pilihan
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-2 border-t border-white/10 pb-1 scrollbar-none">
                {articleCategories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-white text-red-600 shadow-md scale-105'
                          : 'bg-card text-white/80 hover:text-white hover:bg-white/10 border border-border'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Featured Hero Article Banner (Shown when no search/category filter active) */}
            {selectedCategory === 'Semua Kategori' && !searchQuery && featuredArticle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 group hover:border-white/40 transition-all duration-300">
                  {/* Image Column */}
                  <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-full min-h-[300px] overflow-hidden">
                    <img
                      src={featuredArticle.coverImage}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-card" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-white text-red-600 text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                        <Sparkles size={13} />
                        Artikel Utama
                      </span>
                      <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                        {featuredArticle.category}
                      </span>
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-xs text-white/70">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} className="text-white/80" />
                          {featuredArticle.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} className="text-white/80" />
                          {featuredArticle.readTime || '3 menit baca'}
                        </span>
                      </div>

                      <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground group-hover:text-red-200 transition-colors leading-tight">
                        <Link to={`/blog/${featuredArticle.slug}`}>
                          {featuredArticle.title}
                        </Link>
                      </h2>

                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-3">
                        {featuredArticle.excerpt}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-border flex items-center justify-between">
                      <div className="text-xs text-white/70">
                        <span className="block text-white/50 text-[10px] uppercase font-bold tracking-wider">Ditulis Oleh</span>
                        <span className="font-bold text-white">{featuredArticle.author}</span>
                      </div>
                      <Link
                        to={`/blog/${featuredArticle.slug}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-neutral-100 text-red-600 font-bold text-xs shadow-lg transition-transform active:scale-95"
                      >
                        <span>Baca Selengkapnya</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Articles Grid Title */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                <span>Daftar Artikel</span>
                <span className="text-xs bg-white text-red-600 font-bold px-2.5 py-0.5 rounded-full">
                  {filteredArticles.length}
                </span>
              </h2>
              {selectedCategory !== 'Semua Kategori' && (
                <span className="text-xs text-red-200 font-bold">
                  Kategori: {selectedCategory}
                </span>
              )}
            </div>

            {/* Articles Grid */}
            {filteredArticles.length === 0 ? (
              <div className="bg-card border border-border rounded-3xl p-12 text-center max-w-md mx-auto my-12">
                <Bookmark size={40} className="mx-auto text-white/60 mb-3" />
                <h3 className="font-display text-lg font-bold text-white mb-2">
                  Tidak Ada Artikel yang Cocok
                </h3>
                <p className="text-muted-foreground text-xs mb-6 leading-relaxed">
                  Coba gunakan kata kunci pencarian yang lain atau pilih kategori artikel yang berbeda.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('Semua Kategori');
                    setSearchQuery('');
                  }}
                  className="px-5 py-2 rounded-full bg-white text-red-600 text-xs font-bold hover:bg-neutral-100 transition-colors shadow"
                >
                  Tampilkan Semua Artikel
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article, index) => (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card border border-border hover:border-white/40 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300"
                  >
                    <div>
                      {/* Thumbnail Container */}
                      <div className="relative aspect-video overflow-hidden bg-black/20">
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
                        <span className="absolute top-3 left-3 bg-black/60 border border-white/20 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md backdrop-blur-sm">
                          {article.category}
                        </span>
                      </div>

                      {/* Content Body */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center gap-2 text-[11px] text-white/60">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} className="text-white/70" />
                            {article.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-white/70" />
                            {article.readTime || '3 menit'}
                          </span>
                        </div>

                        <h3 className="font-display text-base md:text-lg font-bold text-foreground group-hover:text-red-200 transition-colors line-clamp-2 leading-snug">
                          <Link to={`/blog/${article.slug}`}>
                            {article.title}
                          </Link>
                        </h3>

                        <p className="text-muted-foreground text-xs line-clamp-3 leading-relaxed">
                          {article.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-5 pt-0">
                      <div className="pt-3 border-t border-border flex items-center justify-between">
                        <span className="text-[11px] text-white/60 font-medium truncate max-w-[140px]">
                          {article.author}
                        </span>
                        <Link
                          to={`/blog/${article.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-white hover:text-red-200 transition-colors group-hover:translate-x-1 duration-200"
                        >
                          <span>Baca</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default BlogPost;
