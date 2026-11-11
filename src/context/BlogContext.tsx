import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Article, ArticleInput } from '@/types/blog';
import { initialArticles } from '@/data/initialArticles';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface BlogContextType {
  articles: Article[];
  isAdminAuthenticated: boolean;
  adminPin: string;
  isCloudConnected: boolean;
  addArticle: (data: ArticleInput) => Article;
  updateArticle: (id: string, updated: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  getArticleBySlug: (slug: string) => Article | undefined;
  getArticleById: (id: string) => Article | undefined;
  resetToDefault: () => void;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  updateAdminPin: (oldPin: string, newPin: string) => boolean;
  refreshFromCloud: () => Promise<void>;
}

const STORAGE_KEY = 'agang_articles_v1';
const PIN_KEY = 'agang_admin_pin_v1';
const AUTH_KEY = 'agang_admin_auth_v1';
const DEFAULT_PIN = 'admin123';

const mapFromSupabase = (row: any): Article => ({
  id: String(row.id),
  title: row.title || '',
  slug: row.slug || '',
  excerpt: row.excerpt || '',
  content: row.content || '',
  category: row.category || 'Kabar Agang',
  coverImage: row.cover_image || row.coverImage || '',
  author: row.author || 'Tim Editorial Agang',
  date: row.date || '',
  readTime: row.read_time || row.readTime || '3 menit',
  isFeatured: Boolean(row.is_featured ?? row.isFeatured),
  tags: Array.isArray(row.tags) ? row.tags : [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapToSupabase = (article: Partial<Article>) => {
  const row: Record<string, any> = {};
  if (article.id !== undefined) row.id = article.id;
  if (article.title !== undefined) row.title = article.title;
  if (article.slug !== undefined) row.slug = article.slug;
  if (article.excerpt !== undefined) row.excerpt = article.excerpt;
  if (article.content !== undefined) row.content = article.content;
  if (article.category !== undefined) row.category = article.category;
  if (article.coverImage !== undefined) row.cover_image = article.coverImage;
  if (article.author !== undefined) row.author = article.author;
  if (article.date !== undefined) row.date = article.date;
  if (article.readTime !== undefined) row.read_time = article.readTime;
  if (article.isFeatured !== undefined) row.is_featured = article.isFeatured;
  if (article.tags !== undefined) row.tags = article.tags;
  row.updated_at = new Date().toISOString();
  return row;
};

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse articles from localStorage', e);
    }
    return initialArticles;
  });

  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);

  const [adminPin, setAdminPin] = useState<string>(() => {
    try {
      return localStorage.getItem(PIN_KEY) || DEFAULT_PIN;
    } catch {
      return DEFAULT_PIN;
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Sync articles to localStorage for offline cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    } catch (e) {
      console.error('Failed to save articles to localStorage', e);
    }
  }, [articles]);

  // Fetch articles from Supabase
  const refreshFromCloud = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // Table might not exist yet
        console.warn('Supabase fetch notice:', error.message);
        setIsCloudConnected(false);
        return;
      }

      if (data && data.length > 0) {
        const mapped = data.map(mapFromSupabase);
        setArticles(mapped);
        setIsCloudConnected(true);
      } else if (data && data.length === 0) {
        // Table is empty, seed with initialArticles
        setIsCloudConnected(true);
        const rowsToInsert = initialArticles.map(art => ({
          ...mapToSupabase(art),
          created_at: new Date().toISOString(),
        }));
        await supabase.from('articles').insert(rowsToInsert);
      }
    } catch (err) {
      console.error('Error connecting to Supabase:', err);
      setIsCloudConnected(false);
    }
  }, []);

  // Initial cloud fetch and real-time subscription
  useEffect(() => {
    refreshFromCloud();

    const channel = supabase
      .channel('articles-realtime-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'articles' },
        () => {
          refreshFromCloud();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsCloudConnected(true);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshFromCloud]);

  const loginAdmin = (pin: string): boolean => {
    if (pin.trim() === adminPin.trim()) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem(AUTH_KEY, 'true');
      } catch (e) {
        console.error(e);
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const updateAdminPin = (oldPin: string, newPin: string): boolean => {
    if (oldPin.trim() === adminPin.trim() && newPin.trim().length >= 4) {
      setAdminPin(newPin.trim());
      try {
        localStorage.setItem(PIN_KEY, newPin.trim());
      } catch (e) {
        console.error(e);
      }
      return true;
    }
    return false;
  };

  const generateSlug = (title: string): string => {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${baseSlug}-${Date.now().toString().slice(-4)}`;
  };

  const calculateReadTime = (content: string): string => {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 180));
    return `${minutes} menit baca`;
  };

  const addArticle = (data: ArticleInput): Article => {
    const newArticle: Article = {
      ...data,
      id: `art-${Date.now()}`,
      slug: data.slug?.trim() ? data.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') : generateSlug(data.title),
      date: data.date || new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()),
      readTime: data.readTime || calculateReadTime(data.content),
      isFeatured: data.isFeatured || false,
      tags: data.tags || ['Agang.id', data.category],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Update state immediately
    setArticles(prev => [newArticle, ...prev]);

    // Push to Supabase asynchronously
    supabase
      .from('articles')
      .insert([mapToSupabase(newArticle)])
      .then(({ error }) => {
        if (error) {
          console.warn('Failed to insert article into Supabase:', error.message);
          toast.error('Gagal simpan ke Supabase Cloud: Tabel articles belum dibuat di SQL Editor Supabase!', {
            duration: 7000
          });
        } else {
          toast.success('Artikel tersimpan ke Supabase Cloud (Online untuk semua pengunjung)!');
        }
      })
      .catch((err) => {
        console.error('Supabase insert error:', err);
      });

    return newArticle;
  };

  const updateArticle = (id: string, updated: Partial<Article>) => {
    let updatedArticle: Article | null = null;

    setArticles(prev =>
      prev.map(art => {
        if (art.id === id) {
          const merged = { ...art, ...updated };
          if (updated.content && !updated.readTime) {
            merged.readTime = calculateReadTime(updated.content);
          }
          merged.updatedAt = new Date().toISOString();
          updatedArticle = merged;
          return merged;
        }
        return art;
      })
    );

    // Push update to Supabase
    supabase
      .from('articles')
      .update(mapToSupabase(updated))
      .eq('id', id)
      .then(({ error }) => {
        if (error) {
          console.warn('Failed to update article in Supabase:', error.message);
          toast.error('Gagal update ke Supabase: Tabel articles belum dibuat di dashboard Supabase!');
        } else {
          toast.success('Pembaruan artikel tersimpan ke Supabase Cloud!');
        }
      })
      .catch((err) => {
        console.error('Supabase update error:', err);
      });
  };

  const deleteArticle = (id: string) => {
    // Delete from state immediately
    setArticles(prev => prev.filter(art => art.id !== id));

    // Delete from Supabase
    supabase
      .from('articles')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) {
          console.warn('Failed to delete article from Supabase:', error.message);
          toast.error('Gagal hapus di Supabase Cloud: Tabel articles belum dibuat!');
        } else {
          toast.success('Artikel berhasil dihapus dari Cloud Database!');
        }
      })
      .catch((err) => {
        console.error('Supabase delete error:', err);
      });
  };

  const getArticleBySlug = (slug: string): Article | undefined => {
    return articles.find(art => art.slug === slug);
  };

  const getArticleById = (id: string): Article | undefined => {
    return articles.find(art => art.id === id);
  };

  const resetToDefault = () => {
    setArticles(initialArticles);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialArticles));
    } catch (e) {
      console.error(e);
    }

    // Replace Supabase data with initial articles
    supabase
      .from('articles')
      .delete()
      .neq('id', '___none___')
      .then(async () => {
        const rows = initialArticles.map(art => ({
          ...mapToSupabase(art),
          created_at: new Date().toISOString(),
        }));
        await supabase.from('articles').insert(rows);
      })
      .catch(console.error);
  };

  return (
    <BlogContext.Provider
      value={{
        articles,
        isAdminAuthenticated,
        adminPin,
        isCloudConnected,
        addArticle,
        updateArticle,
        deleteArticle,
        getArticleBySlug,
        getArticleById,
        resetToDefault,
        loginAdmin,
        logoutAdmin,
        updateAdminPin,
        refreshFromCloud
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = (): BlogContextType => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
