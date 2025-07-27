import 'package:json_annotation/json_annotation.dart';

part 'user.g.dart';

@JsonSerializable()
class User {
  final String id;
  final String email;
  final String username;
  final String? displayName;
  final String? profileImageUrl;
  final UserLevel level;
  final int totalXp;
  final int currentStreak;
  final int longestStreak;
  final List<String> badges;
  final UserProgress progress;
  final UserStats stats;
  final UserPreferences preferences;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime? lastStudyDate;

  const User({
    required this.id,
    required this.email,
    required this.username,
    this.displayName,
    this.profileImageUrl,
    required this.level,
    required this.totalXp,
    required this.currentStreak,
    required this.longestStreak,
    required this.badges,
    required this.progress,
    required this.stats,
    required this.preferences,
    required this.createdAt,
    required this.updatedAt,
    this.lastStudyDate,
  });

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
  Map<String, dynamic> toJson() => _$UserToJson(this);
}

@JsonSerializable()
class UserLevel {
  final int level;
  final String title;
  final int currentXp;
  final int xpRequiredForNextLevel;
  final double progressPercentage;
  final int xpRemaining;

  const UserLevel({
    required this.level,
    required this.title,
    required this.currentXp,
    required this.xpRequiredForNextLevel,
    required this.progressPercentage,
    required this.xpRemaining,
  });

  factory UserLevel.fromJson(Map<String, dynamic> json) => _$UserLevelFromJson(json);
  Map<String, dynamic> toJson() => _$UserLevelToJson(this);
}

@JsonSerializable()
class UserProgress {
  final int lessonsCompleted;
  final int vocabularyLearned;
  final int quizzesTaken;
  final int perfectScores;
  final int totalStudyTime; // in minutes
  final DateTime lastActive;
  final List<String> completedLessons;
  final DateTime? vocabularyLastReviewed;
  final Map<String, double> topicProgress;

  const UserProgress({
    required this.lessonsCompleted,
    required this.vocabularyLearned,
    required this.quizzesTaken,
    required this.perfectScores,
    required this.totalStudyTime,
    required this.lastActive,
    required this.completedLessons,
    this.vocabularyLastReviewed,
    required this.topicProgress,
  });

  factory UserProgress.fromJson(Map<String, dynamic> json) => _$UserProgressFromJson(json);
  Map<String, dynamic> toJson() => _$UserProgressToJson(this);
}

@JsonSerializable()
class UserStats {
  final int totalLessons;
  final int totalVocabulary;
  final int totalQuizzes;
  final double averageScore;
  final int studyStreak;
  final int totalStudyTime; // in minutes
  final double accuracyRate;
  final int daysStudied;
  final double averageStudyTimePerDay;
  final List<DateTime> studyDates;
  final Map<String, int> studyTimeByTopic;

  const UserStats({
    required this.totalLessons,
    required this.totalVocabulary,
    required this.totalQuizzes,
    required this.averageScore,
    required this.studyStreak,
    required this.totalStudyTime,
    required this.accuracyRate,
    required this.daysStudied,
    required this.averageStudyTimePerDay,
    required this.studyDates,
    required this.studyTimeByTopic,
  });

  factory UserStats.fromJson(Map<String, dynamic> json) => _$UserStatsFromJson(json);
  Map<String, dynamic> toJson() => _$UserStatsToJson(this);
}

@JsonSerializable()
class UserPreferences {
  final bool notificationsEnabled;
  final bool soundEnabled;
  final bool autoPlayAudio;
  final bool showTransliteration;
  final String interfaceLanguage;
  final String difficultyLevel;
  final String nativeLanguage;
  final String targetLanguage;
  final bool enableNotifications;
  final bool enableOfflineMode;
  final int dailyGoal;
  final List<String> learningTopics;

  const UserPreferences({
    required this.notificationsEnabled,
    required this.soundEnabled,
    required this.autoPlayAudio,
    required this.showTransliteration,
    required this.interfaceLanguage,
    required this.difficultyLevel,
    required this.nativeLanguage,
    required this.targetLanguage,
    required this.enableNotifications,
    required this.enableOfflineMode,
    required this.dailyGoal,
    required this.learningTopics,
  });

  factory UserPreferences.fromJson(Map<String, dynamic> json) => _$UserPreferencesFromJson(json);
  Map<String, dynamic> toJson() => _$UserPreferencesToJson(this);
} 