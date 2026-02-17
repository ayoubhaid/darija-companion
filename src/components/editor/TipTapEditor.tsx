'use client';

import { useEffect, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Loader2, 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Youtube as YoutubeIcon,
  Undo,
  Redo,
  Palette,
  Eraser
} from 'lucide-react';

interface TipTapEditorProps {
  content?: string;
  onChange?: (html: string, json: any) => void;
  placeholder?: string;
  className?: string;
}

// Custom color palette
const COLOR_PALETTE = [
  '#000000', '#ffffff', '#ff0000', '#ff6600', '#ffff00', 
  '#00ff00', '#00ffff', '#0000ff', '#9900ff', '#ff00ff',
  '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
  '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
  '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
];

interface ToolbarButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
  title: string;
  disabled?: boolean;
}

function ToolbarButton({ icon, onClick, isActive, title, disabled }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors ${
        isActive ? 'bg-primary/10 text-primary' : 'text-zinc-600 dark:text-zinc-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {icon}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-600 mx-1" />;
}

export default function TipTapEditor({ 
  content = '', 
  onChange,
  placeholder = 'Start writing your content...',
  className = ''
}: TipTapEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Color.configure({
        types: ['textStyle'],
      }),
      TextStyle,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full my-4',
        },
      }),
      TableRow,
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-zinc-300 dark:border-zinc-600 p-2',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-zinc-300 dark:border-zinc-600 p-2 bg-zinc-100 dark:bg-zinc-800 font-bold',
        },
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'rounded-lg mx-auto my-4',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const json = editor.getJSON();
      onChange?.(html, json);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  // Handle link submission
  const handleLinkSubmit = useCallback(() => {
    if (linkUrl && editor) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  }, [editor, linkUrl]);

  // Handle image submission
  const handleImageSubmit = useCallback(() => {
    if (imageUrl && editor) {
      editor
        .chain()
        .focus()
        .setImage({ src: imageUrl })
        .run();
      setImageUrl('');
      setShowImageInput(false);
    }
  }, [editor, imageUrl]);

  // Handle youtube submission
  const handleYoutubeSubmit = useCallback(() => {
    if (youtubeUrl && editor) {
      editor
        .chain()
        .focus()
        .setYoutubeVideo({ src: youtubeUrl })
        .run();
      setYoutubeUrl('');
      setShowYoutubeInput(false);
    }
  }, [editor, youtubeUrl]);

  // Insert table
  const insertTable = useCallback(() => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

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

  if (!editor) {
    return null;
  }

  return (
    <div className={`border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden ${className}`}>
      {/* Main Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
        {/* History */}
        <ToolbarButton 
          icon={<Undo className="w-4 h-4" />} 
          onClick={() => editor.chain().focus().undo().run()} 
          title="Undo (Ctrl+Z)"
          disabled={!editor.can().undo()}
        />
        <ToolbarButton 
          icon={<Redo className="w-4 h-4" />} 
          onClick={() => editor.chain().focus().redo().run()} 
          title="Redo (Ctrl+Y)"
          disabled={!editor.can().redo()}
        />
        
        <ToolbarDivider />
        
        {/* Text Formatting */}
        <ToolbarButton 
          icon={<Bold className="w-4 h-4" />} 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          isActive={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        />
        <ToolbarButton 
          icon={<Italic className="w-4 h-4" />} 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          isActive={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        />
        <ToolbarButton 
          icon={<UnderlineIcon className="w-4 h-4" />} 
          onClick={() => editor.chain().focus().toggleUnderline().run()} 
          isActive={editor.isActive('underline')}
          title="Underline (Ctrl+U)"
        />
        <ToolbarButton 
          icon={<Strikethrough className="w-4 h-4" />} 
          onClick={() => editor.chain().focus().toggleStrike().run()} 
          isActive={editor.isActive('strike')}
          title="Strikethrough"
        />
        <ToolbarButton 
          icon={<Code className="w-4 h-4" />} 
          onClick={() => editor.chain().focus().toggleCode().run()} 
          isActive={editor.isActive('code')}
          title="Inline Code"
        />
        
        <ToolbarDivider />
        
        {/* Text Color */}
        <div className="relative">
          <ToolbarButton 
            icon={<Palette className="w-4 h-4" />} 
            onClick={() => setShowColorPicker(!showColorPicker)}
            isActive={showColorPicker || editor.isActive('textStyle')}
            title="Text Color"
          />
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 z-50">
              <div className="grid grid-cols-5 gap-1">
                {COLOR_PALETTE.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      editor.chain().focus().setColor(color).run();
                      setShowColorPicker(false);
                    }}
                    className="w-6 h-6 rounded border border-zinc-300 dark:border-zinc-600 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  setShowColorPicker(false);
                }}
                className="mt-2 w-full text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 flex items-center gap-1"
              >
                <Eraser className="w-3 h-3" /> Clear color
              </button>
            </div>
          )}
        </div>
        
        {/* Highlight */}
        <div className="relative">
          <ToolbarButton 
            icon={<Highlighter className="w-4 h-4" />} 
            onClick={() => setShowHighlightPicker(!showHighlightPicker)}
            isActive={showHighlightPicker || editor.isActive('highlight')}
            title="Highlight"
          />
          {showHighlightPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 z-50">
              <div className="grid grid-cols-5 gap-1">
                {COLOR_PALETTE.slice(2).map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      editor.chain().focus().toggleHighlight({ color }).run();
                      setShowHighlightPicker(false);
                    }}
                    className="w-6 h-6 rounded border border-zinc-300 dark:border-zinc-600 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        <ToolbarDivider />
        
        {/* Text Alignment */}
        <ToolbarButton 
          icon={<AlignLeft className="w-4 h-4" />} 
          onClick={() => editor.commands.setTextAlign('left')} 
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        />
        <ToolbarButton 
          icon={<AlignCenter className="w-4 h-4" />} 
          onClick={() => editor.commands.setTextAlign('center')} 
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        />
        <ToolbarButton 
          icon={<AlignRight className="w-4 h-4" />} 
          onClick={() => editor.commands.setTextAlign('right')} 
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        />
        <ToolbarButton 
          icon={<AlignJustify className="w-4 h-4" />} 
          onClick={() => editor.commands.setTextAlign('justify')} 
          isActive={editor.isActive({ textAlign: 'justify' })}
          title="Justify"
        />
        
        <ToolbarDivider />
        
        {/* Lists */}
        <ToolbarButton 
          icon={<List className="w-4 h-4" />} 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        />
        <ToolbarButton 
          icon={<ListOrdered className="w-4 h-4" />} 
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        />
        
        <ToolbarDivider />
        
        {/* Block Elements */}
        <ToolbarButton 
          icon={<Quote className="w-4 h-4" />} 
          onClick={() => editor.chain().focus().toggleBlockquote().run()} 
          isActive={editor.isActive('blockquote')}
          title="Quote"
        />
        <ToolbarButton 
          icon={<Minus className="w-4 h-4" />} 
          onClick={() => editor.chain().focus().setHorizontalRule().run()} 
          title="Horizontal Rule"
        />
        
        <ToolbarDivider />
        
        {/* Link */}
        <div className="relative">
          <ToolbarButton 
            icon={<LinkIcon className="w-4 h-4" />} 
            onClick={() => setShowLinkInput(!showLinkInput)}
            isActive={showLinkInput || editor.isActive('link')}
            title="Insert Link"
          />
          {showLinkInput && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 z-50">
              <input
                type="url"
                placeholder="Enter URL..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLinkSubmit()}
                className="w-48 px-2 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-700"
              />
              <button
                onClick={handleLinkSubmit}
                className="ml-2 px-2 py-1 text-sm bg-primary text-white rounded"
              >
                Add
              </button>
            </div>
          )}
        </div>
        
        {/* Image */}
        <div className="relative">
          <ToolbarButton 
            icon={<ImageIcon className="w-4 h-4" />} 
            onClick={() => setShowImageInput(!showImageInput)}
            isActive={showImageInput}
            title="Insert Image"
          />
          {showImageInput && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 z-50">
              <input
                type="url"
                placeholder="Image URL..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleImageSubmit()}
                className="w-48 px-2 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-700"
              />
              <button
                onClick={handleImageSubmit}
                className="ml-2 px-2 py-1 text-sm bg-primary text-white rounded"
              >
                Add
              </button>
            </div>
          )}
        </div>
        
        {/* Table */}
        <ToolbarButton 
          icon={<TableIcon className="w-4 h-4" />} 
          onClick={insertTable}
          title="Insert Table"
        />
        
        {/* YouTube */}
        <div className="relative">
          <ToolbarButton 
            icon={<YoutubeIcon className="w-4 h-4" />} 
            onClick={() => setShowYoutubeInput(!showYoutubeInput)}
            isActive={showYoutubeInput}
            title="Insert YouTube Video"
          />
          {showYoutubeInput && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 z-50">
              <input
                type="url"
                placeholder="YouTube URL..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleYoutubeSubmit()}
                className="w-48 px-2 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-700"
              />
              <button
                onClick={handleYoutubeSubmit}
                className="ml-2 px-2 py-1 text-sm bg-primary text-white rounded"
              >
                Add
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Editor Content */}
      <div className="bg-white dark:bg-zinc-900 min-h-[400px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
