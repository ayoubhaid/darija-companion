import '../entities/lesson.dart';

abstract class LessonRepositoryInterface {
  Future<List<Lesson>> getLessons();
  Future<Lesson?> getLesson(String lessonId);
  Future<List<Lesson>> getLessonsByTopic(String topic);
  Future<List<Lesson>> getLessonsByDifficulty(int difficulty);
  Future<List<Lesson>> getLessonsByTags(List<String> tags);
  Future<List<Lesson>> getPremiumLessons();
  Future<List<Lesson>> getFreeLessons();
  Future<List<Lesson>> searchLessons(String query);
  Future<void> createLesson(Lesson lesson);
  Future<void> updateLesson(Lesson lesson);
  Future<void> deleteLesson(String lessonId);
  Future<void> incrementViewCount(String lessonId);
  Future<void> updateRating(String lessonId, double rating);
  Stream<List<Lesson>> watchLessons();
  Stream<Lesson?> watchLesson(String lessonId);
  Future<List<String>> getTopics();
  Future<List<String>> getTags();
  Future<List<Lesson>> getRecommendedLessons(String userId);
  Future<List<Lesson>> getPopularLessons({int limit = 10});
  Future<List<Lesson>> getRecentLessons({int limit = 10});
} 