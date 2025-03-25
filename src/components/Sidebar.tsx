import React from 'react';
import { File, FileText, Settings } from 'lucide-react';
import { File as FileType } from '../types';

interface SidebarProps {
  files: FileType[];
  currentFile: FileType;
  onFileSelect: (file: FileType) => void;
}

export function Sidebar({ files, currentFile, onFileSelect }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <File className="w-6 h-6 text-blue-500" />
          <span className="font-semibold">Files</span>
        </div>
      </div>
      
      <div className="space-y-2">
        {files.map((file) => (
          <button
            key={file.id}
            onClick={() => onFileSelect(file)}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              currentFile.id === file.id
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{file.name}</span>
          </button>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 w-64 p-4 border-t dark:border-gray-700">
        <button className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}