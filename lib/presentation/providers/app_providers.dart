// import 'package:firebase_auth/firebase_auth.dart' as firebase_auth;
// import 'package:cloud_firestore/cloud_firestore.dart';

// import '../../data/repositories/user_repository.dart';
// import '../../data/repositories/lesson_repository.dart';
// import '../../data/repositories/quiz_repository.dart';

// Firebase Auth Provider - Disabled for local development
// final firebaseAuthProvider = Provider<firebase_auth.FirebaseAuth>((ref) {
//   return firebase_auth.FirebaseAuth.instance;
// });

// final firestoreProvider = Provider<FirebaseFirestore>((ref) {
//   return FirebaseFirestore.instance;
// });

// Auth State Provider - Disabled for local development
// final authStateProvider = StreamProvider<firebase_auth.User?>((ref) {
//   final auth = ref.watch(firebaseAuthProvider);
//   return auth.authStateChanges();
// });

// User Repository Provider - Disabled for local development
// final userRepositoryProvider = Provider<UserRepository>((ref) {
//   final firestore = ref.watch(firestoreProvider);
//   final auth = ref.watch(firebaseAuthProvider);
//   return UserRepository(firestore, auth);
// });

// Lesson Repository Provider - Disabled for local development
// final lessonRepositoryProvider = Provider<LessonRepository>((ref) {
//   final firestore = ref.watch(firestoreProvider);
//   return LessonRepository(firestore);
// });

// Quiz Repository Provider - Disabled for local development
// final quizRepositoryProvider = Provider<QuizRepository>((ref) {
//   final firestore = ref.watch(firestoreProvider);
//   return QuizRepository(firestore);
// });

// Current User Provider - Disabled for local development
// final currentUserProvider = FutureProvider<User?>((ref) async {
//   final auth = ref.watch(firebaseAuthProvider);
//   final userRepository = ref.watch(userRepositoryProvider);
//   
//   final firebaseUser = auth.currentUser;
//   if (firebaseUser == null) return null;
//   
//   return await userRepository.getUser(firebaseUser.uid);
// });

// Lessons Provider - Disabled for local development
// final lessonsProvider = FutureProvider<List<Lesson>>((ref) async {
//   final lessonRepository = ref.watch(lessonRepositoryProvider);
//   return await lessonRepository.getLessons();
// });

// Quizzes Provider - Disabled for local development
// final quizzesProvider = FutureProvider<List<Quiz>>((ref) async {
//   final quizRepository = ref.watch(quizRepositoryProvider);
//   return await quizRepository.getQuizzes();
// });

// User Progress Provider - Disabled for local development
// final userProgressProvider = FutureProvider<UserProgress?>((ref) async {
//   final user = await ref.watch(currentUserProvider.future);
//   return user?.progress;
// });

// User Stats Provider - Disabled for local development
// final userStatsProvider = FutureProvider<UserStats?>((ref) async {
//   final user = await ref.watch(currentUserProvider.future);
//   return user?.stats;
// });

// User Level Provider - Disabled for local development
// final userLevelProvider = FutureProvider<UserLevel?>((ref) async {
//   final user = await ref.watch(currentUserProvider.future);
//   return user?.level;
// });

// Streak Provider - Disabled for local development
// final streakProvider = FutureProvider<int>((ref) async {
//   final user = await ref.watch(currentUserProvider.future);
//   return user?.currentStreak ?? 0;
// });

// Total XP Provider - Disabled for local development
// final totalXpProvider = FutureProvider<int>((ref) async {
//   final user = await ref.watch(currentUserProvider.future);
//   return user?.totalXp ?? 0;
// });

// Completed Lessons Provider - Disabled for local development
// final completedLessonsProvider = FutureProvider<List<String>>((ref) async {
//   final user = await ref.watch(currentUserProvider.future);
//   return user?.progress.completedLessons ?? [];
// });

// Vocabulary Progress Provider - Disabled for local development
// final vocabularyProgressProvider = FutureProvider<Map<String, DateTime?>>((ref) async {
//   final user = await ref.watch(currentUserProvider.future);
//   return user?.progress.vocabularyLastReviewed != null 
//       ? {'vocabulary': user!.progress.vocabularyLastReviewed!} 
//       : <String, DateTime?>{};
// });

// Topic Progress Provider - Disabled for local development
// final topicProgressProvider = FutureProvider<Map<String, double>>((ref) async {
//   final user = await ref.watch(currentUserProvider.future);
//   return user?.progress.topicProgress ?? <String, double>{};
// });

// User Preferences Provider - Disabled for local development
// final userPreferencesProvider = FutureProvider<UserPreferences?>((ref) async {
//   final user = await ref.watch(currentUserProvider.future);
//   return user?.preferences;
// });

// Badges Provider - Disabled for local development
// final badgesProvider = FutureProvider<List<String>>((ref) async {
//   final user = await ref.watch(currentUserProvider.future);
//   return user?.badges ?? [];
// });

// Study Time Provider - Disabled for local development
// final studyTimeProvider = FutureProvider<int>((ref) async {
//   final stats = await ref.watch(userStatsProvider.future);
//   return stats?.totalStudyTime ?? 0;
// });

// Accuracy Rate Provider - Disabled for local development
// final accuracyRateProvider = FutureProvider<double>((ref) async {
//   final stats = await ref.watch(userStatsProvider.future);
//   return stats?.accuracyRate ?? 0.0;
// });

// Days Studied Provider - Disabled for local development
// final daysStudiedProvider = FutureProvider<int>((ref) async {
//   final stats = await ref.watch(userStatsProvider.future);
//   return stats?.daysStudied ?? 0;
// });

// Average Study Time Provider - Disabled for local development
// final averageStudyTimeProvider = FutureProvider<double>((ref) async {
//   final stats = await ref.watch(userStatsProvider.future);
//   return stats?.averageStudyTimePerDay ?? 0.0;
// });

// Study Dates Provider - Disabled for local development
// final studyDatesProvider = FutureProvider<List<DateTime>>((ref) async {
//   final stats = await ref.watch(userStatsProvider.future);
//   return stats?.studyDates ?? [];
// });

// Study Time by Topic Provider - Disabled for local development
// final studyTimeByTopicProvider = FutureProvider<Map<String, int>>((ref) async {
//   final stats = await ref.watch(userStatsProvider.future);
//   return stats?.studyTimeByTopic ?? <String, int>{};
// });

// Perfect Scores Provider - Disabled for local development
// final perfectScoresProvider = FutureProvider<int>((ref) async {
//   final progress = await ref.watch(userProgressProvider.future);
//   return progress?.perfectScores ?? 0;
// });

// Quizzes Taken Provider - Disabled for local development
// final quizzesTakenProvider = FutureProvider<int>((ref) async {
//   final progress = await ref.watch(userProgressProvider.future);
//   return progress?.quizzesTaken ?? 0;
// });

// Vocabulary Learned Provider - Disabled for local development
// final vocabularyLearnedProvider = FutureProvider<int>((ref) async {
//   final progress = await ref.watch(userProgressProvider.future);
//   return progress?.vocabularyLearned ?? 0;
// });

// Lessons Completed Provider - Disabled for local development
// final lessonsCompletedProvider = FutureProvider<int>((ref) async {
//   final progress = await ref.watch(userProgressProvider.future);
//   return progress?.lessonsCompleted ?? 0;
// });

// Longest Streak Provider - Disabled for local development
// final longestStreakProvider = FutureProvider<int>((ref) async {
//   final user = await ref.watch(currentUserProvider.future);
//   return user?.longestStreak ?? 0;
// });

// Last Study Date Provider - Disabled for local development
// final lastStudyDateProvider = FutureProvider<DateTime?>((ref) async {
//   final user = await ref.watch(currentUserProvider.future);
//   return user?.lastStudyDate;
// });

// User Display Name Provider - Disabled for local development
// final userDisplayNameProvider = FutureProvider<String?>((ref) async {
//   final user = await ref.watch(currentUserProvider.future);
//   return user?.displayName;
// });

// User Email Provider - Disabled for local development
// final userEmailProvider = FutureProvider<String>((ref) async {
//   final user = await ref.watch(currentUserProvider.future);
//   return user?.email ?? '';
// });

// User Profile Image Provider - Disabled for local development
// final userProfileImageProvider = FutureProvider<String?>((ref) async {
//   final user = await ref.watch(currentUserProvider.future);
//   return user?.profileImageUrl;
// });

// Native Language Provider - Disabled for local development
// final nativeLanguageProvider = FutureProvider<String>((ref) async {
//   final preferences = await ref.watch(userPreferencesProvider.future);
//   return preferences?.nativeLanguage ?? 'en';
// });

// Target Language Provider - Disabled for local development
// final targetLanguageProvider = FutureProvider<String>((ref) async {
//   final preferences = await ref.watch(userPreferencesProvider.future);
//   return preferences?.targetLanguage ?? 'ar-MA';
// });

// Show Transliteration Provider - Disabled for local development
// final showTransliterationProvider = FutureProvider<bool>((ref) async {
//   final preferences = await ref.watch(userPreferencesProvider.future);
//   return preferences?.showTransliteration ?? true;
// });

// Auto Play Audio Provider - Disabled for local development
// final autoPlayAudioProvider = FutureProvider<bool>((ref) async {
//   final preferences = await ref.watch(userPreferencesProvider.future);
//   return preferences?.autoPlayAudio ?? true;
// });

// Enable Notifications Provider - Disabled for local development
// final enableNotificationsProvider = FutureProvider<bool>((ref) async {
//   final preferences = await ref.watch(userPreferencesProvider.future);
//   return preferences?.enableNotifications ?? true;
// });

// Enable Offline Mode Provider - Disabled for local development
// final enableOfflineModeProvider = FutureProvider<bool>((ref) async {
//   final preferences = await ref.watch(userPreferencesProvider.future);
//   return preferences?.enableOfflineMode ?? true;
// });

// Daily Goal Provider - Disabled for local development
// final dailyGoalProvider = FutureProvider<int>((ref) async {
//   final preferences = await ref.watch(userPreferencesProvider.future);
//   return preferences?.dailyGoal ?? 15;
// });

// Difficulty Level Provider - Disabled for local development
// final difficultyLevelProvider = FutureProvider<String>((ref) async {
//   final preferences = await ref.watch(userPreferencesProvider.future);
//   return preferences?.difficultyLevel ?? 'beginner';
// });

// Learning Topics Provider - Disabled for local development
// final learningTopicsProvider = FutureProvider<List<String>>((ref) async {
//   final preferences = await ref.watch(userPreferencesProvider.future);
//   return preferences?.learningTopics ?? [];
// }); 