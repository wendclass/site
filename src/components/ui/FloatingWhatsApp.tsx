import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useMobileInputFocus } from '../../hooks/useMobileInputFocus';

export const FloatingWhatsApp: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const isInputFocused = useMobileInputFocus();

  const handleClick = (e: React.MouseEvent) => {
    // If already on homepage, smooth scroll to contact
    if (location.pathname === '/') {
      e.preventDefault();
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <aside
      aria-label="Assistance directe WhatsApp"
      className={`fixed bottom-[calc(env(safe-area-inset-bottom,0px)+1.25rem)] right-4 sm:right-6 z-40 flex items-center gap-3 transition-all duration-300 ${
        isInputFocused ? 'opacity-0 translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
    >
      {/* Tooltip on hover */}
      <div
        className={`hidden sm:block glass-card-dark px-3.5 py-2 rounded-2xl shadow-lg border border-white/15 text-xs text-white transition-all duration-300 pointer-events-none ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3'
        }`}
      >
        <span className="font-semibold text-or-champagne block font-body text-xs">Une question ?</span>
        <span className="text-xs text-ivoire-violet/80 font-body">Réponse directe sous 24h</span>
      </div>

      {/* Main Floating Trigger */}
      <a
        href="/#contact"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-violet-imperial via-[#7a1be8] to-amethyste text-white flex items-center justify-center shadow-soft-lg hover:shadow-glow hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-imperial/40"
        aria-label="Prendre contact sur WhatsApp ou via le formulaire"
      >
        {/* Pulse badge effect */}
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-or-champagne border-2 border-white flex items-center justify-center animate-pulse" />

        {/* WhatsApp / Message Icon */}
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white transition-transform group-hover:rotate-12" />
      </a>
    </aside>
  );
};
