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
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  FireIcon,
  TrophyIcon,
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
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <TrophyIcon className="w-10 h-10 text-primary-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Quiz Completed!
          </h2>
          
          <div className="mb-6">
            <div className="text-4xl font-bold text-primary-500 mb-2">
              {percentage}%
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {score} out of {totalPoints} points
            </p>
          </div>

          <Badge variant={percentage >= 70 ? 'success' : 'warning'} className="mb-6">
            {percentage >= 70 ? 'Passed!' : 'Keep practicing!'}
          </Badge>

          <div className="flex gap-4">
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link 
            href="/quizzes" 
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-500"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Quizzes
          </Link>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <Badge variant="primary">{quiz.xpReward || 10} XP</Badge>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {question?.question}
          </h2>

          <div className="space-y-3">
            {question?.options?.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option === question.correctAnswer;
              
              let buttonClass = 'w-full p-4 text-left rounded-lg border-2 transition-all ';
              
              if (showResult) {
                if (isCorrectOption) {
                  buttonClass += 'border-green-500 bg-green-50 dark:bg-green-900/30';
                } else if (isSelected && !isCorrectOption) {
                  buttonClass += 'border-red-500 bg-red-50 dark:bg-red-900/30';
                } else {
                  buttonClass += 'border-gray-200 dark:border-slate-600 opacity-50';
                }
              } else {
                buttonClass += isSelected 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' 
                  : 'border-gray-200 dark:border-slate-600 hover:border-primary-300';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 dark:text-white">{option}</span>
                    {showResult && isCorrectOption && (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    )}
                    {showResult && isSelected && !isCorrectOption && (
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className={`mt-4 p-3 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30'}`}>
              <p className="text-sm font-medium">
                {isCorrect ? 'Correct!' : 'Incorrect!'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {question.explanation}
              </p>
            </div>
          )}
        </Card>

        <div className="flex justify-end">
          {!showResult ? (
            <Button 
              onClick={checkAnswer} 
              disabled={!selectedAnswer}
            >
              Check Answer
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {currentQuestion < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
