import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';

// Dynamic lazy import to keep game code strictly out of other pages' bundles
const RunnerGame = React.lazy(() => import('../components/game/RunnerGame'));

const GameLoadingPlaceholder: React.FC = () => (
  <div className="w-full aspect-[16/6] min-h-[260px] rounded-3xl bg-onyx/5 border border-violet-imperial/10 flex flex-col items-center justify-center space-y-3 animate-pulse">
    <div className="w-8 h-8 rounded-full border-2 border-violet-imperial/30 border-t-violet-imperial animate-spin" />
    <span className="text-xs text-onyx/60 font-body">Chargement du jeu...</span>
  </div>
);

export const NotFound: React.FC = () => {
  useSeo({
    title: 'Page introuvable | Class S',
    description: 'Page introuvable. Votre image, elle, ne devrait jamais l’être.',
    noIndex: true,
    noCanonical: true,
  });

  return (
    <main
      className="min-h-[85vh] flex flex-col justify-center py-12 md:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 font-body"
      role="main"
    >
      {/* Accessible screen-reader context */}
      <span className="sr-only">Erreur 404 : Page introuvable</span>

      {/* Main Header & Copy */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5 text-violet-imperial" />
          <span>Erreur 404 • Hors piste</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-title font-semibold text-onyx leading-[1.15] tracking-tight">
          Page introuvable. Votre image, elle, ne devrait jamais l’être.
        </h1>

        <p className="text-sm sm:text-base text-onyx/75 max-w-xl mx-auto leading-relaxed">
          L’adresse demandée n’existe pas ou a été déplacée. En attendant de retrouver votre chemin, esquivez les visuels sans âme pour les corriger avec l’identité Class S.
        </p>
      </div>

      {/* Interactive Game Scene (Lazy Loaded) */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <Suspense fallback={<GameLoadingPlaceholder />}>
          <RunnerGame />
        </Suspense>
      </div>

      {/* Immediate Exit link for visitors who do not want to play */}
      <div className="text-center pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-onyx/70 hover:text-violet-imperial transition-colors"
        >
          <Home className="w-4 h-4 text-violet-imperial" />
          <span>Ou quitter le jeu et revenir directement à l’accueil</span>
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
