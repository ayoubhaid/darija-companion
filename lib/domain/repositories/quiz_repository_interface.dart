import '../entities/quiz.dart';

abstract class QuizRepositoryInterface {
  Future<List<Quiz>> getQuizzes();
  Future<Quiz?> getQuiz(String quizId);
  Future<List<Quiz>> getQuizzesByType(QuizType type);
  Future<List<Quiz>> getQuizzesByDifficulty(String difficulty);
  Future<List<Quiz>> getQuizzesByLesson(String lessonId);
  Future<void> createQuiz(Quiz quiz);
  Future<void> updateQuiz(Quiz quiz);
  Future<void> deleteQuiz(String quizId);
  Future<void> incrementAttemptCount(String quizId);
  Future<void> updateAverageScore(String quizId, double score);
  Stream<List<Quiz>> watchQuizzes();
  Stream<Quiz?> watchQuiz(String quizId);
  Future<List<Quiz>> getPopularQuizzes({int limit = 10});
  Future<List<Quiz>> getRecentQuizzes({int limit = 10});
  Future<List<Quiz>> getRecommendedQuizzes(String userId);
} 