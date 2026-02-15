'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { getAllVocabulary, getUserProfile } from '@/lib/firestore';
import { 
  generateSession, 
  processAnswer, 
  calculateSessionResult,
  getUserVocabularyProgress,
  updateUserVocabularyProgress,
  updateUserAfterSession
} from '@/lib/spacedRepetition';
import { VocabularyItem, UserProfile, SpacedRepetitionSession, SpacedRepetitionQuestion, AnswerResult, SessionResult, UserVocabularyProgress } from '@/types';
import { 
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  XMarkIcon,
  BoltIcon,
  FireIcon,
  TrophyIcon,
  SparklesIcon,
  LightBulbIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

function PracticeIntro({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl shadow-glow-md mb-8">
          <SparklesIcon className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
          Daily Practice
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          Train your vocabulary with spaced repetition. The more you practice, the better you remember!
        </p>

        <Card padding="lg" className="text-left mb-8">
          <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">How it works:</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-primary text-sm font-bold">1</span>
              </div>
              <span className="text-zinc-600 dark:text-zinc-300">Answer 15 vocabulary questions</span>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-primary text-sm font-bold">2</span>
              </div>
              <span className="text-zinc-600 dark:text-zinc-300">Review words you&apos;ve learned + new words</span>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-primary text-sm font-bold">3</span>
              </div>
              <span className="text-zinc-600 dark:text-zinc-300">Earn XP and track your progress</span>
            </li>
          </ul>
        </Card>

        <Button onClick={onStart} size="lg" className="w-full">
          Start Practice Session
        </Button>
      </div>
    </div>
  );
}

function SessionComplete({ 
  result, 
  onClose,
  vocabularyCount 
}: { 
  result: SessionResult; 
  onClose: () => void;
  vocabularyCount: number;
}) {
  const getMessage = () => {
    if (result.accuracy >= 90) return { text: 'Excellent! 🌟', desc: 'Outstanding performance!' };
    if (result.accuracy >= 70) return { text: 'Great job! 👏', desc: 'Keep up the good work!' };
    if (result.accuracy >= 50) return { text: 'Good effort! 💪', desc: 'Practice makes perfect.' };
    return { text: 'Keep practicing! 📚', desc: 'You\'ll improve with time.' };
  };

  const message = getMessage();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full shadow-glow-lg mb-6">
            <TrophyIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            {message.text}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">{message.desc}</p>
        </div>

        <Card padding="lg" className="mb-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">{result.correctAnswers}</div>
              <div className="text-sm text-zinc-500">Correct</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-zinc-900 dark:text-white">{Math.round(result.accuracy)}%</div>
              <div className="text-sm text-zinc-500">Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">+{result.totalXpEarned}</div>
              <div className="text-sm text-zinc-500">XP Earned</div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Words in session</span>
              <span className="font-medium text-zinc-900 dark:text-white">{vocabularyCount} words</span>
            </div>
          </div>
        </Card>

        <Button onClick={onClose} size="lg" className="w-full">
          Continue
        </Button>
      </div>
    </div>
  );
}

function PracticeSession({ 
  session, 
  onComplete 
}: { 
  session: SpacedRepetitionSession; 
  onComplete: (result: SessionResult) => void;
}) {
  const { user, userProfile } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [streak, setStreak] = useState(0);

  const currentQuestion = session.questions[currentIndex];
  const progress = ((currentIndex + 1) / session.questions.length) * 100;

  const handleAnswer = async (answer: string) => {
    if (!user || !userProfile) return;

    const timeTaken = Date.now() - questionStartTime;
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    const existingProgress = null;
    
    const defaultProfile = {
      id: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'User',
      xp: 0,
      level: 1,
      streak: 0,
      completedLessons: [],
      completedQuizzes: [],
      vocabularyLearned: 0,
      totalXP: 0,
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      skillLevel: 1,
      accuracyRate: 0,
      quizzesCompleted: 0,
      lessonsCompleted: 0,
    };
    
    const userProfileWithDefaults = { ...defaultProfile, ...userProfile };
    
    const result = await processAnswer(
      user.uid,
      currentQuestion.wordId,
      isCorrect,
      timeTaken,
      userProfileWithDefaults,
      existingProgress
    );

    const newAnswers = [...answers, result];
    setAnswers(newAnswers);
    setSelectedAnswer(answer);
    setShowAnswer(true);
    setStreak(isCorrect ? streak + 1 : 0);

    await updateUserVocabularyProgress(
      user.uid,
      currentQuestion.wordId,
      result,
      1,
      isCorrect ? 1 : 0
    );
  };

  const handleNext = async () => {
    if (currentIndex < session.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
      setQuestionStartTime(Date.now());
    } else {
      const defaultProfile = {
        id: user?.uid || '',
        email: user?.email || '',
        displayName: user?.displayName || 'User',
        xp: 0,
        level: 1,
        streak: 0,
        completedLessons: [],
        completedQuizzes: [],
        vocabularyLearned: 0,
        totalXP: 0,
        lastActive: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        skillLevel: 1,
        accuracyRate: 0,
        quizzesCompleted: 0,
        lessonsCompleted: 0,
      };
      
      const userProfileWithDefaults = { ...defaultProfile, ...userProfile };
      
      const result = calculateSessionResult(answers, userProfileWithDefaults, session.sessionType);
      
      if (user) {
        await updateUserAfterSession(user.uid, result, userProfileWithDefaults);
      }
      
      onComplete(result);
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-500">
              Question {currentIndex + 1} of {session.questions.length}
            </span>
            <div className="flex items-center gap-2">
              {streak > 1 && (
                <Badge variant="warning" className="flex items-center gap-1">
                  <FireIcon className="w-3 h-3" />
                  {streak} streak
                </Badge>
              )}
            </div>
          </div>
          <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card padding="lg" className="mb-6">
          <div className="text-center mb-8">
            <Badge variant="primary" className="mb-4">{currentQuestion.category}</Badge>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              {currentQuestion.questionType === 'translation' 
                ? `What is the translation of "${currentQuestion.word}"?`
                : `Select the correct translation`
              }
            </h2>
            <p className="text-lg text-zinc-500">{currentQuestion.transliteration}</p>
            {currentQuestion.arabic && (
              <p className="text-2xl arabic-text text-zinc-700 dark:text-zinc-300 mt-2" dir="rtl">
                {currentQuestion.arabic}
              </p>
            )}
          </div>

          {/* Answer Options */}
          {currentQuestion.questionType === 'multipleChoice' && currentQuestion.options ? (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                let buttonClass = 'w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ';
                
                if (showAnswer) {
                  if (option === currentQuestion.correctAnswer) {
                    buttonClass += 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-300';
                  } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
                    buttonClass += 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-300';
                  } else {
                    buttonClass += 'border-zinc-200 dark:border-zinc-700 text-zinc-400';
                  }
                } else {
                  buttonClass += 'border-zinc-200 dark:border-zinc-700 hover:border-primary hover:bg-primary/5';
                }

                return (
                  <button
                    key={index}
                    onClick={() => !showAnswer && handleAnswer(option)}
                    disabled={showAnswer}
                    className={buttonClass}
                  >
                    <span className="font-medium">{option}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-zinc-500 mb-4">Think of the answer, then check below!</p>
              <Button onClick={() => handleAnswer(currentQuestion.correctAnswer)}>
                Show Answer & Continue
              </Button>
            </div>
          )}
        </Card>

        {/* Feedback & Next */}
        {showAnswer && (
          <Card padding="lg" className="mb-6 border-2 border-primary/30">
            <div className="text-center">
              {selectedAnswer === currentQuestion.correctAnswer ? (
                <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                  <CheckIcon className="w-6 h-6" />
                  <span className="font-semibold">Correct!</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-red-600 mb-4">
                  <XMarkIcon className="w-6 h-6" />
                  <span className="font-semibold">Not quite!</span>
                </div>
              )}
              
              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 mb-4">
                <p className="text-sm text-zinc-500 mb-1">Correct answer:</p>
                <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {currentQuestion.correctAnswer}
                </p>
              </div>

              <Button onClick={handleNext} size="lg" className="w-full">
                {currentIndex < session.questions.length - 1 ? 'Next Question' : 'See Results'}
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function PracticePage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [session, setSession] = useState<SpacedRepetitionSession | null>(null);
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);
  const [loadingSession, setLoadingSession] = useState(false);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [userProgress, setUserProgress] = useState<UserVocabularyProgress[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchData = async () => {
      const vocab = await getAllVocabulary();
      setVocabulary(vocab);
      
      if (user) {
        const progress = await getUserVocabularyProgress(user.uid);
        setUserProgress(progress);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user]);

  const startSession = useCallback(async () => {
    if (vocabulary.length === 0) return;
    
    setLoadingSession(true);
    try {
      const defaultProfile = {
        skillLevel: 1,
      };
      
      const newSession = generateSession(
        vocabulary,
        userProgress,
        userProfile?.skillLevel || defaultProfile.skillLevel
      );
      setSession(newSession);
    } catch (error) {
      console.error('Error generating session:', error);
    } finally {
      setLoadingSession(false);
    }
  }, [vocabulary, userProgress, userProfile]);

  const handleSessionComplete = useCallback((result: SessionResult) => {
    setSessionResult(result);
  }, []);

  const handleClose = useCallback(() => {
    router.push('/');
  }, [router]);

  if (loading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 pt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (sessionResult) {
    return (
      <SessionComplete 
        result={sessionResult} 
        onClose={handleClose}
        vocabularyCount={session?.questions.length || 0}
      />
    );
  }

  if (session) {
    return (
      <PracticeSession 
        session={session} 
        onComplete={handleSessionComplete}
      />
    );
  }

  return (
    <PracticeIntro onStart={startSession} />
  );
}
