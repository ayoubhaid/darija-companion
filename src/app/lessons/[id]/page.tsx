'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
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
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Lesson not found</h2>
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link 
            href="/lessons" 
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-500"
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
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {lesson.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {lesson.description}
          </p>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <BookOpenIcon className="w-5 h-5 mr-2" />
                Vocabulary
              </h2>
              <span className="text-sm text-gray-500">{vocabulary.length} words</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {vocabulary.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
                >
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {item.word}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {item.transliteration}
                    </div>
                    <div className="text-sm text-primary-500">
                      {item.translation}
                    </div>
                  </div>
                  {item.audioUrl && (
                    <button
                      onClick={() => playAudio(item.audioUrl)}
                      className="p-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg"
                    >
                      <SpeakerWaveIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {sentences.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Sentences
              </h2>
              <div className="space-y-3">
                {sentences.map((sentence, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg text-gray-900 dark:text-white"
                  >
                    {sentence}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {!isCompleted && (
            <div className="flex justify-end">
              <Button onClick={handleComplete} className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Mark as Complete (+20 XP)
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
