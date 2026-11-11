import React, { createContext, useContext, useState, useEffect } from 'react';
import { Article, ArticleInput } from '@/types/blog';
import { initialArticles } from '@/data/initialArticles';

interface BlogContextType {
  articles: Article[];
  isAdminAuthenticated: boolean;
  adminPin: string;
  addArticle: (data: ArticleInput) => Article;
  updateArticle: (id: string, updated: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  getArticleBySlug: (slug: string) => Article | undefined;
  getArticleById: (id: string) => Article | undefined;
  resetToDefault: () => void;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  updateAdminPin: (oldPin: string, newPin: string) => boolean;
}

const STORAGE_KEY = 'agang_articles_v1';
const PIN_KEY = 'agang_admin_pin_v1';
const AUTH_KEY = 'agang_admin_auth_v1';
const DEFAULT_PIN = 'admin123';

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

  // Sync articles to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    } catch (e) {
      console.error('Failed to save articles to localStorage', e);
    }
  }, [articles]);

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
      tags: data.tags || ['Agang.id', data.category]
    };

    setArticles(prev => [newArticle, ...prev]);
    return newArticle;
  };

  const updateArticle = (id: string, updated: Partial<Article>) => {
    setArticles(prev =>
      prev.map(art => {
        if (art.id === id) {
          const merged = { ...art, ...updated };
          if (updated.content && !updated.readTime) {
            merged.readTime = calculateReadTime(updated.content);
          }
          return merged;
        }
        return art;
      })
    );
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(art => art.id !== id));
  };

  const getArticleBySlug = (slug: string): Article | undefined => {
    return articles.find(art => art.slug.toLowerCase() === slug.toLowerCase());
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
  };

  return (
    <BlogContext.Provider
      value={{
        articles,
        isAdminAuthenticated,
        adminPin,
        addArticle,
        updateArticle,
        deleteArticle,
        getArticleBySlug,
        getArticleById,
        resetToDefault,
        loginAdmin,
        logoutAdmin,
        updateAdminPin,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
