import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../core/constants/app_colors.dart';
import '../../../data/sample_data.dart';
import '../../providers/mock_providers.dart';
import '../../widgets/quiz_card.dart';
import 'quiz_detail_screen.dart';

class QuizScreen extends ConsumerStatefulWidget {
  const QuizScreen({super.key});

  @override
  ConsumerState<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends ConsumerState<QuizScreen> {
  String _selectedType = 'All';
  String _selectedDifficulty = 'All';

  @override
  Widget build(BuildContext context) {
    final quizzesAsync = ref.watch(mockQuizzesProvider);
    
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          'Quizzes',
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
                    'Quizzes Taken',
                    '${SampleData.sampleUser.progress.quizzesTaken}',
                    Icons.quiz,
                    AppColors.primary,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard(
                    'Average Score',
                    '${SampleData.sampleUser.stats.averageScore.toStringAsFixed(0)}%',
                    Icons.trending_up,
                    AppColors.success,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard(
                    'Perfect Scores',
                    '${SampleData.sampleUser.progress.perfectScores}',
                    Icons.star,
                    AppColors.warning,
                  ),
                ),
              ],
            ),
          ),
          
          // Filter Chips
          if (_selectedType != 'All' || _selectedDifficulty != 'All')
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Wrap(
                spacing: 8,
                children: [
                  if (_selectedType != 'All')
                    Chip(
                      label: Text(_selectedType),
                      onDeleted: () {
                        setState(() {
                          _selectedType = 'All';
                        });
                      },
                      backgroundColor: AppColors.primary.withOpacity(0.1),
                      deleteIconColor: AppColors.primary,
                    ),
                  if (_selectedDifficulty != 'All')
                    Chip(
                      label: Text(_selectedDifficulty),
                      onDeleted: () {
                        setState(() {
                          _selectedDifficulty = 'All';
                        });
                      },
                      backgroundColor: AppColors.secondary.withOpacity(0.1),
                      deleteIconColor: AppColors.secondary,
                    ),
                ],
              ),
            ),
          
          // Quizzes List
          Expanded(
            child: quizzesAsync.when(
              data: (quizzes) {
                final filteredQuizzes = _filterQuizzes(quizzes);
                
                if (filteredQuizzes.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.quiz_outlined,
                          size: 64,
                          color: AppColors.textLight,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No quizzes found',
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
                  itemCount: filteredQuizzes.length,
                  itemBuilder: (context, index) {
                    final quiz = filteredQuizzes[index];
                    return QuizCard(
                      quiz: quiz,
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (context) => QuizDetailScreen(quiz: quiz),
                          ),
                        );
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
                      'Error loading quizzes',
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
                        ref.invalidate(mockQuizzesProvider);
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
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          // TODO: Start random quiz
        },
        backgroundColor: AppColors.accent,
        foregroundColor: AppColors.textOnPrimary,
        icon: const Icon(Icons.shuffle),
        label: const Text('Random Quiz'),
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

  List<dynamic> _filterQuizzes(List<dynamic> quizzes) {
    return quizzes.where((quiz) {
      // Type filter
      if (_selectedType != 'All' && quiz.type.toString().split('.').last != _selectedType) {
        return false;
      }
      
      // Difficulty filter
      if (_selectedDifficulty != 'All' && quiz.metadata.difficulty != _selectedDifficulty) {
        return false;
      }
      
      return true;
    }).toList();
  }

  void _showFilterDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Filter Quizzes'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Type Filter
            const Text('Type:'),
            DropdownButtonFormField<String>(
              value: _selectedType,
              items: ['All', 'vocabulary', 'grammar', 'pronunciation', 'listening', 'speaking', 'mixed']
                  .map((type) => DropdownMenuItem(
                        value: type,
                        child: Text(type),
                      ))
                  .toList(),
              onChanged: (value) {
                setState(() {
                  _selectedType = value ?? 'All';
                });
              },
            ),
            
            const SizedBox(height: 16),
            
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
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              setState(() {
                _selectedType = 'All';
                _selectedDifficulty = 'All';
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