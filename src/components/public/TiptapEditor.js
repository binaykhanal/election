"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";

export default function TiptapEditor({ value, onChange, className }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: true }),
      Image,
      Link.configure({ openOnClick: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Color,
      Highlight,
    ],
    content: value || "<p></p>",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>");
    }
  }, [value, editor]);

  if (!editor) return <div>Loading editor...</div>;

  return (
    <div className={`bg-white rounded-lg shadow-sm p-2 ${className || ""}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 mb-2 border-b p-1 bg-gray-50 rounded">
        {/* Bold / Italic / Underline / Strike */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-gray-200" : ""}
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-gray-200" : ""}
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "bg-gray-200" : ""}
        >
          U
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "bg-gray-200" : ""}
        >
          S
        </button>

        {/* Headings */}
        {[1, 2, 3].map((h) => (
          <button
            key={h}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: h }).run()
            }
            className={
              editor.isActive("heading", { level: h }) ? "bg-gray-200" : ""
            }
          >
            H{h}
          </button>
        ))}

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
        >
          1. List
        </button>

        {/* Alignment */}
        {["left", "center", "right", "justify"].map((align) => (
          <button
            key={align}
            onClick={() => editor.chain().focus().setTextAlign(align).run()}
            className={
              editor.isActive({ textAlign: align }) ? "bg-gray-200" : ""
            }
          >
            {align[0].toUpperCase()}
          </button>
        ))}

        {/* Link */}
        <button
          onClick={() => {
            const url = prompt("Enter URL");
            if (url)
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
          }}
        >
          🔗
        </button>

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            });
            const data = await res.json();
            if (data.url) {
              editor.chain().focus().setImage({ src: data.url }).run();
            }
          }}
        />

        <button onClick={() => editor.chain().focus().undo().run()}>↺</button>
        <button onClick={() => editor.chain().focus().redo().run()}>↻</button>
      </div>

      <EditorContent editor={editor} className="min-h-[18rem]" />
    </div>
  );
}
