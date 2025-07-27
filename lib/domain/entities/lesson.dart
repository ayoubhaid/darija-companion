import 'package:json_annotation/json_annotation.dart';

part 'lesson.g.dart';

@JsonSerializable()
class Lesson {
  final String id;
  final String title;
  final String description;
  final LessonContent content;
  final String difficulty;
  final int duration; // in minutes
  final List<String> tags;
  final LessonMetadata metadata;
  final String? imageUrl;
  final String? topic;
  final int? estimatedDuration;
  final bool? isPremium;

  const Lesson({
    required this.id,
    required this.title,
    required this.description,
    required this.content,
    required this.difficulty,
    required this.duration,
    required this.tags,
    required this.metadata,
    this.imageUrl,
    this.topic,
    this.estimatedDuration,
    this.isPremium,
  });

  factory Lesson.fromJson(Map<String, dynamic> json) => _$LessonFromJson(json);
  Map<String, dynamic> toJson() => _$LessonToJson(this);

  List<VocabularyItem> get vocabulary => content.vocabulary;
  List<Exercise> get exercises => content.exercises;
}

@JsonSerializable()
class LessonContent {
  final List<VocabularyItem> vocabulary;
  final List<String> sentences;
  final List<Exercise> exercises;

  const LessonContent({
    required this.vocabulary,
    required this.sentences,
    required this.exercises,
  });

  factory LessonContent.fromJson(Map<String, dynamic> json) => _$LessonContentFromJson(json);
  Map<String, dynamic> toJson() => _$LessonContentToJson(this);

  int get length => vocabulary.length + sentences.length + exercises.length;
  
  dynamic operator [](int index) {
    if (index < vocabulary.length) {
      return vocabulary[index];
    } else if (index < vocabulary.length + sentences.length) {
      return sentences[index - vocabulary.length];
    } else if (index < vocabulary.length + sentences.length + exercises.length) {
      return exercises[index - vocabulary.length - sentences.length];
    }
    throw RangeError.index(index, this, 'index', null, length);
  }
}

@JsonSerializable()
class VocabularyItem {
  final String word;
  final String transliteration;
  final String translation;
  final String? audioUrl;
  final String? imageUrl;

  const VocabularyItem({
    required this.word,
    required this.transliteration,
    required this.translation,
    this.audioUrl,
    this.imageUrl,
  });

  factory VocabularyItem.fromJson(Map<String, dynamic> json) => _$VocabularyItemFromJson(json);
  Map<String, dynamic> toJson() => _$VocabularyItemToJson(this);
}

@JsonSerializable()
class Exercise {
  final ExerciseType type;
  final String question;
  final List<String>? options;
  final String? correctAnswer;
  final int? correctAnswerIndex;
  final String? explanation;

  const Exercise({
    required this.type,
    required this.question,
    this.options,
    this.correctAnswer,
    this.correctAnswerIndex,
    this.explanation,
  });

  factory Exercise.fromJson(Map<String, dynamic> json) => _$ExerciseFromJson(json);
  Map<String, dynamic> toJson() => _$ExerciseToJson(this);
}

enum ExerciseType {
  @JsonValue('multipleChoice')
  multipleChoice,
  @JsonValue('fillInTheBlank')
  fillInTheBlank,
  @JsonValue('matching')
  matching,
  @JsonValue('trueFalse')
  trueFalse,
  @JsonValue('ordering')
  ordering,
  @JsonValue('pronunciation')
  pronunciation,
  @JsonValue('translation')
  translation,
  @JsonValue('listening')
  listening,
  @JsonValue('speaking')
  speaking,
}

enum ContentType {
  vocabulary,
  sentence,
  exercise,
  grammar,
  pronunciation,
  culture,
  listening,
  speaking,
}

@JsonSerializable()
class LessonMetadata {
  final DateTime createdAt;
  final DateTime updatedAt;
  final int viewCount;
  final double rating;
  final int ratingCount;
  final bool isPremium;
  final List<String> tags;

  const LessonMetadata({
    required this.createdAt,
    required this.updatedAt,
    required this.viewCount,
    required this.rating,
    required this.ratingCount,
    required this.isPremium,
    required this.tags,
  });

  factory LessonMetadata.fromJson(Map<String, dynamic> json) => _$LessonMetadataFromJson(json);
  Map<String, dynamic> toJson() => _$LessonMetadataToJson(this);
} 