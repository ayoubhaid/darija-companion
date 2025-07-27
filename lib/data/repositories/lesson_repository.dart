// import 'package:cloud_firestore/cloud_firestore.dart';

import '../../domain/entities/lesson.dart';
import '../../domain/repositories/lesson_repository_interface.dart';

class LessonRepository implements LessonRepositoryInterface {
  // final FirebaseFirestore _firestore;

  // LessonRepository(this._firestore);

  @override
  Future<List<Lesson>> getLessons() async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    return _createMockLessons();
  }

  @override
  Future<Lesson?> getLesson(String lessonId) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    final lessons = _createMockLessons();
    return lessons.firstWhere((lesson) => lesson.id == lessonId);
  }

  @override
  Future<List<Lesson>> getLessonsByDifficulty(int difficulty) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    final lessons = _createMockLessons();
    return lessons.where((lesson) => lesson.difficulty == 'beginner').toList();
  }

  @override
  Future<List<Lesson>> getLessonsByTopic(String topic) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    final lessons = _createMockLessons();
    return lessons.where((lesson) => lesson.tags.contains(topic)).toList();
  }

  @override
  Future<List<Lesson>> getLessonsByTags(List<String> tags) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    final lessons = _createMockLessons();
    return lessons.where((lesson) => lesson.tags.any((tag) => tags.contains(tag))).toList();
  }

  @override
  Future<List<Lesson>> getFreeLessons() async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    final lessons = _createMockLessons();
    return lessons.where((lesson) => !lesson.metadata.isPremium).toList();
  }

  @override
  Future<List<Lesson>> getPremiumLessons() async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    final lessons = _createMockLessons();
    return lessons.where((lesson) => lesson.metadata.isPremium).toList();
  }

  @override
  Future<List<Lesson>> getLessonsByLevel(int level) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    return _createMockLessons();
  }

  @override
  Future<List<Lesson>> getRecommendedLessons(String userId) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    return _createMockLessons();
  }

  @override
  Future<List<Lesson>> getPopularLessons({int limit = 10}) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    return _createMockLessons();
  }

  @override
  Future<List<Lesson>> getRecentLessons({int limit = 10}) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    return _createMockLessons();
  }

  @override
  Future<void> createLesson(Lesson lesson) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    print('Mock: Created lesson ${lesson.id}');
  }

  @override
  Future<void> updateLesson(Lesson lesson) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    print('Mock: Updated lesson ${lesson.id}');
  }

  @override
  Future<void> deleteLesson(String lessonId) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    print('Mock: Deleted lesson $lessonId');
  }

  @override
  Future<void> incrementViewCount(String lessonId) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    print('Mock: Incremented view count for lesson $lessonId');
  }

  @override
  Future<void> updateRating(String lessonId, double rating) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    print('Mock: Updated rating for lesson $lessonId to $rating');
  }

  @override
  Stream<List<Lesson>> watchLessons() {
    // Mock implementation - return a stream that emits once
    return Stream.value(_createMockLessons());
  }

  @override
  Stream<Lesson?> watchLesson(String lessonId) {
    // Mock implementation - return a stream that emits once
    final lessons = _createMockLessons();
    final lesson = lessons.firstWhere((lesson) => lesson.id == lessonId);
    return Stream.value(lesson);
  }

  @override
  Future<List<String>> getTags() async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    return ['greetings', 'basics', 'numbers', 'food', 'family'];
  }

  @override
  Future<List<String>> getTopics() async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    return ['greetings', 'basics', 'numbers', 'food', 'family'];
  }

  @override
  Future<List<Lesson>> searchLessons(String query) async {
    // Mock implementation
    await Future.delayed(const Duration(seconds: 1));
    final lessons = _createMockLessons();
    return lessons.where((lesson) => 
      lesson.title.toLowerCase().contains(query.toLowerCase()) ||
      lesson.description.toLowerCase().contains(query.toLowerCase())
    ).toList();
  }

  List<Lesson> _createMockLessons() {
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
  }
} 