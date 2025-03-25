import React, { useEffect, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Code2 } from "lucide-react";
import { RoomParticipant } from "../types";

interface EditorProps {
  currentFile: {
    language: string;
    content: string;
  };
  onContentChange: (content: string) => void;
  onLanguageChange?: (language: string) => void;
  participants?: RoomParticipant[];
  currentUserId?: string;
}

export function Editor({
  currentFile,
  onContentChange,
  onLanguageChange,
  participants = [],
  currentUserId,
}: EditorProps) {
  const languages = [
    {
      name: "JavaScript",
      value: "javascript",
      template: "function solution(nums) {\n    // Your code here\n}",
    },
    {
      name: "TypeScript",
      value: "typescript",
      template:
        "function solution(nums: number[]): number[] {\n    // Your code here\n    return [];\n}",
    },
    {
      name: "Python",
      value: "python",
      template: "def solution(nums):\n    # Your code here\n    pass",
    },
    {
      name: "Java",
      value: "java",
      template:
        "class Solution {\n    public int[] solution(int[] nums) {\n        // Your code here\n        return new int[]{};\n    }\n}",
    },
    {
      name: "C++",
      value: "cpp",
      template:
        "class Solution {\npublic:\n    vector<int> solution(vector<int>& nums) {\n        // Your code here\n        return {};\n    }\n};",
    },
  ];

  // Generate unique colors for each participant
  const getParticipantColor = (index: number) => {
    const colors = [
      "#FF5733", // Orange
      "#33FF57", // Green
      "#3357FF", // Blue
      "#FF33F5", // Pink
    ];
    return colors[index % colors.length];
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    // Create decorations for each participant's cursor
    participants.forEach((participant, index) => {
      if (participant.id === currentUserId) return;

      // Create a content widget for the cursor
      const cursorWidget = {
        domNode: null,
        getId: () => `cursor-${participant.id}`,
        getDomNode: () => {
          if (!cursorWidget.domNode) {
            const node = document.createElement("div");
            node.className = "participant-cursor";
            node.style.position = "absolute";
            node.style.background = getParticipantColor(index);
            node.style.width = "2px";
            node.style.height = "18px";

            const label = document.createElement("div");
            label.className = "participant-label";
            label.textContent = participant.name;
            label.style.position = "absolute";
            label.style.top = "-20px";
            label.style.left = "0";
            label.style.background = getParticipantColor(index);
            label.style.color = "white";
            label.style.padding = "2px 6px";
            label.style.borderRadius = "3px";
            label.style.fontSize = "12px";
            label.style.whiteSpace = "nowrap";

            node.appendChild(label);
            cursorWidget.domNode = node;
          }
          return cursorWidget.domNode;
        },
        getPosition: () => {
          return {
            position: { lineNumber: index + 1, column: 1 },
            preference: [monaco.editor.ContentWidgetPositionPreference.EXACT],
          };
        },
      };

      editor.addContentWidget(cursorWidget);
    });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    const template =
      languages.find((lang) => lang.value === newLanguage)?.template || "";

    if (onLanguageChange) {
      onLanguageChange(newLanguage);
      onContentChange(template);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Code2 className="w-4 h-4 text-gray-500" />
          <select
            className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            value={currentFile.language}
            onChange={handleLanguageChange}
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>Tab Size: 4</span>
          <span>UTF-8</span>
          <span>LF</span>
        </div>
      </div>

      <div className="flex-1 relative">
        <MonacoEditor
          height="100%"
          language={currentFile.language}
          value={currentFile.content}
          onChange={(value) => onContentChange(value || "")}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "JetBrains Mono, Menlo, Monaco, Consolas, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            renderLineHighlight: "all",
            matchBrackets: "always",
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            lineHeight: 21,
            folding: true,
            glyphMargin: false,
            guides: {
              indentation: true,
              bracketPairs: true,
            },
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: true,
            smoothScrolling: true,
            contextmenu: true,
            mouseWheelZoom: true,
            lightbulb: {
              enabled: true,
            },
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false,
            },
            acceptSuggestionOnCommitCharacter: true,
            acceptSuggestionOnEnter: "on",
            accessibilitySupport: "off",
            autoIndent: "full",
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>
    </div>
  );
}
