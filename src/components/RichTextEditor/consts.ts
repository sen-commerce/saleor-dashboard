// @ts-strict-ignore
import { StrikethroughIcon } from "@dashboard/icons/StrikethroughIcon";
import Checklist from "@editorjs/checklist";
import CodeTool from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import { type ToolConstructable, type ToolSettings } from "@editorjs/editorjs";
import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import InlineCode from "@editorjs/inline-code";
import List from "@editorjs/list";
import Marker from "@editorjs/marker";
import Paragraph from "@editorjs/paragraph";
import Quote from "@editorjs/quote";
import Raw from "@editorjs/raw";
import Table from "@editorjs/table";
import Underline from "@editorjs/underline";
import Warning from "@editorjs/warning";
import createGenericInlineTool from "editorjs-inline-tool";

const getTool = (tool: any) => {
  if (!tool) return tool;

  return tool.default || tool;
};

const inlineToolbar = [
  "link",
  "bold",
  "italic",
  "strikethrough",
  "underline",
  "inlineCode",
  "marker",
];

export const tools: Record<string, ToolConstructable | ToolSettings> = {
  embed: getTool(Embed),
  header: {
    class: getTool(Header),
    config: {
      defaultLevel: 1,
      levels: [1, 2, 3],
    },
    inlineToolbar,
  },
  list: {
    class: getTool(List),
    inlineToolbar,
  },
  quote: {
    class: getTool(Quote),
    inlineToolbar,
  },
  table: {
    // @ts-expect-error Type mismatch between editorjs libraries (@editorjs/table and @editorjs/editorjs)
    class: Table,
    inlineToolbar,
    config: {
      rows: 2,
      cols: 2,
    },
  },
  paragraph: {
    class: getTool(Paragraph),
    inlineToolbar,
  },
  strikethrough: createGenericInlineTool({
    sanitize: {
      s: {},
    },
    shortcut: "CMD+S",
    tagName: "s",
    toolboxIcon: StrikethroughIcon,
  }),
  // ── Extended block tools ──────────────────────────────────────────────
  image: {
    class: getTool(ImageTool),
    config: {
      // Custom uploader will be dynamically attached in RichTextEditor component to use React hooks.
    },
  },
  delimiter: {
    class: getTool(Delimiter),
  },
  table: {
    class: getTool(Table),
    inlineToolbar: true,
    config: {
      rows: 3,
      cols: 3,
    },
  },
  code: {
    class: getTool(CodeTool),
  },
  warning: {
    class: getTool(Warning),
    inlineToolbar: true,
  },
  checklist: {
    class: getTool(Checklist),
    inlineToolbar: true,
  },
  raw: {
    class: getTool(Raw),
  },
  // ── Extended inline tools ─────────────────────────────────────────────
  underline: getTool(Underline),
  marker: {
    class: getTool(Marker),
    shortcut: "CMD+SHIFT+M",
  },
  inlineCode: {
    class: getTool(InlineCode),
    shortcut: "CMD+SHIFT+C",
  },
};
