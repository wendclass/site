import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  Save,
  X,
  Eye,
  FileCode,
  Calendar,
  AlertTriangle,
  Globe,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { DbArticle, saveArticle, deleteArticle } from '../../lib/supabase';
import { RichTextEditor } from '../../components/admin/RichTextEditor';

interface AdminArticlesProps {
  articles: DbArticle[];
  onRefresh: () => void;
  isCreatingNew: boolean;
  onCloseNewModal: () => void;
}

export const AdminArticles: React.FC<AdminArticlesProps> = ({
  articles,
  onRefresh,
  isCreatingNew,
  onCloseNewModal,
}) => {
  const [editingArticle, setEditingArticle] = useState<Partial<DbArticle> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'publie' | 'brouillon'>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteConfirmArticle, setDeleteConfirmArticle] = useState<DbArticle | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  // Handle triggered creation from external button (e.g. dashboard)
  useEffect(() => {
    if (isCreatingNew) {
      setEditingArticle({
        title: '',
        slug: '',
        excerpt: '',
        content: '<p>Commencez à rédiger votre article ici...</p>',
        cover_image: '',
        tags: ['Identité Visuelle'],
        status: 'publie',
        meta_description: '',
      });
      setTagsInput('Identité Visuelle');
      setPreviewMode(false);
      setSaveError(null);
    }
  }, [isCreatingNew]);

  const handleStartEdit = (article: DbArticle) => {
    setEditingArticle({ ...article });
    setTagsInput((article.tags || []).join(', '));
    setPreviewMode(false);
    setSaveError(null);
  };

  const handleStartNew = () => {
    setEditingArticle({
      title: '',
      slug: '',
      excerpt: '',
      content: '<p>Commencez à rédiger votre article ici...</p>',
      cover_image: '',
      tags: ['Stratégie de Marque'],
      status: 'publie',
      meta_description: '',
    });
    setTagsInput('Stratégie de Marque');
    setPreviewMode(false);
    setSaveError(null);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (newTitle: string) => {
    if (!editingArticle) return;
    const shouldUpdateSlug = !editingArticle.id || !editingArticle.slug || editingArticle.slug === generateSlug(editingArticle.title || '');
    setEditingArticle({
      ...editingArticle,
      title: newTitle,
      slug: shouldUpdateSlug ? generateSlug(newTitle) : editingArticle.slug,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    if (!editingArticle.title?.trim()) {
      setSaveError('Le titre de l\'article est obligatoire.');
      return;
    }

    if (!editingArticle.excerpt?.trim()) {
      setSaveError('L\'extrait / résumé est obligatoire.');
      return;
    }

    if (!editingArticle.content?.trim() || editingArticle.content === '<p></p>') {
      setSaveError('Le contenu de l\'article ne peut pas être vide.');
      return;
    }

    const slug =
      editingArticle.slug?.trim() ||
      generateSlug(editingArticle.title);

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    setIsSaving(true);
    setSaveError(null);

    const res = await saveArticle({
      ...editingArticle,
      slug,
      tags: parsedTags.length > 0 ? parsedTags : ['Identité Visuelle'],
      meta_description: editingArticle.meta_description?.trim() || editingArticle.excerpt?.trim().slice(0, 160),
    });

    setIsSaving(false);
    if (res.success) {
      setEditingArticle(null);
      onCloseNewModal();
      onRefresh();
    } else {
      setSaveError(res.error || 'Erreur lors de l\'enregistrement.');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmArticle) return;
    const success = await deleteArticle(deleteConfirmArticle.id);
    if (success) {
      setDeleteConfirmArticle(null);
      if (editingArticle?.id === deleteConfirmArticle.id) {
        setEditingArticle(null);
      }
      onRefresh();
    } else {
      alert('Impossible de supprimer cet article. Veuillez réessayer.');
    }
  };

  // Filtered articles list
  const filteredArticles = articles.filter((a) => {
    const matchesFilter =
      filterStatus === 'all' || a.status === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      (a.tags && a.tags.some((t) => t.toLowerCase().includes(q)));
    return matchesFilter && matchesSearch;
  });

  const publishedCount = articles.filter((a) => a.status === 'publie').length;
  const draftCount = articles.filter((a) => a.status === 'brouillon').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-serif text-white">Articles de Blog & SEO</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-imperial/30 text-amethyste border border-violet-imperial/40">
              {articles.length} article{articles.length > 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-xs text-ivoire-violet/60 mt-1">
            Gérez vos publications, prévisualisez en direct et optimisez votre référencement Google.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleStartNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-violet-imperial hover:bg-violet-imperial/90 text-white text-xs font-semibold shadow-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Rédiger un article</span>
          </button>
        </div>
      </div>

      {/* KPI stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-ardoise/60 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-ivoire-violet/60 uppercase tracking-wider block">Total Articles</span>
            <span className="text-xl font-bold text-white font-serif">{articles.length}</span>
          </div>
          <FileText className="w-5 h-5 text-amethyste opacity-60" />
        </div>

        <div className="p-4 rounded-2xl bg-ardoise/60 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-emerald-400/80 uppercase tracking-wider block">En ligne (Publiés)</span>
            <span className="text-xl font-bold text-emerald-400 font-serif">{publishedCount}</span>
          </div>
          <Globe className="w-5 h-5 text-emerald-400 opacity-60" />
        </div>

        <div className="p-4 rounded-2xl bg-ardoise/60 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-amber-400/80 uppercase tracking-wider block">Brouillons</span>
            <span className="text-xl font-bold text-amber-400 font-serif">{draftCount}</span>
          </div>
          <Clock className="w-5 h-5 text-amber-400 opacity-60" />
        </div>
      </div>

      {/* Search and Filters toolbar */}
      <div className="p-3 rounded-2xl bg-ardoise/60 border border-white/5 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-ivoire-violet/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par titre, tag..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/30 border border-white/10 text-xs text-white placeholder-ivoire-violet/40 focus:outline-none focus:border-violet-imperial"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-ivoire-violet/40 mr-1 shrink-0" />
          {(['all', 'publie', 'brouillon'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 ${
                filterStatus === status
                  ? 'bg-violet-imperial text-white'
                  : 'bg-white/5 text-ivoire-violet/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {status === 'all'
                ? 'Tous'
                : status === 'publie'
                ? 'Publiés'
                : 'Brouillons'}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid / List */}
      {filteredArticles.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-ardoise/40 border border-white/5 space-y-3">
          <FileText className="w-10 h-10 text-ivoire-violet/30 mx-auto" />
          <p className="text-sm text-ivoire-violet/70">Aucun article ne correspond à votre recherche.</p>
          <button
            type="button"
            onClick={handleStartNew}
            className="px-4 py-2 rounded-xl bg-violet-imperial/80 text-white text-xs font-semibold hover:bg-violet-imperial transition-all"
          >
            Créer votre premier article
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((article) => {
            const isPub = article.status === 'publie';
            const displayDate = article.published_at || article.created_at;
            const formattedDate = new Date(displayDate).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={article.id}
                className="group p-4 rounded-2xl bg-ardoise/70 border border-white/10 hover:border-violet-imperial/40 transition-all flex flex-col justify-between space-y-4"
              >
                {/* Top preview: Image & Status */}
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/5">
                    {article.cover_image ? (
                      <img
                        src={article.cover_image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-ivoire-violet/30 gap-1 bg-gradient-to-br from-violet-imperial/20 to-black/60">
                        <FileText className="w-6 h-6" />
                        <span className="text-[10px]">Sans image de couverture</span>
                      </div>
                    )}

                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-sm ${
                          isPub
                            ? 'bg-emerald-500/90 text-white'
                            : 'bg-amber-500/90 text-black'
                        }`}
                      >
                        {isPub ? 'Publié' : 'Brouillon'}
                      </span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-2 text-[11px] text-ivoire-violet/50">
                    <Calendar className="w-3 h-3" />
                    <span>{formattedDate}</span>
                    <span>•</span>
                    <span className="truncate">/{article.slug}</span>
                  </div>

                  {/* Title & Excerpt */}
                  <div>
                    <h3 className="font-serif text-base font-bold text-white line-clamp-2 leading-snug group-hover:text-amethyste transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-ivoire-violet/60 line-clamp-2 mt-1.5 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {article.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-ivoire-violet/70 border border-white/5"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {isPub && (
                      <a
                        href={`/blog/${article.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-ivoire-violet/70 hover:text-white transition-colors"
                        title="Voir l'article en direct sur le site"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleStartEdit(article)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-violet-imperial/40 text-ivoire-violet/80 hover:text-white transition-colors"
                      title="Modifier cet article"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmArticle(article)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-ivoire-violet/50 hover:text-rose-400 transition-colors"
                    title="Supprimer définitivement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT / CREATE MODAL */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-ardoise border border-white/15 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col shadow-soft-lg animate-fadeIn">
            {/* Modal Header */}
            <div className="sticky top-0 bg-ardoise/95 backdrop-blur-md px-6 py-4 border-b border-white/10 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-violet-imperial/30 text-amethyste">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-white">
                    {editingArticle.id ? 'Modifier l\'article' : 'Rédiger un nouvel article'}
                  </h2>
                  <p className="text-[11px] text-ivoire-violet/50">
                    Mise en page, SEO et aperçu interactif
                  </p>
                </div>
              </div>

              {/* Mode toggle (Édition vs Aperçu) & Close */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    previewMode
                      ? 'bg-violet-imperial text-white'
                      : 'bg-white/5 text-ivoire-violet/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {previewMode ? (
                    <>
                      <FileCode className="w-3.5 h-3.5" />
                      <span>Éditeur</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Aperçu</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingArticle(null);
                    onCloseNewModal();
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-ivoire-violet/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSave} className="p-6 space-y-5 flex-1">
              {saveError && (
                <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              {previewMode ? (
                /* LIVE PREVIEW OF THE BLOG POST */
                <div className="space-y-6 bg-black/40 p-6 rounded-2xl border border-white/5">
                  <div className="max-w-2xl mx-auto space-y-4">
                    <div className="flex items-center gap-2 text-xs text-ivoire-violet/60">
                      <span className="text-or-champagne font-medium">Scott Nana</span>
                      <span>•</span>
                      <span>{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                      {editingArticle.title || 'Titre de l\'article'}
                    </h1>

                    <p className="text-sm text-ivoire-violet/80 italic border-l-2 border-or-champagne pl-4">
                      {editingArticle.excerpt || 'Chapô / Extrait court de l\'article...'}
                    </p>

                    {editingArticle.cover_image && (
                      <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 my-4">
                        <img
                          src={editingArticle.cover_image}
                          alt="Cover"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div
                      className="prose prose-invert max-w-none text-sm leading-relaxed text-ivoire-violet/90 font-body pt-4"
                      dangerouslySetInnerHTML={{ __html: editingArticle.content || '' }}
                    />
                  </div>
                </div>
              ) : (
                /* FORM FIELDS & TIPTAP EDITOR */
                <div className="space-y-4">
                  {/* Title & Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-ivoire-violet/80">
                        Titre de l'article <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={editingArticle.title || ''}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Ex : Pourquoi un logo seul ne sauvera jamais votre entreprise..."
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-imperial"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-ivoire-violet/80">
                        Slug URL <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={editingArticle.slug || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, slug: generateSlug(e.target.value) })}
                        placeholder="slug-de-l-article"
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-imperial font-mono"
                        required
                      />
                    </div>
                  </div>

                  {/* Excerpt / Chapô */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-ivoire-violet/80">
                      Extrait / Chapô (résumé pour la carte et réseaux) <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={editingArticle.excerpt || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                      placeholder="Court résumé percutant qui donne envie de cliquer (2 à 3 phrases)..."
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-imperial leading-relaxed"
                      required
                    />
                  </div>

                  {/* Cover Image & Tags */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-ivoire-violet/80">
                        Image de couverture (URL HTTPS)
                      </label>
                      <input
                        type="url"
                        value={editingArticle.cover_image || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, cover_image: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3.5 py-2 rounded-2xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-imperial"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-ivoire-violet/80 flex items-center justify-between">
                        <span>Tags (séparés par virgule)</span>
                        <span className="text-[10px] text-ivoire-violet/40">Ex: Branding, Logo</span>
                      </label>
                      <input
                        type="text"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        placeholder="Identité Visuelle, Stratégie, Design"
                        className="w-full px-3.5 py-2 rounded-2xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-imperial"
                      />
                    </div>
                  </div>

                  {/* Meta Description for SEO */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-ivoire-violet/80 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-amethyste" />
                        <span>Meta Description SEO (Google & aperçus WhatsApp)</span>
                      </label>
                      <span className="text-[10px] text-ivoire-violet/40">
                        {(editingArticle.meta_description || '').length}/160 caractères recommandés
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={170}
                      value={editingArticle.meta_description || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, meta_description: e.target.value })}
                      placeholder="Texte de description optimisé pour le référencement naturel..."
                      className="w-full px-3.5 py-2 rounded-2xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-imperial"
                    />
                  </div>

                  {/* Rich Text Editor */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-semibold text-ivoire-violet/80 flex items-center justify-between">
                      <span>Corps de l'article (Éditeur riche) <span className="text-rose-400">*</span></span>
                      <span className="text-[10px] text-ivoire-violet/40">
                        Titres H2/H3, gras, listes, citations, liens & images
                      </span>
                    </label>
                    <RichTextEditor
                      content={editingArticle.content || ''}
                      onChange={(html) => setEditingArticle({ ...editingArticle, content: html })}
                    />
                  </div>

                  {/* Status Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-black/30 border border-white/5">
                    <div>
                      <span className="text-xs font-semibold text-white block">Statut de publication</span>
                      <span className="text-[10px] text-ivoire-violet/50">
                        {editingArticle.status === 'publie'
                          ? 'Visible immédiatement pour tous les visiteurs et indexable'
                          : 'Visible uniquement depuis cette interface administrateur'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-black/50 p-1 rounded-xl border border-white/10">
                      <button
                        type="button"
                        onClick={() => setEditingArticle({ ...editingArticle, status: 'brouillon' })}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          editingArticle.status === 'brouillon'
                            ? 'bg-amber-500/80 text-black font-semibold'
                            : 'text-ivoire-violet/60 hover:text-white'
                        }`}
                      >
                        Brouillon
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingArticle({ ...editingArticle, status: 'publie' })}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          editingArticle.status === 'publie'
                            ? 'bg-emerald-500 text-white font-semibold'
                            : 'text-ivoire-violet/60 hover:text-white'
                        }`}
                      >
                        Publié
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="sticky bottom-0 bg-ardoise/95 backdrop-blur-md pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingArticle(null);
                    onCloseNewModal();
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-ivoire-violet transition-colors"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-violet-imperial hover:bg-violet-imperial/90 text-white text-xs font-semibold shadow-glow transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Enregistrement...' : 'Enregistrer l\'article'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ardoise border border-rose-500/30 rounded-3xl p-6 max-w-md w-full shadow-soft-lg space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 rounded-2xl bg-rose-500/15">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-white text-base">Supprimer définitivement ?</h3>
                <p className="text-xs text-ivoire-violet/60">Cette action est irréversible.</p>
              </div>
            </div>

            <p className="text-xs text-ivoire-violet/80 leading-relaxed bg-black/30 p-3 rounded-2xl border border-white/5">
              Êtes-vous certain de vouloir supprimer l'article : <br />
              <strong className="text-white font-serif">« {deleteConfirmArticle.title} »</strong> ?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmArticle(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-ivoire-violet transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
