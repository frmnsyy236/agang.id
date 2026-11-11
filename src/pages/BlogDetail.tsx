import { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';
import { useBlog } from '@/context/BlogContext';
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Bookmark,
  Check,
  ChevronRight,
  Sparkles,
  MessageCircle,
  Tag
} from 'lucide-react';
import { useState } from 'react';

export const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getArticleBySlug, articles } = useBlog();
  const [copied, setCopied] = useState(false);

  const article = useMemo(() => {
    if (!slug) return undefined;
    return getArticleBySlug(slug);
  }, [slug, getArticleBySlug]);

  // Related articles (same category or latest, excluding current)
  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return articles
      .filter((a) => a.id !== article.id)
      .slice(0, 3);
  }, [article, articles]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!article) return;
    const text = encodeURIComponent(
      `*${article.title}*\n\nBaca artikel selengkapnya di Agang.id:\n${window.location.href}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Helper to render content with markdown-like styling
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];

    let inList = false;
    let listItems: string[] = [];

    const flushList = (key: number) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${key}`} className="space-y-2 my-4 pl-4 list-disc list-inside text-white/90">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
              </li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    const formatInline = (text: string) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white underline decoration-red-400/40">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic text-white/90">$1</em>');
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (!trimmed) {
        flushList(index);
        return;
      }

      // Image markdown: ![alt](url)
      const imageMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imageMatch) {
        flushList(index);
        elements.push(
          <div key={`img-${index}`} className="my-6 rounded-2xl overflow-hidden border border-white/15 shadow-xl">
            <img
              src={imageMatch[2]}
              alt={imageMatch[1] || 'Foto Artikel'}
              className="w-full max-h-[550px] object-cover"
            />
            {imageMatch[1] && (
              <p className="p-2.5 text-center text-xs text-white/70 bg-[#520909] italic border-t border-white/10">
                {imageMatch[1]}
              </p>
            )}
          </div>
        );
        return;
      }

      // Heading 3
      if (trimmed.startsWith('### ')) {
        flushList(index);
        elements.push(
          <h3
            key={`h3-${index}`}
            className="font-display text-xl sm:text-2xl font-black text-white mt-8 mb-4 tracking-tight"
          >
            {trimmed.replace('### ', '')}
          </h3>
        );
        return;
      }

      // Heading 2
      if (trimmed.startsWith('## ')) {
        flushList(index);
        elements.push(
          <h2
            key={`h2-${index}`}
            className="font-display text-2xl sm:text-3xl font-black text-white mt-10 mb-4 tracking-tight"
          >
            {trimmed.replace('## ', '')}
          </h2>
        );
        return;
      }

      // Blockquote
      if (trimmed.startsWith('> ')) {
        flushList(index);
        elements.push(
          <blockquote
            key={`quote-${index}`}
            className="p-5 my-6 rounded-2xl bg-[#520909] border-l-4 border-white text-white/95 italic font-medium shadow-inner"
          >
            "{trimmed.replace('> ', '').replace(/^"|"$/g, '')}"
          </blockquote>
        );
        return;
      }

      // Unordered or Ordered list items
      if (trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
        inList = true;
        const itemText = trimmed.replace(/^-\s|^\d+\.\s/, '');
        listItems.push(itemText);
        return;
      }

      // Standard paragraph
      flushList(index);
      elements.push(
        <p
          key={`p-${index}`}
          className="text-white/85 text-base sm:text-lg leading-relaxed mb-5"
          dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
        />
      );
    });

    flushList(lines.length);

    return elements;
  };

  if (!article) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-hero text-foreground pt-32 pb-20 flex items-center justify-center">
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 text-center max-w-md mx-4 shadow-2xl">
            <Bookmark size={48} className="mx-auto text-white/70 mb-4" />
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Artikel Tidak Ditemukan
            </h1>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Maaf, artikel yang kamu cari mungkin telah dihapus atau tautannya telah berubah.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-neutral-100 text-red-600 font-bold text-xs shadow-lg transition-transform active:scale-95"
            >
              <ArrowLeft size={16} />
              <span>Kembali ke Blog Agang</span>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.title} - Agang.id</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.coverImage} />
      </Helmet>

      <Layout>
        <div className="min-h-screen bg-gradient-hero text-foreground pt-28 pb-20">
          <article className="container mx-auto px-4 max-w-4xl">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs text-white/70 pt-4 pb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
              <Link to="/" className="hover:text-white transition-colors">
                Beranda
              </Link>
              <ChevronRight size={12} className="text-white/40 shrink-0" />
              <Link to="/blog" className="hover:text-white transition-colors">
                Blog
              </Link>
              <ChevronRight size={12} className="text-white/40 shrink-0" />
              <span className="text-white font-bold truncate max-w-[200px]">
                {article.category}
              </span>
            </nav>

            {/* Back button */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => navigate('/blog')}
                className="inline-flex items-center gap-2 text-xs font-bold text-white/90 hover:text-white transition-colors px-4 py-2 rounded-full bg-card border border-border hover:border-white/40 shadow-sm"
              >
                <ArrowLeft size={14} />
                <span>Kembali ke Warta Agang</span>
              </button>
            </div>

            {/* Article Header Card */}
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl mb-8">
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="px-3.5 py-1 rounded-full bg-white text-red-600 font-bold text-xs shadow-md">
                  {article.category}
                </span>
                {article.isFeatured && (
                  <span className="px-3 py-1 rounded-full bg-black/40 text-white border border-white/30 font-bold text-xs flex items-center gap-1 shadow-md">
                    <Sparkles size={12} />
                    Artikel Pilihan
                  </span>
                )}
              </div>

              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
                {article.title}
              </h1>

              {/* Author & Meta bar */}
              <div className="pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white text-red-600 font-bold flex items-center justify-center text-sm shadow-md">
                    {article.author.charAt(0)}
                  </div>
                  <div>
                    <span className="block text-foreground font-bold text-sm">
                      {article.author}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {article.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {article.readTime || '3 menit baca'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Share actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                    title="Bagikan ke WhatsApp"
                  >
                    <MessageCircle size={15} />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white hover:text-red-700 text-white border border-border text-xs font-bold transition-all shadow-md active:scale-95"
                    title="Salin Tautan Artikel"
                  >
                    {copied ? <Check size={15} /> : <Share2 size={15} />}
                    <span>{copied ? 'Tersalin!' : 'Bagikan'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-10 border border-border max-h-[500px]">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Excerpt Lead Paragraph */}
            <div className="bg-card border-l-4 border-white p-6 rounded-2xl mb-8 shadow-xl">
              <p className="text-foreground font-medium text-lg sm:text-xl leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            {/* Main Article Body */}
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-2xl mb-12">
              <div className="prose prose-invert max-w-none">
                {renderFormattedContent(article.content)}
              </div>

              {/* Tags Section */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-border flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground flex items-center gap-1 mr-2">
                    <Tag size={13} />
                    Topik Terkait:
                  </span>
                  {article.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-black/20 text-white text-xs font-bold border border-border"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Related Articles Section */}
            {relatedArticles.length > 0 && (
              <div className="mt-12">
                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <span>Artikel Menarik Lainnya</span>
                  <Sparkles size={20} className="text-red-200" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map((rel) => (
                    <Link
                      key={rel.id}
                      to={`/blog/${rel.slug}`}
                      className="bg-card border border-border hover:border-white/40 rounded-2xl overflow-hidden shadow-xl flex flex-col group hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={rel.coverImage}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2 left-2 bg-black/70 border border-border text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {rel.category}
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <h4 className="font-display font-bold text-sm text-foreground group-hover:text-red-200 transition-colors line-clamp-2 mb-2">
                          {rel.title}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border">
                          <span>{rel.date}</span>
                          <span className="text-foreground font-bold group-hover:underline">Baca →</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </Layout>
    </>
  );
};

export default BlogDetail;
