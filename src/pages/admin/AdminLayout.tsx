import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  FolderKanban,
  MessageSquareQuote,
  BarChart3,
  LogOut,
  ExternalLink,
  ShieldCheck,
  User,
} from 'lucide-react';
import { Logo } from '../../components/ui/Logo';
import { AdminSession } from '../../lib/supabase';

export type AdminTab = 'dashboard' | 'demandes' | 'projets' | 'temoignages' | 'statistiques';

interface AdminLayoutProps {
  session: AdminSession;
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  newDemandesCount: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  session,
  activeTab,
  onSelectTab,
  onLogout,
  newDemandesCount,
  children,
}) => {
  const navItems = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Tableau de bord',
      icon: LayoutDashboard,
    },
    {
      id: 'demandes' as AdminTab,
      label: 'Demandes de devis',
      icon: Inbox,
      badge: newDemandesCount > 0 ? newDemandesCount : undefined,
    },
    {
      id: 'statistiques' as AdminTab,
      label: 'Statistiques de visite',
      icon: BarChart3,
    },
    {
      id: 'projets' as AdminTab,
      label: 'Projets & Galeries',
      icon: FolderKanban,
    },
    {
      id: 'temoignages' as AdminTab,
      label: 'Témoignages clients',
      icon: MessageSquareQuote,
    },
  ];

  return (
    <div className="min-h-screen bg-onyx text-ivoire-violet flex flex-col md:flex-row font-body">
      {/* Sidebar (Desktop) / Topbar (Mobile) */}
      <aside className="w-full md:w-64 bg-ardoise/90 border-b md:border-b-0 md:border-r border-violet-imperial/20 flex flex-col justify-between p-4 sm:p-6 shrink-0 z-20">
        {/* Top brand header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Logo variant="blanc" size="sm" asLink={false} />
              <div className="flex items-center gap-1 text-[10px] text-or-champagne uppercase tracking-widest font-semibold">
                <ShieldCheck className="w-3 h-3" />
                <span>Console Admin</span>
              </div>
            </div>

            {/* View public site link */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-ivoire-violet/70 hover:text-white transition-colors"
              title="Ouvrir le site public dans un nouvel onglet"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all shrink-0 font-body ${
                    isActive
                      ? 'bg-violet-imperial text-white shadow-glow'
                      : 'text-ivoire-violet/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-white text-violet-imperial' : 'bg-rose-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User & Logout session info */}
        <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between gap-2">
          <div className="space-y-0.5 overflow-hidden">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white truncate">
              <User className="w-3.5 h-3.5 text-amethyste shrink-0" />
              <span className="truncate">Scott Nana</span>
            </div>
            <p className="text-[10px] text-ivoire-violet/40 truncate">{session.email}</p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-ivoire-violet/60 hover:text-rose-400 transition-colors shrink-0"
            title="Se déconnecter de l'administration"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
