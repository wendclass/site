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
    { name: 'Blog', path: '/blog' },
    { name: 'À propos', path: '/a-propos' },
  ];

  const isLinkActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-header py-2.5 shadow-soft border-b border-violet-imperial/10'
          : 'bg-transparent py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo (reduced by half) */}
        <Logo variant="violet" size="sm" />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 bg-white/70 backdrop-blur-md px-6 py-2 rounded-full border border-violet-imperial/10 shadow-sm" aria-label="Navigation principale">
          {navLinks.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-violet-imperial py-1 relative ${
                  active
                    ? 'text-violet-imperial font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-violet-imperial after:rounded-full'
                    : 'text-onyx/70'
                }`}
              >
                {link.name}
              </NavLink>
            );
          })}
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

        {/* Mobile controls (Touch target >= 44x44px everywhere) */}
        <div className="flex items-center gap-2.5 md:hidden">
          <CtaButton
            to="/#contact"
            variant="primary"
            size="sm"
            className="!px-3.5 !py-2 !text-sm min-h-[44px] flex items-center justify-center font-semibold"
          >
            Contact
          </CtaButton>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-onyx hover:text-violet-imperial rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-imperial bg-white/60 border border-violet-imperial/10 active:scale-95 transition-all"
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
          <nav className="flex flex-col gap-2 mb-6" aria-label="Menu mobile">
            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={`text-base sm:text-lg py-3 px-3 rounded-xl font-medium min-h-[44px] flex items-center transition-colors ${
                    active ? 'bg-violet-imperial/10 text-violet-imperial font-bold' : 'text-onyx/85 hover:bg-violet-imperial/5'
                  }`}
                >
                  {link.name}
                </NavLink>
              );
            })}
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
