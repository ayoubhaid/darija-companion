import 'package:flutter_riverpod/flutter_riverpod.dart';
// import 'package:firebase_auth/firebase_auth.dart';

import '../../domain/entities/user.dart' as app_user;
// import '../../data/repositories/user_repository.dart';
// import 'app_providers.dart';

class AuthState {
  final bool isLoading;
  final bool isAuthenticated;
  final app_user.User? user;
  final String? error;
  // final User? firebaseUser;

  const AuthState({
    this.isLoading = false,
    this.isAuthenticated = false,
    this.user,
    this.error,
    // this.firebaseUser,
  });

  AuthState copyWith({
    bool? isLoading,
    bool? isAuthenticated,
    app_user.User? user,
    String? error,
    // User? firebaseUser,
  }) {
    return AuthState(
      isLoading: isLoading ?? this.isLoading,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      user: user ?? this.user,
      error: error ?? this.error,
      // firebaseUser: firebaseUser ?? this.firebaseUser,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  // final FirebaseAuth _auth;
  // final UserRepository _userRepository;

  AuthNotifier() : super(const AuthState()) {
    _init();
  }

  void _init() {
    // Simulate authentication state
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        state = state.copyWith(
          isAuthenticated: true,
          user: _createMockUser(),
        );
      }
    });
  }

  app_user.User _createMockUser() {
    return app_user.User(
      id: 'mock-user-id',
      username: 'demo_user',
      email: 'demo@example.com',
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
      level: const app_user.UserLevel(
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
      preferences: const app_user.UserPreferences(
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
      progress: app_user.UserProgress(
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
      stats: const app_user.UserStats(
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

  // TODO: Implement user update methods when copyWith is available
  // For now, these methods are commented out to avoid compilation errors
  
  /*
  Future<void> updateUserProfile({
    String? displayName,
    String? profileImageUrl,
  }) async {
    try {
      if (state.user != null) {
        final updatedUser = state.user!.copyWith(
          displayName: displayName,
          profileImageUrl: profileImageUrl,
          lastActiveAt: DateTime.now(),
        );
        
        await _userRepository.updateUser(updatedUser);
        
        state = state.copyWith(user: updatedUser);
      }
    } catch (e) {
      state = state.copyWith(error: _getErrorMessage(e));
    }
  }

  Future<void> addXp(int xp) async {
    try {
      if (state.user != null) {
        final newTotalXp = state.user!.totalXp + xp;
        final currentLevel = state.user!.level.level;
        
        // Calculate new level
        int newLevel = currentLevel;
        int xpRequiredForNext = state.user!.level.xpRequiredForNextLevel;
        
        while (newTotalXp >= xpRequiredForNext) {
          newLevel++;
          xpRequiredForNext = _calculateXpRequired(newLevel);
        }
        
        final newLevelTitle = _getLevelTitle(newLevel);
        final newProgressPercentage = newLevel > currentLevel 
            ? 0.0 
            : (newTotalXp / xpRequiredForNext);
        final newXpRemaining = xpRequiredForNext - newTotalXp;
        
        final newUserLevel = app_user.UserLevel(
          level: newLevel,
          title: newLevelTitle,
          currentXp: newTotalXp,
          xpRequiredForNextLevel: xpRequiredForNext,
          progressPercentage: newProgressPercentage,
          xpRemaining: newXpRemaining,
        );
        
        final updatedUser = state.user!.copyWith(
          totalXp: newTotalXp,
          level: newUserLevel,
          lastActiveAt: DateTime.now(),
        );
        
        await _userRepository.updateUser(updatedUser);
        
        state = state.copyWith(user: updatedUser);
      }
    } catch (e) {
      state = state.copyWith(error: _getErrorMessage(e));
    }
  }

  Future<void> completeLesson(String lessonId) async {
    try {
      if (state.user != null) {
        final updatedCompletedLessons = List<String>.from(state.user!.progress.completedLessons);
        if (!updatedCompletedLessons.contains(lessonId)) {
          updatedCompletedLessons.add(lessonId);
        }
        
        final updatedProgress = state.user!.progress.copyWith(
          lessonsCompleted: state.user!.progress.lessonsCompleted + 1,
          completedLessons: updatedCompletedLessons,
          lastActive: DateTime.now(),
        );
        
        final updatedUser = state.user!.copyWith(
          progress: updatedProgress,
          lastActiveAt: DateTime.now(),
        );
        
        await _userRepository.updateUser(updatedUser);
        
        state = state.copyWith(user: updatedUser);
      }
    } catch (e) {
      state = state.copyWith(error: _getErrorMessage(e));
    }
  }

  Future<void> updateStudyStreak() async {
    try {
      if (state.user != null) {
        final now = DateTime.now();
        final lastStudyDate = state.user!.lastStudyDate;
        int newStreak = state.user!.currentStreak;
        
        if (lastStudyDate != null) {
          final daysDifference = now.difference(lastStudyDate).inDays;
          
          if (daysDifference == 1) {
            // Consecutive day
            newStreak++;
          } else if (daysDifference > 1) {
            // Streak broken
            newStreak = 1;
          }
        } else {
          // First study session
          newStreak = 1;
        }
        
        final longestStreak = newStreak > state.user!.longestStreak 
            ? newStreak 
            : state.user!.longestStreak;
        
        final updatedUser = state.user!.copyWith(
          currentStreak: newStreak,
          longestStreak: longestStreak,
          lastStudyDate: now,
          lastActiveAt: now,
        );
        
        await _userRepository.updateUser(updatedUser);
        
        state = state.copyWith(user: updatedUser);
      }
    } catch (e) {
      state = state.copyWith(error: _getErrorMessage(e));
    }
  }

  Future<void> addBadge(String badge) async {
    try {
      if (state.user != null && !state.user!.badges.contains(badge)) {
        final updatedBadges = List<String>.from(state.user!.badges)..add(badge);
        
        final updatedUser = state.user!.copyWith(
          badges: updatedBadges,
          lastActiveAt: DateTime.now(),
        );
        
        await _userRepository.updateUser(updatedUser);
        
        state = state.copyWith(user: updatedUser);
      }
    } catch (e) {
      state = state.copyWith(error: _getErrorMessage(e));
    }
  }
  */

  void clearError() {
    state = state.copyWith(error: null);
  }

  String _getErrorMessage(dynamic error) {
    // Simplified error handling for mock implementation
    return error.toString();
  }

  int _calculateXpRequired(int level) {
    // Exponential growth for XP requirements
    return (100 * (1.5 * (level - 1))).round();
  }

  String _getLevelTitle(int level) {
    if (level <= 5) return 'Beginner';
    if (level <= 10) return 'Elementary';
    if (level <= 15) return 'Intermediate';
    if (level <= 20) return 'Upper Intermediate';
    if (level <= 25) return 'Advanced';
    if (level <= 30) return 'Expert';
    return 'Master';
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
}); 