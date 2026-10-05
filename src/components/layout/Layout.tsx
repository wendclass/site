import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingWhatsApp } from '../ui/FloatingWhatsApp';
import { ScrollToTop } from '../ui/ScrollToTop';
import { useScrollToAnchor } from '../../hooks/useScrollToAnchor';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useScrollToAnchor();

  return (
    <div className="min-h-screen flex flex-col bg-ivoire-violet text-onyx selection:bg-violet-imperial selection:text-ivoire-violet relative">
      <Header />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <FloatingWhatsApp />
      <ScrollToTop />
      <Footer />
    </div>
  );
};
