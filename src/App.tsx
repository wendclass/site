import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from './components/layout/Layout';
import { Accueil } from './pages/Accueil';
import { Offres } from './pages/Offres';
import { Projets } from './pages/Projets';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { APropos } from './pages/APropos';
import { NotFound } from './pages/NotFound';
import { AdminPage } from './pages/admin/AdminPage';
import { useReducedMotion } from './hooks/useReducedMotion';
import { usePageTracking } from './hooks/usePageTracking';

const AnimatedPublicRoutes: React.FC = () => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  const pageVariants = {
    initial: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 8,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.2 : 0.35,
        ease: 'easeOut' as const,
      },
    },
    exit: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : -8,
      transition: {
        duration: prefersReducedMotion ? 0.15 : 0.25,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Accueil />
            </motion.div>
          }
        />
        <Route
          path="/offres"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Offres />
            </motion.div>
          }
        />
        <Route
          path="/projets"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Projets />
            </motion.div>
          }
        />
        <Route
          path="/blog"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Blog />
            </motion.div>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <BlogPost />
            </motion.div>
          }
        />
        <Route
          path="/a-propos"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <APropos />
            </motion.div>
          }
        />
        <Route
          path="*"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <NotFound />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const AppRoot: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/classs');

  // Safely track public pages anonymously
  usePageTracking();

  // Protect all images globally from right-click save and drag-and-drop
  React.useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'IMG' || target.closest('img') || target.closest('[data-protected-image]'))) {
        e.preventDefault();
      }
    };
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'IMG' || target.closest('img') || target.closest('[data-protected-image]'))) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  if (isAdminRoute) {
    return <AdminPage />;
  }

  return (
    <Layout>
      <AnimatedPublicRoutes />
    </Layout>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AppRoot />
    </Router>
  );
};

export default App;
