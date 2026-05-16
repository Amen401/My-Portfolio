import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-black font-sans transition-colors duration-300" id="layout-root">
      <Header />
      <main className={cn(
        "flex-1 w-full relative",
        isAdmin ? "max-w-none" : "max-w-7xl mx-auto px-4 py-8"
      )} id="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}
