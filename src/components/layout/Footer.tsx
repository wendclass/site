import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { CtaButton } from '../ui/CtaButton';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-onyx text-ivoire-violet pt-16 pb-24 sm:pb-14 border-t border-white/10 relative overflow-hidden">
      {/* Subtle background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-violet-imperial/20 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10 items-start">
          {/* Brand Column */}
          <div className="md:col-span-6 space-y-4">
            <Logo variant="blanc" size="lg" />
            <p className="text-or-champagne font-medium text-lg tracking-wide max-w-md pt-2">
              « L'identité visuelle qui vous impose »
            </p>
            <p className="text-ivoire-violet/75 text-sm sm:text-base max-w-md leading-relaxed">
              Marque personnelle de Scott Nana, Brand & Graphic Designer basé à Ouagadougou, Burkina Faso. 
              Chaque visuel est pensé stratégiquement pour capter l’attention et transformer vos prospects en clients.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-sm uppercase tracking-wider text-amethyste font-semibold font-body">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm sm:text-base font-medium">
              <li>
                <Link to="/" className="text-ivoire-violet/80 hover:text-white transition-colors py-1 inline-flex items-center min-h-[36px] sm:min-h-0">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/offres" className="text-ivoire-violet/80 hover:text-white transition-colors py-1 inline-flex items-center min-h-[36px] sm:min-h-0">
                  Offres & Formules
                </Link>
              </li>
              <li>
                <Link to="/projets" className="text-ivoire-violet/80 hover:text-white transition-colors py-1 inline-flex items-center min-h-[36px] sm:min-h-0">
                  Mes projets
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-ivoire-violet/80 hover:text-white transition-colors py-1 inline-flex items-center min-h-[36px] sm:min-h-0">
                  Blog & Analyses
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="text-ivoire-violet/80 hover:text-white transition-colors py-1 inline-flex items-center min-h-[36px] sm:min-h-0">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & CTA Column */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-sm uppercase tracking-wider text-amethyste font-semibold font-body">
              Échange direct
            </h3>
            <p className="text-sm text-ivoire-violet/75 leading-relaxed">
              Un projet en tête ? Parlons de vos objectifs et de la stratégie visuelle adaptée.
            </p>
            <CtaButton
              to="/#contact"
              variant="champagne"
              size="sm"
              icon={<ArrowUpRight className="w-4 h-4" />}
            >
              Prendre contact
            </CtaButton>

            {/* Social Icons (all with touch target >= 44x44px) */}
            <div className="pt-2">
              <span className="text-sm text-ivoire-violet/60 block mb-2.5">Réseaux & Portfolio</span>
              <div className="flex items-center gap-3">
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/in/wendclass"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-ivoire-violet/80 hover:text-white hover:bg-violet-imperial hover:border-violet-imperial transition-all duration-300 active:scale-95"
                  aria-label="LinkedIn de Scott Nana / Class S"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 1.64 1.64 1.64 1.64 0 0 0-1.64-1.64Z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://web.facebook.com/wendclass"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-ivoire-violet/80 hover:text-white hover:bg-violet-imperial hover:border-violet-imperial transition-all duration-300 active:scale-95"
                  aria-label="Facebook de Scott Nana / Class S"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>

                {/* Behance */}
                <a
                  href="https://behance.net/wendclass"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-ivoire-violet/80 hover:text-white hover:bg-violet-imperial hover:border-violet-imperial transition-all duration-300 active:scale-95"
                  aria-label="Behance de Scott Nana / Class S"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-4.085 0-6.195-2.825-6.195-6.046 0-3.414 2.378-6.064 6.002-6.064 3.705 0 5.679 2.651 5.679 6.223 0 .425-.043.914-.069 1.137h-8.835c.105 1.706 1.347 2.82 3.197 2.82 1.488 0 2.455-.706 2.868-1.57h2.459zm-8.608-4.482h6.143c-.116-1.57-1.121-2.488-2.91-2.488-1.921 0-3.036 1.07-3.233 2.488zm-8.618 7.482h-6.5v-16h6.883c3.834 0 5.867 1.83 5.867 4.908 0 1.944-.99 3.428-2.628 4.093 2.115.656 3.028 2.392 3.028 4.382 0 3.617-2.73 6.617-6.65 6.617zm-3.693-6.726h3.406c1.848 0 3.125-.794 3.125-2.448 0-1.517-1.129-2.326-2.951-2.326h-3.58v4.774zm0-6.702h3.256c1.551 0 2.766-.669 2.766-2.127 0-1.423-1.11-2.045-2.671-2.045h-3.351v4.172z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line (Section 2: Secondary floor >= 14px) */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ivoire-violet/60">
          <p>© {currentYear} Class S. Tous droits réservés.</p>
          <p className="flex items-center gap-1.5 text-ivoire-violet/70">
            Conception & identité : <span className="text-amethyste font-medium">Class S</span> — Scott Nana
          </p>
        </div>
      </div>
    </footer>
  );
};
