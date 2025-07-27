import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/constants/app_colors.dart';
import '../../../domain/entities/quiz.dart';
import '../../widgets/quiz_card.dart';

class QuizDetailScreen extends ConsumerStatefulWidget {
  final Quiz quiz;

  const QuizDetailScreen({
    super.key,
    required this.quiz,
  });

  @override
  ConsumerState<QuizDetailScreen> createState() => _QuizDetailScreenState();
}

class _QuizDetailScreenState extends ConsumerState<QuizDetailScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          'Quiz Details',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.favorite_border),
            onPressed: () {
              // TODO: Add to favorites
            },
          ),
          IconButton(
            icon: const Icon(Icons.share),
            onPressed: () {
              // TODO: Share quiz
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Quiz Card
            QuizCard(
              quiz: widget.quiz,
              onTap: () {
                // This will be handled by the start button
              },
            ),
            
            const SizedBox(height: 24),
            
            // Quiz Information
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Quiz Information',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    
                    // Information Grid
                    _buildInfoGrid(),
                    
                    const SizedBox(height: 16),
                    
                    // Description
                    Text(
                      'Description',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      widget.quiz.description,
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Question Preview
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Question Preview',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    
                    // Sample Questions
                    ...widget.quiz.questions.take(3).map((question) {
                      return Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceVariant,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              question.question,
                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Type: ${_getQuestionTypeLabel(question.type)}',
                              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: AppColors.textSecondary,
                              ),
                            ),
                            Text(
                              'Points: ${question.points}',
                              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      );
                    }),
                    
                    if (widget.quiz.questions.length > 3)
                      Text(
                        '... and ${widget.quiz.questions.length - 3} more questions',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppColors.textSecondary,
                          fontStyle: FontStyle.italic,
                        ),
                      ),
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Quiz Statistics
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Quiz Statistics',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    
                    Row(
                      children: [
                        Expanded(
                          child: _buildStatItem(
                            'Attempts',
                            '${widget.quiz.metadata.attemptCount}',
                            Icons.people,
                          ),
                        ),
                        Expanded(
                          child: _buildStatItem(
                            'Avg Score',
                            '${widget.quiz.metadata.averageScore.toStringAsFixed(1)}%',
                            Icons.trending_up,
                          ),
                        ),
                        Expanded(
                          child: _buildStatItem(
                            'Completion',
                            '${widget.quiz.metadata.completionRate}%',
                            Icons.check_circle,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 100), // Bottom padding
          ],
        ),
      ),
      
      // Start Quiz Button
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          boxShadow: [
            BoxShadow(
              color: AppColors.shadow,
              blurRadius: 10,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: ElevatedButton(
          onPressed: () {
            _showStartQuizDialog();
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: _getTypeColor(widget.quiz.type),
            foregroundColor: AppColors.textOnPrimary,
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          child: Text(
            'Start Quiz',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInfoGrid() {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _buildInfoItem(
                'Questions',
                '${widget.quiz.totalQuestions}',
                Icons.quiz,
              ),
            ),
            Expanded(
              child: _buildInfoItem(
                'Time Limit',
                '${widget.quiz.timeLimit ~/ 60} min',
                Icons.access_time,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildInfoItem(
                'Passing Score',
                '${widget.quiz.passingScore}%',
                Icons.check_circle,
              ),
            ),
            Expanded(
              child: _buildInfoItem(
                'Difficulty',
                widget.quiz.metadata.difficulty,
                Icons.star,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildInfoItem(String label, String value, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surfaceVariant,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        children: [
          Icon(
            icon,
            color: AppColors.primary,
            size: 24,
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            label,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: AppColors.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(
          icon,
          color: AppColors.primary,
          size: 24,
        ),
        const SizedBox(height: 8),
        Text(
          value,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: AppColors.textSecondary,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  String _getQuestionTypeLabel(QuestionType type) {
    switch (type) {
      case QuestionType.multipleChoice:
        return 'Multiple Choice';
      case QuestionType.fillInTheBlank:
        return 'Fill in the Blank';
      case QuestionType.matching:
        return 'Matching';
      case QuestionType.trueFalse:
        return 'True/False';
      case QuestionType.ordering:
        return 'Ordering';
      case QuestionType.pronunciation:
        return 'Pronunciation';
      case QuestionType.translation:
        return 'Translation';
      case QuestionType.listening:
        return 'Listening';
      case QuestionType.speaking:
        return 'Speaking';
    }
  }

  Color _getTypeColor(QuizType type) {
    switch (type) {
      case QuizType.vocabulary:
        return AppColors.primary;
      case QuizType.grammar:
        return AppColors.secondary;
      case QuizType.pronunciation:
        return AppColors.accent;
      case QuizType.listening:
        return AppColors.patternBlue;
      case QuizType.speaking:
        return AppColors.patternGreen;
      case QuizType.mixed:
        return AppColors.patternPurple;
      case QuizType.assessment:
        return AppColors.patternOrange;
    }
  }

  void _showStartQuizDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Start Quiz'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Are you ready to start "${widget.quiz.title}"?'),
            const SizedBox(height: 16),
            Text('• ${widget.quiz.totalQuestions} questions'),
            Text('• ${widget.quiz.timeLimit ~/ 60} minutes time limit'),
            Text('• ${widget.quiz.passingScore}% passing score required'),
            const SizedBox(height: 16),
            Text(
              'Make sure you have a quiet environment and are ready to focus!',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
            },
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              // TODO: Navigate to quiz player
            },
            child: const Text('Start Quiz'),
          ),
        ],
      ),
    );
  }
} 