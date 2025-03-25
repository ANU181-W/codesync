import React from "react";
import { Play, Send } from "lucide-react";

interface CodeExecutionPanelProps {
  language: string;
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
}

export function CodeExecutionPanel({
  language,
  onRun,
  onSubmit,
  isRunning,
  isSubmitting,
}: CodeExecutionPanelProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-gray-700">
      <div className="flex items-center space-x-4">
        <select
          className="bg-[#2d2d2d] text-white px-3 py-1.5 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={language}
        >
          <option value="typescript">TypeScript</option>
          {/* Add other language options */}
        </select>
        <div className="text-gray-400 text-sm space-x-4">
          <span>Tab Size: 4</span>
          <span>UTF-8</span>
          <span>LF</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onRun}
          disabled={isRunning}
          className="flex items-center space-x-2 px-4 py-1.5 bg-[#2ea043] text-white rounded hover:bg-[#2c974b] disabled:opacity-50"
        >
          <Play className="w-4 h-4" />
          <span>Run</span>
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex items-center space-x-2 px-4 py-1.5 bg-[#3b82f6] text-white rounded hover:bg-[#2563eb] disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>Submit</span>
        </button>
      </div>
    </div>
  );
}
