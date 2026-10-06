import React, { useState } from 'react';
import {
  Inbox,
  Search,
  Filter,
  Phone,
  Building,
  User,
  Clock,
  CheckCircle2,
  MessageCircle,
  X,
  FileText,
  Save,
  ArrowUpRight,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { Demande, updateDemandeStatus, updateDemandeNotes, deleteDemande } from '../../lib/supabase';

interface AdminDemandesProps {
  demandes: Demande[];
  onRefresh: () => void;
  selectedDemande: Demande | null;
  onSelectDemande: (d: Demande | null) => void;
}

export const AdminDemandes: React.FC<AdminDemandesProps> = ({
  demandes,
  onRefresh,
  selectedDemande,
  onSelectDemande,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [internalNotes, setInternalNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesFeedback, setNotesFeedback] = useState<string | null>(null);

  // Deletion state
  const [demandeToDelete, setDemandeToDelete] = useState<Demande | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync internal notes when a demande is opened
  React.useEffect(() => {
    if (selectedDemande) {
      setInternalNotes(selectedDemande.internal_notes || '');
      setNotesFeedback(null);
    }
  }, [selectedDemande]);

  const handleStatusChange = async (id: string, newStatus: Demande['status']) => {
    const success = await updateDemandeStatus(id, newStatus);
    if (success) {
      if (selectedDemande && selectedDemande.id === id) {
        onSelectDemande({ ...selectedDemande, status: newStatus });
      }
      onRefresh();
    }
  };

  const handleConfirmDelete = async () => {
    if (!demandeToDelete) return;
    setIsDeleting(true);
    const success = await deleteDemande(demandeToDelete.id);
    setIsDeleting(false);
    if (success) {
      if (selectedDemande && selectedDemande.id === demandeToDelete.id) {
        onSelectDemande(null);
      }
      setDemandeToDelete(null);
      onRefresh();
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedDemande) return;
    setIsSavingNotes(true);
    const success = await updateDemandeNotes(selectedDemande.id, internalNotes);
    setIsSavingNotes(false);
    if (success) {
      setNotesFeedback('Note enregistrée !');
      setTimeout(() => setNotesFeedback(null), 2500);
      onSelectDemande({ ...selectedDemande, internal_notes: internalNotes });
      onRefresh();
    }
  };

  const formatProjectType = (type: string) => {
    const map: Record<string, string> = {
      logo: 'Création / Refonte de Logo',
      social: 'Social Media & Réseaux Sociaux',
      print: 'Supports Imprimés',
      event: 'Communication Événementielle',
      website: 'Site Web Vitrine',
      unknown: 'Je ne sais pas encore (Orientation)',
    };
    return map[type] || type;
  };

  const formatGoal = (goalId: string) => {
    const map: Record<string, string> = {
      more_clients: 'Attirer plus de clients',
      new_offer: 'Faire connaître un nouveau produit/service',
      stand_out: 'Me démarquer de mes concurrents',
      credibility: 'Être pris au sérieux',
      other: 'Autre besoin spécifique',
    };
    return map[goalId] || goalId;
  };

  const getStatusBadge = (status: Demande['status']) => {
    switch (status) {
      case 'nouveau':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">Nouveau</span>;
      case 'en_cours':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">En cours</span>;
      case 'traite':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Traité</span>;
      case 'archive':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-300 border border-slate-500/30">Archivé</span>;
    }
  };

  // Filtered demands
  const filteredDemandes = demandes.filter((d) => {
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchType = typeFilter === 'all' || d.project_type === typeFilter;
    const matchSearch =
      searchQuery === '' ||
      d.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.whatsapp_number.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchType && matchSearch;
  });

  // Humanized Branch Details Generator
  const renderHumanizedBranchDetails = (d: Demande) => {
    const data = d.branch_data || {};
    switch (d.project_type) {
      case 'logo':
        return (
          <div className="space-y-2">
            <span className="text-xs text-ivoire-violet/60 uppercase font-bold tracking-wider">État actuel du logo :</span>
            <p className="text-sm text-white font-medium">
              {data.hasLogo === 'yes_remake'
                ? 'Dispose déjà d’un logo, mais souhaite une refonte complète plus professionnelle'
                : 'Part de zéro, n’a pas encore de logo'}
            </p>
          </div>
        );
      case 'social':
        return (
          <div className="space-y-2">
            <span className="text-xs text-ivoire-violet/60 uppercase font-bold tracking-wider">Fréquence de publication souhaitée :</span>
            <p className="text-sm text-white font-medium">
              {data.socialFrequency === 'daily'
                ? 'Quotidienne (visuels récurrents)'
                : data.socialFrequency === 'weekly'
                ? 'Hebdomadaire (2 à 3 visuels par semaine)'
                : 'Ponctuelle / Lancement de campagne'}
            </p>
          </div>
        );
      case 'print':
        return (
          <div className="space-y-3">
            <span className="text-xs text-ivoire-violet/60 uppercase font-bold tracking-wider">Supports imprimés demandés :</span>
            <div className="flex flex-wrap gap-2">
              {(data.printItems || []).map((item: string, i: number) => (
                <span key={i} className="px-2.5 py-1 rounded-full bg-violet-imperial/20 border border-violet-imperial/30 text-xs text-amethyste">
                  {item}
                </span>
              ))}
            </div>
            {data.printOtherText && (
              <p className="text-xs text-ivoire-violet/80 bg-onyx/60 p-2.5 rounded-xl border border-white/5">
                <strong>Précisions :</strong> {data.printOtherText}
              </p>
            )}
          </div>
        );
      case 'event':
        return (
          <div className="space-y-3">
            <div>
              <span className="text-xs text-ivoire-violet/60 uppercase font-bold tracking-wider block mb-1">Échéance de l’événement :</span>
              <p className="text-sm text-white font-medium">{data.eventTiming || 'Non spécifiée'}</p>
            </div>
            {data.eventUnknown ? (
              <p className="text-xs text-amber-300 italic">Besoins exacts à cadrer ensemble lors du premier échange</p>
            ) : (
              <div className="space-y-2">
                <span className="text-xs text-ivoire-violet/60 uppercase font-bold tracking-wider block">Besoins identifiés :</span>
                <div className="flex flex-wrap gap-1.5">
                  {[...(data.eventPrintItems || []), ...(data.eventDigitalItems || [])].map((item: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 rounded-full bg-violet-imperial/20 text-xs text-amethyste">
                      {item}
                    </span>
                  ))}
                </div>
                {data.eventOtherText && (
                  <p className="text-xs text-ivoire-violet/80 bg-onyx/60 p-2 rounded-xl">
                    <strong>Note :</strong> {data.eventOtherText}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      case 'website':
        return (
          <div className="space-y-2">
            <span className="text-xs text-ivoire-violet/60 uppercase font-bold tracking-wider">Type de site internet :</span>
            <p className="text-sm text-white font-medium">
              {data.websiteType === 'onepage'
                ? 'Site One-Page (Présentation fluide et directe)'
                : data.websiteType === 'multipage'
                ? 'Site Multi-Pages (Arborescence complète)'
                : 'Refonte / Modernisation d’un site existant'}
            </p>
          </div>
        );
      default:
        return (
          <p className="text-xs text-ivoire-violet/70 italic">
            Demande d’orientation générale. Scott est invité à échanger directement sur WhatsApp.
          </p>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-title font-semibold text-white">
            Demandes reçues ({filteredDemandes.length})
          </h2>
          <p className="text-xs text-ivoire-violet/70 font-body">
            Consultez toutes les soumissions et gérez le suivi de chaque prospect
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-ivoire-violet/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, entreprise..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-ardoise/80 border border-violet-imperial/20 text-white placeholder:text-white/30 text-xs focus:outline-none focus:border-amethyste font-body"
          />
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-ardoise/50 border border-white/5">
        <div className="flex items-center gap-1.5 text-xs text-ivoire-violet/70 font-body mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>Filtres :</span>
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['all', 'nouveau', 'en_cours', 'traite', 'archive'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-full text-xs font-body transition-all ${
                statusFilter === st
                  ? 'bg-violet-imperial text-white font-semibold shadow-glow'
                  : 'bg-white/5 text-ivoire-violet/60 hover:bg-white/10'
              }`}
            >
              {st === 'all'
                ? 'Tous les statuts'
                : st === 'nouveau'
                ? 'Nouveaux'
                : st === 'en_cours'
                ? 'En cours'
                : st === 'traite'
                ? 'Traités'
                : 'Archivés'}
            </button>
          ))}
        </div>

        <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

        {/* Type filters */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-1 rounded-xl bg-onyx border border-violet-imperial/20 text-xs text-ivoire-violet font-body focus:outline-none"
        >
          <option value="all">Tous les types de projet</option>
          <option value="logo">Logo & Identité</option>
          <option value="social">Social Media</option>
          <option value="print">Supports Imprimés</option>
          <option value="event">Événementiel</option>
          <option value="website">Site Web</option>
          <option value="unknown">Orientation</option>
        </select>
      </div>

      {/* Demandes Table / List */}
      <div className="rounded-3xl bg-ardoise/70 border border-violet-imperial/20 shadow-xl overflow-hidden">
        {filteredDemandes.length === 0 ? (
          <div className="py-16 text-center text-ivoire-violet/40 space-y-2">
            <Inbox className="w-10 h-10 mx-auto opacity-40" />
            <p className="text-sm font-body">Aucune demande ne correspond à vos filtres.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredDemandes.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectDemande(item)}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-white/[0.03] transition-all cursor-pointer group"
              >
                {/* Left block */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {getStatusBadge(item.status)}
                    <span className="text-xs font-semibold text-amethyste bg-violet-imperial/10 px-2.5 py-0.5 rounded-full font-body">
                      {formatProjectType(item.project_type)}
                    </span>
                    <span className="text-[11px] text-ivoire-violet/40 font-body flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm font-body">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amethyste" />
                      {item.full_name}
                    </span>
                    <span className="text-ivoire-violet/80 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-or-champagne" />
                      {item.company_name}
                    </span>
                    <span className="text-emerald-400 font-mono text-xs flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-400" />
                      {item.whatsapp_number}
                    </span>
                  </div>
                </div>

                {/* Right quick actions */}
                <div className="flex items-center gap-3 self-end lg:self-center">
                  <a
                    href={`https://wa.me/${item.whatsapp_number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Bonjour ${item.full_name}, c'est Scott de Class S. J'ai bien reçu votre demande concernant votre projet (${formatProjectType(
                        item.project_type
                      )}) pour ${item.company_name}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all font-body"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-xl bg-violet-imperial/20 group-hover:bg-violet-imperial/40 text-amethyste text-xs font-semibold flex items-center gap-1 transition-all font-body"
                  >
                    <span>Détail</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DEMANDE DETAIL MODAL */}
      {selectedDemande && (
        <div
          className="fixed inset-0 z-50 bg-onyx/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-text overflow-y-auto"
          onClick={() => onSelectDemande(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-ardoise rounded-3xl p-6 sm:p-8 border border-violet-imperial/30 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedDemande.status)}
                  <span className="text-xs text-amethyste bg-violet-imperial/20 px-2.5 py-0.5 rounded-full font-body font-semibold">
                    {formatProjectType(selectedDemande.project_type)}
                  </span>
                </div>
                <h3 className="text-2xl font-title font-semibold text-white">
                  Demande de {selectedDemande.full_name}
                </h3>
                <p className="text-xs text-ivoire-violet/50 font-body">
                  Reçue le{' '}
                  {new Date(selectedDemande.created_at).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectDemande(null)}
                className="p-2 text-ivoire-violet/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client Coordinates Card */}
            <div className="p-4 rounded-2xl bg-onyx/70 border border-violet-imperial/20 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-or-champagne font-body block">
                Coordonnées du prospect
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-body">
                <div>
                  <span className="text-ivoire-violet/50 block">Nom complet :</span>
                  <span className="text-white font-semibold">{selectedDemande.full_name}</span>
                </div>
                <div>
                  <span className="text-ivoire-violet/50 block">Entreprise / Projet :</span>
                  <span className="text-white font-semibold">{selectedDemande.company_name}</span>
                </div>
                <div>
                  <span className="text-ivoire-violet/50 block">Numéro WhatsApp :</span>
                  <span className="text-emerald-400 font-mono font-bold">{selectedDemande.whatsapp_number}</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${selectedDemande.whatsapp_number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Bonjour ${selectedDemande.full_name}, c'est Scott de Class S. J'ai bien reçu votre demande concernant votre projet (${formatProjectType(
                      selectedDemande.project_type
                    )}) pour ${selectedDemande.company_name}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all font-body shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Ouvrir la conversation sur WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Goals section */}
            <div className="p-4 rounded-2xl bg-onyx/50 border border-white/5 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amethyste font-body block">
                Objectifs visés par le client :
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(selectedDemande.goals || []).map((goalId, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-full bg-violet-imperial/20 border border-violet-imperial/30 text-xs text-white">
                    {formatGoal(goalId)}
                  </span>
                ))}
              </div>
              {selectedDemande.goals_other && (
                <p className="text-xs text-ivoire-violet/80 bg-onyx/80 p-2.5 rounded-xl border border-white/5 mt-2">
                  <strong>Précision objectif libre :</strong> {selectedDemande.goals_other}
                </p>
              )}
            </div>

            {/* Branch specific details */}
            <div className="p-4 rounded-2xl bg-onyx/50 border border-white/5 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amethyste font-body block">
                Détails du besoin spécifique :
              </span>
              {renderHumanizedBranchDetails(selectedDemande)}
            </div>

            {/* Status change selector */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="text-xs font-bold uppercase tracking-wider text-ivoire-violet/70 block font-body">
                Modifier le statut de la demande :
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['nouveau', 'en_cours', 'traite', 'archive'] as Demande['status'][]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(selectedDemande.id, st)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold font-body transition-all border ${
                      selectedDemande.status === st
                        ? 'bg-violet-imperial text-white border-violet-imperial shadow-glow'
                        : 'bg-onyx/60 text-ivoire-violet/60 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {st === 'nouveau'
                      ? 'Nouveau'
                      : st === 'en_cours'
                      ? 'En cours'
                      : st === 'traite'
                      ? 'Traité'
                      : 'Archivé'}
                  </button>
                ))}
              </div>
            </div>

            {/* Internal notes editor */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-ivoire-violet/70 flex items-center gap-1.5 font-body">
                  <FileText className="w-3.5 h-3.5 text-or-champagne" />
                  <span>Notes internes de Scott (Privé, invisible du client) :</span>
                </label>
                {notesFeedback && (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 font-body">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {notesFeedback}
                  </span>
                )}
              </div>
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Ajouter une note sur ce prospect (ex: Devis envoyé le 12/04, rendez-vous call fixé vendredi)..."
                rows={3}
                className="w-full p-3 rounded-xl bg-onyx border border-violet-imperial/20 text-white placeholder:text-white/30 text-xs font-body focus:outline-none focus:border-amethyste"
              />
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setDemandeToDelete(selectedDemande)}
                  className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all font-body"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Supprimer définitivement cette demande</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="px-4 py-2 rounded-xl bg-violet-imperial hover:bg-violet-imperial/80 text-white text-xs font-semibold flex items-center gap-1.5 transition-all font-body disabled:opacity-50 shadow-glow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingNotes ? 'Enregistrement...' : 'Sauvegarder la note'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Permanent Deletion */}
      {demandeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-ardoise border border-rose-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-title font-semibold text-white">
                  Supprimer définitivement ?
                </h3>
                <p className="text-xs text-rose-300/80 font-body">Action irréversible</p>
              </div>
            </div>

            <p className="text-xs text-ivoire-violet/80 font-body leading-relaxed">
              Êtes-vous sûr de vouloir supprimer définitivement la demande de{' '}
              <strong className="text-white">{demandeToDelete.full_name}</strong> (
              {demandeToDelete.company_name}) ? Cette ligne sera définitivement effacée de la base de données.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDemandeToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-ivoire-violet/80 transition-colors font-body"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-2 transition-all font-body shadow-lg disabled:opacity-50"
              >
                {isDeleting ? (
                  <span>Suppression en cours...</span>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Confirmer la suppression</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
