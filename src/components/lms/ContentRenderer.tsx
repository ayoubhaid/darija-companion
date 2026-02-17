'use client';

import { useMemo } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { EditorJSContent, EditorJSBlock } from '@/types/lms';
import { 
  QuizBlock, 
  VocabularyBlock, 
  DialogueBlock, 
  RevealBlock, 
  CalloutBlock 
} from '@/components/lms/smartBlocks';
import clsx from 'clsx';

// Simple rendered block component
interface ContentRendererProps {
  content: EditorJSContent;
  className?: string;
  isEditable?: boolean;
  onQuizComplete?: (blockId: string, score: number, xpEarned: number) => void;
}

/**
 * Render Editor.js content with smart block support
 */
export function ContentRenderer({ 
  content, 
  className = '',
  isEditable = false,
  onQuizComplete,
}: ContentRendererProps) {
  const sanitizedContent = useMemo(() => {
    if (!content?.blocks) return [];
    return content.blocks;
  }, [content?.blocks]);

  return (
    <div className={clsx('lms-content-renderer', className)}>
      {sanitizedContent.map((block, index) => (
        <BlockRenderer 
          key={block.id || index} 
          block={block}
          isEditable={isEditable}
          onQuizComplete={onQuizComplete}
        />
      ))}
    </div>
  );
}

/**
 * Individual block renderer
 */
function BlockRenderer({ 
  block, 
  isEditable,
  onQuizComplete,
}: { 
  block: EditorJSBlock;
  isEditable: boolean;
  onQuizComplete?: (blockId: string, score: number, xpEarned: number) => void;
}) {
  const { type, data } = block;

  switch (type) {
    case 'header':
      return <HeaderBlock data={data} />;
    
    case 'paragraph':
      return <ParagraphBlock data={data} />;
    
    case 'list':
      return <ListBlock data={data} />;
    
    case 'checklist':
      return <ChecklistBlock data={data} />;
    
    case 'quote':
      return <QuoteBlock data={data} />;
    
    case 'code':
      return <CodeBlock data={data} />;
    
    case 'table':
      return <TableBlock data={data} />;
    
    case 'delimiter':
      return <DelimiterBlock />;
    
    case 'image':
      return <ImageBlock data={data} />;
    
    case 'link':
      return <LinkBlock data={data} />;
    
    case 'embed':
      return <EmbedBlock data={data} />;
    
    case 'warning':
      return <WarningBlock data={data} />;
    
    case 'attaches':
      return <AttachesBlock data={data} />;
    
    case 'raw':
      // Only render raw HTML for admins
      if (isEditable) {
        return <RawBlock data={data} />;
      }
      return null;

    // Smart Blocks
    case 'quiz':
      return (
        <QuizBlock
          id={block.id}
          title={data.title}
          description={data.description}
          questions={data.questions}
          settings={data.settings}
          xpReward={data.xpReward}
          difficulty={data.difficulty}
          timeLimit={data.timeLimit}
          passingScore={data.passingScore}
          onComplete={(score, xp) => onQuizComplete?.(block.id, score, xp)}
          isPreview={isEditable}
        />
      );

    case 'vocabulary':
      return (
        <VocabularyBlock
          id={block.id}
          title={data.title}
          words={data.words}
          displayMode={data.displayMode}
          showTransliteration={data.showTransliteration}
          showTranslation={data.showTranslation}
          enableAudio={data.enableAudio}
        />
      );

    case 'dialogue':
      return (
        <DialogueBlock
          id={block.id}
          title={data.title}
          description={data.description}
          speakers={data.speakers}
          lines={data.lines}
          settings={data.settings}
        />
      );

    case 'reveal':
      return (
        <RevealBlock
          id={block.id}
          title={data.title}
          revealType={data.revealType}
          timerSeconds={data.timerSeconds}
          buttonText={data.buttonText}
          hint={data.hint}
        />
      );

    case 'callout':
      return (
        <CalloutBlock
          id={block.id}
          type={data.type}
          title={data.title}
          message={data.message}
          icon={data.icon}
        />
      );

    default:
      return (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-yellow-800 dark:text-yellow-200">
            Unknown block type: {type}
          </p>
        </div>
      );
  }
}

// ============================================
// Standard Editor.js Block Components
// ============================================

function HeaderBlock({ data }: { data: any }) {
  const Tag = `h${data.level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  const alignClass = data.alignment ? `text-${data.alignment}` : '';
  
  return (
    <Tag className={clsx('font-bold mb-4', alignClass)}>
      {DOMPurify.sanitize(data.text)}
    </Tag>
  );
}

function ParagraphBlock({ data }: { data: any }) {
  const alignClass = data.alignment ? `text-${data.alignment}` : '';
  
  return (
    <p 
      className={clsx('mb-4 leading-relaxed', alignClass)}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.text) }}
    />
  );
}

function ListBlock({ data }: { data: any }) {
  const Tag = data.style === 'ordered' ? 'ol' : 'ul';
  const listClass = data.style === 'ordered' 
    ? 'list-decimal' 
    : 'list-disc';
  
  return (
    <Tag className={clsx('mb-4 pl-6', listClass)}>
      {data.items?.map((item: string, index: number) => (
        <li 
          key={index} 
          className="mb-2"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item) }}
        />
      ))}
    </Tag>
  );
}

function ChecklistBlock({ data }: { data: any }) {
  return (
    <div className="mb-4 space-y-2">
      {data.items?.map((item: { text: string; checked: boolean }, index: number) => (
        <div 
          key={index} 
          className={clsx(
            'flex items-start gap-3 p-3 rounded-lg border',
            item.checked 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
              : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
          )}
        >
          <input
            type="checkbox"
            checked={item.checked}
            readOnly
            className="mt-1 w-4 h-4 rounded border-zinc-300"
          />
          <span 
            className={clsx(
              item.checked && 'line-through text-zinc-400 dark:text-zinc-500'
            )}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.text) }}
          />
        </div>
      ))}
    </div>
  );
}

function QuoteBlock({ data }: { data: any }) {
  const alignClass = data.alignment === 'center' ? 'text-center' : 'text-left';
  
  return (
    <figure className={clsx('mb-4 border-l-4 border-blue-500 pl-4 py-2', alignClass)}>
      <blockquote 
        className="text-lg italic text-zinc-700 dark:text-zinc-300"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.text) }}
      />
      {data.caption && (
        <figcaption className="mt-2 text-sm text-zinc-500">
          — {DOMPurify.sanitize(data.caption)}
        </figcaption>
      )}
    </figure>
  );
}

function CodeBlock({ data }: { data: any }) {
  return (
    <pre className="mb-4 bg-zinc-900 dark:bg-zinc-950 text-zinc-100 p-4 rounded-lg overflow-x-auto">
      <code className={`language-${data.language || 'text'}`}>
        {DOMPurify.sanitize(data.code)}
      </code>
    </pre>
  );
}

function TableBlock({ data }: { data: any }) {
  return (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full border-collapse border border-zinc-200 dark:border-zinc-700">
        <thead>
          {data.withHeadings && data.content?.[0] && (
            <tr className="bg-zinc-50 dark:bg-zinc-800">
              {data.content[0].map((cell: string, index: number) => (
                <th 
                  key={index}
                  className="border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-left font-semibold"
                >
                  {DOMPurify.sanitize(cell)}
                </th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {(data.withHeadings ? data.content?.slice(1) : data.content)?.map((row: string[], rowIndex: number) => (
            <tr key={rowIndex}>
              {row.map((cell: string, cellIndex: number) => (
                <td 
                  key={cellIndex}
                  className="border border-zinc-200 dark:border-zinc-700 px-4 py-2"
                >
                  {DOMPurify.sanitize(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DelimiterBlock() {
  return <hr className="my-8 border-zinc-200 dark:border-zinc-700" />;
}

function ImageBlock({ data }: { data: any }) {
  const containerClass = clsx(
    'mb-4',
    data.stretched && 'full-width',
    data.withBackground && 'bg-zinc-100 dark:bg-zinc-800 p-4',
    data.withBorder && 'border border-zinc-200 dark:border-zinc-700'
  );
  
  return (
    <figure className={containerClass}>
      <img 
        src={data.file?.url} 
        alt={data.caption || ''}
        className="w-full h-auto rounded-lg"
        loading="lazy"
      />
      {data.caption && (
        <figcaption className="mt-2 text-center text-sm text-zinc-500">
          {DOMPurify.sanitize(data.caption)}
        </figcaption>
      )}
    </figure>
  );
}

function LinkBlock({ data }: { data: any }) {
  return (
    <div className="mb-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
      <a 
        href={data.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:underline"
      >
        {data.meta?.title && (
          <div className="font-semibold text-blue-600 dark:text-blue-400">
            {DOMPurify.sanitize(data.meta.title)}
          </div>
        )}
        {data.meta?.description && (
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            {DOMPurify.sanitize(data.meta.description)}
          </div>
        )}
        <div className="text-xs text-zinc-400 mt-1 truncate">
          {data.link}
        </div>
      </a>
    </div>
  );
}

function EmbedBlock({ data }: { data: any }) {
  return (
    <div 
      className="mb-4 aspect-video"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.embed) }}
    />
  );
}

function WarningBlock({ data }: { data: any }) {
  return (
    <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
      <div className="flex items-start gap-3">
        <span className="text-2xl">⚠️</span>
        <div>
          {data.title && (
            <div className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
              {DOMPurify.sanitize(data.title)}
            </div>
          )}
          <div className="text-yellow-700 dark:text-yellow-300">
            {DOMPurify.sanitize(data.message)}
          </div>
        </div>
      </div>
    </div>
  );
}

function AttachesBlock({ data }: { data: any }) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  return (
    <div className="mb-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
      <a 
        href={data.file?.url}
        download
        className="flex items-center gap-3 hover:underline"
      >
        <span className="text-3xl">📎</span>
        <div>
          <div className="font-medium">
            {data.title || data.file?.name || 'Attachment'}
          </div>
          {data.file?.size && (
            <div className="text-sm text-zinc-500">
              {formatFileSize(data.file.size)}
            </div>
          )}
        </div>
      </a>
    </div>
  );
}

function RawBlock({ data }: { data: any }) {
  return (
    <div 
      className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.html) }}
    />
  );
}

export default ContentRenderer;
