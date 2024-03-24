"use client";

import { TRANSFORMERS } from "@lexical/markdown";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { LinkNode } from "@lexical/link";
import { CodeNode } from "@lexical/code";
import { ListItemNode, ListNode } from "@lexical/list";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { MarkNode } from "@lexical/mark";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { Theme } from "./_themes/themes";
import ToolbarPlugin from "./_plugins/toolbar-plugin";
import ModeToggle from "~/components/theme/dark-mode-toggle";
import { useRef } from "react";
import OptionsDropdown from "./_plugins/options-dropdown";
import { EditorState } from "lexical";

function Placeholder() {
  return (
    <div className="px-6 text-gray-600 dark:text-gray-100 select-none pointer-events-none">
      Enter some rich text...
    </div>
  );
}

type Props = {
  documentId: string;
  elements: string;
};

export default function DocumentEditor({ documentId, elements }: Props) {
  console.log("elements: ", elements);
  const editorStateRef = useRef<EditorState>();

  return (
    <LexicalComposer
      initialConfig={{
        namespace: "React.js Demo",
        nodes: [
          MarkNode,
          HeadingNode,
          QuoteNode,
          LinkNode,
          ListNode,
          ListItemNode,
          HorizontalRuleNode,
          CodeNode,
        ],
        onError(error: Error) {
          console.error(error);
        },
        theme: Theme,
        editorState: elements,
      }}
    >
      <div className="relative w-full h-screen">
        {/* Toolbar with semi-transparent background floating over the content */}
        <div className="fixed top-0 left-0 right-0 z-10 px-4 md:px-8">
          <div className="flex justify-between items-center py-2">
            <OptionsDropdown documentId={documentId} state={editorStateRef} />
            <ToolbarPlugin />
            <ModeToggle />
          </div>
        </div>

        {/* ContentEditable allowing content to scroll behind the toolbar */}
        <div className="w-full h-full overflow-y-auto max-w-screen-lg bg-zinc-50 dark:bg-zinc-950 mx-auto">
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                id="lexical-content"
                className="resize-none outline-none pt-20 px-6 text-black dark:text-white "
              />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin
            onChange={(editorState) => (editorStateRef.current = editorState)}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}
