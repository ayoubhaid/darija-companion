export interface VocabularyItem {
  id: string;
  word: string;
  transliteration: string;
  translation: string;
  arabic: string;
  category: string;
  difficulty: string;
  audioUrl?: string;
  imageUrl?: string;
  example?: string;
  exampleTranslation?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Exercise {
  type: 'multipleChoice' | 'translation' | 'fillInTheBlank';
  question: string;
  options?: string[];
  correctAnswer: string;
  correctAnswerIndex?: number;
  explanation: string;
  audioUrl?: string;
  imageUrl?: string;
}

export interface LessonContent {
  vocabulary: VocabularyItem[];
  sentences: string[];
  exercises: Exercise[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: LessonContent;
  contentHtml?: string; // Rich text HTML content
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  tags: string[];
  imageUrl?: string;
  topic: string;
  estimatedDuration?: number;
  isPremium?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Question {
  question: string;
  type: 'multipleChoice' | 'fillInTheBlank' | 'matching' | 'trueFalse';
  options?: string[];
  correctAnswer: string;
  correctAnswerIndex?: number;
  points: number;
  explanation: string;
  audioUrl?: string;
  imageUrl?: string;
  matchingPairs?: { left: string; right: string }[]; // For matching type
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  type: 'vocabulary' | 'mixed' | 'listening' | 'grammar';
  questions: Question[];
  totalQuestions: number;
  timeLimit: number;
  passingScore: number;
  isAdaptive: boolean;
  difficulty: string;
  xpReward: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  xp: number;
  level: number;
  streak: number;
  completedLessons: string[];
  completedQuizzes: string[];
  vocabularyLearned: number;
  totalXP: number;
  lastActive: string;
  createdAt: string;
  isAdmin?: boolean;
  achievements?: string[];
  preferences?: {
    showTransliteration: boolean;
    showArabic: boolean;
    darkMode: boolean;
    notifications: boolean;
  };
}

export interface UserProgress {
  lessonId: string;
  completed: boolean;
  progress: number;
  lastAccessed: string;
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalPoints: number;
  completedAt: string;
  timeTaken: number;
}

export interface AuditLog {
  id: string;
  action: 'create' | 'update' | 'delete';
  collection: 'lessons' | 'vocabulary' | 'quizzes' | 'users';
  documentId: string;
  documentTitle: string;
  userId: string;
  userName: string;
  timestamp: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
}

export interface Stats {
  totalLessons: number;
  totalVocabulary: number;
  totalQuizzes: number;
  totalUsers: number;
}
