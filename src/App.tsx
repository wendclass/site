import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from './components/layout/Layout';
import { Accueil } from './pages/Accueil';
import { Offres } from './pages/Offres';
import { Projets } from './pages/Projets';
import { APropos } from './pages/APropos';
import { AdminPage } from './pages/admin/AdminPage';
import { useReducedMotion } from './hooks/useReducedMotion';

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
    <AnimatePresence mode="wait">
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppRoot: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/classs');

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
