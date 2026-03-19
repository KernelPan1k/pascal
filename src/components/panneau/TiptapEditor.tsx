"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useCallback, useRef, useState } from "react";

interface Props {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "32px",
        height: "28px",
        backgroundColor: active ? "var(--color-midnight)" : "transparent",
        color: active ? "var(--color-gold)" : "var(--color-text)",
        border: "1px solid",
        borderColor: active ? "var(--color-midnight)" : "var(--color-cream-dark)",
        borderRadius: "2px",
        cursor: "pointer",
        fontSize: "0.8rem",
        fontWeight: active ? 700 : 400,
        transition: "all 0.1s",
      }}
    >
      {children}
    </button>
  );
}

function ToolbarSeparator() {
  return (
    <div
      style={{
        width: "1px",
        height: "20px",
        backgroundColor: "var(--color-cream-dark)",
        margin: "0 0.25rem",
      }}
    />
  );
}

export default function TiptapEditor({ content, onChange, placeholder }: Props) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: { class: "youtube-embed" },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: placeholder || "Commencez à écrire…",
      }),
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
    // Only run when content prop changes externally
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL du lien", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const handleImageFile = useCallback(async (file: File) => {
    if (!editor) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/media/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        editor.chain().focus().setImage({ src: data.url }).run();
      }
    } finally {
      setUploadingImage(false);
    }
  }, [editor]);

  const handleDocFile = useCallback(async (file: File) => {
    if (!editor) return;
    setUploadingDoc(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/media/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        editor.chain().focus().insertContent(
          `<a href="${data.url}" target="_blank" rel="noopener noreferrer">${file.name}</a>`
        ).run();
      }
    } finally {
      setUploadingDoc(false);
    }
  }, [editor]);

  const addYoutube = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL YouTube");
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      className="tiptap-wrapper"
      style={{
        border: "1px solid var(--color-cream-dark)",
        borderRadius: "2px",
        overflow: "hidden",
        backgroundColor: "white",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.25rem",
          padding: "0.5rem 0.75rem",
          borderBottom: "1px solid var(--color-cream-dark)",
          backgroundColor: "#faf9f6",
        }}
      >
        {/* History */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Annuler"
        >
          ↩
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Refaire"
        >
          ↪
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Headings */}
        {([1, 2, 3, 4] as const).map((level) => (
          <ToolbarButton
            key={level}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            active={editor.isActive("heading", { level })}
            title={`Titre ${level}`}
          >
            H{level}
          </ToolbarButton>
        ))}

        <ToolbarSeparator />

        {/* Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Gras"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italique"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Souligné"
        >
          <u>U</u>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Barré"
        >
          <s>S</s>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Code"
        >
          {"<>"}
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="Aligner à gauche"
        >
          ≡
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="Centrer"
        >
          ≡
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="Aligner à droite"
        >
          ≡
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Liste à puces"
        >
          •—
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Liste numérotée"
        >
          1—
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Citation"
        >
          &ldquo;
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Bloc de code"
        >
          {"{}"}
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Links & Media */}
        <ToolbarButton
          onClick={setLink}
          active={editor.isActive("link")}
          title="Insérer un lien"
        >
          🔗
        </ToolbarButton>
        <ToolbarButton
          onClick={() => imageInputRef.current?.click()}
          title="Insérer une image"
        >
          {uploadingImage ? "…" : "🖼"}
        </ToolbarButton>
        <ToolbarButton
          onClick={() => docInputRef.current?.click()}
          title="Insérer un document"
        >
          {uploadingDoc ? "…" : "📎"}
        </ToolbarButton>
        <ToolbarButton
          onClick={addYoutube}
          title="Insérer une vidéo YouTube"
        >
          ▶
        </ToolbarButton>

        <ToolbarSeparator />

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Ligne horizontale"
        >
          ─
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          title="Effacer le formatage"
        >
          ✕
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        style={{
          minHeight: "320px",
          fontSize: "0.95rem",
          fontFamily: "var(--font-body)",
          lineHeight: 1.8,
        }}
      />

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); e.target.value = ""; }}
      />
      <input
        ref={docInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleDocFile(f); e.target.value = ""; }}
      />

      <style>{`
        .tiptap-wrapper .ProseMirror {
          padding: 1rem 1.25rem;
          outline: none;
          min-height: 320px;
        }
        .tiptap-wrapper .ProseMirror h1 { font-family: var(--font-display); font-size: 1.6rem; margin: 1.25rem 0 0.5rem; color: var(--color-midnight); }
        .tiptap-wrapper .ProseMirror h2 { font-family: var(--font-display); font-size: 1.35rem; margin: 1rem 0 0.4rem; color: var(--color-midnight); }
        .tiptap-wrapper .ProseMirror h3 { font-family: var(--font-display); font-size: 1.15rem; margin: 0.9rem 0 0.35rem; color: var(--color-midnight); }
        .tiptap-wrapper .ProseMirror h4 { font-family: var(--font-display); font-size: 1rem; margin: 0.8rem 0 0.3rem; color: var(--color-midnight); }
        .tiptap-wrapper .ProseMirror p { margin-bottom: 0.75rem; }
        .tiptap-wrapper .ProseMirror blockquote { border-left: 3px solid var(--color-gold); padding-left: 1rem; margin: 1rem 0; color: var(--color-text-light); font-style: italic; }
        .tiptap-wrapper .ProseMirror ul, .tiptap-wrapper .ProseMirror ol { padding-left: 1.5rem; margin-bottom: 0.75rem; }
        .tiptap-wrapper .ProseMirror li { margin-bottom: 0.25rem; }
        .tiptap-wrapper .ProseMirror code { background: #f0ece0; padding: 0.1em 0.3em; border-radius: 2px; font-size: 0.875em; }
        .tiptap-wrapper .ProseMirror pre { background: var(--color-midnight); color: var(--color-cream); padding: 1rem; border-radius: 4px; overflow-x: auto; margin-bottom: 0.75rem; }
        .tiptap-wrapper .ProseMirror pre code { background: none; color: inherit; padding: 0; }
        .tiptap-wrapper .ProseMirror a { color: var(--color-burgundy); text-decoration: underline; }
        .tiptap-wrapper .ProseMirror img { max-width: 100%; height: auto; margin: 0.5rem 0; }
        .tiptap-wrapper .ProseMirror .youtube-embed { width: 100%; aspect-ratio: 16/9; }
        .tiptap-wrapper .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: #aaa; pointer-events: none; height: 0; }
        .tiptap-wrapper .ProseMirror hr { border: none; border-top: 1px solid var(--color-cream-dark); margin: 1.5rem 0; }
      `}</style>
    </div>
  );
}
