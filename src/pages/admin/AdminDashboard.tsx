import React from 'react';
import {
  Inbox,
  FolderKanban,
  MessageSquareQuote,
  Sparkles,
  ArrowUpRight,
  Clock,
  Building,
  User,
  Phone,
  PlusCircle,
  Eye,
} from 'lucide-react';
import { Demande, DbProject, DbTestimonial } from '../../lib/supabase';

interface AdminDashboardProps {
  demandes: Demande[];
  projects: DbProject[];
  testimonials: DbTestimonial[];
  onNavigateTab: (tab: 'demandes' | 'projets' | 'temoignages') => void;
  onSelectDemande: (demande: Demande) => void;
  onNewProject: () => void;
  onNewTestimonial: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  demandes,
  projects,
  testimonials,
  onNavigateTab,
  onSelectDemande,
  onNewProject,
  onNewTestimonial,
}) => {
  const newDemandesCount = demandes.filter((d) => d.status === 'nouveau').length;
  const inProgressCount = demandes.filter((d) => d.status === 'en_cours').length;
  const publishedProjectsCount = projects.filter((p) => p.status === 'publie').length;
  const publishedTestimonialsCount = testimonials.filter((t) => t.status === 'publie').length;

  const recentDemandes = demandes.slice(0, 6);

  const getStatusBadge = (status: Demande['status']) => {
    switch (status) {
      case 'nouveau':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">Nouveau</span>;
      case 'en_cours':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">En cours</span>;
      case 'traite':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Traité</span>;
      case 'archive':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-500/20 text-slate-300 border border-slate-500/30">Archivé</span>;
    }
  };

  const formatProjectType = (type: string) => {
    const map: Record<string, string> = {
      logo: 'Logo & Identité',
      social: 'Social Media',
      print: 'Supports Imprimés',
      event: 'Événementiel',
      website: 'Site Web',
      unknown: 'Orientation / Conseil',
    };
    return map[type] || type;
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-ardoise via-ardoise to-violet-imperial/20 border border-violet-imperial/25 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-imperial/20 text-amethyste text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tableau de bord Class S</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-title font-semibold text-white">
            Bienvenue dans votre espace, Scott
          </h2>
          <p className="text-xs sm:text-sm text-ivoire-violet/70 font-body">
            Gérez vos demandes de devis, mettez à jour vos projets et pilotez vos retours clients.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onNewProject}
            className="px-4 py-2.5 rounded-2xl bg-violet-imperial hover:bg-violet-imperial/80 text-white text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-glow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nouveau projet</span>
          </button>
          <button
            type="button"
            onClick={onNewTestimonial}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 border border-white/10"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nouveau témoignage</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Nouvelles demandes */}
        <div
          onClick={() => onNavigateTab('demandes')}
          className="p-6 rounded-3xl bg-ardoise/70 border border-rose-500/30 shadow-lg hover:border-rose-500/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-rose-500/15 text-rose-400">
              <Inbox className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">
              À traiter
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-title font-bold text-white">
              {newDemandesCount}
            </span>
            <p className="text-xs text-ivoire-violet/70 font-body">
              {newDemandesCount > 1 ? 'Nouvelles demandes reçues' : 'Nouvelle demande reçue'}
            </p>
          </div>
        </div>

        {/* Card 2: Total demandes */}
        <div
          onClick={() => onNavigateTab('demandes')}
          className="p-6 rounded-3xl bg-ardoise/70 border border-violet-imperial/20 shadow-lg hover:border-violet-imperial/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-violet-imperial/20 text-amethyste">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-amethyste bg-violet-imperial/10 px-2 py-0.5 rounded-full">
              {inProgressCount} en cours
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-title font-bold text-white">
              {demandes.length}
            </span>
            <p className="text-xs text-ivoire-violet/70 font-body">
              Total des formulaires reçus
            </p>
          </div>
        </div>

        {/* Card 3: Projets */}
        <div
          onClick={() => onNavigateTab('projets')}
          className="p-6 rounded-3xl bg-ardoise/70 border border-violet-imperial/20 shadow-lg hover:border-violet-imperial/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-or-champagne/15 text-or-champagne">
              <FolderKanban className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-or-champagne bg-or-champagne/10 px-2 py-0.5 rounded-full">
              {publishedProjectsCount} publiés
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-title font-bold text-white">
              {projects.length}
            </span>
            <p className="text-xs text-ivoire-violet/70 font-body">
              Études de cas & Réalisations
            </p>
          </div>
        </div>

        {/* Card 4: Témoignages */}
        <div
          onClick={() => onNavigateTab('temoignages')}
          className="p-6 rounded-3xl bg-ardoise/70 border border-violet-imperial/20 shadow-lg hover:border-violet-imperial/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400">
              <MessageSquareQuote className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              {publishedTestimonialsCount} actifs
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-title font-bold text-white">
              {testimonials.length}
            </span>
            <p className="text-xs text-ivoire-violet/70 font-body">
              Retours clients certifiés
            </p>
          </div>
        </div>
      </div>

      {/* Recent Demandes Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-ardoise/70 border border-violet-imperial/20 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-title font-semibold text-white">
              Dernières demandes du formulaire
            </h3>
            <p className="text-xs text-ivoire-violet/60 font-body">
              Cliquez sur une ligne pour voir les réponses détaillées et contacter le client sur WhatsApp
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('demandes')}
            className="text-xs font-semibold text-amethyste hover:text-white flex items-center gap-1 transition-colors font-body"
          >
            <span>Voir tout ({demandes.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentDemandes.length === 0 ? (
          <div className="py-12 text-center text-ivoire-violet/40 space-y-2">
            <Inbox className="w-10 h-10 mx-auto opacity-40" />
            <p className="text-xs font-body">Aucune demande reçue pour le moment.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentDemandes.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectDemande(item)}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] px-3 rounded-2xl transition-all cursor-pointer group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    {getStatusBadge(item.status)}
                    <span className="text-xs font-semibold text-amethyste bg-violet-imperial/10 px-2 py-0.5 rounded-full font-body">
                      {formatProjectType(item.project_type)}
                    </span>
                    <span className="text-[11px] text-ivoire-violet/40 font-body">
                      {new Date(item.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white font-body pt-0.5">
                    <span className="font-semibold flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-ivoire-violet/50" />
                      {item.full_name}
                    </span>
                    <span className="text-ivoire-violet/70 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-ivoire-violet/50" />
                      {item.company_name}
                    </span>
                    <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-400" />
                      {item.whatsapp_number}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs text-ivoire-violet/50 group-hover:text-amethyste transition-colors flex items-center gap-1 font-body">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Détail</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
