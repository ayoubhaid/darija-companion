class AppConstants {
  // App Information
  static const String appName = 'My Darija Companion';
  static const String appVersion = '1.0.0';
  static const String appDescription = 'Learn Moroccan Arabic (Darija) with interactive lessons and AI-powered features';
  
  // Firebase Configuration
  static const String firebaseProjectId = 'my-darija-companion';
  
  // API Endpoints
  static const String baseUrl = 'https://api.mydarijacompanion.com';
  static const String lessonsEndpoint = '/api/lessons';
  static const String vocabularyEndpoint = '/api/vocabulary';
  static const String audioEndpoint = '/api/audio';
  static const String quizEndpoint = '/api/quiz';
  static const String userProgressEndpoint = '/api/user-progress';
  
  // Audio Configuration
  static const int maxAudioDuration = 30; // seconds
  static const String audioFormat = 'mp3';
  static const double playbackRate = 1.0;
  
  // Learning Configuration
  static const int defaultLessonDuration = 15; // minutes
  static const int maxVocabularyPerLesson = 20;
  static const int minCorrectAnswersForProgress = 70; // percentage
  static const int streakBonusMultiplier = 2;
  
  // Spaced Repetition System (SRS) intervals (in days)
  static const List<int> srsIntervals = [1, 3, 7, 14, 30, 90, 180];
  
  // Gamification
  static const int xpPerCorrectAnswer = 10;
  static const int xpPerLessonCompleted = 50;
  static const int xpPerStreakDay = 25;
  static const int xpPerPerfectScore = 100;
  
  // Quiz Configuration
  static const int quizTimeLimit = 300; // seconds
  static const int maxQuizAttempts = 3;
  static const int questionsPerQuiz = 10;
  
  // Offline Configuration
  static const int maxOfflineLessons = 50;
  static const int maxOfflineVocabulary = 500;
  static const int syncIntervalMinutes = 30;
  
  // UI Configuration
  static const double defaultPadding = 16.0;
  static const double defaultRadius = 12.0;
  static const double defaultElevation = 4.0;
  static const Duration defaultAnimationDuration = Duration(milliseconds: 300);
  
  // Error Messages
  static const String networkErrorMessage = 'Please check your internet connection and try again.';
  static const String audioErrorMessage = 'Unable to play audio. Please try again.';
  static const String speechRecognitionErrorMessage = 'Speech recognition is not available.';
  static const String offlineErrorMessage = 'This feature requires an internet connection.';
  
  // Success Messages
  static const String lessonCompletedMessage = 'Great job! Lesson completed successfully.';
  static const String vocabularyLearnedMessage = 'New vocabulary added to your collection!';
  static const String streakMaintainedMessage = 'Excellent! Your streak continues!';
  
  // File Paths
  static const String audioCachePath = '/audio_cache';
  static const String imageCachePath = '/image_cache';
  static const String databasePath = '/app_database';
  
  // Local Storage Keys
  static const String userPreferencesKey = 'user_preferences';
  static const String userProgressKey = 'user_progress';
  static const String offlineDataKey = 'offline_data';
  static const String streakDataKey = 'streak_data';
  static const String vocabularyProgressKey = 'vocabulary_progress';
  
  // Animation Durations
  static const Duration shortAnimation = Duration(milliseconds: 200);
  static const Duration mediumAnimation = Duration(milliseconds: 300);
  static const Duration longAnimation = Duration(milliseconds: 500);
  
  // Validation
  static const int minUsernameLength = 3;
  static const int maxUsernameLength = 20;
  static const int minPasswordLength = 6;
  static const int maxPasswordLength = 50;
  
  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;
  
  // Cache Configuration
  static const int maxCacheSize = 100 * 1024 * 1024; // 100MB
  static const Duration cacheExpiration = Duration(days: 7);
  
  // Feature Flags
  static const bool enableARFeatures = false;
  static const bool enableVideoLessons = false;
  static const bool enableAIChatbot = true;
  static const bool enableSpeechRecognition = true;
  static const bool enableOfflineMode = true;
} 