import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../screens/splash_screen.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/signup_screen.dart';
import '../screens/auth/forgot_password_screen.dart';
import '../screens/home_screen.dart';
import '../screens/lessons/lessons_screen.dart';
import '../screens/lessons/lesson_detail_screen.dart';
import '../screens/vocabulary/vocabulary_screen.dart';
import '../screens/quiz/quiz_screen.dart';
import '../screens/quiz/quiz_detail_screen.dart';
import '../screens/chat/chat_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../screens/settings/settings_screen.dart';
import '../../../domain/entities/lesson.dart';
import '../../../domain/entities/quiz.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/',
    routes: [
      // Splash Screen
      GoRoute(
        path: '/',
        builder: (context, state) => const SplashScreen(),
      ),
      
      // Auth Routes
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/signup',
        builder: (context, state) => const SignupScreen(),
      ),
      GoRoute(
        path: '/forgot-password',
        builder: (context, state) => const ForgotPasswordScreen(),
      ),
      
      // Main App Routes
      GoRoute(
        path: '/home',
        builder: (context, state) => const HomeScreen(),
      ),
      
      // Lessons Routes
      GoRoute(
        path: '/lessons',
        builder: (context, state) => const LessonsScreen(),
      ),
      GoRoute(
        path: '/lesson/:id',
        builder: (context, state) {
          final lessonId = state.pathParameters['id']!;
          // TODO: Get lesson from provider using lessonId
          // Creating a dummy lesson for now
          final dummyLesson = Lesson(
            id: lessonId,
            title: 'Loading...',
            description: 'Loading lesson...',
            content: LessonContent(
              vocabulary: [],
              sentences: [],
              exercises: [],
            ),
            difficulty: 'beginner',
            duration: 0,
            tags: [],
            metadata: LessonMetadata(
              createdAt: DateTime.now(),
              updatedAt: DateTime.now(),
              viewCount: 0,
              rating: 0.0,
              ratingCount: 0,
              isPremium: false,
              tags: [],
            ),
          );
          return LessonDetailScreen(lesson: dummyLesson);
        },
      ),
      
      // Vocabulary Routes
      GoRoute(
        path: '/vocabulary',
        builder: (context, state) => const VocabularyScreen(),
      ),
      
      // Quiz Routes
      GoRoute(
        path: '/quizzes',
        builder: (context, state) => const QuizScreen(),
      ),
      GoRoute(
        path: '/quiz/:id',
        builder: (context, state) {
          final quizId = state.pathParameters['id']!;
          // TODO: Get quiz from provider
          // Creating a dummy quiz for now
          final dummyQuiz = Quiz(
            id: quizId,
            title: 'Loading...',
            description: 'Loading quiz...',
            type: QuizType.vocabulary,
            questions: [],
            totalQuestions: 0,
            timeLimit: 0,
            passingScore: 0,
            isAdaptive: false,
            metadata: QuizMetadata(
              difficulty: 'beginner',
              tags: [],
              createdAt: DateTime.now(),
              updatedAt: DateTime.now(),
              attemptCount: 0,
              averageScore: 0.0,
              completionRate: 0.0,
            ),
          );
          return QuizDetailScreen(quiz: dummyQuiz);
        },
      ),
      
      // Chat Routes
      GoRoute(
        path: '/chat',
        builder: (context, state) => const ChatScreen(),
      ),
      
      // Profile Routes
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfileScreen(),
      ),
      
      // Settings Routes
      GoRoute(
        path: '/settings',
        builder: (context, state) => const SettingsScreen(),
      ),
    ],
    
    // Error handling
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 64,
              color: Colors.red,
            ),
            const SizedBox(height: 16),
            Text(
              'Page not found',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              'The page you\'re looking for doesn\'t exist.',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => context.go('/'),
              child: const Text('Go Home'),
            ),
          ],
        ),
      ),
    ),
  );
} 