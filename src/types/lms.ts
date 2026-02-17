/**
 * LMS Core Types
 * Production-ready type definitions for the Learning Management System
 * 
 * Architecture:
 * - Course > Module > Lesson hierarchy
 * - Editor.js content storage as JSON
 * - Smart blocks for interactive content
 * - Progress tracking and gamification
 * - Role-based access control
 */

// ============================================
// USER & ROLES
// ============================================

export type UserRole = 'admin' | 'instructor' | 'student';

export interface LMSUser {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  userId: string;
  xp: number;
  level: number;
  streak: number;
  totalXP: number;
  completedLessons: string[];
  completedQuizzes: string[];
  vocabularyLearned: number;
  lastActive: Date;
  achievements: string[];
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  showTransliteration: boolean;
  showArabic: boolean;
  darkMode: boolean;
  notifications: boolean;
  language: 'en' | 'ar' | 'fr';
}

export interface UserStats {
  lessonsCompleted: number;
  quizzesCompleted: number;
  vocabularyLearned: number;
  averageQuizScore: number;
  totalTimeSpent: number; // in minutes
  currentStreak: number;
  longestStreak: number;
}

// ============================================
// COURSE STRUCTURE
// ============================================

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  coverImage?: string;
  difficulty: CourseDifficulty;
  category: string;
  tags: string[];
  estimatedDuration: number; // in minutes
  isFree: boolean;
  price?: number;
  currency?: string;
  isPublished: boolean;
  isFeatured: boolean;
  seoMetadata?: SEOMetadata;
  certificateEnabled: boolean;
  certificateTemplate?: string;
  prerequisites?: string[]; // Course IDs
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  // Resolved fields (not stored, computed)
  modules?: Module[];
  enrollmentCount?: number;
  averageRating?: number;
}

export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  isLocked: boolean;
  unlockCondition?: UnlockCondition;
  prerequisites?: string[]; // Lesson IDs
  dripRelease?: DripRelease;
  createdAt: Date;
  updatedAt: Date;
  // Resolved fields
  lessons?: Lesson[];
}

export interface UnlockCondition {
  type: 'lesson_complete' | 'quiz_pass' | 'xp_threshold' | 'date';
  value: string | number | Date;
}

export interface DripRelease {
  enabled: boolean;
  type: 'daily' | 'weekly' | 'specific_dates';
  releaseDates?: Date[];
  intervalDays?: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  description?: string;
  content: EditorJSContent; // Stored as JSON
  contentHtml?: string; // Rendered HTML for display
  order: number;
  duration: number; // estimated minutes
  xpReward: number;
  difficulty: CourseDifficulty;
  isFree: boolean;
  isPublished: boolean;
  completionRules?: CompletionRules;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompletionRules {
  requireAllBlocks: boolean;
  passAllQuizzes: boolean;
  minimumTimeMinutes?: number;
  requirePercentage?: number;
}

// ============================================
// EDITOR.JS CONTENT
// ============================================

export interface EditorJSContent {
  time: number;
  version: string;
  blocks: EditorJSBlock[];
}

export type EditorJSBlock = 
  | HeaderBlock
  | ParagraphBlock
  | ListBlock
  | ChecklistBlock
  | QuoteBlock
  | CodeBlock
  | TableBlock
  | DelimiterBlock
  | ImageBlock
  | LinkBlock
  | EmbedBlock
  | WarningBlock
  | AttachesBlock
  | RawBlock
  // Custom Smart Blocks
  | QuizBlock
  | VocabularyBlock
  | DialogueBlock
  | RevealBlock
  | CalloutBlock;

export interface HeaderBlock {
  id: string;
  type: 'header';
  data: {
    text: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
    alignment?: 'left' | 'center' | 'right';
  };
}

export interface ParagraphBlock {
  id: string;
  type: 'paragraph';
  data: {
    text: string;
    alignment?: 'left' | 'center' | 'right';
  };
}

export interface ListBlock {
  id: string;
  type: 'list';
  data: {
    style: 'unordered' | 'ordered';
    items: string[];
  };
}

export interface ChecklistBlock {
  id: string;
  type: 'checklist';
  data: {
    items: { text: string; checked: boolean }[];
  };
}

export interface QuoteBlock {
  id: string;
  type: 'quote';
  data: {
    text: string;
    caption?: string;
    alignment?: 'left' | 'center';
  };
}

export interface CodeBlock {
  id: string;
  type: 'code';
  data: {
    code: string;
    language?: string;
    filename?: string;
  };
}

export interface TableBlock {
  id: string;
  type: 'table';
  data: {
    withHeadings: boolean;
    content: string[][];
  };
}

export interface DelimiterBlock {
  id: string;
  type: 'delimiter';
  data: {};
}

export interface ImageBlock {
  id: string;
  type: 'image';
  data: {
    file: {
      url: string;
      width?: number;
      height?: number;
    };
    caption?: string;
    withBorder?: boolean;
    stretched?: boolean;
    withBackground?: boolean;
  };
}

export interface LinkBlock {
  id: string;
  type: 'link';
  data: {
    link: string;
    meta: {
      title?: string;
      description?: string;
      image?: { url: string };
    };
  };
}

export interface EmbedBlock {
  id: string;
  type: 'embed';
  data: {
    service: string;
    embed: string;
    source: string;
    width?: number;
    height?: number;
    caption?: string;
  };
}

export interface WarningBlock {
  id: string;
  type: 'warning';
  data: {
    title: string;
    message: string;
  };
}

export interface AttachesBlock {
  id: string;
  type: 'attaches';
  data: {
    file: {
      url: string;
      name: string;
      size: number;
    };
    title?: string;
  };
}

export interface RawBlock {
  id: string;
  type: 'raw';
  data: {
    html: string;
  };
}

// ============================================
// SMART BLOCKS
// ============================================

// Quiz Block
export interface QuizBlock {
  id: string;
  type: 'quiz';
  data: {
    quizId?: string;
    title: string;
    description?: string;
    questions: QuizQuestion[];
    settings: QuizSettings;
    xpReward: number;
    difficulty: CourseDifficulty;
    shuffleQuestions: boolean;
    showFeedback: boolean;
    allowRetry: boolean;
    maxAttempts?: number;
    timeLimit?: number; // in minutes, 0 = unlimited
    passingScore: number; // percentage
  };
}

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  question: string;
  options?: QuizOption[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  imageUrl?: string;
  audioUrl?: string;
  matchingPairs?: MatchingPair[];
  blankPosition?: number;
}

export type QuizQuestionType = 
  | 'multipleChoice' 
  | 'fillInBlank' 
  | 'matchPairs' 
  | 'trueFalse'
  | 'ordering';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface QuizSettings {
  shuffleOptions: boolean;
  showCorrectAnswers: boolean;
  showExplanations: boolean;
  requireAllCorrect: boolean;
}

// Vocabulary Block
export interface VocabularyBlock {
  id: string;
  type: 'vocabulary';
  data: {
    title: string;
    words: VocabularyWord[];
    displayMode: 'list' | 'flashcard' | 'table';
    showTransliteration: boolean;
    showTranslation: boolean;
    enableAudio: boolean;
  };
}

export interface VocabularyWord {
  id: string;
  word: string;
  transliteration: string;
  translation: string;
  arabic?: string;
  audioUrl?: string;
  imageUrl?: string;
  category?: string;
  example?: string;
  exampleTranslation?: string;
}

// Dialogue Block
export interface DialogueBlock {
  id: string;
  type: 'dialogue';
  data: {
    title: string;
    description?: string;
    speakers: DialogueSpeaker[];
    lines: DialogueLine[];
    settings: DialogueSettings;
  };
}

export interface DialogueSpeaker {
  id: string;
  name: string;
  avatar?: string;
  color?: string;
}

export interface DialogueLine {
  id: string;
  speakerId: string;
  text: string;
  transliteration?: string;
  translation?: string;
  audioUrl?: string;
  delay?: number;
}

export interface DialogueSettings {
  showTranslation: boolean;
  showTransliteration: boolean;
  enableSlowPlayback: boolean;
  playbackSpeed: number;
}

// Reveal Block
export interface RevealBlock {
  id: string;
  type: 'reveal';
  data: {
    title: string;
    content: EditorJSContent;
    revealType: 'click' | 'timer' | 'scroll' | 'completion';
    timerSeconds?: number;
    buttonText: string;
    hint?: string;
  };
}

// Callout Block
export interface CalloutBlock {
  id: string;
  type: 'callout';
  data: {
    type: CalloutType;
    title?: string;
    message: string;
    icon?: string;
  };
}

export type CalloutType = 'info' | 'tip' | 'warning' | 'success' | 'error' | 'cultural';

// ============================================
// ENROLLMENT & PROGRESS
// ============================================

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  progress: number; // 0-100
  startedAt: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
  currentModuleId?: string;
  currentLessonId?: string;
  paymentId?: string;
  transactionId?: string;
}

export type EnrollmentStatus = 'active' | 'completed' | 'dropped' | 'expired' | 'refunded';

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  moduleId: string;
  completed: boolean;
  progress: number; // 0-100
  timeSpent: number; // in seconds
  blocksCompleted: string[]; // block IDs
  startedAt: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
}

export interface CourseProgress {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  quizzesPassed: number;
  totalQuizzes: number;
  xpEarned: number;
  startedAt: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
}

// ============================================
// QUIZ & ASSESSMENT
// ============================================

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  lessonId?: string;
  courseId?: string;
  answers: QuizAnswer[];
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  timeSpent: number; // in seconds
  startedAt: Date;
  completedAt: Date;
  xpEarned: number;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  points: number;
  timeSpent: number;
}

export interface UserBlockInteraction {
  id: string;
  userId: string;
  blockId: string;
  lessonId: string;
  blockType: string;
  interactionType: 'view' | 'complete' | 'answer' | 'retry';
  data: Record<string, unknown>;
  timestamp: Date;
}

// ============================================
// XP & GAMIFICATION
// ============================================

export interface XPLog {
  id: string;
  userId: string;
  amount: number;
  source: XPSource;
  sourceId: string;
  description: string;
  timestamp: Date;
}

export type XPSource = 
  | 'lesson_complete' 
  | 'quiz_pass' 
  | 'quiz_perfect' 
  | 'streak_bonus' 
  | 'achievement' 
  | 'course_complete'
  | 'daily_login'
  | 'vocabulary_mastered';

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  xpReward: number;
  requirement: AchievementRequirement;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export type AchievementCategory = 
  | 'progress' 
  | 'quiz' 
  | 'vocabulary' 
  | 'streak' 
  | 'completion'
  | 'special';

export interface AchievementRequirement {
  type: string;
  value: number;
  target?: string;
}

// ============================================
// CERTIFICATES
// ============================================

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  userName: string;
  issuedAt: Date;
  credentialId: string;
  verificationUrl?: string;
  templateId?: string;
  metadata?: Record<string, unknown>;
}

// ============================================
// ANALYTICS
// ============================================

export interface CourseAnalytics {
  courseId: string;
  totalEnrollments: number;
  activeStudents: number;
  completionRate: number;
  averageProgress: number;
  averageTimeSpent: number; // in minutes
  averageScore: number;
  dropOffPoints: { lessonId: string; count: number }[];
  quizPerformance: { quizId: string; avgScore: number; passRate: number }[];
  lastUpdated: Date;
}

export interface UserAnalytics {
  userId: string;
  totalTimeSpent: number;
  lessonsCompleted: number;
  quizzesTaken: number;
  averageScore: number;
  currentStreak: number;
  longestStreak: number;
  preferredTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  engagementScore: number;
  learningPath: LearningPathStep[];
}

export interface LearningPathStep {
  date: Date;
  lessonId: string;
  courseId: string;
  action: string;
  xp: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface LMSApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface CourseFilters {
  difficulty?: CourseDifficulty[];
  category?: string[];
  isFree?: boolean;
  isPublished?: boolean;
  search?: string;
  sortBy?: 'title' | 'createdAt' | 'popularity' | 'rating';
  sortOrder?: 'asc' | 'desc';
}
