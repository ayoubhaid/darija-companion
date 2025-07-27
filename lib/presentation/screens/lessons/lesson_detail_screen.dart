import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/constants/app_colors.dart';
import '../../../domain/entities/lesson.dart';

class LessonDetailScreen extends ConsumerStatefulWidget {
  final Lesson lesson;

  const LessonDetailScreen({
    super.key,
    required this.lesson,
  });

  @override
  ConsumerState<LessonDetailScreen> createState() => _LessonDetailScreenState();
}

class _LessonDetailScreenState extends ConsumerState<LessonDetailScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;
  int _currentTabIndex = 0;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _tabController.addListener(() {
      setState(() {
        _currentTabIndex = _tabController.index;
      });
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          // App Bar
          SliverAppBar(
            expandedHeight: 200,
            floating: false,
            pinned: true,
            backgroundColor: AppColors.surface,
            elevation: 0,
            flexibleSpace: FlexibleSpaceBar(
              title: Text(
                widget.lesson.title,
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  color: AppColors.textPrimary,
                  fontWeight: FontWeight.bold,
                ),
              ),
              background: widget.lesson.imageUrl != null
                  ? Image.network(
                      widget.lesson.imageUrl!,
                      fit: BoxFit.cover,
                    )
                  : Container(
                      decoration: const BoxDecoration(
                        gradient: AppColors.primaryGradient,
                      ),
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
                  // TODO: Share lesson
                },
              ),
            ],
          ),
          
          // Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Lesson Info
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'About this lesson',
                            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            widget.lesson.description,
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              _buildInfoChip(
                                Icons.access_time,
                                '${widget.lesson.estimatedDuration} min',
                              ),
                              const SizedBox(width: 12),
                              _buildInfoChip(
                                Icons.school,
                                'Level ${widget.lesson.difficulty}',
                              ),
                              const SizedBox(width: 12),
                              _buildInfoChip(
                                Icons.book,
                                '${widget.lesson.vocabulary.length} words',
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Tab Bar
                  Container(
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: TabBar(
                      controller: _tabController,
                      indicator: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        color: AppColors.primary,
                      ),
                      labelColor: AppColors.textOnPrimary,
                      unselectedLabelColor: AppColors.textSecondary,
                      tabs: const [
                        Tab(text: 'Content'),
                        Tab(text: 'Vocabulary'),
                        Tab(text: 'Exercises'),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Tab Content
                  SizedBox(
                    height: 400, // Fixed height for tab content
                    child: TabBarView(
                      controller: _tabController,
                      children: [
                        _buildContentTab(),
                        _buildVocabularyTab(),
                        _buildExercisesTab(),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
      
      // Bottom Action Button
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
            // TODO: Start lesson
            _showStartLessonDialog();
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            foregroundColor: AppColors.textOnPrimary,
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          child: Text(
            'Start Lesson',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInfoChip(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.surfaceVariant,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 16,
            color: AppColors.textSecondary,
          ),
          const SizedBox(width: 4),
          Text(
            label,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: AppColors.textSecondary,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContentTab() {
    return ListView.builder(
      itemCount: widget.lesson.content.length,
      itemBuilder: (context, index) {
        final content = widget.lesson.content[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: Icon(
              _getContentIcon(content.type),
              color: AppColors.primary,
            ),
            title: Text(
              content.title,
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
            subtitle: Text(
              content.content,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            trailing: const Icon(Icons.arrow_forward_ios),
            onTap: () {
              // TODO: Navigate to content detail
            },
          ),
        );
      },
    );
  }

  Widget _buildVocabularyTab() {
    return ListView.builder(
      itemCount: widget.lesson.vocabulary.length,
      itemBuilder: (context, index) {
        final vocabulary = widget.lesson.vocabulary[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: AppColors.primary.withOpacity(0.1),
              child: Text(
                '${index + 1}',
                style: TextStyle(
                  color: AppColors.primary,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            title: Text(
              vocabulary.word,
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
            subtitle: Text(vocabulary.translation),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (vocabulary.audioUrl != null)
                  IconButton(
                    icon: const Icon(Icons.volume_up),
                    onPressed: () {
                      // TODO: Play audio
                    },
                  ),
                const Icon(Icons.arrow_forward_ios),
              ],
            ),
            onTap: () {
              // TODO: Show vocabulary detail
            },
          ),
        );
      },
    );
  }

  Widget _buildExercisesTab() {
    return ListView.builder(
      itemCount: widget.lesson.exercises.length,
      itemBuilder: (context, index) {
        final exercise = widget.lesson.exercises[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: Icon(
              _getExerciseIcon(exercise.type),
              color: AppColors.accent,
            ),
            title: Text(
              exercise.question,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            subtitle: Text(
              'Exercise',
              style: TextStyle(
                color: AppColors.accent,
                fontWeight: FontWeight.w600,
              ),
            ),
            trailing: const Icon(Icons.arrow_forward_ios),
            onTap: () {
              // TODO: Start exercise
            },
          ),
        );
      },
    );
  }

  IconData _getContentIcon(ContentType type) {
    switch (type) {
      case ContentType.vocabulary:
        return Icons.book;
      case ContentType.sentence:
        return Icons.chat;
      case ContentType.exercise:
        return Icons.fitness_center;
      case ContentType.grammar:
        return Icons.rule;
      case ContentType.pronunciation:
        return Icons.record_voice_over;
      case ContentType.culture:
        return Icons.emoji_events;
      case ContentType.listening:
        return Icons.hearing;
      case ContentType.speaking:
        return Icons.record_voice_over;
    }
  }

  IconData _getExerciseIcon(ExerciseType type) {
    switch (type) {
      case ExerciseType.multipleChoice:
        return Icons.checklist;
      case ExerciseType.fillInTheBlank:
        return Icons.edit;
      case ExerciseType.matching:
        return Icons.compare_arrows;
      case ExerciseType.trueFalse:
        return Icons.check_circle;
      case ExerciseType.ordering:
        return Icons.sort;
      case ExerciseType.pronunciation:
        return Icons.mic;
      case ExerciseType.translation:
        return Icons.translate;
      case ExerciseType.listening:
        return Icons.hearing;
      case ExerciseType.speaking:
        return Icons.record_voice_over;
    }
  }

  void _showStartLessonDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Start Lesson'),
        content: Text(
          'Are you ready to begin this lesson? You\'ll need about ${widget.lesson.estimatedDuration ?? 15} minutes to complete it.',
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
              // TODO: Navigate to lesson player
            },
            child: const Text('Start'),
          ),
        ],
      ),
    );
  }
} 