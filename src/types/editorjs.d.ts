// Editor.js TypeScript declarations
declare module '@editorjs/editorjs' {
  export interface OutputData {
    time: number;
    blocks: Block[];
    version?: string;
  }

  export interface Block {
    id: string;
    type: string;
    data: Record<string, unknown>;
  }

  export interface API {
    blocks: {
      update(id: string, data: Record<string, unknown>): Promise<void>;
      delete(id: string): Promise<void>;
      move(id: string, index: number): Promise<void>;
      getBlockById(id: string): BlockAPI | undefined;
    };
    caret: {
      focus(blockId?: string, position?: 'start' | 'end'): void;
      extractExtract(): string;
    };
    events: {
      on(event: string, handler: Function): void;
      off(event: string, handler: Function): void;
    };
    saver: {
      save(): Promise<OutputData>;
    };
  }

  export interface BlockAPI {
    id: string;
    type: string;
    data: Record<string, unknown>;
    HTMLElement: HTMLElement;
  }

  export interface ToolConfig {
    [key: string]: unknown;
  }

  export interface EditorConfig {
    holder?: string | HTMLElement;
    holderId?: string;
    data?: OutputData;
    onReady?: () => void;
    onChange?: (api: API) => void;
    onAPIError?: (error: Error) => void;
    tools?: Record<string, unknown>;
    placeholder?: string;
    autofocus?: boolean;
    readOnly?: boolean;
    minHeight?: number;
  }

  export default class EditorJS {
    constructor(config?: EditorConfig);
    save(): Promise<OutputData>;
    render(data: OutputData): Promise<void>;
    destroy(): Promise<void>;
    isReady: Promise<void>;
  }
}

declare module '@editorjs/header' {
  import { BlockToolConstructable } from '@editorjs/editorjs';
  const Header: BlockToolConstructable;
  export default Header;
}

declare module '@editorjs/paragraph' {
  import { BlockToolConstructable } from '@editorjs/editorjs';
  const Paragraph: BlockToolConstructable;
  export default Paragraph;
}

declare module '@editorjs/list' {
  import { BlockToolConstructable } from '@editorjs/editorjs';
  const List: BlockToolConstructable;
  export default List;
}

declare module '@editorjs/nested-list' {
  import { BlockToolConstructable } from '@editorjs/editorjs';
  const NestedList: BlockToolConstructable;
  export default NestedList;
}

declare module '@editorjs/checklist' {
  import { BlockToolConstructable } from '@editorjs/editorjs';
  const Checklist: BlockToolConstructable;
  export default Checklist;
}

declare module '@editorjs/quote' {
  import { BlockToolConstructable } from '@editorjs/editorjs';
  const Quote: BlockToolConstructable;
  export default Quote;
}

declare module '@editorjs/code' {
  import { BlockToolConstructable } from '@editorjs/editorjs';
  const Code: BlockToolConstructable;
  export default Code;
}

declare module '@editorjs/table' {
  import { BlockToolConstructable } from '@editorjs/editorjs';
  const Table: BlockToolConstructable;
  export default Table;
}

declare module '@editorjs/delimiter' {
  import { BlockToolConstructable } from '@editorjs/editorjs';
  const Delimiter: BlockToolConstructable;
  export default Delimiter;
}

declare module '@editorjs/marker' {
  import { InlineToolConstructable } from '@editorjs/editorjs';
  const Marker: InlineToolConstructable;
  export default Marker;
}

declare module '@editorjs/inline-code' {
  import { InlineToolConstructable } from '@editorjs/editorjs';
  const InlineCode: InlineToolConstructable;
  export default InlineCode;
}

declare module '@editorjs/image' {
  import { BlockToolConstructable } from '@editorjs/editorjs';
  const Image: BlockToolConstructable;
  export default Image;
}

declare module '@editorjs/link' {
  import { InlineToolConstructable } from '@editorjs/editorjs';
  const Link: InlineToolConstructable;
  export default Link;
}

declare module '@editorjs/embed' {
  import { BlockToolConstructable } from '@editorjs/editorjs';
  const Embed: BlockToolConstructable;
  export default Embed;
}

declare module '@editorjs/warning' {
  import { BlockToolConstructable } from '@editorjs/editorjs';
  const Warning: BlockToolConstructable;
  export default Warning;
}

declare module '@editorjs/attaches' {
  import { BlockToolConstructable } from '@editorjs/editorjs';
  const Attaches: BlockToolConstructable;
  export default Attaches;
}

// Core Editor.js types
export interface EditorJSContent {
  time: number;
  blocks: EditorJSBlock[];
  version?: string;
}

export interface EditorJSBlock {
  id: string;
  type: string;
  data: Record<string, unknown>;
}

export type EditorJSTool = 
  | 'header'
  | 'paragraph'
  | 'list'
  | 'nestedList'
  | 'checklist'
  | 'quote'
  | 'code'
  | 'table'
  | 'delimiter'
  | 'image'
  | 'link'
  | 'embed'
  | 'warning'
  | 'attaches'
  | 'inlineCode'
  | 'marker'
  | 'underline'
  | 'textAlign'
  | 'vocabulary'
  | 'exercise'
  | 'callout'
  | 'audio';

// Block data interfaces
export interface VocabularyBlockData {
  word: string;
  transliteration: string;
  translation: string;
  audioUrl?: string;
  category?: string;
  arabic?: string;
  example?: string;
}

export interface ExerciseBlockData {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  type: 'multipleChoice' | 'translation' | 'fillInTheBlank';
}

export interface CalloutBlockData {
  type: 'info' | 'warning' | 'tip' | 'cultural' | 'success' | 'error';
  title: string;
  message: string;
  icon?: string;
}

export interface AudioBlockData {
  url: string;
  title?: string;
  artist?: string;
  duration?: number;
}

// Content API types
export interface ContentAPIResponse {
  success: boolean;
  data?: EditorJSContent;
  error?: string;
}

export interface ContentVersion {
  id: string;
  contentId: string;
  version: number;
  data: EditorJSContent;
  createdBy: string;
  createdAt: string;
  changelog?: string;
}

// Editor configuration
export interface EditorConfig {
  tools?: EditorJSTool[];
  placeholder?: string;
  autofocus?: boolean;
  autosave?: {
    enabled: boolean;
    interval?: number;
    endpoint?: string;
  };
  darkMode?: boolean;
  readonly?: boolean;
  minHeight?: number;
}

// Sanitization config
export interface SanitizationConfig {
  allowedTags?: string[];
  allowedAttrs?: string[];
  allowedSchemes?: string[];
}
