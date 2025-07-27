// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'lesson.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Lesson _$LessonFromJson(Map<String, dynamic> json) => Lesson(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      content: LessonContent.fromJson(json['content'] as Map<String, dynamic>),
      difficulty: json['difficulty'] as String,
      duration: (json['duration'] as num).toInt(),
      tags: (json['tags'] as List<dynamic>).map((e) => e as String).toList(),
      metadata:
          LessonMetadata.fromJson(json['metadata'] as Map<String, dynamic>),
      imageUrl: json['imageUrl'] as String?,
      topic: json['topic'] as String?,
      estimatedDuration: (json['estimatedDuration'] as num?)?.toInt(),
      isPremium: json['isPremium'] as bool?,
    );

Map<String, dynamic> _$LessonToJson(Lesson instance) => <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'description': instance.description,
      'content': instance.content,
      'difficulty': instance.difficulty,
      'duration': instance.duration,
      'tags': instance.tags,
      'metadata': instance.metadata,
      'imageUrl': instance.imageUrl,
      'topic': instance.topic,
      'estimatedDuration': instance.estimatedDuration,
      'isPremium': instance.isPremium,
    };

LessonContent _$LessonContentFromJson(Map<String, dynamic> json) =>
    LessonContent(
      vocabulary: (json['vocabulary'] as List<dynamic>)
          .map((e) => VocabularyItem.fromJson(e as Map<String, dynamic>))
          .toList(),
      sentences:
          (json['sentences'] as List<dynamic>).map((e) => e as String).toList(),
      exercises: (json['exercises'] as List<dynamic>)
          .map((e) => Exercise.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$LessonContentToJson(LessonContent instance) =>
    <String, dynamic>{
      'vocabulary': instance.vocabulary,
      'sentences': instance.sentences,
      'exercises': instance.exercises,
    };

VocabularyItem _$VocabularyItemFromJson(Map<String, dynamic> json) =>
    VocabularyItem(
      word: json['word'] as String,
      transliteration: json['transliteration'] as String,
      translation: json['translation'] as String,
      audioUrl: json['audioUrl'] as String?,
      imageUrl: json['imageUrl'] as String?,
    );

Map<String, dynamic> _$VocabularyItemToJson(VocabularyItem instance) =>
    <String, dynamic>{
      'word': instance.word,
      'transliteration': instance.transliteration,
      'translation': instance.translation,
      'audioUrl': instance.audioUrl,
      'imageUrl': instance.imageUrl,
    };

Exercise _$ExerciseFromJson(Map<String, dynamic> json) => Exercise(
      type: $enumDecode(_$ExerciseTypeEnumMap, json['type']),
      question: json['question'] as String,
      options:
          (json['options'] as List<dynamic>?)?.map((e) => e as String).toList(),
      correctAnswer: json['correctAnswer'] as String?,
      correctAnswerIndex: (json['correctAnswerIndex'] as num?)?.toInt(),
      explanation: json['explanation'] as String?,
    );

Map<String, dynamic> _$ExerciseToJson(Exercise instance) => <String, dynamic>{
      'type': _$ExerciseTypeEnumMap[instance.type]!,
      'question': instance.question,
      'options': instance.options,
      'correctAnswer': instance.correctAnswer,
      'correctAnswerIndex': instance.correctAnswerIndex,
      'explanation': instance.explanation,
    };

const _$ExerciseTypeEnumMap = {
  ExerciseType.multipleChoice: 'multipleChoice',
  ExerciseType.fillInTheBlank: 'fillInTheBlank',
  ExerciseType.matching: 'matching',
  ExerciseType.trueFalse: 'trueFalse',
  ExerciseType.ordering: 'ordering',
  ExerciseType.pronunciation: 'pronunciation',
  ExerciseType.translation: 'translation',
  ExerciseType.listening: 'listening',
  ExerciseType.speaking: 'speaking',
};

LessonMetadata _$LessonMetadataFromJson(Map<String, dynamic> json) =>
    LessonMetadata(
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      viewCount: (json['viewCount'] as num).toInt(),
      rating: (json['rating'] as num).toDouble(),
      ratingCount: (json['ratingCount'] as num).toInt(),
      isPremium: json['isPremium'] as bool,
      tags: (json['tags'] as List<dynamic>).map((e) => e as String).toList(),
    );

Map<String, dynamic> _$LessonMetadataToJson(LessonMetadata instance) =>
    <String, dynamic>{
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'viewCount': instance.viewCount,
      'rating': instance.rating,
      'ratingCount': instance.ratingCount,
      'isPremium': instance.isPremium,
      'tags': instance.tags,
    };
