import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BlogProvider } from '@/context/BlogContext';

import Index from './pages/Index';
import About from './pages/About';
import Promo from './pages/Promo';
import Products from './pages/Products';
import BlogPost from './pages/BlogPost';
import BlogDetail from './pages/BlogDetail';
import AdminBlog from './pages/AdminBlog';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BlogProvider>
          <Toaster />
          <Sonner position="top-center" richColors />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/promo" element={<Promo />} />
              <Route path="/products" element={<Products />} />
              <Route path="/Products" element={<Products />} />
              <Route path="/menu" element={<Products />} />
              <Route path="/blog" element={<BlogPost />} />
              <Route path="/BlogPost" element={<BlogPost />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/admin" element={<AdminBlog />} />
              <Route path="/admin/blog" element={<AdminBlog />} />
              <Route path="/admin/articles" element={<AdminBlog />} />
              <Route path="/admin/artikel" element={<AdminBlog />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </BlogProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
