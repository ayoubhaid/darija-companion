// import 'package:cloud_firestore/cloud_firestore.dart';

import '../../domain/entities/quiz.dart';
import '../../domain/repositories/quiz_repository_interface.dart';

class QuizRepository implements QuizRepositoryInterface {
  // final FirebaseFirestore _firestore;

  // QuizRepository(this._firestore);

  @override
  Future<List<Quiz>> getQuizzes() async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    return _createMockQuizzes();
  }

  @override
  Future<Quiz?> getQuiz(String quizId) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    final quizzes = _createMockQuizzes();
    return quizzes.firstWhere((quiz) => quiz.id == quizId);
  }

  @override
  Future<List<Quiz>> getQuizzesByType(QuizType type) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    final quizzes = _createMockQuizzes();
    return quizzes.where((quiz) => quiz.type == type).toList();
  }

  @override
  Future<List<Quiz>> getQuizzesByDifficulty(String difficulty) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    final quizzes = _createMockQuizzes();
    return quizzes.where((quiz) => quiz.metadata.difficulty == difficulty).toList();
  }

  @override
  Future<List<Quiz>> getQuizzesByLesson(String lessonId) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    return _createMockQuizzes();
  }

  @override
  Future<void> createQuiz(Quiz quiz) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    print('Mock: Created quiz ${quiz.id}');
  }

  @override
  Future<void> updateQuiz(Quiz quiz) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    print('Mock: Updated quiz ${quiz.id}');
  }

  @override
  Future<void> deleteQuiz(String quizId) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    print('Mock: Deleted quiz $quizId');
  }

  @override
  Future<void> incrementAttemptCount(String quizId) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    print('Mock: Incremented attempt count for quiz $quizId');
  }

  @override
  Future<void> updateAverageScore(String quizId, double score) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    print('Mock: Updated average score for quiz $quizId to $score');
  }

  @override
  Stream<List<Quiz>> watchQuizzes() {
    // Mock implementation - return a stream that emits once
    return Stream.value(_createMockQuizzes());
  }

  @override
  Stream<Quiz?> watchQuiz(String quizId) {
    // Mock implementation - return a stream that emits once
    final quizzes = _createMockQuizzes();
    final quiz = quizzes.firstWhere((quiz) => quiz.id == quizId);
    return Stream.value(quiz);
  }

  @override
  Future<List<Quiz>> getPopularQuizzes({int limit = 10}) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    return _createMockQuizzes();
  }

  @override
  Future<List<Quiz>> getRecentQuizzes({int limit = 10}) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    return _createMockQuizzes();
  }

  @override
  Future<List<Quiz>> getRecommendedQuizzes(String userId) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    return _createMockQuizzes();
  }

  List<Quiz> _createMockQuizzes() {
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
  }
} 