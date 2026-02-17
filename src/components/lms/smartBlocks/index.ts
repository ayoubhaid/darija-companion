/**
 * Smart Blocks - Interactive Learning Components
 * Export all smart block components
 */

export { QuizBlock } from './QuizBlock';
export { VocabularyBlock } from './VocabularyBlock';
export { DialogueBlock } from './DialogueBlock';
export { RevealBlock } from './RevealBlock';
export { CalloutBlock, InlineCallout } from './CalloutBlock';

// Re-export types
export type {
  QuizQuestion,
  QuizOption,
  QuizAnswer,
  QuizSettings,
  VocabularyWord,
  DialogueSpeaker,
  DialogueLine,
  DialogueSettings,
} from '@/types/lms';
