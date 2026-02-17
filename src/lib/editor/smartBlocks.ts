/**
 * Editor.js Custom Tools - Smart Blocks
 * Production-ready custom blocks for interactive learning content
 */

import { API, ToolConfig } from '@editorjs/editorjs';
import { VocabBlock } from './tools/VocabBlock';
import { QuizBlock } from './tools/QuizBlock';
import { DialogueBlock } from './tools/DialogueBlock';
import { RevealBlock } from './tools/RevealBlock';
import { CalloutBlock } from './tools/CalloutBlock';

export interface SmartBlockTool {
  class: new (config?: ToolConfig) => any;
  config?: ToolConfig;
  shortcut?: string;
  inlineToolbar?: boolean;
  toolbox?: {
    icon: string;
    title: string;
  };
}

/**
 * All custom smart blocks available in the LMS
 */
export const smartBlocks: Record<string, SmartBlockTool> = {
  vocab: {
    class: VocabBlock as any,
    config: {
      placeholder: 'Add vocabulary words',
      endpoint: '/api/vocabulary',
    },
    toolbox: {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
      title: 'Vocabulary',
    },
  },
  quiz: {
    class: QuizBlock as any,
    toolbox: {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      title: 'Quiz',
    },
  },
  dialogue: {
    class: DialogueBlock as any,
    toolbox: {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
      title: 'Dialogue',
    },
  },
  reveal: {
    class: RevealBlock as any,
    toolbox: {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
      title: 'Reveal',
    },
  },
  callout: {
    class: CalloutBlock as any,
    toolbox: {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
      title: 'Callout',
    },
  },
};

/**
 * Get tools config for Editor.js
 * Includes both default and custom tools
 */
export function getEditorTools(isAdmin: boolean = false) {
  const tools: Record<string, any> = {
    header: {
      class: require('@editorjs/header'),
      config: {
        placeholder: 'Enter a heading',
        levels: [1, 2, 3, 4, 5, 6],
        defaultLevel: 2,
      },
      inlineToolbar: true,
      shortcut: 'CMD+SHIFT+H',
    },
    paragraph: {
      class: require('@editorjs/paragraph'),
      config: {
        placeholder: 'Start writing your content...',
      },
      inlineToolbar: true,
    },
    list: {
      class: require('@editorjs/list'),
      inlineToolbar: true,
      shortcut: 'CMD+SHIFT+L',
    },
    nestedList: {
      class: require('@editorjs/nested-list'),
      inlineToolbar: true,
      shortcut: 'CMD+SHIFT+N',
    },
    checklist: {
      class: require('@editorjs/checklist'),
      inlineToolbar: true,
      shortcut: 'CMD+SHIFT+K',
    },
    quote: {
      class: require('@editorjs/quote'),
      inlineToolbar: true,
      config: {
        quotePlaceholder: 'Enter a quote',
        captionPlaceholder: 'Quote author',
      },
      shortcut: 'CMD+SHIFT+Q',
    },
    code: {
      class: require('@editorjs/code'),
      inlineToolbar: true,
      shortcut: 'CMD+SHIFT+C',
    },
    table: {
      class: require('@editorjs/table'),
      inlineToolbar: true,
      config: {
        rows: 2,
        cols: 3,
        withHeadings: true,
      },
    },
    delimiter: {
      class: require('@editorjs/delimiter'),
      shortcut: 'CMD+SHIFT+D',
    },
    image: {
      class: require('@editorjs/image'),
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
      class: require('@editorjs/link'),
      config: {
        endpoint: '/api/fetch-url',
      },
    },
    embed: {
      class: require('@editorjs/embed'),
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
      class: require('@editorjs/warning'),
      inlineToolbar: true,
    },
    attaches: {
      class: require('@editorjs/attaches'),
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
      class: require('@editorjs/marker'),
      inlineToolbar: true,
      shortcut: 'CMD+SHIFT+M',
    },
    inlineCode: {
      class: require('@editorjs/inline-code'),
      inlineToolbar: true,
      shortcut: 'CMD+SHIFT+I',
    },
  };

  // Add custom smart blocks
  Object.entries(smartBlocks).forEach(([name, tool]) => {
    tools[name] = {
      class: tool.class,
      ...tool.config,
      toolbox: tool.toolbox,
      inlineToolbar: tool.inlineToolbar,
      shortcut: tool.shortcut,
    };
  });

  // Add raw HTML block only for admins
  if (isAdmin) {
    tools.raw = {
      class: require('@editorjs/raw'),
      inlineToolbar: true,
    };
  }

  return tools;
}

/**
 * Render a smart block based on its type
 */
export function renderSmartBlock(block: any, isEditable: boolean = false): string {
  const { type, data } = block;
  
  switch (type) {
    case 'vocab':
      return renderVocabBlock(data, isEditable);
    case 'quiz':
      return renderQuizBlock(data, isEditable);
    case 'dialogue':
      return renderDialogueBlock(data, isEditable);
    case 'reveal':
      return renderRevealBlock(data, isEditable);
    case 'callout':
      return renderCalloutBlock(data);
    default:
      return '';
  }
}

function renderVocabBlock(data: any, isEditable: boolean): string {
  const { title, words, displayMode } = data;
  const wordCount = words?.length || 0;
  
  return `
    <div class="lms-vocab-block" data-mode="${displayMode || 'list'}">
      <div class="lms-vocab-header">
        <h3>${title || 'Vocabulary'}</h3>
        <span class="word-count">${wordCount} words</span>
      </div>
      <div class="lms-vocab-content">
        ${isEditable ? '<div class="edit-prompt">Click to add vocabulary words</div>' : ''}
        ${words?.map((word: any) => `
          <div class="vocab-word">
            <span class="word">${word.word}</span>
            <span class="transliteration">${word.transliteration || ''}</span>
            <span class="translation">${word.translation}</span>
            ${word.audioUrl ? '<button class="audio-btn" data-audio="' + word.audioUrl + '">🔊</button>' : ''}
          </div>
        `).join('') || ''}
      </div>
    </div>
  `;
}

function renderQuizBlock(data: any, isEditable: boolean): string {
  const { title, description, questions, xpReward, difficulty, passingScore } = data;
  const questionCount = questions?.length || 0;
  
  return `
    <div class="lms-quiz-block" data-difficulty="${difficulty}">
      <div class="lms-quiz-header">
        <h3>${title || 'Quiz'}</h3>
        <div class="quiz-meta">
          <span class="xp-reward">+${xpReward || 10} XP</span>
          <span class="difficulty">${difficulty || 'beginner'}</span>
          <span class="questions">${questionCount} questions</span>
        </div>
      </div>
      ${description ? `<p class="quiz-description">${description}</p>` : ''}
      ${isEditable ? '<div class="edit-prompt">Click to edit quiz questions</div>' : ''}
    </div>
  `;
}

function renderDialogueBlock(data: any, isEditable: boolean): string {
  const { title, speakers, lines } = data;
  
  return `
    <div class="lms-dialogue-block">
      <div class="lms-dialogue-header">
        <h3>${title || 'Dialogue'}</h3>
      </div>
      <div class="lms-dialogue-content">
        ${isEditable ? '<div class="edit-prompt">Click to edit dialogue</div>' : ''}
        ${lines?.map((line: any) => {
          const speaker = speakers?.find((s: any) => s.id === line.speakerId);
          return `
            <div class="dialogue-line" data-speaker="${line.speakerId}">
              <span class="speaker-name" style="color: ${speaker?.color || '#666'}">${speaker?.name || 'Speaker'}</span>
              <p class="dialogue-text">${line.text}</p>
              ${line.transliteration ? `<p class="transliteration">${line.transliteration}</p>` : ''}
              ${line.translation ? `<p class="translation">${line.translation}</p>` : ''}
            </div>
          `;
        }).join('') || ''}
      </div>
    </div>
  `;
}

function renderRevealBlock(data: any, isEditable: boolean): string {
  const { title, revealType, buttonText, hint } = data;
  
  return `
    <div class="lms-reveal-block" data-reveal-type="${revealType || 'click'}">
      <div class="reveal-header">
        <h4>${title || 'Reveal Answer'}</h4>
      </div>
      <div class="reveal-content hidden">
        ${isEditable ? '<div class="edit-prompt">Click to edit hidden content</div>' : ''}
      </div>
      <button class="reveal-btn">${buttonText || 'Reveal Answer'}</button>
      ${hint ? `<p class="hint">${hint}</p>` : ''}
    </div>
  `;
}

function renderCalloutBlock(data: any): string {
  const { type, title, message } = data;
  const icons: Record<string, string> = {
    info: 'ℹ️',
    tip: '💡',
    warning: '⚠️',
    success: '✅',
    error: '❌',
    cultural: '🌍',
  };
  
  return `
    <div class="lms-callout-block callout-${type || 'info'}">
      <div class="callout-icon">${icons[type] || 'ℹ️'}</div>
      <div class="callout-content">
        ${title ? `<strong>${title}</strong>` : ''}
        <p>${message}</p>
      </div>
    </div>
  `;
}
