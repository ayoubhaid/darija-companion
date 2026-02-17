'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import List from '@editorjs/list';
import NestedList from '@editorjs/nested-list';
import Checklist from '@editorjs/checklist';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import Table from '@editorjs/table';
import Delimiter from '@editorjs/delimiter';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import Image from '@editorjs/image';
import LinkTool from '@editorjs/link';
import Embed from '@editorjs/embed';
import Warning from '@editorjs/warning';
import Attaches from '@editorjs/attaches';
import { EditorConfig, EditorJSContent } from '@/types/editorjs';
import { Loader2, Save, CheckCircle, AlertCircle } from 'lucide-react';

interface EditorProps {
  data?: EditorJSContent;
  onChange?: (data: EditorJSContent) => void;
  onReady?: () => void;
  onError?: (error: Error) => void;
  config?: EditorConfig;
  placeholder?: string;
  holderId?: string;
  className?: string;
}

// Default tools configuration - using any to avoid complex typing issues with Editor.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultTools: any = {
  header: {
    class: Header,
    config: {
      placeholder: 'Enter a heading',
      levels: [1, 2, 3, 4, 5, 6],
      defaultLevel: 2,
    },
    inlineToolbar: true,
    shortcut: 'CMD+SHIFT+H',
  },
  paragraph: {
    class: Paragraph,
    config: {
      placeholder: 'Start writing your content...',
    },
    inlineToolbar: true,
  },
  list: {
    class: List,
    inlineToolbar: true,
    shortcut: 'CMD+SHIFT+L',
  },
  nestedList: {
    class: NestedList,
    inlineToolbar: true,
    shortcut: 'CMD+SHIFT+N',
  },
  checklist: {
    class: Checklist,
    inlineToolbar: true,
    shortcut: 'CMD+SHIFT+K',
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: 'Enter a quote',
      captionPlaceholder: 'Quote author',
    },
    shortcut: 'CMD+SHIFT+Q',
  },
  code: {
    class: Code,
    inlineToolbar: true,
    shortcut: 'CMD+SHIFT+C',
  },
  table: {
    class: Table,
    inlineToolbar: true,
    config: {
      rows: 2,
      cols: 3,
      withHeadings: true,
    },
  },
  delimiter: {
    class: Delimiter,
    shortcut: 'CMD+SHIFT+D',
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByFile: async (file: File) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('type', 'image');
          
          const response = await fetch('/api/upload-file', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error('Failed to upload image');
          }
          
          const result = await response.json();
          return {
            success: 1,
            file: {
              url: result.url,
              width: result.width,
              height: result.height,
            },
          };
        },
        uploadByUrl: async (url: string) => {
          return {
            success: 1,
            file: { url },
          };
        },
      },
      field: 'file',
      types: 'image/*',
    },
  },
  link: {
    class: LinkTool,
    config: {
      endpoint: '/api/fetch-url',
    },
  },
  embed: {
    class: Embed,
    config: {
      services: {
        youtube: true,
        twitter: true,
        instagram: true,
        vimeo: true,
        facebook: true,
        tiktok: true,
      },
    },
    inlineToolbar: true,
  },
  warning: {
    class: Warning,
    inlineToolbar: true,
  },
  attaches: {
    class: Attaches,
    config: {
      uploader: {
        uploadByFile: async (file: File) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('type', 'file');
          
          const response = await fetch('/api/upload-file', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error('Failed to upload file');
          }
          
          const result = await response.json();
          return {
            success: 1,
            file: {
              url: result.url,
              name: file.name,
              size: file.size,
            },
          };
        },
      },
    },
  },
  marker: {
    class: Marker,
    inlineToolbar: true,
    shortcut: 'CMD+SHIFT+M',
  },
  inlineCode: {
    class: InlineCode,
    inlineToolbar: true,
    shortcut: 'CMD+SHIFT+I',
  },
};

export default function Editor({
  data,
  onChange,
  onReady,
  onError,
  config = {},
  placeholder = 'Start writing your content...',
  holderId,
  className = '',
}: EditorProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const holderIdRef = useRef(holderId || `editor-${Math.random().toString(36).substr(2, 9)}`);
  const [isMounted, setIsMounted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [editorError, setEditorError] = useState<string | null>(null);
  const [currentData, setCurrentData] = useState<EditorJSContent | undefined>(data);

  // Update currentData when prop changes
  useEffect(() => {
    if (data !== currentData) {
      setCurrentData(data);
    }
  }, [data, currentData]);

  // Initialize editor
  const initEditor = useCallback(async () => {
    // Prevent multiple initializations
    if (editorRef.current) return;

    try {
      // Wait for DOM to be ready
      const holderElement = document.getElementById(holderIdRef.current);
      if (!holderElement) {
        console.error('Editor holder element not found:', holderIdRef.current);
        setEditorError('Editor container not found');
        return;
      }

      // Ensure the holder element has proper dimensions
      if (holderElement.clientHeight === 0) {
        holderElement.style.minHeight = `${config.minHeight || 400}px`;
      }

      const editorInstance = new EditorJS({
        holder: holderElement,
        data: currentData ? { ...currentData } : undefined,
        placeholder,
        readOnly: config.readonly || false,
        autofocus: config.autofocus || false,
        minHeight: config.minHeight || 400,
        tools: defaultTools,
        onReady: () => {
          console.log('Editor.js is ready');
          setIsInitialized(true);
          onReady?.();
        },
        onChange: async () => {
          if (onChange && editorRef.current) {
            try {
              const outputData = await editorRef.current.save();
              onChange(outputData as EditorJSContent);
              
              // Handle autosave
              if (config.autosave?.enabled) {
                setSaveStatus('saving');
                try {
                  if (config.autosave.endpoint) {
                    await fetch(config.autosave.endpoint, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(outputData),
                    });
                  }
                  setSaveStatus('saved');
                  setLastSaved(new Date());
                  setTimeout(() => setSaveStatus('idle'), 2000);
                } catch (error) {
                  console.error('Autosave failed:', error);
                  setSaveStatus('error');
                }
              }
            } catch (error) {
              console.error('Error saving editor data:', error);
            }
          }
        },
        onAPIError: (error) => {
          console.error('Editor.js API error:', error);
          onError?.(error);
        },
      });
      
      editorRef.current = editorInstance;
    } catch (error) {
      console.error('Error initializing Editor.js:', error);
      setEditorError(error instanceof Error ? error.message : 'Failed to initialize editor');
      onError?.(error as Error);
    }
  }, [currentData, placeholder, config, onChange, onReady, onError]);

  // Handle mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize editor after mount
  useEffect(() => {
    if (!isMounted) return;
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initEditor();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [isMounted, initEditor]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (editorRef.current) {
        try {
          editorRef.current.destroy();
          editorRef.current = null;
        } catch (e) {
          console.error('Error destroying editor:', e);
        }
      }
    };
  }, []);

  // Manual save function
  const save = useCallback(async (): Promise<EditorJSContent | null> => {
    if (!editorRef.current) return null;
    
    try {
      setSaveStatus('saving');
      const outputData = await editorRef.current.save();
      setSaveStatus('saved');
      setLastSaved(new Date());
      setTimeout(() => setSaveStatus('idle'), 2000);
      return outputData as EditorJSContent;
    } catch (error) {
      console.error('Error saving:', error);
      setSaveStatus('error');
      return null;
    }
  }, []);

  // Render save status indicator
  const renderSaveStatus = () => {
    const statusConfig = {
      idle: { icon: null, text: '', color: '' },
      saving: { icon: Loader2, text: 'Saving...', color: 'text-blue-500' },
      saved: { icon: CheckCircle, text: 'Saved', color: 'text-green-500' },
      error: { icon: AlertCircle, text: 'Save failed', color: 'text-red-500' },
    };

    const status = statusConfig[saveStatus];
    if (!status.icon) return null;

    const Icon = status.icon;
    return (
      <div className={`flex items-center gap-1.5 text-sm ${status.color}`}>
        <Icon className={`w-4 h-4 ${saveStatus === 'saving' ? 'animate-spin' : ''}`} />
        <span>{status.text}</span>
        {lastSaved && saveStatus === 'saved' && (
          <span className="text-zinc-400 text-xs ml-1">
            {lastSaved.toLocaleTimeString()}
          </span>
        )}
      </div>
    );
  };

  if (!isMounted) {
    return (
      <div className={`min-h-[400px] border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center ${className}`}>
        <div className="flex items-center gap-2 text-zinc-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading editor...</span>
        </div>
      </div>
    );
  }

  if (editorError) {
    return (
      <div className={`min-h-[400px] border border-red-200 dark:border-red-700 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center ${className}`}>
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>Error: {editorError}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Editor Container - ensure it has proper height */}
      <div 
        id={holderIdRef.current}
        className="ej-editor-container min-h-[400px]"
        style={{ minHeight: config.minHeight || 400 }}
      />
      
      {/* Save Status Indicator */}
      <div className="absolute top-2 right-2 z-10">
        {renderSaveStatus()}
      </div>
    </div>
  );
}

// Export the Editor class for external use
export { Editor as EditorJS };
export type { EditorJSContent as OutputData };
