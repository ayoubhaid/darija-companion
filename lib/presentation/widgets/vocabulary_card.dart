import 'package:flutter/material.dart';

import '../../core/constants/app_colors.dart';

class VocabularyCard extends StatefulWidget {
  final String darija;
  final String transliteration;
  final String english;
  final String category;
  final VoidCallback onTap;
  final bool showTransliteration;

  const VocabularyCard({
    super.key,
    required this.darija,
    required this.transliteration,
    required this.english,
    required this.category,
    required this.onTap,
    this.showTransliteration = true,
  });

  @override
  State<VocabularyCard> createState() => _VocabularyCardState();
}

class _VocabularyCardState extends State<VocabularyCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;
  bool _isFlipped = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );
    _animation = Tween<double>(
      begin: 0,
      end: 1,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _flipCard() {
    if (_isFlipped) {
      _controller.reverse();
    } else {
      _controller.forward();
    }
    setState(() {
      _isFlipped = !_isFlipped;
    });
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _flipCard,
      child: AnimatedBuilder(
        animation: _animation,
        builder: (context, child) {
          final transform = Matrix4.identity()
            ..setEntry(3, 2, 0.001)
            ..rotateY(_animation.value * 3.14159);
          
          return Transform(
            transform: transform,
            alignment: Alignment.center,
            child: _animation.value < 0.5
                ? _buildFrontSide()
                : Transform(
                    transform: Matrix4.identity()..rotateY(3.14159),
                    alignment: Alignment.center,
                    child: _buildBackSide(),
                  ),
          );
        },
      ),
    );
  }

  Widget _buildFrontSide() {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 8,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Container(
        height: 120,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              AppColors.primary,
              AppColors.primaryLight,
            ],
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Category Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.surface.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  widget.category,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppColors.textOnPrimary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              
              const Spacer(),
              
              // Darija Text
              Text(
                widget.darija,
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  color: AppColors.textOnPrimary,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'NotoNaskhArabic',
                ),
              ),
              
              // Transliteration
              if (widget.showTransliteration)
                Text(
                  widget.transliteration,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: AppColors.textOnPrimary.withOpacity(0.8),
                    fontStyle: FontStyle.italic,
                  ),
                ),
              
              const Spacer(),
              
              // Flip Hint
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Tap to flip',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: AppColors.textOnPrimary.withOpacity(0.7),
                    ),
                  ),
                  Icon(
                    Icons.flip,
                    color: AppColors.textOnPrimary.withOpacity(0.7),
                    size: 16,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBackSide() {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 8,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Container(
        height: 120,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              AppColors.secondary,
              AppColors.secondaryLight,
            ],
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Category Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.surface.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  widget.category,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppColors.textOnPrimary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              
              const Spacer(),
              
              // English Translation
              Text(
                widget.english,
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  color: AppColors.textOnPrimary,
                  fontWeight: FontWeight.bold,
                ),
              ),
              
              const SizedBox(height: 8),
              
              // Action Buttons
              Row(
                children: [
                  IconButton(
                    onPressed: () {
                      // TODO: Play pronunciation
                    },
                    icon: const Icon(
                      Icons.volume_up,
                      color: AppColors.textOnPrimary,
                      size: 20,
                    ),
                  ),
                  IconButton(
                    onPressed: () {
                      // TODO: Mark as known
                    },
                    icon: const Icon(
                      Icons.check_circle_outline,
                      color: AppColors.textOnPrimary,
                      size: 20,
                    ),
                  ),
                  IconButton(
                    onPressed: () {
                      // TODO: Mark as unknown
                    },
                    icon: const Icon(
                      Icons.cancel_outlined,
                      color: AppColors.textOnPrimary,
                      size: 20,
                    ),
                  ),
                ],
              ),
              
              const Spacer(),
              
              // Flip Hint
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Tap to flip back',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: AppColors.textOnPrimary.withOpacity(0.7),
                    ),
                  ),
                  Icon(
                    Icons.flip,
                    color: AppColors.textOnPrimary.withOpacity(0.7),
                    size: 16,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
} 