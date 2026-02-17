'use client';

import { useState, useEffect, useCallback } from 'react';
import { Course, Module, Lesson, LessonProgress, CourseProgress, Enrollment } from '@/types/lms';
import { ContentRenderer } from '@/components/lms/ContentRenderer';
import { 
  Play, 
  CheckCircle, 
  Lock, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X,
  Clock,
  Star,
  Award,
  BookOpen,
  Target,
  Zap
} from 'lucide-react';
import clsx from 'clsx';

interface CoursePlayerProps {
  course: Course;
  modules: Module[];
  enrollment: Enrollment;
  courseProgress?: CourseProgress;
  currentLessonId?: string;
  onLessonComplete: (lessonId: string) => Promise<void>;
  onQuizComplete: (lessonId: string, blockId: string, score: number, xpEarned: number) => Promise<void>;
  onNavigate: (lessonId: string) => void;
}

/**
 * Course Player - Student-facing lesson viewer
 */
export function CoursePlayer({
  course,
  modules,
  enrollment,
  courseProgress,
  currentLessonId,
  onLessonComplete,
  onQuizComplete,
  onNavigate,
}: CoursePlayerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  // Flatten all lessons from modules
  const allLessons = modules.flatMap(m => m.lessons || []);
  
  // Find current lesson
  useEffect(() => {
    if (currentLessonId) {
      const lesson = allLessons.find(l => l.id === currentLessonId);
      setCurrentLesson(lesson || null);
    } else if (allLessons.length > 0 && !currentLesson) {
      setCurrentLesson(allLessons[0]);
    }
  }, [currentLessonId, allLessons, currentLesson]);

  // Get current module for the lesson
  const currentModule = currentLesson 
    ? modules.find(m => m.id === currentLesson.moduleId) 
    : null;

  // Get current lesson index
  const currentIndex = currentLesson 
    ? allLessons.findIndex(l => l.id === currentLesson.id) 
    : -1;

  // Navigation
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allLessons.length - 1;

  const handlePrevious = useCallback(() => {
    if (hasPrevious) {
      const prevLesson = allLessons[currentIndex - 1];
      onNavigate(prevLesson.id);
    }
  }, [hasPrevious, allLessons, currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (hasNext) {
      const nextLesson = allLessons[currentIndex + 1];
      onNavigate(nextLesson.id);
    }
  }, [hasNext, allLessons, currentIndex, onNavigate]);

  const handleComplete = useCallback(async () => {
    if (!currentLesson) return;
    setIsCompleting(true);
    try {
      await onLessonComplete(currentLesson.id);
    } finally {
      setIsCompleting(false);
    }
  }, [currentLesson, onLessonComplete]);

  const handleQuizComplete = useCallback(async (blockId: string, score: number, xpEarned: number) => {
    if (!currentLesson) return;
    await onQuizComplete(currentLesson.id, blockId, score, xpEarned);
  }, [currentLesson, onQuizComplete]);

  if (!currentLesson) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <BookOpen className="w-16 h-16 mx-auto text-zinc-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No lesson selected</h2>
          <p className="text-zinc-500">Select a lesson from the sidebar to begin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed lg:relative inset-y-0 left-0 z-40 w-80 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-700 transform transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:border-0 lg:overflow-hidden'
        )}
      >
        <div className="h-full flex flex-col w-80">
          {/* Course Header */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-lg line-clamp-2">{course.title}</h2>
            
            {/* Progress */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-zinc-500">Progress</span>
                <span className="font-medium">{courseProgress?.progress || 0}%</span>
              </div>
              <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${courseProgress?.progress || 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Modules & Lessons */}
          <div className="flex-1 overflow-y-auto">
            {modules.map((module, moduleIndex) => (
              <div key={module.id} className="border-b border-zinc-100 dark:border-zinc-800">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800">
                  <h3 className="font-medium text-sm">
                    Module {moduleIndex + 1}: {module.title}
                  </h3>
                </div>
                <div>
                  {module.lessons?.map((lesson, lessonIndex) => {
                    const isActive = lesson.id === currentLesson.id;
                    const isCompleted = courseProgress && allLessons.findIndex(l => l.id === lesson.id) < (courseProgress.lessonsCompleted || 0);
                    
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onNavigate(lesson.id)}
                        className={clsx(
                          'w-full flex items-center gap-3 p-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors',
                          isActive && 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500'
                        )}
                      >
                        <div className={clsx(
                          'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : isActive 
                            ? 'bg-blue-500 text-white'
                            : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500'
                        )}>
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            lessonIndex + 1
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={clsx(
                            'text-sm font-medium truncate',
                            isActive ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-700 dark:text-zinc-300'
                          )}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <Clock className="w-3 h-3" />
                            <span>{lesson.duration} min</span>
                            <Zap className="w-3 h-3" />
                            <span>+{lesson.xpReward} XP</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-zinc-50 dark:bg-zinc-950">
        {/* Header */}
        <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <p className="text-sm text-zinc-500">
                  {currentModule && `Module ${modules.indexOf(currentModule) + 1}: ${currentModule.title}`}
                </p>
                <h1 className="font-bold text-lg">{currentLesson.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Clock className="w-4 h-4" />
                <span>{currentLesson.duration} min</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <Zap className="w-4 h-4" />
                <span>+{currentLesson.xpReward} XP</span>
              </div>
            </div>
          </div>
        </header>

        {/* Lesson Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            {/* Description */}
            {currentLesson.description && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200">{currentLesson.description}</p>
              </div>
            )}

            {/* Content */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
              <ContentRenderer
                content={currentLesson.content}
                onQuizComplete={handleQuizComplete}
              />
            </div>

            {/* Completion */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleComplete}
                disabled={isCompleting}
                className={clsx(
                  'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors',
                  'bg-green-600 text-white hover:bg-green-700',
                  isCompleting && 'opacity-50 cursor-not-allowed'
                )}
              >
                <CheckCircle className="w-5 h-5" />
                {isCompleting ? 'Completing...' : 'Mark as Complete'}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-700 px-4 py-3">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <button
              onClick={handlePrevious}
              disabled={!hasPrevious}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                hasPrevious 
                  ? 'hover:bg-zinc-100 dark:hover:bg-zinc-800' 
                  : 'opacity-50 cursor-not-allowed'
              )}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>
            
            <span className="text-sm text-zinc-500">
              Lesson {currentIndex + 1} of {allLessons.length}
            </span>

            <button
              onClick={handleNext}
              disabled={!hasNext}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                hasNext 
                  ? 'hover:bg-zinc-100 dark:hover:bg-zinc-800' 
                  : 'opacity-50 cursor-not-allowed'
              )}
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </footer>
      </main>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default CoursePlayer;
