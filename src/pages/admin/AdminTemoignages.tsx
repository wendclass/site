import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  AlertTriangle,
  X,
  Save,
} from 'lucide-react';
import { DbTestimonial, DbProject, saveTestimonial, deleteTestimonial } from '../../lib/supabase';

interface AdminTemoignagesProps {
  testimonials: DbTestimonial[];
  projects: DbProject[];
  onRefresh: () => void;
  isCreatingNew: boolean;
  onCloseNewModal: () => void;
}

export const AdminTemoignages: React.FC<AdminTemoignagesProps> = ({
  testimonials,
  projects,
  onRefresh,
  isCreatingNew,
  onCloseNewModal,
}) => {
  const [editingTestim, setEditingTestim] = useState<Partial<DbTestimonial> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  React.useEffect(() => {
    if (isCreatingNew) {
      setEditingTestim({
        author_name: '',
        author_role_company: '',
        content: '',
        rating: 5,
        projet_id: '',
        category: 'Branding & Identité',
        impact_result: '',
        status: 'publie',
        display_order: testimonials.length + 1,
      });
    }
  }, [isCreatingNew, testimonials.length]);

  const handleEdit = (testim: DbTestimonial) => {
    setEditingTestim({ ...testim });
    setSaveError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestim) return;

    if (!editingTestim.author_name?.trim() || !editingTestim.content?.trim()) {
      setSaveError('Veuillez renseigner le nom de l’auteur et le texte du témoignage.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    const result = await saveTestimonial({
      ...editingTestim,
      projet_id: editingTestim.projet_id || undefined,
    });

    setIsSaving(false);
    if (result.success) {
      setEditingTestim(null);
      onCloseNewModal();
      onRefresh();
    } else {
      setSaveError(result.error || 'Erreur lors de l’enregistrement du témoignage.');
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteTestimonial(id);
    if (success) {
      setDeleteConfirmId(null);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-title font-semibold text-white">
            Gestion des Témoignages ({testimonials.length})
          </h2>
          <p className="text-xs text-ivoire-violet/70 font-body">
            Gérez les retours d'expérience clients affichés sur le site public
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditingTestim({
              author_name: '',
              author_role_company: '',
              content: '',
              rating: 5,
              projet_id: '',
              category: 'Branding & Identité',
              impact_result: '',
              status: 'publie',
              display_order: testimonials.length + 1,
            })
          }
          className="px-4 py-2.5 rounded-2xl bg-violet-imperial hover:bg-violet-imperial/80 text-white text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-glow self-start sm:self-auto font-body"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un témoignage</span>
        </button>
      </div>

      {/* Testimonials List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testim) => (
          <div
            key={testim.id}
            className="p-6 rounded-3xl bg-ardoise/70 border border-violet-imperial/20 shadow-xl flex flex-col justify-between space-y-4 hover:border-violet-imperial/40 transition-all group"
          >
            <div className="space-y-3">
              {/* Rating & Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-or-champagne">
                  {Array.from({ length: testim.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-or-champagne text-or-champagne" />
                  ))}
                </div>
                {testim.status === 'publie' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold uppercase tracking-wider">
                    Publié
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold uppercase tracking-wider">
                    Brouillon
                  </span>
                )}
              </div>

              {/* Quote */}
              <p className="text-xs sm:text-sm text-ivoire-violet/85 italic font-body leading-relaxed line-clamp-4">
                « {testim.content} »
              </p>

              {/* Author & Project */}
              <div className="pt-2 border-t border-white/5 space-y-1">
                <p className="text-xs font-bold text-white font-body">{testim.author_name}</p>
                <p className="text-[11px] text-ivoire-violet/50 font-body">{testim.author_role_company}</p>
                {testim.projet_id && (
                  <span className="text-[10px] text-amethyste bg-violet-imperial/15 px-2 py-0.5 rounded-md inline-block font-body mt-1">
                    Projet lié : {projects.find((p) => p.id === testim.projet_id || p.slug === testim.projet_id)?.title || testim.projet_id}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-ivoire-violet/40 font-body">
                Ordre : #{testim.display_order}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(testim)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-violet-imperial/20 text-ivoire-violet hover:text-white transition-colors"
                  title="Modifier"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(testim.id)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-ivoire-violet hover:text-rose-400 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {editingTestim && (
        <div
          className="fixed inset-0 z-50 bg-onyx/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => {
            setEditingTestim(null);
            onCloseNewModal();
          }}
        >
          <div
            className="relative max-w-xl w-full bg-ardoise rounded-3xl p-6 sm:p-8 border border-violet-imperial/30 shadow-2xl space-y-6 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-xl font-title font-semibold text-white">
                {editingTestim.id ? 'Modifier le témoignage' : 'Nouveau retour d’expérience'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingTestim(null);
                  onCloseNewModal();
                }}
                className="p-2 text-ivoire-violet/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveError && (
              <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-body flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ivoire-violet/90 font-body">
                    Nom de l’auteur *
                  </label>
                  <input
                    type="text"
                    value={editingTestim.author_name || ''}
                    onChange={(e) => setEditingTestim({ ...editingTestim, author_name: e.target.value })}
                    placeholder="Ex: Abdoul Razack"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-onyx border border-violet-imperial/20 text-white text-xs font-body focus:outline-none focus:border-amethyste"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ivoire-violet/90 font-body">
                    Rôle / Entreprise
                  </label>
                  <input
                    type="text"
                    value={editingTestim.author_role_company || ''}
                    onChange={(e) => setEditingTestim({ ...editingTestim, author_role_company: e.target.value })}
                    placeholder="Ex: Fondateur, Café Inspire"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-onyx border border-violet-imperial/20 text-white text-xs font-body focus:outline-none focus:border-amethyste"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ivoire-violet/90 font-body">
                  Citation / Contenu du témoignage *
                </label>
                <textarea
                  value={editingTestim.content || ''}
                  onChange={(e) => setEditingTestim({ ...editingTestim, content: e.target.value })}
                  placeholder="Ce que le client a retenu de l'impact du design et de la collaboration..."
                  rows={3}
                  required
                  className="w-full p-3 rounded-xl bg-onyx border border-violet-imperial/20 text-white text-xs font-body focus:outline-none focus:border-amethyste"
                />
              </div>

              {/* Linked project */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ivoire-violet/90 font-body">
                  Associer à un projet (Optionnel)
                </label>
                <select
                  value={editingTestim.projet_id || ''}
                  onChange={(e) => setEditingTestim({ ...editingTestim, projet_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-onyx border border-violet-imperial/20 text-white text-xs font-body focus:outline-none"
                >
                  <option value="">-- Aucun projet associé spécifique --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating, Status, Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ivoire-violet/90 font-body">
                    Note (étoiles)
                  </label>
                  <select
                    value={editingTestim.rating || 5}
                    onChange={(e) => setEditingTestim({ ...editingTestim, rating: parseInt(e.target.value, 10) || 5 })}
                    className="w-full px-3 py-2 rounded-xl bg-onyx border border-violet-imperial/20 text-white text-xs font-body focus:outline-none"
                  >
                    <option value={5}>5 étoiles ★★★★★</option>
                    <option value={4}>4 étoiles ★★★★☆</option>
                    <option value={3}>3 étoiles ★★★☆☆</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ivoire-violet/90 font-body">
                    Statut
                  </label>
                  <select
                    value={editingTestim.status || 'publie'}
                    onChange={(e) => setEditingTestim({ ...editingTestim, status: e.target.value as 'publie' | 'brouillon' })}
                    className="w-full px-3 py-2 rounded-xl bg-onyx border border-violet-imperial/20 text-white text-xs font-body focus:outline-none"
                  >
                    <option value="publie">Publié</option>
                    <option value="brouillon">Brouillon</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ivoire-violet/90 font-body">
                    Ordre
                  </label>
                  <input
                    type="number"
                    value={editingTestim.display_order || 1}
                    onChange={(e) => setEditingTestim({ ...editingTestim, display_order: parseInt(e.target.value, 10) || 1 })}
                    min={1}
                    className="w-full px-3 py-2 rounded-xl bg-onyx border border-violet-imperial/20 text-white text-xs font-body focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTestim(null);
                    onCloseNewModal();
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-ivoire-violet font-body"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-imperial to-amethyste hover:opacity-90 text-white text-xs font-semibold flex items-center gap-1.5 font-body shadow-glow disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Enregistrement...' : 'Enregistrer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 bg-onyx/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="max-w-md w-full bg-ardoise rounded-3xl p-6 sm:p-8 border border-rose-500/30 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 rounded-2xl bg-rose-500/15">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-title font-semibold text-white">
                Supprimer le témoignage
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-ivoire-violet/80 font-body leading-relaxed">
              Êtes-vous certain de vouloir supprimer ce témoignage ? Cette action est irréversible.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-ivoire-violet font-body"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold font-body transition-all"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
