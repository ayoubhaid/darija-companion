'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import AudioPlayer from '@/components/ui/AudioPlayer';
import { Lesson, VocabularyItem } from '@/types';
import { getLessonById, updateUserProgress } from '@/lib/firestore';
import { 
  ArrowLeftIcon,
  PlayIcon,
  SpeakerWaveIcon,
  CheckCircleIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  const lessonId = params.id as string;

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const data = await getLessonById(lessonId);
        setLesson(data);
      } catch (error) {
        console.error('Error fetching lesson:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  const handleStart = async () => {
    if (!user || !lesson) return;
    
    try {
      await updateUserProgress(user.uid, lessonId, undefined, 0);
    } catch (error) {
      console.error('Error starting lesson:', error);
    }
  };

  const handleComplete = async () => {
    if (!user || !lesson) return;
    
    try {
      await updateUserProgress(user.uid, lessonId, undefined, 20);
      router.push('/lessons');
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

  const playAudio = (audioUrl?: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 pt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Lesson not found</h2>
          <Link href="/lessons">
            <Button variant="outline">Back to Lessons</Button>
          </Link>
        </div>
      </div>
    );
  }

  const vocabulary = lesson.content?.vocabulary || [];
  const sentences = lesson.content?.sentences || [];
  const isCompleted = userProfile?.completedLessons?.includes(lessonId);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link 
            href="/lessons" 
            className="inline-flex items-center text-zinc-600 dark:text-zinc-400 hover:text-primary"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Lessons
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Badge variant={lesson.difficulty === 'beginner' ? 'success' : lesson.difficulty === 'intermediate' ? 'warning' : 'danger'}>
              {lesson.difficulty}
            </Badge>
            {isCompleted && (
              <Badge variant="success" className="flex items-center">
                <CheckCircleIcon className="w-4 h-4 mr-1" />
                Completed
              </Badge>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            {lesson.title}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            {lesson.description}
          </p>
        </div>

        <div className="space-y-6">
          {/* Rich Text Content */}
          {lesson.contentHtml && (
            <Card padding="lg">
              <div 
                className="prose prose-zinc dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: lesson.contentHtml }}
              />
            </Card>
          )}

          {/* Vocabulary Section */}
          {vocabulary.length > 0 && (
            <Card padding="lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white flex items-center">
                  <BookOpenIcon className="w-5 h-5 mr-2" />
                  Vocabulary
                </h2>
                <span className="text-sm text-zinc-500">{vocabulary.length} words</span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {vocabulary.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl"
                  >
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-white">
                        {item.word}
                      </div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">
                        {item.transliteration}
                      </div>
                      <div className="text-sm text-primary">
                        {item.translation}
                      </div>
                      {item.arabic && (
                        <div className="text-lg arabic-text text-zinc-700 dark:text-zinc-300" dir="rtl">
                          {item.arabic}
                        </div>
                      )}
                    </div>
                    {item.audioUrl && (
                      <button
                        onClick={() => playAudio(item.audioUrl)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                      >
                        <SpeakerWaveIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Sentences Section */}
          {sentences.length > 0 && (
            <Card padding="lg">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
                Sentences
              </h2>
              <div className="space-y-3">
                {sentences.map((sentence, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-zinc-900 dark:text-white"
                  >
                    {sentence}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* If no content at all */}
          {!lesson.contentHtml && vocabulary.length === 0 && sentences.length === 0 && (
            <Card padding="lg" className="text-center py-12">
              <BookOpenIcon className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
              <p className="text-zinc-500">No content available for this lesson yet.</p>
              <p className="text-sm text-zinc-400 mt-2">The admin is still working on this lesson.</p>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            {!isCompleted && (
              <>
                <Button onClick={handleStart} variant="outline" className="flex items-center justify-center">
                  Start Lesson
                </Button>
                <Button onClick={handleComplete} className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Mark as Complete (+20 XP)
                </Button>
              </>
            )}
            {isCompleted && (
              <Button onClick={() => router.push('/lessons')} variant="outline" className="flex items-center justify-center">
                Back to Lessons
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
