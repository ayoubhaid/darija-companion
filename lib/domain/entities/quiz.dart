import 'package:json_annotation/json_annotation.dart';

part 'quiz.g.dart';

@JsonSerializable()
class Quiz {
  final String id;
  final String title;
  final String description;
  final QuizType type;
  final List<QuizQuestion> questions;
  final int totalQuestions;
  final int timeLimit; // in seconds
  final int passingScore; // percentage
  final bool isAdaptive;
  final QuizMetadata metadata;

  const Quiz({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.questions,
    required this.totalQuestions,
    required this.timeLimit,
    required this.passingScore,
    required this.isAdaptive,
    required this.metadata,
  });

  factory Quiz.fromJson(Map<String, dynamic> json) => _$QuizFromJson(json);
  Map<String, dynamic> toJson() => _$QuizToJson(this);
}

@JsonSerializable()
class QuizQuestion {
  final String question;
  final QuestionType type;
  final List<String>? options;
  final String? correctAnswer;
  final int? correctAnswerIndex;
  final int points;
  final String? explanation;
  final String? audioUrl;
  final String? imageUrl;

  const QuizQuestion({
    required this.question,
    required this.type,
    this.options,
    this.correctAnswer,
    this.correctAnswerIndex,
    required this.points,
    this.explanation,
    this.audioUrl,
    this.imageUrl,
  });

  factory QuizQuestion.fromJson(Map<String, dynamic> json) => _$QuizQuestionFromJson(json);
  Map<String, dynamic> toJson() => _$QuizQuestionToJson(this);
}

enum QuestionType {
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

enum QuizType {
  @JsonValue('vocabulary')
  vocabulary,
  @JsonValue('grammar')
  grammar,
  @JsonValue('pronunciation')
  pronunciation,
  @JsonValue('listening')
  listening,
  @JsonValue('speaking')
  speaking,
  @JsonValue('mixed')
  mixed,
  @JsonValue('assessment')
  assessment,
}

@JsonSerializable()
class QuizMetadata {
  final String difficulty;
  final List<String> tags;
  final DateTime createdAt;
  final DateTime updatedAt;
  final int attemptCount;
  final double averageScore;
  final double completionRate;

  const QuizMetadata({
    required this.difficulty,
    required this.tags,
    required this.createdAt,
    required this.updatedAt,
    required this.attemptCount,
    required this.averageScore,
    required this.completionRate,
  });

  factory QuizMetadata.fromJson(Map<String, dynamic> json) => _$QuizMetadataFromJson(json);
  Map<String, dynamic> toJson() => _$QuizMetadataToJson(this);
}

@JsonSerializable()
class QuizResult {
  final String id;
  final String quizId;
  final String userId;
  final int score;
  final int totalQuestions;
  final int correctAnswers;
  final int timeSpent; // in seconds
  final DateTime completedAt;
  final List<QuestionAttempt> attempts;

  const QuizResult({
    required this.id,
    required this.quizId,
    required this.userId,
    required this.score,
    required this.totalQuestions,
    required this.correctAnswers,
    required this.timeSpent,
    required this.completedAt,
    required this.attempts,
  });

  factory QuizResult.fromJson(Map<String, dynamic> json) => _$QuizResultFromJson(json);
  Map<String, dynamic> toJson() => _$QuizResultToJson(this);
}

@JsonSerializable()
class QuestionAttempt {
  final String questionId;
  final String userAnswer;
  final bool isCorrect;
  final int timeSpent; // in seconds
  final int pointsEarned;

  const QuestionAttempt({
    required this.questionId,
    required this.userAnswer,
    required this.isCorrect,
    required this.timeSpent,
    required this.pointsEarned,
  });

  factory QuestionAttempt.fromJson(Map<String, dynamic> json) => _$QuestionAttemptFromJson(json);
  Map<String, dynamic> toJson() => _$QuestionAttemptToJson(this);
} 