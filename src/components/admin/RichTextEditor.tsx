import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  RemoveFormatting,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-amethyste underline hover:text-white transition-colors',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-2xl max-w-full my-6 border border-white/10 shadow-lg',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          'min-h-[280px] max-h-[500px] overflow-y-auto px-4 py-3 text-sm text-ivoire-violet focus:outline-none prose prose-invert max-w-none leading-relaxed font-body',
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  // Sync content if changed from outside
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  if (!editor) {
    return <div className="h-40 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />;
  }

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL du lien :', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('URL de l\'image (HTTPS) :');
    if (url && url.trim().startsWith('http')) {
      editor.chain().focus().setImage({ src: url.trim() }).run();
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden focus-within:border-violet-imperial/60 transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-white/5 border-b border-white/10 text-ivoire-violet/80">
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

        <div className="w-px h-5 bg-white/10 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-violet-imperial text-white'
              : 'hover:bg-white/10 hover:text-white'
          }`}
          title="Titre de section (H2)"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-violet-imperial text-white'
              : 'hover:bg-white/10 hover:text-white'
          }`}
          title="Sous-titre (H3)"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-white/10 mx-1" />

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

        <div className="w-px h-5 bg-white/10 mx-1" />

        <button
          type="button"
          onClick={addLink}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            editor.isActive('link')
              ? 'bg-violet-imperial text-white'
              : 'hover:bg-white/10 hover:text-white'
          }`}
          title="Insérer un lien"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={addImage}
          className="p-1.5 rounded-lg text-xs hover:bg-white/10 hover:text-white transition-colors"
          title="Insérer une image par URL"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className="p-1.5 rounded-lg text-xs hover:bg-white/10 hover:text-white transition-colors"
          title="Effacer le formatage"
        >
          <RemoveFormatting className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-white/10 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-lg text-xs hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Annuler (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </button>

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

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
};
