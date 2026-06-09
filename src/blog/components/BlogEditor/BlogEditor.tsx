import "./styles.css";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

import { MenuBar } from "./MenuBar";

interface BlogEditorProps {
  initialValue: string | null;
  onChange: (value: any) => void;
}

export const BlogEditor = ({ initialValue, onChange }: BlogEditorProps) => {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");

  let parsedContent = null;

  if (initialValue) {
    try {
      parsedContent = typeof initialValue === "string" ? JSON.parse(initialValue) : initialValue;
    } catch (e) {
      console.error("Failed to parse initial blog content", e);
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Image.configure({
        allowBase64: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing your article here...",
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: parsedContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  // Keep content in sync if initialValue changes dynamically (e.g. from GraphQL query fetch)
  useEffect(() => {
    if (editor && parsedContent) {
      const currentContent = JSON.stringify(editor.getJSON());
      const incomingContent = JSON.stringify(parsedContent);

      if (currentContent !== incomingContent) {
        editor.commands.setContent(parsedContent, { emitUpdate: false });
      }
    }
  }, [initialValue, editor]);

  return (
    <div className="blog-editor-container">
      <div
        className="blog-editor-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div style={{ fontSize: "14px", fontWeight: 600, color: "#64748b" }}>
          {isHtmlMode ? "HTML Source Code" : "Visual Editor"}
        </div>
        <div
          style={{
            display: "flex",
            gap: "4px",
            backgroundColor: "#f1f5f9",
            padding: "4px",
            borderRadius: "8px",
          }}
        >
          <button
            type="button"
            onClick={() => {
              if (isHtmlMode && editor) {
                editor.commands.setContent(htmlContent);
              }

              setIsHtmlMode(false);
            }}
            style={{
              padding: "4px 12px",
              fontSize: "12px",
              fontWeight: 500,
              borderRadius: "6px",
              border: "none",
              backgroundColor: !isHtmlMode ? "#ffffff" : "transparent",
              color: !isHtmlMode ? "#0f172a" : "#64748b",
              boxShadow: !isHtmlMode ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              cursor: "pointer",
            }}
          >
            Visual
          </button>
          <button
            type="button"
            onClick={() => {
              if (!isHtmlMode && editor) {
                setHtmlContent(editor.getHTML());
              }

              setIsHtmlMode(true);
            }}
            style={{
              padding: "4px 12px",
              fontSize: "12px",
              fontWeight: 500,
              borderRadius: "6px",
              border: "none",
              backgroundColor: isHtmlMode ? "#ffffff" : "transparent",
              color: isHtmlMode ? "#0f172a" : "#64748b",
              boxShadow: isHtmlMode ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              cursor: "pointer",
            }}
          >
            HTML Code
          </button>
        </div>
      </div>

      {!isHtmlMode ? (
        <>
          <MenuBar editor={editor} />
          <div className="tiptap-content-wrapper">
            <EditorContent editor={editor} />
          </div>
        </>
      ) : (
        <textarea
          value={htmlContent}
          onChange={e => {
            const val = e.target.value;

            setHtmlContent(val);

            if (editor) {
              try {
                editor.commands.setContent(val, { emitUpdate: false });
                onChange(editor.getJSON());
              } catch (err) {
                console.error("Failed to sync HTML changes to editor", err);
              }
            }
          }}
          placeholder="Write raw HTML code here..."
          style={{
            width: "100%",
            minHeight: "350px",
            fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
            fontSize: "14px",
            lineHeight: "1.5",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            backgroundColor: "#f8fafc",
            color: "#0f172a",
            outline: "none",
            resize: "vertical",
            boxSizing: "border-box",
          }}
        />
      )}
    </div>
  );
};
