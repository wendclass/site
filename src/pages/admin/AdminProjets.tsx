import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Star,
  X,
  Save,
  Layers,
} from 'lucide-react';
import { DbProject, saveProject, deleteProject } from '../../lib/supabase';

interface AdminProjetsProps {
  projects: DbProject[];
  onRefresh: () => void;
  isCreatingNew: boolean;
  onCloseNewModal: () => void;
}

export const AdminProjets: React.FC<AdminProjetsProps> = ({
  projects,
  onRefresh,
  isCreatingNew,
  onCloseNewModal,
}) => {
  const [editingProject, setEditingProject] = useState<Partial<DbProject> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Triggered when editing or creating
  React.useEffect(() => {
    if (isCreatingNew) {
      setEditingProject({
        title: '',
        slug: '',
        category: 'Branding & Identité Visuelle',
        tagline: '',
        client_goal: '',
        designed_solution: '',
        result: '',
        disclaimer: '',
        status: 'publie',
        display_order: projects.length + 1,
        gallery: [],
      });
    }
  }, [isCreatingNew, projects.length]);

  const handleEdit = (project: DbProject) => {
    setEditingProject({ ...project, gallery: [...(project.gallery || [])] });
    setSaveError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    if (!editingProject.title?.trim() || !editingProject.client_goal?.trim() || !editingProject.designed_solution?.trim()) {
      setSaveError('Veuillez remplir au moins le titre et les 3 étapes narratives.');
      return;
    }

    // Auto-generate slug if empty
    const slug =
      editingProject.slug?.trim() ||
      editingProject.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    setIsSaving(true);
    setSaveError(null);

    const result = await saveProject({
      ...editingProject,
      slug,
      hero_image: editingProject.gallery?.find((g) => g.is_hero)?.src || editingProject.gallery?.[0]?.src,
    });

    setIsSaving(false);
    if (result.success) {
      setEditingProject(null);
      onCloseNewModal();
      onRefresh();
    } else {
      setSaveError(result.error || 'Erreur lors de la sauvegarde du projet.');
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteProject(id);
    if (success) {
      setDeleteConfirmId(null);
      onRefresh();
    }
  };

  // Gallery Helpers
  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    if (!editingProject) return;

    const currentGallery = editingProject.gallery || [];
    const isFirst = currentGallery.length === 0;

    const updated = [
      ...currentGallery,
      {
        src: newImageUrl.trim(),
        caption: newImageCaption.trim() || editingProject.title || 'Visuel du projet',
        is_hero: isFirst,
        display_order: currentGallery.length + 1,
      },
    ];

    setEditingProject({ ...editingProject, gallery: updated });
    setNewImageUrl('');
    setNewImageCaption('');
  };

  const handleRemoveImage = (index: number) => {
    if (!editingProject) return;
    const currentGallery = editingProject.gallery || [];
    const updated = currentGallery.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((img) => img.is_hero)) {
      updated[0].is_hero = true;
    }
    setEditingProject({ ...editingProject, gallery: updated });
  };

  const handleSetHero = (index: number) => {
    if (!editingProject) return;
    const currentGallery = editingProject.gallery || [];
    const updated = currentGallery.map((img, i) => ({
      ...img,
      is_hero: i === index,
    }));
    setEditingProject({ ...editingProject, gallery: updated });
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    if (!editingProject) return;
    const currentGallery = [...(editingProject.gallery || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentGallery.length) return;

    const temp = currentGallery[index];
    currentGallery[index] = currentGallery[targetIndex];
    currentGallery[targetIndex] = temp;

    setEditingProject({ ...editingProject, gallery: currentGallery });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-title font-semibold text-white">
            Gestion des Projets ({projects.length})
          </h2>
          <p className="text-xs text-ivoire-violet/70 font-body">
            Ajoutez, modifiez et organisez vos études de cas et galeries d'œuvres
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditingProject({
              title: '',
              slug: '',
              category: 'Branding & Identité Visuelle',
              tagline: '',
              client_goal: '',
              designed_solution: '',
              result: '',
              disclaimer: '',
              status: 'publie',
              display_order: projects.length + 1,
              gallery: [],
            })
          }
          className="px-4 py-2.5 rounded-2xl bg-violet-imperial hover:bg-violet-imperial/80 text-white text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-glow self-start sm:self-auto font-body"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un nouveau projet</span>
        </button>
      </div>

      {/* Projects List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-5 rounded-3xl bg-ardoise/70 border border-violet-imperial/20 shadow-xl flex flex-col justify-between space-y-4 hover:border-violet-imperial/40 transition-all group"
          >
            {/* Top thumbnail & status */}
            <div className="space-y-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-onyx border border-white/10">
                <img
                  src={project.hero_image || project.gallery?.[0]?.src || '/assets/logo/logo-violet.png'}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5">
                  {project.status === 'publie' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/80 backdrop-blur-md text-[10px] font-semibold text-white uppercase tracking-wider">
                      Publié
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/80 backdrop-blur-md text-[10px] font-semibold text-white uppercase tracking-wider">
                      Brouillon
                    </span>
                  )}
                </div>

                <div className="absolute top-2.5 right-2.5 bg-onyx/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-ivoire-violet flex items-center gap-1 font-body">
                  <ImageIcon className="w-3 h-3 text-amethyste" />
                  <span>{project.gallery?.length || 0} visuels</span>
                </div>
              </div>

              {/* Title and Category */}
              <div>
                <span className="text-[11px] font-semibold text-amethyste uppercase tracking-wider block font-body">
                  {project.category}
                </span>
                <h3 className="text-lg font-title font-semibold text-white line-clamp-1 group-hover:text-amethyste transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-ivoire-violet/70 font-body line-clamp-2 mt-1">
                  {project.tagline || project.client_goal}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <span className="text-[11px] text-ivoire-violet/40 font-body">
                Ordre : #{project.display_order}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(project)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-violet-imperial/20 text-ivoire-violet hover:text-white transition-colors"
                  title="Modifier le projet"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(project.id)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-ivoire-violet hover:text-rose-400 transition-colors"
                  title="Supprimer le projet"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT PROJECT MODAL */}
      {editingProject && (
        <div
          className="fixed inset-0 z-50 bg-onyx/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => {
            setEditingProject(null);
            onCloseNewModal();
          }}
        >
          <div
            className="relative max-w-4xl w-full bg-ardoise rounded-3xl p-6 sm:p-8 border border-violet-imperial/30 shadow-2xl space-y-6 my-8 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="space-y-1">
                <h3 className="text-2xl font-title font-semibold text-white">
                  {editingProject.id ? `Modifier : ${editingProject.title}` : 'Créer une nouvelle réalisation'}
                </h3>
                <p className="text-xs text-ivoire-violet/60 font-body">
                  Renseignez les détails du projet et gérez sa galerie d'images
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingProject(null);
                  onCloseNewModal();
                }}
                className="p-2 text-ivoire-violet/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-body flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              {/* Row 1: Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ivoire-violet/90 font-body">
                    Titre du projet *
                  </label>
                  <input
                    type="text"
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    placeholder="Ex: Mon Frère, Parle"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-onyx border border-violet-imperial/20 text-white text-xs font-body focus:outline-none focus:border-amethyste"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ivoire-violet/90 font-body">
                    Catégorie *
                  </label>
                  <input
                    type="text"
                    value={editingProject.category || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    placeholder="Ex: Identité Visuelle & Campagne"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-onyx border border-violet-imperial/20 text-white text-xs font-body focus:outline-none focus:border-amethyste"
                  />
                </div>
              </div>

              {/* Row 2: Tagline */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ivoire-violet/90 font-body">
                  Accroche / Tagline synthétique
                </label>
                <input
                  type="text"
                  value={editingProject.tagline || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                  placeholder="Ex: Une identité apaisante pour libérer la parole des hommes sur la santé mentale."
                  className="w-full px-4 py-2.5 rounded-xl bg-onyx border border-violet-imperial/20 text-white text-xs font-body focus:outline-none focus:border-amethyste"
                />
              </div>

              {/* 3-Part Narrative Fields */}
              <div className="p-4 sm:p-5 rounded-2xl bg-onyx/50 border border-violet-imperial/15 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amethyste font-body block">
                  Structure narrative en 3 étapes (Prompt Maître)
                </span>

                {/* 1. But du client */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white font-body">
                    1. But du client *
                  </label>
                  <textarea
                    value={editingProject.client_goal || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, client_goal: e.target.value })}
                    placeholder="Ce que le client cherchait à accomplir avec son audience..."
                    rows={2}
                    required
                    className="w-full p-3 rounded-xl bg-onyx border border-white/10 text-white text-xs font-body focus:outline-none focus:border-amethyste"
                  />
                </div>

                {/* 2. Ce qui a été conçu */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white font-body">
                    2. Ce qui a été conçu *
                  </label>
                  <textarea
                    value={editingProject.designed_solution || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, designed_solution: e.target.value })}
                    placeholder="L'intention stratégique derrière les choix graphiques, couleurs, typographies..."
                    rows={2}
                    required
                    className="w-full p-3 rounded-xl bg-onyx border border-white/10 text-white text-xs font-body focus:outline-none focus:border-amethyste"
                  />
                </div>

                {/* 3. Résultat */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white font-body">
                    3. Résultat commercial obtenu *
                  </label>
                  <textarea
                    value={editingProject.result || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, result: e.target.value })}
                    placeholder="Impact concret constaté sur l'activité ou la perception du client..."
                    rows={2}
                    required
                    className="w-full p-3 rounded-xl bg-onyx border border-white/10 text-white text-xs font-body focus:outline-none focus:border-amethyste"
                  />
                </div>
              </div>

              {/* Optional Disclaimer (e.g. Off Day) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-amber-300/90 font-body flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Précision d'attribution optionnelle (ex: Note logo tiers / IA)</span>
                </label>
                <input
                  type="text"
                  value={editingProject.disclaimer || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, disclaimer: e.target.value })}
                  placeholder="Ex: Le logo de cet événement a été conçu par un graphiste tiers..."
                  className="w-full px-4 py-2.5 rounded-xl bg-onyx border border-amber-500/20 text-white text-xs font-body focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Status & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ivoire-violet/90 font-body">
                    Statut de publication
                  </label>
                  <select
                    value={editingProject.status || 'publie'}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        status: e.target.value as 'publie' | 'brouillon',
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-onyx border border-violet-imperial/20 text-white text-xs font-body focus:outline-none"
                  >
                    <option value="publie">Publié (Visible sur le site public)</option>
                    <option value="brouillon">Brouillon (Masqué du public)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ivoire-violet/90 font-body">
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    value={editingProject.display_order || 1}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        display_order: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    min={1}
                    className="w-full px-4 py-2.5 rounded-xl bg-onyx border border-violet-imperial/20 text-white text-xs font-body focus:outline-none"
                  />
                </div>
              </div>

              {/* GALLERY MANAGER */}
              <div className="p-4 sm:p-5 rounded-2xl bg-onyx/60 border border-violet-imperial/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amethyste" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white font-body">
                      Galerie d'œuvres du projet ({editingProject.gallery?.length || 0})
                    </span>
                  </div>
                  <span className="text-[10px] text-ivoire-violet/50 font-body">
                    L'étoile marque l'image de couverture
                  </span>
                </div>

                {/* Add new image row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 p-3 rounded-xl bg-ardoise/60 border border-white/5 items-center">
                  <div className="sm:col-span-6">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Chemin ou URL de l'image (ex: /assets/projets/72h-cj-2026/visuel.png)"
                      className="w-full px-3 py-2 rounded-lg bg-onyx border border-white/10 text-white text-xs font-body focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      value={newImageCaption}
                      onChange={(e) => setNewImageCaption(e.target.value)}
                      placeholder="Légende descriptive..."
                      className="w-full px-3 py-2 rounded-lg bg-onyx border border-white/10 text-white text-xs font-body focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="w-full py-2 px-3 rounded-lg bg-violet-imperial hover:bg-violet-imperial/80 text-white text-xs font-semibold flex items-center justify-center gap-1 font-body transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter</span>
                    </button>
                  </div>
                </div>

                {/* Gallery thumbnails list */}
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {(editingProject.gallery || []).map((img, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-onyx/80 border border-white/5 text-xs font-body"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={img.src}
                          alt={img.caption}
                          className="w-12 h-12 object-cover rounded-lg bg-onyx border border-white/10 shrink-0"
                        />
                        <div className="space-y-0.5">
                          <p className="text-white font-medium line-clamp-1">{img.caption}</p>
                          <span className="text-[10px] text-ivoire-violet/40 font-mono line-clamp-1 truncate max-w-xs block">
                            {img.src}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Hero indicator */}
                        <button
                          type="button"
                          onClick={() => handleSetHero(idx)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            img.is_hero
                              ? 'text-or-champagne bg-or-champagne/10'
                              : 'text-ivoire-violet/30 hover:text-or-champagne'
                          }`}
                          title="Définir comme image principale"
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>

                        {/* Move Up */}
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveImage(idx, 'up')}
                          className="p-1.5 rounded-lg text-ivoire-violet/50 hover:text-white disabled:opacity-20"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          disabled={idx === (editingProject.gallery?.length || 0) - 1}
                          onClick={() => handleMoveImage(idx, 'down')}
                          className="p-1.5 rounded-lg text-ivoire-violet/50 hover:text-white disabled:opacity-20"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1.5 rounded-lg text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProject(null);
                    onCloseNewModal();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-ivoire-violet font-body"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-imperial to-amethyste hover:opacity-90 text-white text-xs font-semibold flex items-center gap-2 font-body shadow-glow disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Enregistrement...' : 'Enregistrer le projet'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
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
                Confirmer la suppression
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-ivoire-violet/80 font-body leading-relaxed">
              Êtes-vous certain de vouloir supprimer ce projet et l'ensemble de ses visuels associés ? Cette action est irréversible.
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
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
