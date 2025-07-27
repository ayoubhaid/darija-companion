import '../domain/entities/lesson.dart';
import '../domain/entities/quiz.dart';
import '../domain/entities/user.dart';

class SampleData {
  // Sample Lessons
  static final List<Lesson> lessons = [
    Lesson(
      id: 'lesson_1',
      title: 'Basic Greetings',
      description: 'Learn essential greetings in Moroccan Darija',
      content: LessonContent(
        vocabulary: [
          VocabularyItem(
            word: 'مرحبا',
            transliteration: 'Marhaba',
            translation: 'Hello',
            audioUrl: 'audio/marhaba.mp3',
            imageUrl: 'images/greeting.jpg',
          ),
          VocabularyItem(
            word: 'السلام عليكم',
            transliteration: 'Assalamu alaykum',
            translation: 'Peace be upon you',
            audioUrl: 'audio/assalamu_alaykum.mp3',
            imageUrl: 'images/greeting.jpg',
          ),
          VocabularyItem(
            word: 'كيف حالك',
            transliteration: 'Kif halak',
            translation: 'How are you?',
            audioUrl: 'audio/kif_halak.mp3',
            imageUrl: 'images/greeting.jpg',
          ),
        ],
        sentences: [
          'مرحبا، كيف حالك؟',
          'السلام عليكم ورحمة الله',
          'أهلا وسهلا',
        ],
        exercises: [
          Exercise(
            type: ExerciseType.multipleChoice,
            question: 'How do you say "Hello" in Darija?',
            options: ['مرحبا', 'كيف حالك', 'السلام عليكم', 'أهلا وسهلا'],
            correctAnswer: 'مرحبا',
            correctAnswerIndex: 0,
            explanation: 'مرحبا (Marhaba) is the most common way to say hello.',
          ),
        ],
      ),
      difficulty: 'beginner',
      duration: 15,
      tags: ['greetings', 'basic', 'conversation'],
      metadata: LessonMetadata(
        createdAt: DateTime.now().subtract(const Duration(days: 1)),
        updatedAt: DateTime.now(),
        viewCount: 150,
        rating: 4.5,
        ratingCount: 25,
        isPremium: false,
        tags: ['greetings', 'basic', 'conversation'],
      ),
    ),
    Lesson(
      id: 'lesson_2',
      title: 'Numbers 1-10',
      description: 'Learn to count from 1 to 10 in Darija',
      content: LessonContent(
        vocabulary: [
          VocabularyItem(
            word: 'واحد',
            transliteration: 'Wahid',
            translation: 'One',
            audioUrl: 'audio/wahid.mp3',
            imageUrl: 'images/numbers.jpg',
          ),
          VocabularyItem(
            word: 'اثنين',
            transliteration: 'Ithnin',
            translation: 'Two',
            audioUrl: 'audio/ithnin.mp3',
            imageUrl: 'images/numbers.jpg',
          ),
          VocabularyItem(
            word: 'ثلاثة',
            transliteration: 'Thlatha',
            translation: 'Three',
            audioUrl: 'audio/thlatha.mp3',
            imageUrl: 'images/numbers.jpg',
          ),
        ],
        sentences: [
          'عندي واحد كتاب',
          'عندي اثنين أطفال',
          'عندي ثلاثة أصدقاء',
        ],
        exercises: [
          Exercise(
            type: ExerciseType.fillInTheBlank,
            question: 'Complete: عندي ___ كتاب (I have one book)',
            correctAnswer: 'واحد',
            explanation: 'واحد means "one" in Darija.',
          ),
        ],
      ),
      difficulty: 'beginner',
      duration: 20,
      tags: ['numbers', 'counting', 'basic'],
      metadata: LessonMetadata(
        createdAt: DateTime.now().subtract(const Duration(days: 2)),
        updatedAt: DateTime.now(),
        viewCount: 120,
        rating: 4.3,
        ratingCount: 18,
        isPremium: false,
        tags: ['numbers', 'counting'],
      ),
    ),
  ];

  // Sample Quizzes
  static final List<Quiz> quizzes = [
    Quiz(
      id: 'quiz_1',
      title: 'Greetings Quiz',
      description: 'Test your knowledge of basic greetings',
      type: QuizType.vocabulary,
      questions: [
        QuizQuestion(
          question: 'What does "مرحبا" mean?',
          type: QuestionType.multipleChoice,
          options: ['Goodbye', 'Hello', 'Thank you', 'Please'],
          correctAnswer: 'Hello',
          correctAnswerIndex: 1,
          points: 10,
          explanation: 'مرحبا (Marhaba) means "Hello" in Darija.',
        ),
        QuizQuestion(
          question: 'How do you say "How are you?" in Darija?',
          type: QuestionType.multipleChoice,
          options: ['مرحبا', 'كيف حالك', 'السلام عليكم', 'أهلا وسهلا'],
          correctAnswer: 'كيف حالك',
          correctAnswerIndex: 1,
          points: 10,
          explanation: 'كيف حالك (Kif halak) means "How are you?" in Darija.',
        ),
      ],
      totalQuestions: 2,
      timeLimit: 120,
      passingScore: 70,
      isAdaptive: false,
      metadata: QuizMetadata(
        difficulty: 'beginner',
        tags: ['greetings', 'basic'],
        createdAt: DateTime.now().subtract(const Duration(days: 1)),
        updatedAt: DateTime.now(),
        attemptCount: 45,
        averageScore: 85.5,
        completionRate: 92.0,
      ),
    ),
    Quiz(
      id: 'quiz_2',
      title: 'Numbers Quiz',
      description: 'Test your knowledge of numbers 1-10',
      type: QuizType.vocabulary,
      questions: [
        QuizQuestion(
          question: 'What is the Arabic word for "one"?',
          type: QuestionType.multipleChoice,
          options: ['اثنين', 'واحد', 'ثلاثة', 'أربعة'],
          correctAnswer: 'واحد',
          correctAnswerIndex: 1,
          points: 10,
          explanation: 'واحد (Wahid) means "one" in Arabic.',
        ),
        QuizQuestion(
          question: 'Complete: عندي ___ أطفال (I have two children)',
          type: QuestionType.fillInTheBlank,
          correctAnswer: 'اثنين',
          points: 10,
          explanation: 'اثنين (Ithnin) means "two" in Arabic.',
        ),
      ],
      totalQuestions: 2,
      timeLimit: 180,
      passingScore: 70,
      isAdaptive: false,
      metadata: QuizMetadata(
        difficulty: 'beginner',
        tags: ['numbers', 'counting'],
        createdAt: DateTime.now().subtract(const Duration(days: 2)),
        updatedAt: DateTime.now(),
        attemptCount: 32,
        averageScore: 78.2,
        completionRate: 88.0,
      ),
    ),
  ];

  // Sample User
  static final User sampleUser = User(
    id: 'user_1',
    email: 'user@example.com',
    username: 'darija_learner',
    displayName: 'Ahmed',
    profileImageUrl: null,
    level: UserLevel(
      level: 3,
      title: 'Intermediate Learner',
      currentXp: 750,
      xpRequiredForNextLevel: 1000,
      progressPercentage: 0.75,
      xpRemaining: 250,
    ),
    totalXp: 2750,
    currentStreak: 7,
    longestStreak: 15,
    badges: [
      'First Lesson',
      'Week Warrior',
      'Perfect Score',
      'Vocabulary Master',
    ],
    progress: UserProgress(
      lessonsCompleted: 12,
      vocabularyLearned: 150,
      quizzesTaken: 8,
      perfectScores: 3,
      totalStudyTime: 360, // minutes
      lastActive: DateTime.now(),
      completedLessons: ['lesson_1', 'lesson_2', 'lesson_3'],
      topicProgress: {'greetings': 0.8, 'numbers': 0.9, 'basic': 0.7},
    ),
    stats: UserStats(
      totalLessons: 12,
      totalVocabulary: 150,
      totalQuizzes: 8,
      averageScore: 85.5,
      studyStreak: 7,
      totalStudyTime: 360,
      accuracyRate: 0.85,
      daysStudied: 25,
      averageStudyTimePerDay: 14.4,
      studyDates: [DateTime.now().subtract(const Duration(days: 1)), DateTime.now()],
      studyTimeByTopic: {'greetings': 120, 'numbers': 90, 'basic': 150},
    ),
    preferences: UserPreferences(
      notificationsEnabled: true,
      soundEnabled: true,
      autoPlayAudio: true,
      showTransliteration: true,
      interfaceLanguage: 'English',
      difficultyLevel: 'intermediate',
      nativeLanguage: 'English',
      targetLanguage: 'Darija',
      enableNotifications: true,
      enableOfflineMode: false,
      dailyGoal: 30,
      learningTopics: ['greetings', 'numbers', 'basic'],
    ),
    createdAt: DateTime.now().subtract(const Duration(days: 30)),
    updatedAt: DateTime.now(),
  );
} 