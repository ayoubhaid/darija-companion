import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../domain/entities/user.dart';
import '../../domain/entities/lesson.dart';
import '../../domain/entities/quiz.dart';

// Mock Auth State
class MockAuthState {
  final bool isLoading;
  final bool isAuthenticated;
  final User? user;
  final String? error;

  const MockAuthState({
    this.isLoading = false,
    this.isAuthenticated = false,
    this.user,
    this.error,
  });

  MockAuthState copyWith({
    bool? isLoading,
    bool? isAuthenticated,
    User? user,
    String? error,
  }) {
    return MockAuthState(
      isLoading: isLoading ?? this.isLoading,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      user: user ?? this.user,
      error: error ?? this.error,
    );
  }
}

// Mock Auth Notifier
class MockAuthNotifier extends StateNotifier<MockAuthState> {
  MockAuthNotifier() : super(MockAuthState(
    isAuthenticated: true,
    user: _createMockUser(),
  )) {
    _init();
  }

  void _init() {
    // User is already authenticated, no need for delay
  }

  static User _createMockUser() {
    return User(
      id: 'mock-user-id',
      username: 'demo_user',
      email: 'demo@example.com',
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
      level: const UserLevel(
        level: 1,
        currentXp: 0,
        xpRequiredForNextLevel: 100,
        title: 'Beginner',
        progressPercentage: 0.0,
        xpRemaining: 100,
      ),
      totalXp: 0,
      currentStreak: 0,
      longestStreak: 0,
      preferences: const UserPreferences(
        notificationsEnabled: true,
        soundEnabled: true,
        autoPlayAudio: true,
        showTransliteration: true,
        interfaceLanguage: 'en',
        difficultyLevel: 'beginner',
        nativeLanguage: 'en',
        targetLanguage: 'ar-MA',
        enableNotifications: true,
        enableOfflineMode: true,
        dailyGoal: 15,
        learningTopics: ['greetings', 'basics'],
      ),
      progress: UserProgress(
        lessonsCompleted: 0,
        vocabularyLearned: 0,
        quizzesTaken: 0,
        perfectScores: 0,
        totalStudyTime: 0,
        lastActive: DateTime.now(),
        completedLessons: [],
        topicProgress: {},
      ),
      badges: [],
      stats: const UserStats(
        totalLessons: 0,
        totalVocabulary: 0,
        totalQuizzes: 0,
        averageScore: 0.0,
        studyStreak: 0,
        totalStudyTime: 0,
        accuracyRate: 0.0,
        daysStudied: 0,
        averageStudyTimePerDay: 0.0,
        studyDates: [],
        studyTimeByTopic: {},
      ),
    );
  }

  Future<void> signInWithEmailAndPassword(String email, String password) async {
    try {
      state = state.copyWith(isLoading: true, error: null);
      
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));
      
      // Mock successful login
      state = state.copyWith(
        isLoading: false,
        isAuthenticated: true,
        user: _createMockUser(),
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'Mock error: $e',
      );
    }
  }

  Future<void> signUpWithEmailAndPassword(
    String email, 
    String password, 
    String username,
  ) async {
    try {
      state = state.copyWith(isLoading: true, error: null);
      
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));
      
      // Mock successful signup
      state = state.copyWith(
        isLoading: false,
        isAuthenticated: true,
        user: _createMockUser(),
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'Mock error: $e',
      );
    }
  }

  Future<void> signOut() async {
    try {
      state = state.copyWith(isLoading: true);
      
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));
      
      state = state.copyWith(
        isLoading: false,
        isAuthenticated: false,
        user: null,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'Mock error: $e',
      );
    }
  }

  Future<void> resetPassword(String email) async {
    try {
      state = state.copyWith(isLoading: true, error: null);
      
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));
      
      state = state.copyWith(isLoading: false);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'Mock error: $e',
      );
    }
  }

  void clearError() {
    state = state.copyWith(error: null);
  }
}

// Mock providers
final mockAuthProvider = StateNotifierProvider<MockAuthNotifier, MockAuthState>((ref) {
  return MockAuthNotifier();
});

// Mock lessons provider
final mockLessonsProvider = FutureProvider<List<Lesson>>((ref) async {
  await Future.delayed(const Duration(seconds: 1)); // Simulate loading
  
  return [
    Lesson(
      id: '1',
      title: 'Basic Greetings',
      description: 'Learn essential Moroccan Arabic greetings',
      content: LessonContent(
        vocabulary: [
          VocabularyItem(
            word: 'Salam',
            transliteration: 'Salam',
            translation: 'Hello/Peace',
            audioUrl: null,
          ),
          VocabularyItem(
            word: 'Labas',
            transliteration: 'Labas',
            translation: 'How are you?',
            audioUrl: null,
          ),
        ],
        sentences: [
          'Salam, labas?',
        ],
        exercises: [],
      ),
      difficulty: 'beginner',
      duration: 10,
      tags: ['greetings', 'basics'],
      metadata: LessonMetadata(
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        viewCount: 0,
        rating: 0.0,
        ratingCount: 0,
        isPremium: false,
        tags: ['greetings', 'basics'],
      ),
    ),
    Lesson(
      id: '2',
      title: 'Numbers 1-10',
      description: 'Learn to count from 1 to 10 in Darija',
      content: LessonContent(
        vocabulary: [
          VocabularyItem(
            word: 'Wahid',
            transliteration: 'Wahid',
            translation: 'One',
            audioUrl: null,
          ),
          VocabularyItem(
            word: 'Juj',
            transliteration: 'Juj',
            translation: 'Two',
            audioUrl: null,
          ),
        ],
        sentences: [],
        exercises: [],
      ),
      difficulty: 'beginner',
      duration: 15,
      tags: ['numbers', 'basics'],
      metadata: LessonMetadata(
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        viewCount: 0,
        rating: 0.0,
        ratingCount: 0,
        isPremium: false,
        tags: ['numbers', 'basics'],
      ),
    ),
  ];
});

// Mock quizzes provider
final mockQuizzesProvider = FutureProvider<List<Quiz>>((ref) async {
  await Future.delayed(const Duration(seconds: 1)); // Simulate loading
  
  return [
    Quiz(
      id: '1',
      title: 'Greetings Quiz',
      description: 'Test your knowledge of basic greetings',
      type: QuizType.vocabulary,
      questions: [
        QuizQuestion(
          question: 'What does "Salam" mean?',
          type: QuestionType.multipleChoice,
          options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
          correctAnswerIndex: 0,
          points: 10,
          explanation: 'Salam means "Hello" or "Peace" in Darija.',
        ),
      ],
      totalQuestions: 1,
      timeLimit: 300,
      passingScore: 70,
      isAdaptive: false,
      metadata: QuizMetadata(
        difficulty: 'beginner',
        tags: ['greetings'],
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        attemptCount: 0,
        averageScore: 0.0,
        completionRate: 0.0,
      ),
    ),
  ];
});

// Mock current user provider
final mockCurrentUserProvider = FutureProvider<User?>((ref) async {
  final authState = ref.watch(mockAuthProvider);
  return authState.user;
});

// Mock user progress provider
final mockUserProgressProvider = FutureProvider<UserProgress?>((ref) async {
  final user = await ref.watch(mockCurrentUserProvider.future);
  return user?.progress;
});

// Mock user stats provider
final mockUserStatsProvider = FutureProvider<UserStats?>((ref) async {
  final user = await ref.watch(mockCurrentUserProvider.future);
  return user?.stats;
});

// Mock user level provider
final mockUserLevelProvider = FutureProvider<UserLevel?>((ref) async {
  final user = await ref.watch(mockCurrentUserProvider.future);
  return user?.level;
});

// Mock streak provider
final mockStreakProvider = FutureProvider<int>((ref) async {
  final user = await ref.watch(mockCurrentUserProvider.future);
  return user?.currentStreak ?? 0;
});

// Mock total XP provider
final mockTotalXpProvider = FutureProvider<int>((ref) async {
  final user = await ref.watch(mockCurrentUserProvider.future);
  return user?.totalXp ?? 0;
});

// Mock completed lessons provider
final mockCompletedLessonsProvider = FutureProvider<List<String>>((ref) async {
  final user = await ref.watch(mockCurrentUserProvider.future);
  return user?.progress.completedLessons ?? [];
});

// Mock user preferences provider
final mockUserPreferencesProvider = FutureProvider<UserPreferences?>((ref) async {
  final user = await ref.watch(mockCurrentUserProvider.future);
  return user?.preferences;
});

// Mock badges provider
final mockBadgesProvider = FutureProvider<List<String>>((ref) async {
  final user = await ref.watch(mockCurrentUserProvider.future);
  return user?.badges ?? [];
}); 