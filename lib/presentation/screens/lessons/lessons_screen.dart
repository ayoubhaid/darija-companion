import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../core/constants/app_colors.dart';
import '../../../data/sample_data.dart';
import '../../providers/mock_providers.dart';
import '../../widgets/lesson_card.dart';

class LessonsScreen extends ConsumerStatefulWidget {
  const LessonsScreen({super.key});

  @override
  ConsumerState<LessonsScreen> createState() => _LessonsScreenState();
}

class _LessonsScreenState extends ConsumerState<LessonsScreen> {
  String _selectedDifficulty = 'All';
  String _selectedTopic = 'All';

  @override
  Widget build(BuildContext context) {
    final lessonsAsync = ref.watch(mockLessonsProvider);
    
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          'Lessons',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () {
              _showFilterDialog();
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Stats Cards
          Container(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    'Total Lessons',
                    '${SampleData.lessons.length}',
                    Icons.school,
                    AppColors.primary,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard(
                    'Completed',
                    '${SampleData.sampleUser.progress.lessonsCompleted}',
                    Icons.check_circle,
                    AppColors.success,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard(
                    'In Progress',
                    '${SampleData.lessons.length - SampleData.sampleUser.progress.lessonsCompleted}',
                    Icons.pending,
                    AppColors.warning,
                  ),
                ),
              ],
            ),
          ),
          
          // Filter Chips
          if (_selectedDifficulty != 'All' || _selectedTopic != 'All')
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Wrap(
                spacing: 8,
                children: [
                  if (_selectedDifficulty != 'All')
                    Chip(
                      label: Text(_selectedDifficulty),
                      onDeleted: () {
                        setState(() {
                          _selectedDifficulty = 'All';
                        });
                      },
                      backgroundColor: AppColors.primary.withOpacity(0.1),
                      deleteIconColor: AppColors.primary,
                    ),
                  if (_selectedTopic != 'All')
                    Chip(
                      label: Text(_selectedTopic),
                      onDeleted: () {
                        setState(() {
                          _selectedTopic = 'All';
                        });
                      },
                      backgroundColor: AppColors.secondary.withOpacity(0.1),
                      deleteIconColor: AppColors.secondary,
                    ),
                ],
              ),
            ),
          
          // Lessons List
          Expanded(
            child: lessonsAsync.when(
              data: (lessons) {
                final filteredLessons = _filterLessons(lessons);
                
                if (filteredLessons.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.school_outlined,
                          size: 64,
                          color: AppColors.textLight,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No lessons found',
                          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            color: AppColors.textLight,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Try adjusting your filters',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: AppColors.textLight,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  );
                }
                
                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: filteredLessons.length,
                  itemBuilder: (context, index) {
                    final lesson = filteredLessons[index];
                    return LessonCard(
                      lesson: lesson,
                      onTap: () {
                        Navigator.of(context).pushNamed('/lesson/${lesson.id}');
                      },
                    )
                        .animate()
                        .fadeIn(duration: 300.ms, delay: (index * 100).ms)
                        .slideY(begin: 0.3, end: 0);
                  },
                );
              },
              loading: () => const Center(
                child: CircularProgressIndicator(),
              ),
              error: (error, stack) => Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.error_outline,
                      size: 64,
                      color: AppColors.error,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Error loading lessons',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        color: AppColors.error,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      error.toString(),
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppColors.textLight,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        ref.invalidate(mockLessonsProvider);
                      },
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(
              icon,
              color: color,
              size: 24,
            ),
            const SizedBox(height: 8),
            Text(
              value,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                color: color,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              title,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  List<dynamic> _filterLessons(List<dynamic> lessons) {
    return lessons.where((lesson) {
      // Difficulty filter
      if (_selectedDifficulty != 'All' && lesson.difficulty != _selectedDifficulty) {
        return false;
      }
      
      // Topic filter (using tags for now)
      if (_selectedTopic != 'All' && !lesson.tags.contains(_selectedTopic)) {
        return false;
      }
      
      return true;
    }).toList();
  }

  void _showFilterDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Filter Lessons'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Difficulty Filter
            const Text('Difficulty:'),
            DropdownButtonFormField<String>(
              value: _selectedDifficulty,
              items: ['All', 'beginner', 'intermediate', 'advanced']
                  .map((difficulty) => DropdownMenuItem(
                        value: difficulty,
                        child: Text(difficulty),
                      ))
                  .toList(),
              onChanged: (value) {
                setState(() {
                  _selectedDifficulty = value ?? 'All';
                });
              },
            ),
            
            const SizedBox(height: 16),
            
            // Topic Filter
            const Text('Topic:'),
            DropdownButtonFormField<String>(
              value: _selectedTopic,
              items: ['All', 'greetings', 'numbers', 'basic', 'conversation']
                  .map((topic) => DropdownMenuItem(
                        value: topic,
                        child: Text(topic),
                      ))
                  .toList(),
              onChanged: (value) {
                setState(() {
                  _selectedTopic = value ?? 'All';
                });
              },
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              setState(() {
                _selectedDifficulty = 'All';
                _selectedTopic = 'All';
              });
              Navigator.of(context).pop();
            },
            child: const Text('Clear All'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
            },
            child: const Text('Apply'),
          ),
        ],
      ),
    );
  }
} 