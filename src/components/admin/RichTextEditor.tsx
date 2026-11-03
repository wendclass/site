import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import DOMPurify from 'dompurify';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  RemoveFormatting,
  ClipboardPaste,
  AlertTriangle,
  CheckCircle2,
  X,
  Upload,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import {
  processArticleImage,
  uploadProcessedImageToStorage,
  ProcessedImageResult,
} from '../../lib/imageProcessing';

// ==============================================================================
// CUSTOM IMAGE EXTENSION WITH ALT, SRCSET, SIZES, DIMENSIONS & CAPTION (FIGURE)
// ==============================================================================
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      alt: {
        default: '',
        parseHTML: (element) => element.getAttribute('alt') || '',
        renderHTML: (attributes) => ({
          alt: attributes.alt || '',
        }),
      },
      srcset: {
        default: null,
        parseHTML: (element) => element.getAttribute('srcset'),
        renderHTML: (attributes) =>
          attributes.srcset ? { srcset: attributes.srcset } : {},
      },
      sizes: {
        default: '(max-width: 768px) 100vw, 800px',
        parseHTML: (element) => element.getAttribute('sizes') || '(max-width: 768px) 100vw, 800px',
        renderHTML: (attributes) => ({
          sizes: attributes.sizes || '(max-width: 768px) 100vw, 800px',
        }),
      },
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute('width'),
        renderHTML: (attributes) =>
          attributes.width ? { width: attributes.width } : {},
      },
      height: {
        default: null,
        parseHTML: (element) => element.getAttribute('height'),
        renderHTML: (attributes) =>
          attributes.height ? { height: attributes.height } : {},
      },
      caption: {
        default: null,
        parseHTML: (element) => {
          const figcaption = element.closest('figure')?.querySelector('figcaption');
          return figcaption ? figcaption.textContent : element.getAttribute('data-caption');
        },
        renderHTML: (attributes) =>
          attributes.caption ? { 'data-caption': attributes.caption } : {},
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const { caption, ...imgAttrs } = HTMLAttributes;
    const baseImgClass =
      'rounded-2xl max-w-full my-4 border border-white/10 shadow-lg object-cover w-full';
    imgAttrs.class = `${baseImgClass} ${imgAttrs.class || ''}`.trim();
    imgAttrs.loading = 'lazy';
    imgAttrs.decoding = 'async';

    if (caption) {
      return [
        'figure',
        { class: 'my-6 block text-center' },
        ['img', imgAttrs],
        ['figcaption', { class: 'text-xs text-center text-ivoire-violet/60 mt-2 italic font-body' }, caption],
      ];
    }

    return ['img', imgAttrs];
  },
});

// ==============================================================================
// CLEAN PASTE HELPER (Word, Google Docs, Web pages)
// ==============================================================================
export const cleanPastedHtml = (rawHtml: string): string => {
  if (!rawHtml) return '';

  // 1. Remove Word comments and Mso styles
  let cleaned = rawHtml
    .replace(/<!--[\s\S]*?-->/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<xml[\s\S]*?<\/xml>/gi, '');

  // 2. Normalize headings (map H1 to H2, H4-H6 to H3)
  cleaned = cleaned.replace(/<h1(\b[^>]*)>/gi, '<h2$1>').replace(/<\/h1>/gi, '</h2>');
  cleaned = cleaned.replace(/<h[4-6](\b[^>]*)>/gi, '<h3$1>').replace(/<\/h[4-6]>/gi, '</h3>');

  // 3. Strict DOMPurify sanitize
  const sanitized = DOMPurify.sanitize(cleaned, {
    ALLOWED_TAGS: [
      'p',
      'h2',
      'h3',
      'strong',
      'b',
      'em',
      'i',
      'ul',
      'ol',
      'li',
      'blockquote',
      'hr',
      'a',
      'img',
      'figure',
      'figcaption',
      'br',
    ],
    ALLOWED_ATTR: [
      'href',
      'target',
      'rel',
      'src',
      'srcset',
      'sizes',
      'alt',
      'width',
      'height',
      'loading',
      'decoding',
      'data-caption',
    ],
  });

  // 4. Clean extra consecutive empty paragraphs
  return sanitized
    .replace(/(<p>\s*(?:<br\s*\/?>)?\s*<\/p>\s*){2,}/gi, '<p><br></p>')
    .trim();
};

// ==============================================================================
// HEADING HIERARCHY VALIDATION
// ==============================================================================
export interface HierarchyCheckResult {
  valid: boolean;
  warnings: string[];
}

export const checkHeadingHierarchy = (editor: Editor | null): HierarchyCheckResult => {
  if (!editor) return { valid: true, warnings: [] };
  const warnings: string[] = [];
  let hasH2 = false;
  let previousWasEmpty = false;

  editor.state.doc.descendants((node) => {
    if (node.type.name === 'heading') {
      const level = node.attrs.level;
      const text = node.textContent.trim();

      if (!text) {
        warnings.push(`Un sous-titre H${level} est vide.`);
      }

      if (level === 2) {
        hasH2 = true;
      } else if (level === 3 && !hasH2) {
        if (!warnings.includes('Un sous-titre H3 est utilisé avant tout sous-titre H2.')) {
          warnings.push('Un sous-titre H3 est utilisé avant tout sous-titre H2.');
        }
      }

      if (previousWasEmpty && !text) {
        if (!warnings.includes('Deux sous-titres consécutifs sont vides.')) {
          warnings.push('Deux sous-titres consécutifs sont vides.');
        }
      }

      previousWasEmpty = !text;
    } else if (node.isText && node.text?.trim()) {
      previousWasEmpty = false;
    }
  });

  return {
    valid: warnings.length === 0,
    warnings,
  };
};

// ==============================================================================
// PROPS INTERFACE
// ==============================================================================
interface RichTextEditorProps {
  content: string;
  onChange: (html: string, json?: any) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
}) => {
  // Modal states
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkNofollow, setLinkNofollow] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [isDecorative, setIsDecorative] = useState(false);
  const [imageProcessingStep, setImageProcessingStep] = useState<string | null>(null);
  const [imageProgress, setImageProgress] = useState(0);
  const [imageProcessedResult, setImageProcessedResult] = useState<ProcessedImageResult | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const [hierarchy, setHierarchy] = useState<HierarchyCheckResult>({ valid: true, warnings: [] });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Tiptap Editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3], // strictly H2 and H3 only! No H1 or H4+
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-amethyste underline hover:text-white transition-colors',
        },
      }),
      CustomImage,
    ],
    content,
    editorProps: {
      attributes: {
        class:
          'min-h-[320px] max-h-[600px] overflow-y-auto px-4 py-4 text-sm sm:text-base text-ivoire-violet focus:outline-none prose prose-invert max-w-none leading-relaxed font-body focus:ring-0',
      },
      transformPastedHTML: (html) => cleanPastedHtml(html),
    },
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      const json = ed.getJSON();
      onChange(html, json);
      setHierarchy(checkHeadingHierarchy(ed));
    },
  });

  // Sync content when changed from outside
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
      setHierarchy(checkHeadingHierarchy(editor));
    }
  }, [content, editor]);

  // Initial hierarchy check
  useEffect(() => {
    if (editor) {
      setHierarchy(checkHeadingHierarchy(editor));
    }
  }, [editor]);

  // ----------------------------------------------------------------------------
  // LINK MODAL LOGIC
  // ----------------------------------------------------------------------------
  const openLinkModal = () => {
    if (!editor) return;
    const attrs = editor.getAttributes('link');
    setLinkUrl(attrs.href || '');
    setLinkNofollow(attrs.rel?.includes('nofollow') || false);
    setLinkError(null);
    setIsLinkModalOpen(true);
  };

  const handleApplyLink = () => {
    if (!editor) return;
    let url = linkUrl.trim();

    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      setIsLinkModalOpen(false);
      return;
    }

    // Safety checks against dangerous schemes
    const lower = url.toLowerCase();
    if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:')) {
      setLinkError('Les protocoles dangereux (javascript:, data:) sont strictement interdits.');
      return;
    }

    // Auto prepend https:// if missing schema and not relative or mailto
    if (
      !url.startsWith('https://') &&
      !url.startsWith('http://') &&
      !url.startsWith('mailto:') &&
      !url.startsWith('/') &&
      !url.startsWith('#')
    ) {
      url = `https://${url}`;
    }

    const isExternal = url.startsWith('http://') || url.startsWith('https://');
    let rel = isExternal ? 'noopener noreferrer' : '';
    if (linkNofollow) {
      rel = rel ? `${rel} nofollow` : 'nofollow';
    }

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({
        href: url,
        target: isExternal ? '_blank' : undefined,
        rel: rel || undefined,
      })
      .run();

    setIsLinkModalOpen(false);
  };

  const handleRemoveLink = () => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setIsLinkModalOpen(false);
  };

  // ----------------------------------------------------------------------------
  // IMAGE MODAL & CONVERSION LOGIC
  // ----------------------------------------------------------------------------
  const openImageModal = () => {
    setImageAlt('');
    setImageCaption('');
    setIsDecorative(false);
    setImageProcessingStep(null);
    setImageProgress(0);
    setImageProcessedResult(null);
    setImageError(null);
    setIsImageModalOpen(true);
  };

  const handleFileSelect = async (file: File) => {
    setImageError(null);
    setImageProcessingStep('Conversion WebP et calcul des dimensions...');
    setImageProgress(25);

    try {
      const processed = await processArticleImage(file, { isCover: false });
      setImageProcessedResult(processed);
      setImageProgress(60);
      setImageProcessingStep('Image convertie avec succès en WebP !');
    } catch (err: any) {
      setImageError(err.message || 'Erreur lors de la conversion de l\'image.');
      setImageProcessingStep(null);
      setImageProcessedResult(null);
    }
  };

  const handleInsertProcessedImage = async () => {
    if (!editor || !imageProcessedResult) return;

    if (!isDecorative && !imageAlt.trim()) {
      setImageError('Le texte alternatif (alt) est obligatoire pour l\'accessibilité et le référencement (ou cochez "Image purement décorative").');
      return;
    }

    try {
      setImageProcessingStep('Upload vers Supabase Storage...');
      setImageProgress(75);

      const uploaded = await uploadProcessedImageToStorage(
        imageProcessedResult,
        (step, progress) => {
          setImageProcessingStep(step);
          setImageProgress(progress);
        }
      );

      const finalAlt = isDecorative ? '' : imageAlt.trim();
      const primaryVariant = imageProcessedResult.primaryVariant;

      // Insert image via Tiptap custom image attributes
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'image',
          attrs: {
            src: uploaded.primaryUrl,
            srcset: uploaded.srcsetString,
            sizes: '(max-width: 768px) 100vw, 800px',
            alt: finalAlt,
            caption: imageCaption.trim() || null,
            width: primaryVariant.width,
            height: primaryVariant.height,
          },
        })
        .run();

      setIsImageModalOpen(false);
    } catch (err: any) {
      setImageError(err.message || 'Erreur lors du téléversement de l\'image.');
    }
  };

  // ----------------------------------------------------------------------------
  // PASTE AS PLAIN TEXT
  // ----------------------------------------------------------------------------
  const handlePastePlainText = async () => {
    if (!editor) return;
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        const paragraphs = text
          .split(/\n\s*\n/)
          .filter((p) => p.trim())
          .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
          .join('');
        editor.commands.insertContent(paragraphs);
      }
    } catch (e) {
      console.warn('Clipboard read permission denied or unavailable:', e);
    }
  };

  if (!editor) {
    return <div className="h-44 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden focus-within:border-violet-imperial/60 transition-colors shadow-soft">
      {/* ----------------- Toolbar ----------------- */}
      <div className="flex items-center justify-between flex-wrap gap-1 p-2 bg-white/5 border-b border-white/10 text-ivoire-violet/80">
        {/* Scrollable button groups for mobile */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {/* Paragraph */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              editor.isActive('paragraph') && !editor.isActive('heading')
                ? 'bg-violet-imperial text-white'
                : 'hover:bg-white/10 hover:text-white'
            }`}
            title="Paragraphe normal"
          >
            P
          </button>

          {/* Heading 2 */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-violet-imperial text-white'
                : 'hover:bg-white/10 hover:text-white'
            }`}
            title="Titre de section (H2)"
          >
            <Heading2 className="w-4 h-4" />
          </button>

          {/* Heading 3 */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ${
              editor.isActive('heading', { level: 3 })
                ? 'bg-violet-imperial text-white'
                : 'hover:bg-white/10 hover:text-white'
            }`}
            title="Sous-titre (H3)"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-white/10 mx-1 flex-shrink-0" />

          {/* Bold */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              editor.isActive('bold')
                ? 'bg-violet-imperial text-white'
                : 'hover:bg-white/10 hover:text-white'
            }`}
            title="Gras (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              editor.isActive('italic')
                ? 'bg-violet-imperial text-white'
                : 'hover:bg-white/10 hover:text-white'
            }`}
            title="Italique (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-white/10 mx-1 flex-shrink-0" />

          {/* Bullet List */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              editor.isActive('bulletList')
                ? 'bg-violet-imperial text-white'
                : 'hover:bg-white/10 hover:text-white'
            }`}
            title="Liste à puces"
          >
            <List className="w-4 h-4" />
          </button>

          {/* Ordered List */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              editor.isActive('orderedList')
                ? 'bg-violet-imperial text-white'
                : 'hover:bg-white/10 hover:text-white'
            }`}
            title="Liste numérotée"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          {/* Blockquote */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              editor.isActive('blockquote')
                ? 'bg-violet-imperial text-white'
                : 'hover:bg-white/10 hover:text-white'
            }`}
            title="Citation"
          >
            <Quote className="w-4 h-4" />
          </button>

          {/* Horizontal Rule */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-1.5 rounded-lg text-xs hover:bg-white/10 hover:text-white transition-colors"
            title="Séparateur horizontal (hr)"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-white/10 mx-1 flex-shrink-0" />

          {/* Link Modal trigger */}
          <button
            type="button"
            onClick={openLinkModal}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              editor.isActive('link')
                ? 'bg-violet-imperial text-white'
                : 'hover:bg-white/10 hover:text-white'
            }`}
            title="Insérer ou modifier un lien"
          >
            <LinkIcon className="w-4 h-4" />
          </button>

          {/* Image Modal trigger */}
          <button
            type="button"
            onClick={openImageModal}
            className="p-1.5 rounded-lg text-xs hover:bg-violet-imperial/40 hover:text-white text-amethyste transition-colors flex items-center gap-1 font-medium"
            title="Insérer une image WebP avec alt et légende"
          >
            <ImageIcon className="w-4 h-4" />
            <span className="text-[11px] hidden sm:inline">Image WebP</span>
          </button>

          <div className="w-px h-5 bg-white/10 mx-1 flex-shrink-0" />

          {/* Paste as plain text */}
          <button
            type="button"
            onClick={handlePastePlainText}
            className="p-1.5 rounded-lg text-xs hover:bg-white/10 hover:text-white transition-colors"
            title="Coller sans mise en forme"
          >
            <ClipboardPaste className="w-4 h-4" />
          </button>

          {/* Clear formatting */}
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            className="p-1.5 rounded-lg text-xs hover:bg-white/10 hover:text-white transition-colors"
            title="Effacer le formatage"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-white/10 mx-1 flex-shrink-0" />

          {/* Undo */}
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 rounded-lg text-xs hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Annuler (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>

          {/* Redo */}
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-1.5 rounded-lg text-xs hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Rétablir (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Hierarchy Status Badge */}
        <div className="flex items-center gap-2 pl-2 text-xs">
          {hierarchy.valid ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              <span>Hiérarchie H2/H3 conforme</span>
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 cursor-help"
              title={hierarchy.warnings.join(' ')}
            >
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>{hierarchy.warnings[0]}</span>
            </span>
          )}
        </div>
      </div>

      {/* ----------------- Editor Content Area ----------------- */}
      <EditorContent editor={editor} />

      {/* ----------------- Accessible Link Modal ----------------- */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-onyx border border-white/20 rounded-3xl p-6 shadow-soft-lg space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-violet-imperial" />
                <h3 className="font-serif font-bold text-lg text-white">Insérer ou modifier un lien</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="text-ivoire-violet/60 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {linkError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{linkError}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-ivoire-violet/80 mb-1">
                  Adresse web (URL)
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => {
                    setLinkUrl(e.target.value);
                    setLinkError(null);
                  }}
                  placeholder="https://exemple.com ou /contact ou #ancre"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-violet-imperial focus:outline-none"
                  autoFocus
                />
                <p className="text-[11px] text-ivoire-violet/50 mt-1">
                  Les liens externes ouvrent automatiquement un nouvel onglet avec <code className="text-amethyste">rel="noopener noreferrer"</code>.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="link-nofollow"
                  checked={linkNofollow}
                  onChange={(e) => setLinkNofollow(e.target.checked)}
                  className="rounded border-white/20 bg-white/10 text-violet-imperial focus:ring-0 w-4 h-4"
                />
                <label htmlFor="link-nofollow" className="text-xs text-ivoire-violet/80 cursor-pointer">
                  Ajouter l'attribut <code className="text-amethyste">rel="nofollow"</code> (moteurs de recherche)
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              {editor.isActive('link') ? (
                <button
                  type="button"
                  onClick={handleRemoveLink}
                  className="px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
                >
                  Supprimer le lien
                </button>
              ) : (
                <div />
              )}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-ivoire-violet/80"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleApplyLink}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-violet-imperial hover:bg-violet-imperial/80 text-white shadow-soft"
                >
                  Appliquer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- Accessible Image Modal with WebP Conversion ----------------- */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-onyx border border-white/20 rounded-3xl p-6 shadow-soft-lg space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-violet-imperial" />
                <h3 className="font-serif font-bold text-lg text-white">Insérer une image WebP</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="text-ivoire-violet/60 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {imageError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{imageError}</span>
              </div>
            )}

            {imageProcessedResult?.warning && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{imageProcessedResult.warning}</span>
              </div>
            )}

            {/* File Dropzone */}
            {!imageProcessedResult ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 hover:border-violet-imperial/60 rounded-2xl p-6 text-center cursor-pointer bg-white/5 transition-all group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                  }}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-violet-imperial/20 border border-violet-imperial/40 flex items-center justify-center mx-auto mb-3 text-amethyste group-hover:scale-105 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-white mb-1">
                  Sélectionner ou déposer une image
                </div>
                <p className="text-xs text-ivoire-violet/60">
                  JPEG, PNG, WebP ou GIF (max 15 Mo). Conversion WebP automatique & suppression des métadonnées EXIF.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Image info & weight gain banner */}
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Optimisation WebP réussie :</span>
                  </div>
                  <span className="font-bold font-mono">{imageProcessedResult.savingsLabel}</span>
                </div>

                {/* Alt Text (Mandatory) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-ivoire-violet/80">
                      Texte alternatif (alt) <span className="text-red-400">*</span>
                    </label>
                    <span className="text-[11px] text-ivoire-violet/50">
                      {imageAlt.length} caractères
                    </span>
                  </div>
                  <input
                    type="text"
                    value={imageAlt}
                    disabled={isDecorative}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Description précise du contenu visible sur l'image..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-violet-imperial focus:outline-none disabled:opacity-40"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="body-img-decorative"
                      checked={isDecorative}
                      onChange={(e) => setIsDecorative(e.target.checked)}
                      className="rounded border-white/20 bg-white/10 text-violet-imperial focus:ring-0 w-3.5 h-3.5"
                    />
                    <label htmlFor="body-img-decorative" className="text-xs text-ivoire-violet/70 cursor-pointer">
                      Image purement décorative (alt vide volontaire)
                    </label>
                  </div>
                </div>

                {/* Caption (figcaption) */}
                <div>
                  <label className="block text-xs font-semibold text-ivoire-violet/80 mb-1">
                    Légende sous l'image (optionnelle)
                  </label>
                  <input
                    type="text"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    placeholder="Ex : Typographie Cormorant Garamond déclinée sur fond noir"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-violet-imperial focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Processing / Progress status */}
            {imageProcessingStep && (
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs text-ivoire-violet/70">
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amethyste" />
                    <span>{imageProcessingStep}</span>
                  </span>
                  <span>{imageProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-imperial transition-all duration-300"
                    style={{ width: `${imageProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Modal actions */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              {imageProcessedResult ? (
                <button
                  type="button"
                  onClick={() => {
                    setImageProcessedResult(null);
                  }}
                  className="text-xs text-ivoire-violet/60 hover:text-white"
                >
                  Changer de fichier
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-ivoire-violet/80"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleInsertProcessedImage}
                  disabled={!imageProcessedResult || (!isDecorative && !imageAlt.trim())}
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-violet-imperial hover:bg-violet-imperial/80 text-white shadow-soft disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Insérer dans l'article</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
