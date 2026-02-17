'use client';

import { useState, useCallback, useEffect } from 'react';
import { QuizQuestion, QuizOption, QuizAnswer } from '@/types/lms';
import { Play, CheckCircle, XCircle, RotateCcw, Award, Clock } from 'lucide-react';
import clsx from 'clsx';

interface QuizBlockProps {
  id: string;
  title?: string;
  description?: string;
  questions: QuizQuestion[];
  settings: {
    shuffleOptions: boolean;
    showCorrectAnswers: boolean;
    showExplanations: boolean;
    requireAllCorrect: boolean;
  };
  xpReward: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  timeLimit?: number;
  passingScore: number;
  onComplete?: (score: number, xpEarned: number) => void;
  isPreview?: boolean;
}

export function QuizBlock({
  id,
  title = 'Quiz',
  description,
  questions,
  settings,
  xpReward,
  difficulty,
  timeLimit = 0,
  passingScore,
  onComplete,
  isPreview = false,
}: QuizBlockProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60);
  const [startTime] = useState(Date.now());

  const question = questions[currentQuestion];
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  // Timer effect
  useEffect(() => {
    if (timeLimit === 0 || isComplete || isPreview) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLimit, isComplete, isPreview]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = useCallback((answer: string) => {
    if (showFeedback || isPreview) return;
    setSelectedAnswer(answer);
  }, [showFeedback, isPreview]);

  const handleSubmit = useCallback(() => {
    if (!selectedAnswer || !question) return;

    const isCorrect = Array.isArray(question.correctAnswer)
      ? question.correctAnswer.includes(selectedAnswer)
      : selectedAnswer === question.correctAnswer;

    const answer: QuizAnswer = {
      questionId: question.id,
      answer: selectedAnswer,
      isCorrect,
      points: isCorrect ? question.points : 0,
      timeSpent: 0,
    };

    setAnswers((prev) => [...prev, answer]);
    setShowFeedback(true);

    if (settings.showExplanations && question.explanation) {
      // Show explanation - handled by rendering
    }
  }, [selectedAnswer, question, settings]);

  const handleNext = useCallback(() => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      handleFinish();
    }
  }, [currentQuestion, totalQuestions]);

  const handleFinish = useCallback(() => {
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const earnedPoints = answers.reduce((sum, a) => sum + a.points, 0);
    const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const passed = percentage >= passingScore;

    setIsComplete(true);
    
    if (!isPreview) {
      const xp = passed ? xpReward : Math.floor(xpReward * 0.5);
      onComplete?.(percentage, xp);
    }
  }, [answers, questions, passingScore, xpReward, isPreview, onComplete]);

  const handleRetry = useCallback(() => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsComplete(false);
    setTimeLeft(timeLimit * 60);
  }, [timeLimit]);

  // Render question types
  const renderQuestion = () => {
    if (!question) return null;

    switch (question.type) {
      case 'multipleChoice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => {
              const isSelected = selectedAnswer === option.id || selectedAnswer === option.text;
              const isCorrect = question.correctAnswer === option.id || question.correctAnswer === option.text;
              
              let optionClass = 'border-zinc-200 dark:border-zinc-700 hover:border-blue-500';
              if (showFeedback) {
                if (isCorrect) {
                  optionClass = 'border-green-500 bg-green-50 dark:bg-green-900/20';
                } else if (isSelected && !isCorrect) {
                  optionClass = 'border-red-500 bg-red-50 dark:bg-red-900/20';
                }
              } else if (isSelected) {
                optionClass = 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
              }

              return (
                <button
                  key={option.id || index}
                  onClick={() => handleAnswer(option.id || option.text)}
                  disabled={showFeedback || isPreview}
                  className={clsx(
                    'w-full p-4 text-left rounded-lg border-2 transition-all',
                    optionClass,
                    (showFeedback || isPreview) && 'cursor-default'
                  )}
                >
                  <span className="font-medium">{option.text}</span>
                  {showFeedback && isCorrect && (
                    <CheckCircle className="inline-block w-5 h-5 ml-2 text-green-500" />
                  )}
                  {showFeedback && isSelected && !isCorrect && (
                    <XCircle className="inline-block w-5 h-5 ml-2 text-red-500" />
                  )}
                </button>
              );
            })}
          </div>
        );

      case 'fillInBlank':
        return (
          <div className="space-y-4">
            <p className="text-lg">{question.question.replace('___', '_______')}</p>
            <input
              type="text"
              value={selectedAnswer || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              disabled={showFeedback || isPreview}
              placeholder="Type your answer..."
              className="w-full p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
            />
          </div>
        );

      case 'trueFalse':
        return (
          <div className="grid grid-cols-2 gap-4">
            {['True', 'False'].map((option) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = question.correctAnswer === option;
              
              let btnClass = 'border-zinc-200 dark:border-zinc-700';
              if (showFeedback) {
                if (isCorrect) {
                  btnClass = 'border-green-500 bg-green-50 dark:bg-green-900/20';
                } else if (isSelected && !isCorrect) {
                  btnClass = 'border-red-500 bg-red-50 dark:bg-red-900/20';
                }
              } else if (isSelected) {
                btnClass = 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
              }

              return (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={showFeedback || isPreview}
                  className={clsx(
                    'p-6 rounded-lg border-2 text-xl font-semibold transition-all',
                    btnClass
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        );

      default:
        return <p>Unknown question type</p>;
    }
  };

  // Calculate results
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const earnedPoints = answers.reduce((sum, a) => sum + a.points, 0);
  const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const passed = percentage >= passingScore;

  if (isComplete) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
        <div className="text-center">
          <div className={clsx(
            'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4',
            passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
          )}>
            {passed ? (
              <Award className="w-10 h-10 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            )}
          </div>
          
          <h3 className="text-2xl font-bold mb-2">
            {passed ? 'Congratulations!' : 'Keep Practicing!'}
          </h3>
          
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            {passed 
              ? `You passed with ${percentage}%!` 
              : `You scored ${percentage}%. You need ${passingScore}% to pass.`
            }
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
              <p className="text-2xl font-bold">{percentage}%</p>
              <p className="text-sm text-zinc-500">Score</p>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
              <p className="text-2xl font-bold">{answers.filter(a => a.isCorrect).length}/{totalQuestions}</p>
              <p className="text-sm text-zinc-500">Correct</p>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">+{passed ? xpReward : Math.floor(xpReward / 2)}</p>
              <p className="text-sm text-zinc-500">XP Earned</p>
            </div>
          </div>

          {!isPreview && (
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            {description && <p className="text-blue-100 text-sm">{description}</p>}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">+{xpReward} XP</span>
            </div>
            {timeLimit > 0 && (
              <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-zinc-100 dark:bg-zinc-800">
        <div 
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-zinc-500">
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
          <span className={clsx(
            'px-2 py-1 rounded text-xs font-medium',
            difficulty === 'beginner' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            difficulty === 'intermediate' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            difficulty === 'advanced' && 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
            difficulty === 'expert' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
          )}>
            {difficulty}
          </span>
        </div>

        <h4 className="text-xl font-semibold mb-6">{question?.question}</h4>

        {renderQuestion()}

        {/* Feedback */}
        {showFeedback && question.explanation && settings.showExplanations && (
          <div className={clsx(
            'mt-4 p-4 rounded-lg',
            answers[answers.length - 1]?.isCorrect 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          )}>
            <p className="font-medium mb-1">
              {answers[answers.length - 1]?.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{question.explanation}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          {!showFeedback ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer || isPreview}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentQuestion < totalQuestions - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
