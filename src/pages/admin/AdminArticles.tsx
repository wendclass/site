import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Search,
  X,
  Eye,
  FileCode,
  AlertTriangle,
  Globe,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  Share2,
  Upload,
  ShieldAlert,
  Loader2,
  Tag,
  BookOpen,
  Send,
  Info,
} from 'lucide-react';
import {
  DbArticle,
  saveArticle,
  deleteArticle,
  recordArticleRedirect,
} from '../../lib/supabase';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import {
  processArticleImage,
  uploadProcessedImageToStorage,
} from '../../lib/imageProcessing';
import DOMPurify from 'dompurify';
import { RUBRIQUES, getRubriqueName } from '../../config/rubriques';

interface AdminArticlesProps {
  articles: DbArticle[];
  onRefresh: () => void;
  isCreatingNew: boolean;
  onCloseNewModal: () => void;
}

const PRESET_TAGS = [
  'Identité Visuelle',
  'Stratégie de Marque',
  'Branding',
  'Typographie',
  'Création de Logo',
  'Design Graphique',
];

export const AdminArticles: React.FC<AdminArticlesProps> = ({
  articles,
  onRefresh,
  isCreatingNew,
  onCloseNewModal,
}) => {
  // Editing state
  const [editingArticle, setEditingArticle] = useState<Partial<DbArticle> | null>(null);
  const [originalArticle, setOriginalArticle] = useState<DbArticle | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [lastAutosaveTime, setLastAutosaveTime] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'publie' | 'brouillon'>('all');

  // Saving / Delete states
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteConfirmArticle, setDeleteConfirmArticle] = useState<DbArticle | null>(null);

  // Tabs inside modal (especially for mobile responsiveness)
  const [activeTab, setActiveTab] = useState<'editor' | 'previews' | 'settings'>('editor');
  const [previewSubTab, setPreviewSubTab] = useState<'serp' | 'social' | 'full'>('serp');

  // Tag chip input
  const [tagInput, setTagInput] = useState('');

  // Cover image upload state
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverProgress, setCoverProgress] = useState(0);
  const [coverStep, setCoverStep] = useState<string | null>(null);
  const [coverGainLabel, setCoverGainLabel] = useState<string | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  // Pre-publish gatekeeper modal
  const [showPublishChecklist, setShowPublishChecklist] = useState(false);

  // ----------------------------------------------------------------------------
  // SLUG GENERATION & SANITIZATION
  // ----------------------------------------------------------------------------
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
      .slice(0, 80);
  };

  // ----------------------------------------------------------------------------
  // WORDS & READING TIME CALCULATION
  // ----------------------------------------------------------------------------
  const { wordCount, readingTime, hasH2 } = useMemo(() => {
    const content = editingArticle?.content || '';
    const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = plainText ? plainText.split(' ').length : 0;
    const time = Math.max(1, Math.ceil(words / 200));
    const h2Present = /<h2\b[^>]*>/i.test(content);
    return { wordCount: words, readingTime: time, hasH2: h2Present };
  }, [editingArticle?.content]);

  // ----------------------------------------------------------------------------
  // SLUG UNIQUENESS & PUBLISHED SLUG MODIFICATION CHECK
  // ----------------------------------------------------------------------------
  const slugValidation = useMemo(() => {
    if (!editingArticle?.slug) {
      return { isDuplicate: false, isPublishedChanged: false };
    }
    const currentSlug = editingArticle.slug.trim().toLowerCase();
    const isDuplicate = articles.some(
      (a) => a.id !== editingArticle.id && a.slug.toLowerCase() === currentSlug
    );
    const isPublishedChanged =
      !!originalArticle &&
      originalArticle.status === 'publie' &&
      originalArticle.slug !== currentSlug;

    return { isDuplicate, isPublishedChanged };
  }, [editingArticle?.slug, editingArticle?.id, originalArticle, articles]);

  // ----------------------------------------------------------------------------
  // PRE-PUBLISH CHECKLIST VALIDATION
  // ----------------------------------------------------------------------------
  const checklistValidation = useMemo(() => {
    if (!editingArticle) {
      return { canPublish: false, blockers: [], warnings: [] };
    }

    const blockers: string[] = [];
    const warnings: string[] = [];

    // Blockers
    if (!editingArticle.title?.trim()) {
      blockers.push('Le titre de l\'article est obligatoire.');
    }
    if (!editingArticle.rubrique?.trim()) {
      blockers.push('La rubrique principale est obligatoire pour la publication.');
    }
    if (!editingArticle.slug?.trim()) {
      blockers.push('L\'adresse URL (slug) est obligatoire.');
    } else if (slugValidation.isDuplicate) {
      blockers.push('L\'adresse URL (slug) est déjà utilisée par un autre article.');
    }
    if (!editingArticle.cover_image?.trim()) {
      blockers.push('L\'image de couverture WebP est obligatoire.');
    } else if (!editingArticle.cover_image_alt?.trim()) {
      blockers.push('Le texte alternatif (alt) de la couverture est obligatoire.');
    }

    // Warnings (non-blocking)
    if (!editingArticle.excerpt?.trim()) {
      warnings.push('L\'extrait / résumé est vide (fortement conseillé pour le listing).');
    }
    const metaLen = (editingArticle.meta_description || '').trim().length;
    if (metaLen < 120 || metaLen > 160) {
      warnings.push(
        `La meta description fait ${metaLen} car. (recommandé : entre 120 et 160 car.).`
      );
    }
    if (wordCount > 300 && !hasH2) {
      warnings.push(
        'L\'article fait plus de 300 mots mais ne contient aucun sous-titre H2 pour aérer la lecture.'
      );
    }

    return {
      canPublish: blockers.length === 0,
      blockers,
      warnings,
    };
  }, [editingArticle, slugValidation.isDuplicate, wordCount, hasH2]);

  // ----------------------------------------------------------------------------
  // AUTOSAVE DRAFT TO LOCALSTORAGE
  // ----------------------------------------------------------------------------
  useEffect(() => {
    if (!editingArticle || !isDirty) return;

    const timer = setTimeout(() => {
      try {
        const draftKey = `class_s_draft_${editingArticle.id || 'new'}`;
        localStorage.setItem(
          draftKey,
          JSON.stringify({
            ...editingArticle,
            savedAt: new Date().toISOString(),
          })
        );
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        setLastAutosaveTime(`${hh}:${mm}`);
      } catch (err) {
        console.warn('Autosave failed:', err);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [editingArticle, isDirty]);

  // ----------------------------------------------------------------------------
  // BEFOREUNLOAD WARNING FOR UNSAVED CHANGES
  // ----------------------------------------------------------------------------
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (editingArticle && isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [editingArticle, isDirty]);

  // ----------------------------------------------------------------------------
  // EXTERNAL TRIGGER FOR NEW ARTICLE
  // ----------------------------------------------------------------------------
  useEffect(() => {
    if (isCreatingNew) {
      handleStartNew();
    }
  }, [isCreatingNew]);

  const handleStartNew = () => {
    const initial: Partial<DbArticle> = {
      title: '',
      slug: '',
      rubrique: 'identite-visuelle',
      excerpt: '',
      content: '<p>Commencez à rédiger votre analyse ici...</p>',
      cover_image: '',
      cover_image_alt: '',
      cover_image_og_jpeg: '',
      tags: ['Identité Visuelle'],
      status: 'brouillon',
      meta_description: '',
      reading_time: 1,
      word_count: 0,
    };
    setEditingArticle(initial);
    setOriginalArticle(null);
    setIsDirty(false);
    setActiveTab('editor');
    setCoverGainLabel(null);
    setSaveError(null);
  };

  const handleStartEdit = (article: DbArticle) => {
    setEditingArticle({ ...article });
    setOriginalArticle(article);
    setIsDirty(false);
    setActiveTab('editor');
    setCoverGainLabel(null);
    setSaveError(null);
  };

  const handleTitleChange = (newTitle: string) => {
    if (!editingArticle) return;
    const shouldUpdateSlug =
      !editingArticle.id ||
      !editingArticle.slug ||
      editingArticle.slug === generateSlug(editingArticle.title || '');

    setEditingArticle((prev) => ({
      ...prev,
      title: newTitle,
      slug: shouldUpdateSlug ? generateSlug(newTitle) : prev?.slug || '',
    }));
    setIsDirty(true);
  };

  // ----------------------------------------------------------------------------
  // TAG CHIPS MANAGEMENT
  // ----------------------------------------------------------------------------
  const handleAddTag = (rawTag: string) => {
    const cleaned = rawTag.trim();
    if (!cleaned || !editingArticle) return;

    const currentTags = editingArticle.tags || [];
    // Case and accent insensitive duplicate check
    const normalized = cleaned
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const exists = currentTags.some(
      (t) =>
        t
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') === normalized
    );

    if (!exists) {
      setEditingArticle({
        ...editingArticle,
        tags: [...currentTags, cleaned],
      });
      setIsDirty(true);
    }
    setTagInput('');
  };

  const handleRemoveTag = (indexToRemove: number) => {
    if (!editingArticle) return;
    setEditingArticle({
      ...editingArticle,
      tags: (editingArticle.tags || []).filter((_, idx) => idx !== indexToRemove),
    });
    setIsDirty(true);
  };

  // ----------------------------------------------------------------------------
  // COVER IMAGE UPLOAD (WEBP + OG JPEG)
  // ----------------------------------------------------------------------------
  const handleCoverFileSelect = async (file: File) => {
    setCoverUploading(true);
    setCoverError(null);
    setCoverStep('Conversion WebP et génération de la copie JPEG 1200×630...');
    setCoverProgress(20);

    try {
      // Process image: 3 WebP sizes + 1200x630 OG JPEG
      const processed = await processArticleImage(file, { isCover: true });
      setCoverGainLabel(processed.savingsLabel);
      setCoverProgress(55);
      setCoverStep('Upload vers Supabase Storage (compartiments WebP et OG JPEG)...');

      const uploaded = await uploadProcessedImageToStorage(
        processed,
        (step, progress) => {
          setCoverStep(step);
          setCoverProgress(progress);
        }
      );

      setEditingArticle((prev) => ({
        ...prev,
        cover_image: uploaded.primaryUrl,
        cover_image_og_jpeg: uploaded.ogJpegUrl,
        cover_image_srcset: uploaded.srcsetMap as any,
      }));
      setIsDirty(true);
      setCoverStep(null);
    } catch (err: any) {
      setCoverError(err.message || 'Erreur lors du traitement de l\'image de couverture.');
      setCoverStep(null);
    } finally {
      setCoverUploading(false);
    }
  };

  // ----------------------------------------------------------------------------
  // SAVE / PUBLISH ACTIONS
  // ----------------------------------------------------------------------------
  const executeSave = async (forceStatus?: 'publie' | 'brouillon') => {
    if (!editingArticle) return;

    const targetStatus = forceStatus || editingArticle.status || 'brouillon';

    // 1. If publishing, verify blockers
    if (targetStatus === 'publie') {
      if (!checklistValidation.canPublish) {
        setShowPublishChecklist(true);
        return;
      }
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      // 2. Check if slug changed on a published article -> create 301 redirect
      if (
        originalArticle &&
        originalArticle.status === 'publie' &&
        originalArticle.slug !== editingArticle.slug
      ) {
        await recordArticleRedirect(
          originalArticle.slug,
          editingArticle.slug!,
          originalArticle.id
        );
      }

      const res = await saveArticle({
        ...editingArticle,
        status: targetStatus,
        reading_time: readingTime,
        word_count: wordCount,
        meta_description:
          editingArticle.meta_description?.trim() ||
          editingArticle.excerpt?.trim().slice(0, 160),
      });

      if (res.success) {
        // Clean up draft in localStorage
        try {
          localStorage.removeItem(`class_s_draft_${editingArticle.id || 'new'}`);
        } catch (_) {}

        setIsDirty(false);
        setEditingArticle(null);
        setOriginalArticle(null);
        setShowPublishChecklist(false);
        onCloseNewModal();
        onRefresh();
      } else {
        setSaveError(res.error || 'Erreur lors de l\'enregistrement de l\'article.');
      }
    } catch (err: any) {
      setSaveError(err?.message || 'Erreur imprévue.');
    } finally {
      setIsSaving(false);
    }
  };

  // ----------------------------------------------------------------------------
  // CASCADE DELETE
  // ----------------------------------------------------------------------------
  const handleDelete = async () => {
    if (!deleteConfirmArticle) return;
    const success = await deleteArticle(deleteConfirmArticle.id, deleteConfirmArticle);
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

  // Filtered list
  const filteredArticles = articles.filter((a) => {
    const matchesFilter = filterStatus === 'all' || a.status === filterStatus;
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
            Éditeur guidé, conformité sémantique H2/H3, images WebP natives et aperçus en direct.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleStartNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-violet-imperial hover:bg-violet-imperial/90 text-white text-xs font-semibold shadow-glow transition-all active:scale-95"
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

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filterStatus === 'all'
                ? 'bg-violet-imperial text-white'
                : 'text-ivoire-violet/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Tous ({articles.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('publie')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filterStatus === 'publie'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-ivoire-violet/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Publiés ({publishedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('brouillon')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filterStatus === 'brouillon'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-ivoire-violet/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Brouillons ({draftCount})
          </button>
        </div>
      </div>

      {/* Articles Cards Grid */}
      {filteredArticles.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-ardoise/40 border border-white/5 space-y-3">
          <BookOpen className="w-10 h-10 text-ivoire-violet/30 mx-auto" />
          <h3 className="text-sm font-semibold text-white">Aucun article trouvé</h3>
          <p className="text-xs text-ivoire-violet/50 max-w-sm mx-auto">
            {searchQuery
              ? 'Aucun résultat ne correspond à votre recherche.'
              : 'Commencez par rédiger votre premier article stratégique.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((article) => {
            const isPub = article.status === 'publie';
            return (
              <div
                key={article.id}
                className="group relative rounded-3xl bg-ardoise/60 border border-white/5 hover:border-violet-imperial/40 transition-all duration-300 flex flex-col overflow-hidden shadow-soft hover:shadow-soft-lg"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video w-full bg-black/40 overflow-hidden border-b border-white/5">
                  {article.cover_image ? (
                    <img
                      src={article.cover_image}
                      alt={article.cover_image_alt || article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ivoire-violet/30 text-xs">
                      Sans image
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
                        isPub
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-amber-500/90 text-black'
                      }`}
                    >
                      {isPub ? 'Publié' : 'Brouillon'}
                    </span>
                  </div>

                  {/* Reading time */}
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[10px] text-ivoire-violet/90 flex items-center gap-1 border border-white/10">
                    <Clock className="w-3 h-3 text-amethyste" />
                    <span>{article.reading_time || 1} min</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {(article.rubrique || (article.tags && article.tags.length > 0)) && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {article.rubrique && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amethyste/20 text-amethyste border border-amethyste/30">
                            {getRubriqueName(article.rubrique)}
                          </span>
                        )}
                        {article.tags && article.tags.slice(0, 2).map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-ivoire-violet/70 border border-white/5"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <h3 className="font-serif font-bold text-white text-base leading-snug line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-xs text-ivoire-violet/60 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-ivoire-violet/40">
                      {new Date(article.published_at || article.created_at).toLocaleDateString(
                        'fr-FR',
                        { day: 'numeric', month: 'short', year: 'numeric' }
                      )}
                    </span>

                    <div className="flex items-center gap-1">
                      {isPub && (
                        <a
                          href={`/blog/${article.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-xl hover:bg-white/10 text-ivoire-violet/70 hover:text-white transition-colors"
                          title="Voir sur le site public"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => handleStartEdit(article)}
                        className="p-1.5 rounded-xl hover:bg-violet-imperial/20 text-amethyste transition-colors"
                        title="Modifier l'article"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteConfirmArticle(article)}
                        className="p-1.5 rounded-xl hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Supprimer l'article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================
          FULL EDIT / CREATE MODAL WITH GUIDED STEPS & LIVE PREVIEWS
      ======================================================================== */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div className="bg-ardoise border border-white/15 rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-y-auto flex flex-col shadow-soft-lg animate-fadeIn">
            {/* Modal Header */}
            <div className="sticky top-0 bg-ardoise/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-white/10 flex items-center justify-between z-20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-violet-imperial/30 text-amethyste">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-serif font-bold text-white">
                    {editingArticle.id ? 'Modifier l\'article' : 'Rédiger un article guidé'}
                  </h2>
                  <div className="flex items-center gap-2 text-[11px] text-ivoire-violet/50">
                    <span>
                      {wordCount} mots • {readingTime} min de lecture
                    </span>
                    {lastAutosaveTime && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-400">Enregistré à {lastAutosaveTime}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Tabs (Mobile-friendly switcher) */}
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="flex items-center bg-black/40 p-1 rounded-2xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setActiveTab('editor')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      activeTab === 'editor'
                        ? 'bg-violet-imperial text-white shadow-soft'
                        : 'text-ivoire-violet/70 hover:text-white'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Rédaction</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('previews')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      activeTab === 'previews'
                        ? 'bg-violet-imperial text-white shadow-soft'
                        : 'text-ivoire-violet/70 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Aperçus en direct</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      activeTab === 'settings'
                        ? 'bg-violet-imperial text-white shadow-soft'
                        : 'text-ivoire-violet/70 hover:text-white'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>SEO & Paramètres</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (isDirty && !window.confirm('Des modifications ne sont pas enregistrées. Voulez-vous vraiment quitter ?')) {
                      return;
                    }
                    setEditingArticle(null);
                    onCloseNewModal();
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-ivoire-violet/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Error banner */}
            {saveError && (
              <div className="m-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-6 flex-1">
              {/* TAB 1: RÉDACTION PRINCIPALE */}
              {activeTab === 'editor' && (
                <div className="space-y-6">
                  {/* Title & Slug Group */}
                  <div className="space-y-4 bg-black/30 p-4 sm:p-5 rounded-3xl border border-white/5">
                    {/* Title */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-ivoire-violet/90 flex items-center gap-1">
                          <span>Titre principal (H1 unique)</span>
                          <span className="text-red-400">*</span>
                        </label>
                        <div className="flex items-center gap-2 text-xs">
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono text-[11px] ${
                              (editingArticle.title || '').length > 60
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'text-ivoire-violet/50'
                            }`}
                          >
                            {(editingArticle.title || '').length}/60 car.
                          </span>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={editingArticle.title || ''}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Ex : Pourquoi un logo seul ne sauvera jamais votre entreprise..."
                        className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/15 text-sm sm:text-base text-white focus:outline-none focus:border-violet-imperial shadow-inner"
                      />
                      <p className="text-[11px] text-ivoire-violet/50 mt-1 flex items-center gap-1">
                        <Info className="w-3 h-3 text-amethyste" />
                        <span>C'est le seul H1 de la page publique. Ne le répétez jamais dans le corps du texte.</span>
                      </p>
                    </div>

                    {/* Rubrique Principale */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-ivoire-violet/90 flex items-center gap-1">
                          <span>Rubrique principale</span>
                          <span className="text-red-400">*</span>
                        </label>
                        <span className="text-[11px] text-amethyste font-medium">Filtre maîtrisé du blog</span>
                      </div>
                      <select
                        value={editingArticle.rubrique || ''}
                        onChange={(e) => {
                          setEditingArticle((prev) => (prev ? { ...prev, rubrique: e.target.value } : null));
                          setIsDirty(true);
                        }}
                        className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/15 text-sm sm:text-base text-white focus:outline-none focus:border-violet-imperial shadow-inner"
                      >
                        <option value="" disabled>-- Sélectionner une rubrique --</option>
                        {RUBRIQUES.map((rub) => (
                          <option key={rub.slug} value={rub.slug} className="bg-onyx text-white">
                            {rub.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-ivoire-violet/50 mt-1 flex items-center gap-1">
                        <Info className="w-3 h-3 text-amethyste" />
                        <span>La rubrique régit le filtre sur la page /blog. Les étiquettes (tags) restent libres.</span>
                      </p>
                    </div>

                    {/* Slug */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-ivoire-violet/90 flex items-center gap-1">
                          <span>Adresse URL (Slug)</span>
                          <span className="text-red-400">*</span>
                        </label>
                        <span className="text-[11px] text-ivoire-violet/40 font-mono">
                          /blog/{editingArticle.slug || 'adresse'}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={editingArticle.slug || ''}
                        onChange={(e) => {
                          setEditingArticle({ ...editingArticle, slug: generateSlug(e.target.value) });
                          setIsDirty(true);
                        }}
                        placeholder="slug-de-l-article"
                        className={`w-full px-4 py-2.5 rounded-2xl bg-black/60 border text-xs text-white font-mono focus:outline-none ${
                          slugValidation.isDuplicate
                            ? 'border-red-500 text-red-300'
                            : 'border-white/15 focus:border-violet-imperial'
                        }`}
                      />

                      {/* Duplicate warning */}
                      {slugValidation.isDuplicate && (
                        <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Cette adresse est déjà utilisée par un autre article. Veuillez la modifier.</span>
                        </p>
                      )}

                      {/* Published slug changed warning */}
                      {slugValidation.isPublishedChanged && (
                        <div className="mt-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                          <div>
                            <span className="font-semibold block">Attention : modification de l'adresse d'un article publié</span>
                            <span>
                              Une redirection 301 automatique sera créée de <code className="text-white">/blog/{originalArticle?.slug}</code> vers <code className="text-white">/blog/{editingArticle.slug}</code> pour préserver vos liens externes.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cover Image Uploader (WebP mandatory) */}
                  <div className="bg-black/30 p-4 sm:p-5 rounded-3xl border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-ivoire-violet/90 flex items-center gap-1">
                        <span>Image de couverture</span>
                        <span className="text-red-400">*</span>
                        <span className="text-[10px] text-amethyste font-normal ml-2">
                          (Toujours WebP + copie JPEG 1200×630 pour le partage)
                        </span>
                      </label>
                    </div>

                    {coverError && (
                      <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{coverError}</span>
                      </div>
                    )}

                    {editingArticle.cover_image ? (
                      <div className="space-y-3">
                        <div className="relative aspect-video w-full max-w-lg rounded-2xl overflow-hidden border border-white/15 bg-black/40 shadow-soft">
                          <img
                            src={editingArticle.cover_image}
                            alt={editingArticle.cover_image_alt || 'Couverture'}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setEditingArticle({
                                ...editingArticle,
                                cover_image: '',
                                cover_image_alt: '',
                                cover_image_og_jpeg: '',
                                cover_image_srcset: undefined,
                              });
                              setIsDirty(true);
                              setCoverGainLabel(null);
                            }}
                            className="absolute top-3 right-3 p-2 rounded-xl bg-black/70 hover:bg-rose-500 text-white transition-colors"
                            title="Supprimer la couverture"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {coverGainLabel && (
                          <p className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Optimisation WebP : {coverGainLabel}</span>
                          </p>
                        )}
                      </div>
                    ) : (
                      <div
                        onClick={() => coverFileInputRef.current?.click()}
                        className="border-2 border-dashed border-white/20 hover:border-violet-imperial/60 rounded-2xl p-6 text-center cursor-pointer bg-white/5 transition-all group max-w-lg"
                      >
                        <input
                          ref={coverFileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleCoverFileSelect(e.target.files[0]);
                          }}
                          className="hidden"
                        />
                        <div className="w-12 h-12 rounded-2xl bg-violet-imperial/20 border border-violet-imperial/40 flex items-center justify-center mx-auto mb-3 text-amethyste group-hover:scale-105 transition-transform">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div className="text-sm font-semibold text-white mb-1">
                          Choisir l'image de couverture
                        </div>
                        <p className="text-xs text-ivoire-violet/60">
                          JPEG, PNG, WebP ou GIF (max 15 Mo). Conversion automatique en WebP (3 tailles) et copie JPEG 1200×630.
                        </p>
                      </div>
                    )}

                    {/* Progress bar */}
                    {coverUploading && (
                      <div className="space-y-1.5 max-w-lg">
                        <div className="flex items-center justify-between text-xs text-ivoire-violet/70">
                          <span className="flex items-center gap-1.5">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-amethyste" />
                            <span>{coverStep}</span>
                          </span>
                          <span>{coverProgress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-violet-imperial transition-all duration-300"
                            style={{ width: `${coverProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Mandatory Alt Text for Cover */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-ivoire-violet/90 flex items-center gap-1">
                          <span>Texte alternatif (alt) de la couverture</span>
                          <span className="text-red-400">*</span>
                        </label>
                        <span className="text-[11px] text-ivoire-violet/40">
                          Obligatoire (pas d'exception pour la couverture)
                        </span>
                      </div>
                      <input
                        type="text"
                        value={editingArticle.cover_image_alt || ''}
                        onChange={(e) => {
                          setEditingArticle({ ...editingArticle, cover_image_alt: e.target.value });
                          setIsDirty(true);
                        }}
                        placeholder="Ex : Logo Scott Nana doré embossé sur papier noir mat"
                        className={`w-full px-4 py-2.5 rounded-2xl bg-black/60 border text-xs text-white focus:outline-none ${
                          !editingArticle.cover_image_alt?.trim() && editingArticle.cover_image
                            ? 'border-amber-500/80 focus:border-amber-500'
                            : 'border-white/15 focus:border-violet-imperial'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Body Content Editor */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-ivoire-violet/90 flex items-center gap-1">
                        <span>Corps de l'article</span>
                        <span className="text-red-400">*</span>
                      </label>
                      <span className="text-[11px] text-ivoire-violet/40">
                        Seuls les titres H2 et H3 sont autorisés (H1 réservé au titre).
                      </span>
                    </div>

                    <RichTextEditor
                      content={editingArticle.content || ''}
                      onChange={(html, json) => {
                        setEditingArticle((prev) => ({
                          ...prev,
                          content: html,
                          content_json: json,
                        }));
                        setIsDirty(true);
                      }}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: APERÇUS EN DIRECT (SERP & CARTE DE PARTAGE) */}
              {activeTab === 'previews' && (
                <div className="space-y-6">
                  {/* Subtabs switcher */}
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab('serp')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                        previewSubTab === 'serp'
                          ? 'bg-violet-imperial text-white'
                          : 'text-ivoire-violet/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Aperçu Google (SERP)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewSubTab('social')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                        previewSubTab === 'social'
                          ? 'bg-violet-imperial text-white'
                          : 'text-ivoire-violet/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Aperçu Partage Réseaux (1200×630)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewSubTab('full')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                        previewSubTab === 'full'
                          ? 'bg-violet-imperial text-white'
                          : 'text-ivoire-violet/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Rendu Article Complet</span>
                    </button>
                  </div>

                  {/* 1. Google SERP Preview */}
                  {previewSubTab === 'serp' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">
                          Aperçu dans les résultats de recherche Google
                        </h4>
                        <p className="text-xs text-ivoire-violet/60">
                          Tel qu'il apparaît sur ordinateur et mobile lors d'une recherche.
                        </p>
                      </div>

                      {/* Google Card Simulation */}
                      <div className="p-5 rounded-2xl bg-[#202124] border border-[#303134] max-w-2xl font-sans space-y-1.5 shadow-soft">
                        <div className="flex items-center gap-2 text-xs text-[#bdc1c6]">
                          <div className="w-5 h-5 rounded-full bg-violet-imperial flex items-center justify-center text-[10px] text-white font-bold">
                            S
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[12px] text-white font-medium">Class S</span>
                            <span className="text-[11px] text-[#bdc1c6] truncate">
                              https://www.wendclass.com/blog/{editingArticle.slug || 'adresse-de-l-article'}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-lg text-[#8ab4f8] hover:underline cursor-pointer font-normal line-clamp-1 pt-1">
                          {editingArticle.title ? `${editingArticle.title} | Class S` : 'Titre de l\'article | Class S'}
                        </h3>

                        <p className="text-xs text-[#bdc1c6] line-clamp-2 leading-relaxed">
                          {editingArticle.meta_description ||
                            editingArticle.excerpt ||
                            'Rédigez une meta description pour donner envie aux internautes de cliquer sur votre lien.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 2. Social Card (Open Graph 1200x630) */}
                  {previewSubTab === 'social' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">
                          Aperçu de la carte de partage (LinkedIn, WhatsApp, X, Facebook)
                        </h4>
                        <p className="text-xs text-ivoire-violet/60">
                          Utilise la copie JPEG 1200×630 générée automatiquement pour une compatibilité parfaite.
                        </p>
                      </div>

                      {/* Social Card Simulation */}
                      <div className="max-w-xl rounded-2xl overflow-hidden bg-[#1e1f22] border border-[#2e3035] shadow-soft font-sans">
                        <div className="aspect-[1200/630] w-full bg-black/60 relative overflow-hidden">
                          {editingArticle.cover_image_og_jpeg || editingArticle.cover_image ? (
                            <img
                              src={editingArticle.cover_image_og_jpeg || editingArticle.cover_image}
                              alt="Aperçu partage"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-white/40">
                              Aucune image de couverture sélectionnée
                            </div>
                          )}
                          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-white font-mono">
                            1200 × 630 JPEG (og:image)
                          </div>
                        </div>

                        <div className="p-4 space-y-1 bg-[#2b2d31]">
                          <span className="text-[11px] uppercase tracking-wider text-amethyste font-semibold block">
                            wendclass.com
                          </span>
                          <h4 className="font-semibold text-white text-sm line-clamp-2 leading-snug">
                            {editingArticle.title || 'Titre de votre article'}
                          </h4>
                          <p className="text-xs text-ivoire-violet/70 line-clamp-2 leading-relaxed">
                            {editingArticle.meta_description ||
                              editingArticle.excerpt ||
                              'Résumé percutant de votre publication...'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. Full Article Render */}
                  {previewSubTab === 'full' && (
                    <div className="max-w-3xl mx-auto space-y-6 bg-black/40 p-6 rounded-3xl border border-white/5">
                      <div className="space-y-2">
                        {editingArticle.tags && editingArticle.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {editingArticle.tags.map((t, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-imperial/20 text-amethyste border border-violet-imperial/30"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
                          {editingArticle.title || 'Titre de l\'article'}
                        </h1>
                        <p className="text-xs text-ivoire-violet/60">
                          Scott Nana • {readingTime} min de lecture
                        </p>
                      </div>

                      {editingArticle.excerpt && (
                        <div className="p-4 rounded-2xl bg-ardoise/80 border-l-4 border-or-champagne text-sm italic text-white/90">
                          « {editingArticle.excerpt} »
                        </div>
                      )}

                      {editingArticle.cover_image && (
                        <div className="aspect-video rounded-3xl overflow-hidden border border-white/10">
                          <img
                            src={editingArticle.cover_image}
                            alt={editingArticle.cover_image_alt || ''}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div
                        className="prose prose-invert max-w-none text-sm sm:text-base leading-relaxed text-ivoire-violet/90 font-body"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(editingArticle.content || ''),
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SEO & PARAMÈTRES */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  {/* Excerpt */}
                  <div className="bg-black/30 p-4 sm:p-5 rounded-3xl border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-ivoire-violet/90 flex items-center gap-1">
                        <span>Extrait / Résumé court (affiché dans la liste /blog)</span>
                        <span className="text-red-400">*</span>
                      </label>
                      <span
                        className={`text-xs font-mono ${
                          (editingArticle.excerpt || '').length > 160
                            ? 'text-amber-300'
                            : 'text-ivoire-violet/40'
                        }`}
                      >
                        {(editingArticle.excerpt || '').length}/160 car.
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={editingArticle.excerpt || ''}
                      onChange={(e) => {
                        setEditingArticle({ ...editingArticle, excerpt: e.target.value });
                        setIsDirty(true);
                      }}
                      placeholder="Court résumé percutant de 2 phrases donnant envie de cliquer..."
                      className="w-full px-4 py-2.5 rounded-2xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-violet-imperial leading-relaxed"
                    />
                  </div>

                  {/* Meta Description with 120-160 status */}
                  <div className="bg-black/30 p-4 sm:p-5 rounded-3xl border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-ivoire-violet/90 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-amethyste" />
                        <span>Description pour les moteurs de recherche (Meta Description)</span>
                      </label>

                      {/* 3-state badge */}
                      {(() => {
                        const len = (editingArticle.meta_description || '').length;
                        if (len === 0) {
                          return (
                            <span className="text-[11px] text-ivoire-violet/40">
                              0/160 car.
                            </span>
                          );
                        }
                        if (len < 120) {
                          return (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Trop courte ({len}/160 car.)
                            </span>
                          );
                        }
                        if (len <= 160) {
                          return (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Longueur optimale ({len}/160 car.)
                            </span>
                          );
                        }
                        return (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Trop longue ({len}/160 car.)
                          </span>
                        );
                      })()}
                    </div>

                    <input
                      type="text"
                      value={editingArticle.meta_description || ''}
                      onChange={(e) => {
                        setEditingArticle({ ...editingArticle, meta_description: e.target.value });
                        setIsDirty(true);
                      }}
                      placeholder="Texte de synthèse ciblé avec mots-clés stratégiques pour les résultats de recherche..."
                      className="w-full px-4 py-2.5 rounded-2xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-violet-imperial"
                    />
                  </div>

                  {/* Tags with Chip input */}
                  <div className="bg-black/30 p-4 sm:p-5 rounded-3xl border border-white/5 space-y-3">
                    <label className="text-xs font-semibold text-ivoire-violet/90 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amethyste" />
                      <span>Étiquettes (Tags)</span>
                    </label>

                    {/* Chips list */}
                    <div className="flex flex-wrap gap-2">
                      {(editingArticle.tags || []).map((t, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-xl text-xs font-semibold bg-violet-imperial/20 text-amethyste border border-violet-imperial/40 flex items-center gap-1.5"
                        >
                          <span>{t}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(idx)}
                            className="hover:text-white transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Tag input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            handleAddTag(tagInput);
                          }
                        }}
                        placeholder="Tapez un mot-clé puis appuyez sur Entrée ou virgule..."
                        className="flex-1 px-4 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-violet-imperial"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddTag(tagInput)}
                        disabled={!tagInput.trim()}
                        className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white disabled:opacity-40"
                      >
                        Ajouter
                      </button>
                    </div>

                    {/* Preset suggestion chips */}
                    <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-ivoire-violet/40 mr-1">Suggestions :</span>
                      {PRESET_TAGS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleAddTag(preset)}
                          className="px-2 py-0.5 rounded-lg text-[10px] bg-white/5 hover:bg-white/10 text-ivoire-violet/70 hover:text-white transition-colors"
                        >
                          + {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Publication Status & Date */}
                  <div className="bg-black/30 p-4 sm:p-5 rounded-3xl border border-white/5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-semibold text-white block">
                          Statut de l'article
                        </span>
                        <span className="text-[11px] text-ivoire-violet/50">
                          {editingArticle.status === 'publie'
                            ? 'L\'article est en ligne, indexable et visible publiquement.'
                            : 'Brouillon confidentiel, visible uniquement par vous.'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 bg-black/50 p-1 rounded-2xl border border-white/10 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingArticle({ ...editingArticle, status: 'brouillon' });
                            setIsDirty(true);
                          }}
                          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                            editingArticle.status === 'brouillon'
                              ? 'bg-amber-500/80 text-black shadow-sm'
                              : 'text-ivoire-violet/60 hover:text-white'
                          }`}
                        >
                          Brouillon
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingArticle({ ...editingArticle, status: 'publie' });
                            setIsDirty(true);
                          }}
                          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                            editingArticle.status === 'publie'
                              ? 'bg-emerald-500 text-white shadow-sm'
                              : 'text-ivoire-violet/60 hover:text-white'
                          }`}
                        >
                          Publié
                        </button>
                      </div>
                    </div>

                    {/* Published At Date */}
                    <div>
                      <label className="text-xs font-semibold text-ivoire-violet/80 block mb-1">
                        Date de publication affichée
                      </label>
                      <input
                        type="date"
                        value={
                          editingArticle.published_at
                            ? new Date(editingArticle.published_at).toISOString().split('T')[0]
                            : new Date().toISOString().split('T')[0]
                        }
                        onChange={(e) => {
                          setEditingArticle({
                            ...editingArticle,
                            published_at: new Date(e.target.value).toISOString(),
                          });
                          setIsDirty(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-violet-imperial"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Bar */}
            <div className="sticky bottom-0 bg-ardoise/95 backdrop-blur-md px-4 sm:px-6 py-4 border-t border-white/10 flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (isDirty && !window.confirm('Voulez-vous annuler vos modifications ?')) {
                      return;
                    }
                    setEditingArticle(null);
                    onCloseNewModal();
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-ivoire-violet transition-colors"
                >
                  Fermer
                </button>
              </div>

              <div className="flex items-center gap-3">
                {/* Save as draft */}
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => executeSave('brouillon')}
                  className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors disabled:opacity-40"
                >
                  Enregistrer en brouillon
                </button>

                {/* Publish with Gatekeeper Checklist */}
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => {
                    if (checklistValidation.canPublish && checklistValidation.warnings.length === 0) {
                      executeSave('publie');
                    } else {
                      setShowPublishChecklist(true);
                    }
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-violet-imperial hover:bg-violet-imperial/90 text-white text-xs font-semibold shadow-glow transition-all active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSaving ? 'Publication...' : 'Publier l\'article'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================
          PRE-PUBLISH GATEKEEPER CHECKLIST MODAL
      ======================================================================== */}
      {showPublishChecklist && editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ardoise border border-white/20 rounded-3xl p-6 max-w-lg w-full shadow-soft-lg space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amethyste" />
                <h3 className="font-serif font-bold text-lg text-white">
                  Contrôle qualité avant publication
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPublishChecklist(false)}
                className="text-ivoire-violet/60 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Blockers list */}
            {checklistValidation.blockers.length > 0 && (
              <div className="space-y-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/30">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400 block">
                  Éléments obligatoires manquants (Publication bloquée) :
                </span>
                <ul className="space-y-1.5 text-xs text-red-200 list-disc pl-4">
                  {checklistValidation.blockers.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings list */}
            {checklistValidation.warnings.length > 0 && (
              <div className="space-y-2 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  Avertissements recommandés (Non bloquants) :
                </span>
                <ul className="space-y-1.5 text-xs text-amber-200 list-disc pl-4">
                  {checklistValidation.warnings.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {checklistValidation.canPublish && checklistValidation.warnings.length === 0 && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>Tous les critères de qualité, sémantique et référencement sont validés !</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowPublishChecklist(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-ivoire-violet"
              >
                Corriger dans l'éditeur
              </button>

              <button
                type="button"
                disabled={!checklistValidation.canPublish || isSaving}
                onClick={() => executeSave('publie')}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-soft disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>
                  {checklistValidation.warnings.length > 0
                    ? 'Publier malgré les avertissements'
                    : 'Confirmer la publication'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================
          DELETE CONFIRMATION MODAL WITH CASCADE STORAGE NOTICE
      ======================================================================== */}
      {deleteConfirmArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ardoise border border-rose-500/30 rounded-3xl p-6 max-w-md w-full shadow-soft-lg space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 rounded-2xl bg-rose-500/15">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-white text-base">Supprimer définitivement ?</h3>
                <p className="text-xs text-ivoire-violet/60">
                  Supprime l'article et nettoie les fichiers images dans le stockage.
                </p>
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
