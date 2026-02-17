'use client';

import { useMemo } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { EditorJSContent, VocabularyBlockData, ExerciseBlockData, CalloutBlockData, AudioBlockData } from '@/types/editorjs';
import { 
  Volume2, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  Lightbulb, 
  Heart, 
  CheckCircle2,
  AlertTriangle,
  Speaker,
  Music,
  Play,
  BookOpen,
  GraduationCap,
  PenTool
} from 'lucide-react';

interface ContentRendererProps {
  data: EditorJSContent;
  className?: string;
  onExerciseSubmit?: (exerciseId: string, answer: string) => void;
}

export default function ContentRenderer({ data, className = '', onExerciseSubmit }: ContentRendererProps) {
  const sanitizedContent = useMemo(() => {
    if (!data?.blocks) return '';
    
    const html = renderBlocksToHTML(data.blocks);
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre', 'blockquote', 'ul', 'ol', 'li', 'a', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'div', 'span', 'iframe'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder', 'scrolling'],
      ALLOWED_IFRAME_REGEX: /^(https?:)?\/\/(www\.)?(youtube|vimeo|twitter|instagram|tiktok|facebook)\.com\//,
    });
  }, [data]);

  if (!data?.blocks || data.blocks.length === 0) {
    return null;
  }

  return (
    <div className={`ej-content-renderer ${className}`}>
      {/* Render custom blocks first */}
      {data.blocks.map((block) => {
        switch (block.type) {
          case 'vocabulary':
            return (
              <VocabularyBlock 
                key={block.id} 
                data={block.data as VocabularyBlockData} 
              />
            );
          case 'exercise':
            return (
              <ExerciseBlock 
                key={block.id} 
                data={block.data as ExerciseBlockData}
                onSubmit={onExerciseSubmit}
              />
            );
          case 'callout':
            return (
              <CalloutBlock 
                key={block.id} 
                data={block.data as CalloutBlockData} 
              />
            );
          case 'audio':
            return (
              <AudioBlock 
                key={block.id} 
                data={block.data as AudioBlockData} 
              />
            );
          case 'delimiter':
            return (
              <DelimiterBlock key={block.id} />
            );
          default:
            return null;
        }
      })}

      {/* Render standard blocks as HTML */}
      <div 
        className="ej-standard-content"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </div>
  );
}

// Vocabulary Block Component
function VocabularyBlock({ data }: { data: VocabularyBlockData }) {
  const playAudio = () => {
    if (data.audioUrl) {
      const audio = new Audio(data.audioUrl);
      audio.play();
    }
  };

  return (
    <div className="my-6 p-5 bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 rounded-xl border border-primary/10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              {data.word}
            </h3>
            {data.category && (
              <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                {data.category}
              </span>
            )}
          </div>
          
          {data.transliteration && (
            <p className="text-lg text-zinc-600 dark:text-zinc-300 italic mb-1">
              {data.transliteration}
            </p>
          )}
          
          {data.arabic && (
            <p className="text-2xl arabic-text text-zinc-800 dark:text-zinc-200 mb-2" dir="rtl">
              {data.arabic}
            </p>
          )}
          
          <p className="text-primary font-medium">
            {data.translation}
          </p>
          
          {data.example && (
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="font-medium">Example:</span> {data.example}
            </p>
          )}
        </div>
        
        {data.audioUrl && (
          <button
            onClick={playAudio}
            className="flex-shrink-0 p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
            aria-label="Play audio"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

// Exercise Block Component
function ExerciseBlock({ 
  data, 
  onSubmit 
}: { 
  data: ExerciseBlockData;
  onSubmit?: (exerciseId: string, answer: string) => void;
}) {
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(null);
  const [showResult, setShowResult] = React.useState(false);

  const handleSubmit = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    onSubmit?.(data.question, answer);
  };

  const isCorrect = selectedAnswer === data.correctAnswer;

  return (
    <div className="my-6 p-5 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <PenTool className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          Exercise
        </span>
        <span className="px-2 py-0.5 text-xs bg-zinc-100 dark:bg-zinc-700 rounded">
          {data.type}
        </span>
      </div>

      <p className="text-lg font-medium text-zinc-900 dark:text-white mb-4">
        {data.question}
      </p>

      <div className="space-y-2 mb-4">
        {data.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOption = option === data.correctAnswer;
          
          let optionClass = 'p-4 rounded-lg border-2 transition-all cursor-pointer ';
          if (showResult) {
            if (isCorrectOption) {
              optionClass += 'border-green-500 bg-green-50 dark:bg-green-900/20';
            } else if (isSelected && !isCorrectOption) {
              optionClass += 'border-red-500 bg-red-50 dark:bg-red-900/20';
            } else {
              optionClass += 'border-zinc-200 dark:border-zinc-600 opacity-50';
            }
          } else {
            optionClass += isSelected 
              ? 'border-primary bg-primary/5' 
              : 'border-zinc-200 dark:border-zinc-600 hover:border-primary/50';
          }

          return (
            <button
              key={index}
              onClick={() => !showResult && handleSubmit(option)}
              disabled={showResult}
              className={optionClass}
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-500 text-sm">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-zinc-900 dark:text-white">{option}</span>
                {showResult && isCorrectOption && (
                  <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                )}
                {showResult && isSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-red-500 ml-auto" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
          <p className={`font-medium ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
            {isCorrect ? '✓ Correct!' : `✗ Incorrect. The answer is: ${data.correctAnswer}`}
          </p>
          {data.explanation && (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {data.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Callout Block Component
function CalloutBlock({ data }: { data: CalloutBlockData }) {
  const config = {
    info: { icon: Info, bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-800 dark:text-blue-200' },
    warning: { icon: AlertTriangle, bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800', text: 'text-yellow-800 dark:text-yellow-200' },
    tip: { icon: Lightbulb, bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', text: 'text-green-800 dark:text-green-200' },
    cultural: { icon: Heart, bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-800', text: 'text-rose-800 dark:text-rose-200' },
    success: { icon: CheckCircle2, bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-800 dark:text-emerald-200' },
    error: { icon: AlertCircle, bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', text: 'text-red-800 dark:text-red-200' },
  };

  const { icon: Icon, bg, border, text } = config[data.type] || config.info;

  return (
    <div className={`my-6 p-4 rounded-xl border ${bg} ${border}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${text}`} />
        <div className="flex-1">
          {data.title && (
            <p className={`font-semibold ${text}`}>{data.title}</p>
          )}
          <p className="text-zinc-700 dark:text-zinc-300">{data.message}</p>
        </div>
      </div>
    </div>
  );
}

// Audio Block Component
function AudioBlock({ data }: { data: AudioBlockData }) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="my-6 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
      <audio
        ref={audioRef}
        src={data.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
      
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
        >
          {isPlaying ? (
            <Music className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>
        
        <div className="flex-1">
          {data.title && (
            <p className="font-medium text-zinc-900 dark:text-white">{data.title}</p>
          )}
          {data.artist && (
            <p className="text-sm text-zinc-500">{data.artist}</p>
          )}
          <div className="mt-1 h-1.5 bg-zinc-200 dark:bg-zinc-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <span className="text-sm text-zinc-500">
          {formatDuration(data.duration)}
        </span>
      </div>
    </div>
  );
}

// Delimiter Block Component
function DelimiterBlock() {
  return (
    <div className="my-8 flex items-center justify-center">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="px-4 flex items-center gap-2 text-primary">
        <BookOpen className="w-5 h-5" />
        <GraduationCap className="w-5 h-5" />
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </div>
  );
}

// Import React for hooks
import React from 'react';

// Render standard Editor.js blocks to HTML
function renderBlocksToHTML(blocks: EditorJSContent['blocks']): string {
  return blocks
    .filter(block => !['vocabulary', 'exercise', 'callout', 'audio', 'delimiter'].includes(block.type))
    .map(block => {
      switch (block.type) {
        case 'header':
          return `<h${block.data.level} class="ej-header ej-h${block.data.level}">${block.data.text}</h${block.data.level}>`;
        case 'paragraph':
          return `<p class="ej-paragraph">${block.data.text}</p>`;
        case 'list':
          const listTag = block.data.style === 'ordered' ? 'ol' : 'ul';
          const items = block.data.items.map((item: string) => `<li>${item}</li>`).join('');
          return `<${listTag} class="ej-list">${items}</${listTag}>`;
        case 'nestedList':
          return renderNestedList(block.data);
        case 'checklist':
          const checkItems = block.data.items.map((item: { text: string; checked: boolean }) => 
            `<div class="ej-checklist-item ${item.checked ? 'checked' : ''}">
              <input type="checkbox" ${item.checked ? 'checked' : ''} disabled />
              <span>${item.text}</span>
            </div>`
          ).join('');
          return `<div class="ej-checklist">${checkItems}</div>`;
        case 'quote':
          return `<blockquote class="ej-quote">
            <p>${block.data.text}</p>
            ${block.data.caption ? `<cite>${block.data.caption}</cite>` : ''}
          </blockquote>`;
        case 'code':
          return `<pre class="ej-code"><code>${escapeHtml(block.data.code)}</code></pre>`;
        case 'table':
          return renderTable(block.data);
        case 'image':
          return `<figure class="ej-image">
            <img src="${block.data.file.url}" alt="${block.data.caption || ''}" ${block.data.stretched ? 'class="stretched"' : ''} />
            ${block.data.caption ? `<figcaption>${block.data.caption}</figcaption>` : ''}
          </figure>`;
        case 'link':
          return `<a href="${block.data.link}" class="ej-link" target="_blank" rel="noopener noreferrer">${block.data.meta?.title || block.data.link}</a>`;
        case 'embed':
          return `<div class="ej-embed">${block.data.embed}</div>`;
        case 'warning':
          return `<div class="ej-warning">
            <strong>${block.data.title}</strong>
            <p>${block.data.message}</p>
          </div>`;
        case 'attaches':
          return `<a href="${block.data.file.url}" class="ej-attaches" download>
            <span class="filename">${block.data.file.name}</span>
            <span class="filesize">${formatFileSize(block.data.file.size)}</span>
          </a>`;
        case 'delimiter':
          return '<hr class="ej-delimiter" />';
        default:
          return '';
      }
    })
    .join('');
}

function renderNestedList(data: { items: Array<{ content: string; items?: Array<{ content: string; items?: unknown[] }> }> }): string {
  const renderItems = (items: unknown[]): string => {
    return items.map((item: unknown) => {
      const nestedItem = item as { content: string; items?: unknown[] };
      return `<li>${nestedItem.content}${nestedItem.items ? `<ul>${renderItems(nestedItem.items)}</ul>` : ''}</li>`;
    }).join('');
  };
  return `<ul class="ej-nested-list">${renderItems(data.items)}</ul>`;
}

function renderTable(data: { content: string[][] }): string {
  const rows = data.content.map(row => 
    `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
  ).join('');
  return `<table class="ej-table"><tbody>${rows}</tbody></table>`;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
