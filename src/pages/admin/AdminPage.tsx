import React, { useState, useEffect } from 'react';
import {
  getAdminSession,
  clearAdminSession,
  AdminSession,
  Demande,
  DbProject,
  DbTestimonial,
  DbArticle,
  VisitEvent,
  fetchDemandes,
  fetchAdminProjects,
  fetchAdminTestimonials,
  fetchAdminArticles,
  fetchVisitEvents,
} from '../../lib/supabase';
import { AdminAuth } from './AdminAuth';
import { AdminLayout, AdminTab } from './AdminLayout';
import { AdminDashboard } from './AdminDashboard';
import { AdminDemandes } from './AdminDemandes';
import { AdminProjets } from './AdminProjets';
import { AdminTemoignages } from './AdminTemoignages';
import { AdminArticles } from './AdminArticles';
import { AdminStats } from './AdminStats';

export const AdminPage: React.FC = () => {
  const [session, setSession] = useState<AdminSession | null>(getAdminSession());
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [testimonials, setTestimonials] = useState<DbTestimonial[]>([]);
  const [articles, setArticles] = useState<DbArticle[]>([]);
  const [events, setEvents] = useState<VisitEvent[]>([]);

  const [selectedDemande, setSelectedDemande] = useState<Demande | null>(null);
  const [isCreatingNewProject, setIsCreatingNewProject] = useState(false);
  const [isCreatingNewTestimonial, setIsCreatingNewTestimonial] = useState(false);
  const [isCreatingNewArticle, setIsCreatingNewArticle] = useState(false);

  // Load all admin data
  const loadData = async () => {
    try {
      const [demandesData, projectsData, testimonialsData, articlesData, eventsData] = await Promise.all([
        fetchDemandes(),
        fetchAdminProjects(),
        fetchAdminTestimonials(),
        fetchAdminArticles(),
        fetchVisitEvents(),
      ]);
      setDemandes(demandesData);
      setProjects(projectsData);
      setTestimonials(testimonialsData);
      setArticles(articlesData);
      setEvents(eventsData);
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  };

  useEffect(() => {
    // Prevent search engines from indexing the admin interface
    let metaTag = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    let created = false;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = 'robots';
      document.head.appendChild(metaTag);
      created = true;
    }
    const previousContent = metaTag.getAttribute('content');
    metaTag.setAttribute('content', 'noindex, nofollow, noarchive');

    return () => {
      if (created) {
        metaTag?.remove();
      } else if (previousContent) {
        metaTag?.setAttribute('content', previousContent);
      } else {
        metaTag?.removeAttribute('content');
      }
    };
  }, []);

  useEffect(() => {
    if (session) {
      loadData();
    }
  }, [session]);

  // Handle URL query parameters (e.g. ?demande_id=...&tab=demandes) from email notification links
  useEffect(() => {
    if (session && demandes.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const targetDemandeId = urlParams.get('demande_id');
      const targetTab = urlParams.get('tab') as AdminTab | null;

      if (targetDemandeId) {
        const found = demandes.find((d) => d.id === targetDemandeId);
        if (found) {
          setSelectedDemande(found);
          setActiveTab('demandes');
          return;
        }
      }

      if (targetTab && ['dashboard', 'demandes', 'articles', 'projets', 'temoignages', 'statistiques'].includes(targetTab)) {
        setActiveTab(targetTab);
      }
    }
  }, [session, demandes]);

  // Handle logout
  const handleLogout = () => {
    clearAdminSession();
    setSession(null);
  };

  // If not authenticated, render strict double-lock login
  if (!session) {
    return <AdminAuth onAuthenticated={(newSession) => setSession(newSession)} />;
  }

  const newDemandesCount = demandes.filter((d) => d.status === 'nouveau').length;

  return (
    <AdminLayout
      session={session}
      activeTab={activeTab}
      onSelectTab={(tab) => {
        setActiveTab(tab);
        setIsCreatingNewProject(false);
        setIsCreatingNewTestimonial(false);
      }}
      onLogout={handleLogout}
      newDemandesCount={newDemandesCount}
    >
      {activeTab === 'dashboard' && (
        <AdminDashboard
          demandes={demandes}
          projects={projects}
          testimonials={testimonials}
          articles={articles}
          events={events}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onSelectDemande={(d) => {
            setSelectedDemande(d);
            setActiveTab('demandes');
          }}
          onNewProject={() => {
            setIsCreatingNewProject(true);
            setActiveTab('projets');
          }}
          onNewTestimonial={() => {
            setIsCreatingNewTestimonial(true);
            setActiveTab('temoignages');
          }}
          onNewArticle={() => {
            setIsCreatingNewArticle(true);
            setActiveTab('articles');
          }}
        />
      )}

      {activeTab === 'demandes' && (
        <AdminDemandes
          demandes={demandes}
          onRefresh={loadData}
          selectedDemande={selectedDemande}
          onSelectDemande={setSelectedDemande}
        />
      )}

      {activeTab === 'articles' && (
        <AdminArticles
          articles={articles}
          onRefresh={loadData}
          isCreatingNew={isCreatingNewArticle}
          onCloseNewModal={() => setIsCreatingNewArticle(false)}
        />
      )}

      {activeTab === 'statistiques' && (
        <AdminStats
          events={events}
          onRefresh={loadData}
        />
      )}

      {activeTab === 'projets' && (
        <AdminProjets
          projects={projects}
          onRefresh={loadData}
          isCreatingNew={isCreatingNewProject}
          onCloseNewModal={() => setIsCreatingNewProject(false)}
        />
      )}

      {activeTab === 'temoignages' && (
        <AdminTemoignages
          testimonials={testimonials}
          projects={projects}
          onRefresh={loadData}
          isCreatingNew={isCreatingNewTestimonial}
          onCloseNewModal={() => setIsCreatingNewTestimonial(false)}
        />
      )}
    </AdminLayout>
  );
};
