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
  contentHtml?: string;
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
  matchingPairs?: { left: string; right: string }[];
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
  skillLevel: number;
  accuracyRate: number;
  quizzesCompleted: number;
  lessonsCompleted: number;
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

export interface UserVocabularyProgress {
  id: string;
  userId: string;
  wordId: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewDate: string;
  successRate: number;
  totalAttempts: number;
  successfulAttempts: number;
  lastReviewed: string;
}

export interface SpacedRepetitionSession {
  questions: SpacedRepetitionQuestion[];
  sessionType: 'review' | 'practice' | 'mixed';
  totalQuestions: number;
}

export interface SpacedRepetitionQuestion {
  id: string;
  wordId: string;
  word: string;
  translation: string;
  transliteration: string;
  arabic: string;
  category: string;
  questionType: 'translation' | 'multipleChoice';
  options?: string[];
  correctAnswer: string;
}

export interface AnswerResult {
  wordId: string;
  correct: boolean;
  timeTaken: number;
  xpEarned: number;
  newEaseFactor: number;
  newInterval: number;
  newRepetitions: number;
  nextReviewDate: string;
}

export interface SessionResult {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  totalXpEarned: number;
  sessionType: string;
  answers: AnswerResult[];
  skillLevelChange: number;
}
