// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

User _$UserFromJson(Map<String, dynamic> json) => User(
      id: json['id'] as String,
      email: json['email'] as String,
      username: json['username'] as String,
      displayName: json['displayName'] as String?,
      profileImageUrl: json['profileImageUrl'] as String?,
      level: UserLevel.fromJson(json['level'] as Map<String, dynamic>),
      totalXp: (json['totalXp'] as num).toInt(),
      currentStreak: (json['currentStreak'] as num).toInt(),
      longestStreak: (json['longestStreak'] as num).toInt(),
      badges:
          (json['badges'] as List<dynamic>).map((e) => e as String).toList(),
      progress: UserProgress.fromJson(json['progress'] as Map<String, dynamic>),
      stats: UserStats.fromJson(json['stats'] as Map<String, dynamic>),
      preferences:
          UserPreferences.fromJson(json['preferences'] as Map<String, dynamic>),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      lastStudyDate: json['lastStudyDate'] == null
          ? null
          : DateTime.parse(json['lastStudyDate'] as String),
    );

Map<String, dynamic> _$UserToJson(User instance) => <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'username': instance.username,
      'displayName': instance.displayName,
      'profileImageUrl': instance.profileImageUrl,
      'level': instance.level,
      'totalXp': instance.totalXp,
      'currentStreak': instance.currentStreak,
      'longestStreak': instance.longestStreak,
      'badges': instance.badges,
      'progress': instance.progress,
      'stats': instance.stats,
      'preferences': instance.preferences,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'lastStudyDate': instance.lastStudyDate?.toIso8601String(),
    };

UserLevel _$UserLevelFromJson(Map<String, dynamic> json) => UserLevel(
      level: (json['level'] as num).toInt(),
      title: json['title'] as String,
      currentXp: (json['currentXp'] as num).toInt(),
      xpRequiredForNextLevel: (json['xpRequiredForNextLevel'] as num).toInt(),
      progressPercentage: (json['progressPercentage'] as num).toDouble(),
      xpRemaining: (json['xpRemaining'] as num).toInt(),
    );

Map<String, dynamic> _$UserLevelToJson(UserLevel instance) => <String, dynamic>{
      'level': instance.level,
      'title': instance.title,
      'currentXp': instance.currentXp,
      'xpRequiredForNextLevel': instance.xpRequiredForNextLevel,
      'progressPercentage': instance.progressPercentage,
      'xpRemaining': instance.xpRemaining,
    };

UserProgress _$UserProgressFromJson(Map<String, dynamic> json) => UserProgress(
      lessonsCompleted: (json['lessonsCompleted'] as num).toInt(),
      vocabularyLearned: (json['vocabularyLearned'] as num).toInt(),
      quizzesTaken: (json['quizzesTaken'] as num).toInt(),
      perfectScores: (json['perfectScores'] as num).toInt(),
      totalStudyTime: (json['totalStudyTime'] as num).toInt(),
      lastActive: DateTime.parse(json['lastActive'] as String),
      completedLessons: (json['completedLessons'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      vocabularyLastReviewed: json['vocabularyLastReviewed'] == null
          ? null
          : DateTime.parse(json['vocabularyLastReviewed'] as String),
      topicProgress: (json['topicProgress'] as Map<String, dynamic>).map(
        (k, e) => MapEntry(k, (e as num).toDouble()),
      ),
    );

Map<String, dynamic> _$UserProgressToJson(UserProgress instance) =>
    <String, dynamic>{
      'lessonsCompleted': instance.lessonsCompleted,
      'vocabularyLearned': instance.vocabularyLearned,
      'quizzesTaken': instance.quizzesTaken,
      'perfectScores': instance.perfectScores,
      'totalStudyTime': instance.totalStudyTime,
      'lastActive': instance.lastActive.toIso8601String(),
      'completedLessons': instance.completedLessons,
      'vocabularyLastReviewed':
          instance.vocabularyLastReviewed?.toIso8601String(),
      'topicProgress': instance.topicProgress,
    };

UserStats _$UserStatsFromJson(Map<String, dynamic> json) => UserStats(
      totalLessons: (json['totalLessons'] as num).toInt(),
      totalVocabulary: (json['totalVocabulary'] as num).toInt(),
      totalQuizzes: (json['totalQuizzes'] as num).toInt(),
      averageScore: (json['averageScore'] as num).toDouble(),
      studyStreak: (json['studyStreak'] as num).toInt(),
      totalStudyTime: (json['totalStudyTime'] as num).toInt(),
      accuracyRate: (json['accuracyRate'] as num).toDouble(),
      daysStudied: (json['daysStudied'] as num).toInt(),
      averageStudyTimePerDay:
          (json['averageStudyTimePerDay'] as num).toDouble(),
      studyDates: (json['studyDates'] as List<dynamic>)
          .map((e) => DateTime.parse(e as String))
          .toList(),
      studyTimeByTopic: Map<String, int>.from(json['studyTimeByTopic'] as Map),
    );

Map<String, dynamic> _$UserStatsToJson(UserStats instance) => <String, dynamic>{
      'totalLessons': instance.totalLessons,
      'totalVocabulary': instance.totalVocabulary,
      'totalQuizzes': instance.totalQuizzes,
      'averageScore': instance.averageScore,
      'studyStreak': instance.studyStreak,
      'totalStudyTime': instance.totalStudyTime,
      'accuracyRate': instance.accuracyRate,
      'daysStudied': instance.daysStudied,
      'averageStudyTimePerDay': instance.averageStudyTimePerDay,
      'studyDates':
          instance.studyDates.map((e) => e.toIso8601String()).toList(),
      'studyTimeByTopic': instance.studyTimeByTopic,
    };

UserPreferences _$UserPreferencesFromJson(Map<String, dynamic> json) =>
    UserPreferences(
      notificationsEnabled: json['notificationsEnabled'] as bool,
      soundEnabled: json['soundEnabled'] as bool,
      autoPlayAudio: json['autoPlayAudio'] as bool,
      showTransliteration: json['showTransliteration'] as bool,
      interfaceLanguage: json['interfaceLanguage'] as String,
      difficultyLevel: json['difficultyLevel'] as String,
      nativeLanguage: json['nativeLanguage'] as String,
      targetLanguage: json['targetLanguage'] as String,
      enableNotifications: json['enableNotifications'] as bool,
      enableOfflineMode: json['enableOfflineMode'] as bool,
      dailyGoal: (json['dailyGoal'] as num).toInt(),
      learningTopics: (json['learningTopics'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
    );

Map<String, dynamic> _$UserPreferencesToJson(UserPreferences instance) =>
    <String, dynamic>{
      'notificationsEnabled': instance.notificationsEnabled,
      'soundEnabled': instance.soundEnabled,
      'autoPlayAudio': instance.autoPlayAudio,
      'showTransliteration': instance.showTransliteration,
      'interfaceLanguage': instance.interfaceLanguage,
      'difficultyLevel': instance.difficultyLevel,
      'nativeLanguage': instance.nativeLanguage,
      'targetLanguage': instance.targetLanguage,
      'enableNotifications': instance.enableNotifications,
      'enableOfflineMode': instance.enableOfflineMode,
      'dailyGoal': instance.dailyGoal,
      'learningTopics': instance.learningTopics,
    };
