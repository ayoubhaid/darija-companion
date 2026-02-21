'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Quiz, Question } from '@/types';
import { getQuizById, recordQuizResult, updateUserProgress } from '@/lib/firestore';
import { useAuth } from '@/hooks/useAuth';
import { showXPToast } from '@/components/ui/XPToast';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  FireIcon,
  TrophyIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const quizId = params.id as string;

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getQuizById(quizId);
        setQuiz(data);
        setAnswers(new Array(data?.questions?.length || 0).fill(null));
      } catch (error) {
        console.error('Error fetching quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const checkAnswer = () => {
    setShowResult(true);
    const question = quiz?.questions[currentQuestion];
    if (selectedAnswer === question?.correctAnswer) {
      setScore(score + (question.points || 10));
    }
  };

  const handleNext = () => {
    if (currentQuestion < (quiz?.questions?.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    setQuizCompleted(true);
    
    if (user && quiz) {
      const totalPoints = quiz.questions.reduce((acc, q) => acc + (q.points || 10), 0);
      await recordQuizResult(user.uid, quizId, score, totalPoints, 0);
      await updateUserProgress(user.uid, undefined, quizId, score);
      // Show XP toast
      showXPToast(quiz.xpReward || 10, 'Quiz complete!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quiz not found</h2>
          <Link href="/quizzes">
            <Button variant="outline">Back to Quizzes</Button>
          </Link>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const isCorrect = selectedAnswer === question?.correctAnswer;
  const totalPoints = quiz.questions.reduce((acc, q) => acc + (q.points || 10), 0);
  const percentage = Math.round((score / totalPoints) * 100);

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center pt-20 pb-24 md:pb-12 px-4">
        <Card padding="lg" className="max-w-md w-full text-center animate-fade-in-up">
          <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
            <TrophyIcon className="w-10 h-10 text-primary" />
          </div>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            Quiz Completed! 🎉
          </h2>

          <div className="mb-6">
            <div className="text-5xl font-bold text-primary mb-2">{percentage}%</div>
            <p className="text-zinc-500">
              {score} out of {totalPoints} points
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-3">
              <div className="text-lg font-bold text-zinc-900 dark:text-white">
                {quiz.xpReward || 10}
              </div>
              <div className="text-xs text-zinc-500 flex items-center justify-center gap-1">
                <StarIcon className="w-3 h-3 text-primary" /> XP Earned
              </div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-3">
              <div className="text-lg font-bold text-zinc-900 dark:text-white">
                {quiz.questions.length}
              </div>
              <div className="text-xs text-zinc-500">Questions</div>
            </div>
          </div>

          <Badge variant={percentage >= 70 ? 'success' : 'warning'} className="mb-6 text-sm px-4 py-1.5">
            {percentage >= 70 ? '✓ Passed!' : '💪 Keep practicing!'}
          </Badge>

          <div className="flex gap-3">
            <Link href="/quizzes" className="flex-1">
              <Button variant="outline" className="w-full">
                Back to Quizzes
              </Button>
            </Link>
            <Link href="/lessons" className="flex-1">
              <Button className="w-full">
                Continue Learning
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-24 md:pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/quizzes"
            className="inline-flex items-center text-zinc-500 hover:text-primary transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Quizzes
          </Link>
        </div>

        {/* Quiz header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white">{quiz.title}</h1>
              <span className="text-sm text-zinc-500">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
            </div>
            <Badge variant="primary" className="flex items-center gap-1">
              <StarIcon className="w-3.5 h-3.5" />
              {quiz.xpReward || 10} XP
            </Badge>
          </div>
          <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <Card padding="lg" className="mb-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-6">
            {question?.question}
          </h2>

          <div className="space-y-3">
            {question?.options?.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option === question.correctAnswer;

              let buttonClass =
                'w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ';

              if (showResult) {
                if (isCorrectOption) {
                  buttonClass += 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
                } else if (isSelected && !isCorrectOption) {
                  buttonClass += 'border-red-500 bg-red-50 dark:bg-red-900/20';
                } else {
                  buttonClass += 'border-zinc-200 dark:border-zinc-700 opacity-40';
                }
              } else {
                buttonClass += isSelected
                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-zinc-200 dark:border-zinc-700 hover:border-primary/50 hover:bg-zinc-50 dark:hover:bg-zinc-800';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-900 dark:text-white font-medium">{option}</span>
                    {showResult && isCorrectOption && (
                      <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    )}
                    {showResult && isSelected && !isCorrectOption && (
                      <XCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div
              className={`mt-4 p-4 rounded-xl ${
                isCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}
            >
              <p className={`text-sm font-semibold mb-1 ${isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                {isCorrect ? '✓ Correct!' : '✗ Incorrect!'}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{question.explanation}</p>
            </div>
          )}
        </Card>

        <div className="flex justify-end">
          {!showResult ? (
            <Button onClick={checkAnswer} disabled={!selectedAnswer}>
              Check Answer
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {currentQuestion < quiz.questions.length - 1 ? 'Next Question →' : 'Finish Quiz 🎉'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
