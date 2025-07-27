// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'quiz.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Quiz _$QuizFromJson(Map<String, dynamic> json) => Quiz(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      type: $enumDecode(_$QuizTypeEnumMap, json['type']),
      questions: (json['questions'] as List<dynamic>)
          .map((e) => QuizQuestion.fromJson(e as Map<String, dynamic>))
          .toList(),
      totalQuestions: (json['totalQuestions'] as num).toInt(),
      timeLimit: (json['timeLimit'] as num).toInt(),
      passingScore: (json['passingScore'] as num).toInt(),
      isAdaptive: json['isAdaptive'] as bool,
      metadata: QuizMetadata.fromJson(json['metadata'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$QuizToJson(Quiz instance) => <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'description': instance.description,
      'type': _$QuizTypeEnumMap[instance.type]!,
      'questions': instance.questions,
      'totalQuestions': instance.totalQuestions,
      'timeLimit': instance.timeLimit,
      'passingScore': instance.passingScore,
      'isAdaptive': instance.isAdaptive,
      'metadata': instance.metadata,
    };

const _$QuizTypeEnumMap = {
  QuizType.vocabulary: 'vocabulary',
  QuizType.grammar: 'grammar',
  QuizType.pronunciation: 'pronunciation',
  QuizType.listening: 'listening',
  QuizType.speaking: 'speaking',
  QuizType.mixed: 'mixed',
  QuizType.assessment: 'assessment',
};

QuizQuestion _$QuizQuestionFromJson(Map<String, dynamic> json) => QuizQuestion(
      question: json['question'] as String,
      type: $enumDecode(_$QuestionTypeEnumMap, json['type']),
      options:
          (json['options'] as List<dynamic>?)?.map((e) => e as String).toList(),
      correctAnswer: json['correctAnswer'] as String?,
      correctAnswerIndex: (json['correctAnswerIndex'] as num?)?.toInt(),
      points: (json['points'] as num).toInt(),
      explanation: json['explanation'] as String?,
      audioUrl: json['audioUrl'] as String?,
      imageUrl: json['imageUrl'] as String?,
    );

Map<String, dynamic> _$QuizQuestionToJson(QuizQuestion instance) =>
    <String, dynamic>{
      'question': instance.question,
      'type': _$QuestionTypeEnumMap[instance.type]!,
      'options': instance.options,
      'correctAnswer': instance.correctAnswer,
      'correctAnswerIndex': instance.correctAnswerIndex,
      'points': instance.points,
      'explanation': instance.explanation,
      'audioUrl': instance.audioUrl,
      'imageUrl': instance.imageUrl,
    };

const _$QuestionTypeEnumMap = {
  QuestionType.multipleChoice: 'multipleChoice',
  QuestionType.fillInTheBlank: 'fillInTheBlank',
  QuestionType.matching: 'matching',
  QuestionType.trueFalse: 'trueFalse',
  QuestionType.ordering: 'ordering',
  QuestionType.pronunciation: 'pronunciation',
  QuestionType.translation: 'translation',
  QuestionType.listening: 'listening',
  QuestionType.speaking: 'speaking',
};

QuizMetadata _$QuizMetadataFromJson(Map<String, dynamic> json) => QuizMetadata(
      difficulty: json['difficulty'] as String,
      tags: (json['tags'] as List<dynamic>).map((e) => e as String).toList(),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      attemptCount: (json['attemptCount'] as num).toInt(),
      averageScore: (json['averageScore'] as num).toDouble(),
      completionRate: (json['completionRate'] as num).toDouble(),
    );

Map<String, dynamic> _$QuizMetadataToJson(QuizMetadata instance) =>
    <String, dynamic>{
      'difficulty': instance.difficulty,
      'tags': instance.tags,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'attemptCount': instance.attemptCount,
      'averageScore': instance.averageScore,
      'completionRate': instance.completionRate,
    };

QuizResult _$QuizResultFromJson(Map<String, dynamic> json) => QuizResult(
      id: json['id'] as String,
      quizId: json['quizId'] as String,
      userId: json['userId'] as String,
      score: (json['score'] as num).toInt(),
      totalQuestions: (json['totalQuestions'] as num).toInt(),
      correctAnswers: (json['correctAnswers'] as num).toInt(),
      timeSpent: (json['timeSpent'] as num).toInt(),
      completedAt: DateTime.parse(json['completedAt'] as String),
      attempts: (json['attempts'] as List<dynamic>)
          .map((e) => QuestionAttempt.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$QuizResultToJson(QuizResult instance) =>
    <String, dynamic>{
      'id': instance.id,
      'quizId': instance.quizId,
      'userId': instance.userId,
      'score': instance.score,
      'totalQuestions': instance.totalQuestions,
      'correctAnswers': instance.correctAnswers,
      'timeSpent': instance.timeSpent,
      'completedAt': instance.completedAt.toIso8601String(),
      'attempts': instance.attempts,
    };

QuestionAttempt _$QuestionAttemptFromJson(Map<String, dynamic> json) =>
    QuestionAttempt(
      questionId: json['questionId'] as String,
      userAnswer: json['userAnswer'] as String,
      isCorrect: json['isCorrect'] as bool,
      timeSpent: (json['timeSpent'] as num).toInt(),
      pointsEarned: (json['pointsEarned'] as num).toInt(),
    );

Map<String, dynamic> _$QuestionAttemptToJson(QuestionAttempt instance) =>
    <String, dynamic>{
      'questionId': instance.questionId,
      'userAnswer': instance.userAnswer,
      'isCorrect': instance.isCorrect,
      'timeSpent': instance.timeSpent,
      'pointsEarned': instance.pointsEarned,
    };
