import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { CtaButton } from '../ui/CtaButton';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Offres', path: '/offres' },
    { name: 'Mes projets', path: '/projets' },
    { name: 'À propos', path: '/a-propos' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-header py-2.5 shadow-soft border-b border-violet-imperial/10'
          : 'bg-transparent py-3.5 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo (reduced by half) */}
        <Logo variant="violet" size="sm" />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 bg-white/70 backdrop-blur-md px-6 py-2 rounded-full border border-violet-imperial/10 shadow-sm" aria-label="Navigation principale">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-violet-imperial py-1 relative ${
                  isActive
                    ? 'text-violet-imperial font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-violet-imperial after:rounded-full'
                    : 'text-onyx/70'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <CtaButton
            to="/#contact"
            variant="primary"
            size="sm"
            icon={<ArrowUpRight className="w-4 h-4" />}
          >
            Prendre contact
          </CtaButton>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <CtaButton
            to="/#contact"
            variant="primary"
            size="sm"
            className="!px-3 !py-1.5 !text-xs"
          >
            Contact
          </CtaButton>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-onyx hover:text-violet-imperial rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-imperial"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-header border-b border-violet-imperial/15 px-6 py-6 animate-fadeIn shadow-soft-lg">
          <nav className="flex flex-col gap-4 mb-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-base py-2 font-medium transition-colors ${
                    isActive ? 'text-violet-imperial font-bold' : 'text-onyx/80'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
          <CtaButton
            to="/#contact"
            variant="primary"
            fullWidth
            size="md"
            icon={<ArrowUpRight className="w-4 h-4" />}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Prendre contact
          </CtaButton>
        </div>
      )}
    </header>
  );
};
