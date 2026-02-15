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
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  tags: string[];
  imageUrl?: string;
  topic: string;
  estimatedDuration?: number;
  isPremium?: boolean;
  metadata?: {
    createdAt: string;
    updatedAt: string;
    viewCount: number;
    rating: number;
    ratingCount: number;
    isPremium: boolean;
  };
}

export interface Question {
  question: string;
  type: 'multipleChoice' | 'fillInTheBlank' | 'matching';
  options?: string[];
  correctAnswer: string;
  correctAnswerIndex?: number;
  points: number;
  explanation: string;
  audioUrl?: string;
  imageUrl?: string;
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
  metadata?: {
    difficulty: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    attemptCount: number;
    averageScore: number;
    completionRate: number;
  };
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
