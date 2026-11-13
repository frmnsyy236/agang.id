import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@/lib/analytics';

export const PageTracker: React.FC = () => {
  const location = useLocation();
  const lastTrackedPath = useRef<string>('');

  useEffect(() => {
    const currentPath = location.pathname;

    // Hindari double-tracking pada path yang sama berturut-turut dalam 1 render cycle
    if (lastTrackedPath.current === currentPath) {
      return;
    }
    lastTrackedPath.current = currentPath;

    // Tunggu sedikit agar document.title sudah terupdate oleh React Helmet
    const timer = setTimeout(() => {
      trackPageView(currentPath, document.title);
    }, 400);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
};
