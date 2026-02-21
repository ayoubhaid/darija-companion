'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { showXPToast } from '@/components/ui/XPToast';
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
import SoukRush from '@/components/games/SoukRush';
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
  ClockIcon,
  PencilSquareIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline';

function PracticeIntro({ onStart, onStartTyping, onStartSoukRush }: { onStart: () => void; onStartTyping: () => void; onStartSoukRush: () => void }) {
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

        {/* Practice Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card padding="lg" variant="interactive" className="text-left group cursor-pointer" onClick={onStart}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">Flashcard Mode</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Multiple choice questions to test your vocabulary recognition
                </p>
              </div>
            </div>
          </Card>

          <Card padding="lg" variant="interactive" className="text-left group cursor-pointer" onClick={onStartTyping}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <PencilSquareIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">Typing Practice</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Type the translation to improve your recall and spelling
                </p>
              </div>
            </div>
          </Card>

          {/* Souk Rush Game Card */}
          <Card padding="lg" variant="interactive" className="text-left group cursor-pointer md:col-span-2" onClick={onStartSoukRush}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-orange-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <PuzzlePieceIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">Souk Rush 🪔</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Play a fun game! Catch the matching Darija lanterns as they fall from the sky
                </p>
              </div>
            </div>
          </Card>
        </div>

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
              <span className="text-zinc-600 dark:text-zinc-300">Review words you've learned + new words</span>
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

// Typing Practice Session Component
function TypingPracticeSession({ 
  vocabulary, 
  onComplete 
}: { 
  vocabulary: VocabularyItem[]; 
  onComplete: (result: SessionResult) => void;
}) {
  const { user, userProfile } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(Date.now());
  const [streak, setStreak] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get random words for typing practice
  const questions = useMemo(() => {
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 15).map(word => ({
      wordId: word.id,
      darija: word.word,
      transliteration: word.transliteration,
      arabic: word.arabic,
      correctAnswer: word.translation,
    }));
  }, [vocabulary]);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  useEffect(() => {
    if (inputRef.current && !submitted) {
      inputRef.current.focus();
    }
  }, [currentIndex, submitted]);

  const checkAnswer = (input: string, correct: string): boolean => {
    const normalizedInput = input.toLowerCase().trim();
    const normalizedCorrect = correct.toLowerCase().trim();
    return normalizedInput === normalizedCorrect;
  };

  const handleSubmit = async () => {
    if (!user || !userProfile || !userInput.trim()) return;

    const isCorrect = checkAnswer(userInput, currentQuestion.correctAnswer);
    
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
    
    const result: AnswerResult = {
      wordId: currentQuestion.wordId,
      correct: isCorrect,
      timeTaken: 5000,
      xpEarned: isCorrect ? 10 : 2,
      newEaseFactor: 2.5,
      newInterval: 1,
      newRepetitions: 1,
      nextReviewDate: new Date().toISOString(),
    };

    const newAnswers = [...answers, result];
    setAnswers(newAnswers);
    setSubmitted(true);
    setStreak(isCorrect ? streak + 1 : 0);
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserInput('');
      setSubmitted(false);
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
      
      const result = calculateSessionResult(answers, userProfileWithDefaults, 'typing');
      
      if (user) {
        await updateUserAfterSession(user.uid, result, userProfileWithDefaults);
      }
      
      onComplete(result);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !submitted) {
      handleSubmit();
    } else if (e.key === 'Enter' && submitted) {
      handleNext();
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
              Question {currentIndex + 1} of {questions.length}
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
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card padding="lg" className="mb-6">
          <div className="text-center mb-8">
            <Badge variant="warning" className="mb-4">Typing Practice</Badge>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              {currentQuestion.darija}
            </h2>
            <p className="text-lg text-zinc-500">{currentQuestion.transliteration}</p>
            {currentQuestion.arabic && (
              <p className="text-2xl arabic-text text-zinc-700 dark:text-zinc-300 mt-2" dir="rtl">
                {currentQuestion.arabic}
              </p>
            )}
          </div>

          {/* Typing Input */}
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
              Type the English translation:
            </label>
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={submitted}
              placeholder="Type your answer..."
              className={`w-full px-4 py-3 text-lg rounded-xl border-2 transition-all duration-200 ${
                submitted
                  ? userInput.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim()
                    ? 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-300'
                    : 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-300'
                  : 'border-zinc-300 dark:border-zinc-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
              } bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white`}
            />
            {submitted && (
              <div className="mt-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                {userInput.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim() ? (
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckIcon className="w-6 h-6" />
                    <span className="font-semibold">Correct!</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-center gap-2 text-red-600 mb-2">
                      <XMarkIcon className="w-6 h-6" />
                      <span className="font-semibold">Not quite!</span>
                    </div>
                    <p className="text-sm text-zinc-500 text-center">
                      Correct answer: <span className="font-semibold text-zinc-900 dark:text-white">{currentQuestion.correctAnswer}</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Submit/Next Button */}
        <div className="max-w-md mx-auto">
          {!submitted ? (
            <Button 
              onClick={handleSubmit} 
              size="lg" 
              className="w-full"
              disabled={!userInput.trim()}
            >
              Check Answer
              <CheckIcon className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleNext} size="lg" className="w-full">
              {currentIndex < questions.length - 1 ? 'Next Word' : 'See Results'}
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
          )}
          <p className="text-center text-xs text-zinc-400 mt-3">
            Press Enter to submit
          </p>
        </div>
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
  const [typingVocabulary, setTypingVocabulary] = useState<VocabularyItem[]>([]);
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);
  const [loadingSession, setLoadingSession] = useState(false);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [userProgress, setUserProgress] = useState<UserVocabularyProgress[]>([]);
  const [practiceMode, setPracticeMode] = useState<'flashcard' | 'typing' | 'soukRush' | null>(null);

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
      setPracticeMode('flashcard');
    } catch (error) {
      console.error('Error generating session:', error);
    } finally {
      setLoadingSession(false);
    }
  }, [vocabulary, userProgress, userProfile]);

  const startTypingSession = useCallback(() => {
    setTypingVocabulary(vocabulary);
    setPracticeMode('typing');
  }, [vocabulary]);

  const startSoukRushGame = useCallback(() => {
    setPracticeMode('soukRush');
  }, []);

  const handleSessionComplete = useCallback((result: SessionResult) => {
    setSessionResult(result);
    setPracticeMode(null);
    if (result.totalXpEarned > 0) {
      showXPToast(result.totalXpEarned, 'Practice complete!');
    }
  }, []);

  const handleSoukRushComplete = useCallback((score: number, xpEarned: number) => {
    setPracticeMode(null);
    if (xpEarned > 0) {
      showXPToast(xpEarned, `Souk Rush! Score: ${score}`);
    }
  }, []);

  const handleClose = useCallback(() => {
    setSession(null);
    setTypingVocabulary([]);
    setSessionResult(null);
    setPracticeMode(null);
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
        vocabularyCount={practiceMode === 'typing' ? 15 : (session?.questions.length || 0)}
      />
    );
  }

  if (practiceMode === 'soukRush' && vocabulary.length > 0) {
    return (
      <SoukRush
        vocabulary={vocabulary}
        onComplete={handleSoukRushComplete}
        onExit={() => setPracticeMode(null)}
      />
    );
  }

  if (practiceMode === 'typing' && typingVocabulary.length > 0) {
    return (
      <TypingPracticeSession 
        vocabulary={typingVocabulary} 
        onComplete={handleSessionComplete}
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
    <PracticeIntro onStart={startSession} onStartTyping={startTypingSession} onStartSoukRush={startSoukRushGame} />
  );
}
